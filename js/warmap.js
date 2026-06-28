/* =========================================================================
 * IRON & FAITH — warmap.js
 * Pixelated recreation of the "WORLD WAR I IN EUROPE" theatre map:
 *   green  = Central Powers   orange = Allied Powers   cream = Neutral
 * with major battle stars, movement arrows, sea labels and a legend.
 * Rendered to a low-res offscreen buffer then scaled with nearest-neighbour
 * for a chunky pixel look (terrain), with crisp labels overlaid on top.
 * ========================================================================= */
(function (global) {
  'use strict';

  const C = {
    sea:'#a7d2e4', central:'#93cf7c', allied:'#f2a95c', neutral:'#ece0c2',
    border:'#7a6aa0', land2:'#00000018'
  };

  // regions: normalised [x,y] polygons (0..1 within the map rect)
  const REGIONS = [
    // --- Allied (orange) ---
    {c:'allied', p:[[.10,.21],[.20,.23],[.22,.30],[.25,.34],[.20,.41],[.15,.39],[.12,.30]]},   // UK
    {c:'allied', p:[[.05,.30],[.10,.30],[.10,.39],[.06,.39]]},                                  // Ireland
    {c:'allied', p:[[.17,.35],[.30,.34],[.33,.42],[.31,.53],[.24,.57],[.18,.52],[.15,.43]]},    // France
    {c:'allied', p:[[.02,.55],[.07,.55],[.07,.68],[.03,.68]]},                                  // Portugal
    {c:'allied', p:[[.31,.50],[.39,.49],[.41,.58],[.46,.69],[.42,.75],[.38,.66],[.35,.57],[.32,.53]]}, // Italy
    {c:'allied', p:[[.55,.05],[1.0,.03],[1.0,.41],[.90,.51],[.80,.54],[.67,.52],[.58,.43],[.555,.28],[.55,.15]]}, // Russia
    {c:'allied', p:[[.50,.07],[.58,.07],[.58,.25],[.50,.23]]},                                  // Finland (Rus)
    {c:'allied', p:[[.46,.30],[.56,.30],[.575,.40],[.48,.42],[.46,.36]]},                       // Poland (Rus)
    {c:'allied', p:[[.54,.45],[.65,.45],[.66,.53],[.56,.54],[.54,.49]]},                        // Romania
    {c:'allied', p:[[.45,.54],[.54,.54],[.54,.66],[.48,.69],[.44,.62]]},                        // Serbia/Montenegro
    {c:'allied', p:[[.00,.84],[.50,.81],[.52,1.0],[.00,1.0]]},                                  // NW Africa (Fr.)
    {c:'allied', p:[[.50,.81],[.80,.80],[.82,1.0],[.50,1.0]]},                                  // Libya/Egypt
    // --- Neutral (cream) ---
    {c:'neutral', p:[[.33,.05],[.45,.03],[.51,.10],[.47,.29],[.40,.31],[.36,.20],[.34,.11]]},   // Norway/Sweden
    {c:'neutral', p:[[.36,.22],[.42,.22],[.42,.30],[.37,.30]]},                                 // Denmark
    {c:'neutral', p:[[.27,.30],[.32,.30],[.32,.345],[.27,.345]]},                               // Netherlands
    {c:'neutral', p:[[.04,.54],[.20,.52],[.225,.63],[.16,.71],[.07,.71],[.035,.62]]},           // Spain
    {c:'neutral', p:[[.29,.455],[.355,.45],[.355,.50],[.295,.50]]},                             // Switzerland
    {c:'neutral', p:[[.49,.64],[.58,.63],[.585,.72],[.52,.745],[.49,.70]]},                     // Greece
    {c:'neutral', p:[[.93,.56],[1.0,.55],[1.0,.72],[.94,.72]]},                                 // Persia
    {c:'neutral', p:[[.80,.86],[.95,.84],[.96,1.0],[.80,1.0]]},                                 // Arabia
    // --- Central Powers (green) ---
    {c:'central', p:[[.31,.27],[.46,.26],[.50,.33],[.485,.42],[.40,.44],[.33,.42],[.305,.34]]}, // Germany
    {c:'central', p:[[.35,.43],[.50,.42],[.575,.45],[.565,.54],[.46,.565],[.385,.55],[.35,.50]]}, // Austria-Hungary
    {c:'central', p:[[.54,.535],[.635,.525],[.645,.59],[.56,.60],[.54,.565]]},                  // Bulgaria
    {c:'central', p:[[.59,.555],[.80,.55],[.99,.605],[1.0,.72],[.93,.80],[.82,.82],[.68,.785],[.595,.665]]}, // Ottoman Anatolia
    {c:'central', p:[[.80,.66],[.99,.71],[.985,.87],[.87,.93],[.82,.81],[.80,.74]]}             // Ottoman Levant/Mesopotamia
  ];

  // open seas painted over land gaps (Black Sea / Caspian)
  const SEAS_OVAL = [
    {x:.715,y:.555,rx:.07,ry:.035},   // Black Sea
    {x:.985,y:.55,rx:.03,ry:.05}      // Caspian
  ];

  const SEA_LABELS = [
    {t:'ATLANTIC OCEAN',x:.05,y:.50,s:.022,it:1},
    {t:'NORTH SEA',x:.275,y:.30,s:.018,it:1},
    {t:'BALTIC SEA',x:.47,y:.24,s:.016,it:1},
    {t:'MEDITERRANEAN SEA',x:.45,y:.86,s:.020,it:1},
    {t:'BLACK SEA',x:.70,y:.50,s:.016,it:1},
    {t:'ADRIATIC',x:.42,y:.60,s:.012,it:1},
    {t:'CASPIAN',x:.95,y:.50,s:.012,it:1}
  ];

  const LAND_LABELS = [
    {t:'UNITED KINGDOM',x:.13,y:.31,s:.014},
    {t:'FRANCE',x:.21,y:.48,s:.018},
    {t:'SPAIN',x:.11,y:.62,s:.016},
    {t:'GERMANY',x:.37,y:.35,s:.018},
    {t:'AUSTRIA-HUNGARY',x:.41,y:.50,s:.014},
    {t:'RUSSIA',x:.78,y:.28,s:.024},
    {t:'ITALY',x:.37,y:.62,s:.014},
    {t:'OTTOMAN EMPIRE',x:.74,y:.66,s:.018},
    {t:'BULGARIA',x:.575,y:.565,s:.011},
    {t:'ROMANIA',x:.585,y:.49,s:.011},
    {t:'SERBIA',x:.485,y:.59,s:.010},
    {t:'GREECE',x:.515,y:.69,s:.011},
    {t:'NORWAY',x:.37,y:.13,s:.012},{t:'SWEDEN',x:.44,y:.16,s:.012},
    {t:'POLAND',x:.50,y:.36,s:.010},{t:'PERSIA',x:.955,y:.63,s:.012},
    {t:'N. AFRICA',x:.20,y:.92,s:.014},{t:'EGYPT',x:.66,y:.93,s:.012},{t:'ARABIA',x:.86,y:.94,s:.012}
  ];

  const BATTLES = [
    {t:'Jutland',x:.40,y:.205},{t:'Lusitania',x:.085,y:.40},
    {t:'Somme',x:.295,y:.41},{t:'Verdun',x:.315,y:.455},
    {t:'Masurian L.',x:.50,y:.335},{t:'Caporetto',x:.415,y:.545},
    {t:'Gallipoli',x:.585,y:.625},{t:'Baghdad',x:.915,y:.74}
  ];

  // arrows: [x1,y1,x2,y2,colour]  (green=Central advance, red=Allied)
  const ARROWS = [
    [.50,.355,.605,.40,'#1f8a3a'],[.50,.555,.50,.63,'#1f8a3a'],[.575,.50,.625,.52,'#1f8a3a'],
    [.66,.46,.585,.43,'#b3261e'],[.585,.70,.585,.64,'#b3261e'],[.80,.93,.82,.80,'#b3261e']
  ];

  let off=null, offW=300, offH=225;
  function buildOffscreen(){
    off=document.createElement('canvas'); off.width=offW; off.height=offH;
    const x=off.getContext('2d');
    x.fillStyle=C.sea; x.fillRect(0,0,offW,offH);
    // faint sea grid
    x.fillStyle='#9bc8dc'; for(let i=0;i<offH;i+=8) x.fillRect(0,i,offW,1);
    for(const r of REGIONS){
      x.beginPath();
      r.p.forEach((pt,i)=>{ const px=pt[0]*offW, py=pt[1]*offH; i?x.lineTo(px,py):x.moveTo(px,py); });
      x.closePath();
      x.fillStyle=C[r.c]; x.fill();
      x.fillStyle=C.land2; x.fill();                 // subtle shade pass
      x.lineWidth=1; x.strokeStyle=C.border; x.stroke();
    }
    for(const s of SEAS_OVAL){ x.fillStyle=C.sea; x.beginPath(); x.ellipse(s.x*offW,s.y*offH,s.rx*offW,s.ry*offH,0,0,7); x.fill(); }
  }

  function star(ctx,cx,cy,r,col){
    ctx.fillStyle=col; ctx.beginPath();
    for(let i=0;i<10;i++){ const a=-Math.PI/2+i*Math.PI/5, rr=i%2?r*0.45:r; const px=cx+Math.cos(a)*rr, py=cy+Math.sin(a)*rr; i?ctx.lineTo(px,py):ctx.moveTo(px,py); }
    ctx.closePath(); ctx.fill();
  }
  function arrow(ctx,x1,y1,x2,y2,col,sc){
    ctx.strokeStyle=col; ctx.fillStyle=col; ctx.lineWidth=Math.max(2,sc*0.004);
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
    const a=Math.atan2(y2-y1,x2-x1), h=Math.max(5,sc*0.012);
    ctx.beginPath(); ctx.moveTo(x2,y2);
    ctx.lineTo(x2-h*Math.cos(a-0.5),y2-h*Math.sin(a-0.5));
    ctx.lineTo(x2-h*Math.cos(a+0.5),y2-h*Math.sin(a+0.5));
    ctx.closePath(); ctx.fill();
  }

  // draw the full map into rect (X,Y,W,H). opts:{title, legend, t}
  function draw(ctx, X, Y, W, H, opts){
    opts=opts||{}; if(!off) buildOffscreen();
    const sm=ctx.imageSmoothingEnabled; ctx.imageSmoothingEnabled=false;
    ctx.drawImage(off, X, Y, W, H);                  // pixelated terrain
    ctx.imageSmoothingEnabled=sm;
    const px=(nx)=>X+nx*W, py=(ny)=>Y+ny*H;
    // sea labels
    ctx.textAlign='center'; ctx.textBaseline='middle';
    for(const l of SEA_LABELS){ ctx.fillStyle='#3a6a86'; ctx.font=(l.it?'italic ':'')+Math.max(8,l.s*H)+'px Georgia'; ctx.fillText(l.t,px(l.x),py(l.y)); }
    // land labels
    for(const l of LAND_LABELS){ ctx.font='bold '+Math.max(8,l.s*H)+'px Georgia';
      ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.fillText(l.t,px(l.x)+1,py(l.y)+1);
      ctx.fillStyle='#2a2418'; ctx.fillText(l.t,px(l.x),py(l.y)); }
    // movement arrows
    for(const a of ARROWS) arrow(ctx,px(a[0]),py(a[1]),px(a[2]),py(a[3]),a[4],H);
    // battle stars (twinkle)
    const tw=0.85+0.15*Math.sin((opts.t||0)*4);
    for(const b of BATTLES){ const r=Math.max(4,0.013*H)*tw;
      star(ctx,px(b.x),py(b.y),r,'#c01a1a'); star(ctx,px(b.x),py(b.y),r*0.5,'#ff5a4a');
      ctx.font='italic '+Math.max(7,0.011*H)+'px Georgia'; ctx.fillStyle='#2a1410'; ctx.textAlign='left';
      ctx.fillText(b.t,px(b.x)+r+2,py(b.y)); ctx.textAlign='center'; }
    // title banner
    if(opts.title){ ctx.fillStyle='#f3ead0'; const bw=W*0.5,bx=X+W/2-bw/2,by=Y-2;
      ctx.fillRect(bx,by, bw, Math.max(16,0.05*H)); ctx.strokeStyle='#2a2418'; ctx.lineWidth=2; ctx.strokeRect(bx,by,bw,Math.max(16,0.05*H));
      ctx.fillStyle='#1a140d'; ctx.font='bold '+Math.max(11,0.032*H)+'px Georgia'; ctx.textBaseline='middle';
      ctx.fillText('WORLD WAR I IN EUROPE', X+W/2, by+Math.max(8,0.025*H)); }
    // legend
    if(opts.legend!==false){ const lw=W*0.20, lh=H*0.24, lx=X+W-lw-6, ly=Y+6;
      ctx.fillStyle='rgba(255,252,244,0.92)'; ctx.fillRect(lx,ly,lw,lh); ctx.strokeStyle='#2a2418'; ctx.lineWidth=1; ctx.strokeRect(lx,ly,lw,lh);
      const items=[['Allied Powers',C.allied],['Central Powers',C.central],['Neutral nations',C.neutral]];
      ctx.textAlign='left'; ctx.textBaseline='middle'; const fs=Math.max(8,0.020*H);
      items.forEach((it,i)=>{ const yy=ly+lh*0.16+i*lh*0.20; ctx.fillStyle=it[1]; ctx.fillRect(lx+6,yy-fs*0.5,fs*1.4,fs); ctx.strokeRect(lx+6,yy-fs*0.5,fs*1.4,fs);
        ctx.fillStyle='#2a2418'; ctx.font=fs+'px Georgia'; ctx.fillText(it[1]===C.central?'Central Powers':items[i][0],lx+6+fs*1.9,yy); });
      const sy=ly+lh*0.78; star(ctx,lx+6+fs*0.7,sy,fs*0.7,'#c01a1a'); ctx.fillStyle='#2a2418'; ctx.fillText('Major battles',lx+6+fs*1.9,sy);
    }
    ctx.textAlign='left'; ctx.textBaseline='alphabetic';
  }

  global.WarMap = { draw, rebuild:()=>{off=null;} };
})(window);
