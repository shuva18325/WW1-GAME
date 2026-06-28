/* =========================================================================
 * IRON & FAITH — warmap.js
 * Renders the real WW1 theatre using ACTUAL country borders (js/europe_geo.js,
 * built from public-domain world GeoJSON) coloured by 1914 alliance:
 *   green = Central Powers   orange = Allied   cream = Neutral
 * with battle stars, movement arrows, sea/land labels, legend and title.
 * Real coastlines — not blobs.
 * ========================================================================= */
(function (global) {
  'use strict';
  const C = { sea:'#add5e6', central:'#94d07d', allied:'#f1a85b', neutral:'#e9ddbf', border:'#5a5a5a', grid:'#9fcadd' };

  // labels & markers in real lon/lat (projected via the geo bounds)
  const LAND = [
    ['UNITED KINGDOM',-1.8,52.6,14],['FRANCE',2.2,47.2,18],['SPAIN',-3.7,40,16],
    ['GERMANY',10.4,51,18],['AUSTRIA-HUNGARY',17,47.2,13],['RUSSIA',40,55,26],
    ['ITALY',12.6,43,14],['OTTOMAN EMPIRE',34,39,17],['BULGARIA',25,42.6,11],
    ['ROMANIA',25,46,11],['SERBIA',20.6,44,10],['GREECE',22,39.2,11],
    ['NORWAY',9,61,11],['SWEDEN',15,60.2,11],['POLAND',19.2,52,10],
    ['EGYPT',30,29.8,11],['N. AFRICA',3,33,13],['PERSIA',49,33.5,11]
  ];
  const SEAS = [
    ['ATLANTIC OCEAN',-10,46,16],['NORTH SEA',3.2,56,12],['BALTIC SEA',19.5,57.5,11],
    ['MEDITERRANEAN SEA',15,34,14],['BLACK SEA',34,43.5,12],['ADRIATIC',16.2,42.6,9],['CASPIAN',49.3,42,9]
  ];
  const BATTLES = [
    ['Jutland 1916',7.6,56.8],['Lusitania 1915',-11,51.2],['Somme 1916',2.7,50],
    ['Verdun 1916',5.4,49.2],['Masurian L. 1914',21.7,53.9],['Caporetto 1917',13.6,46.2],
    ['Gallipoli 1915',26.3,40.2],['Baghdad 1917',44.4,33.3]
  ];
  const ARROWS = [
    [22,52,30,50,'#1f8a3a'],[20,45.5,20.6,43.4,'#1f8a3a'],[26,46.4,27.5,46.8,'#1f8a3a'],
    [33,52,25,52,'#b3261e'],[12,46.2,13.6,46.1,'#b3261e'],[32,30,33,31.5,'#b3261e'],[25.8,39.4,26.3,40,'#b3261e']
  ];

  let off=null, B=null;
  function bake(){
    const geo=global.EUROPE_GEO; if(!geo) return false;
    B=geo.bounds;
    const OW=1200, OH=720;
    off=document.createElement('canvas'); off.width=OW; off.height=OH;
    const x=off.getContext('2d');
    x.fillStyle=C.sea; x.fillRect(0,0,OW,OH);
    x.strokeStyle=C.grid; x.lineWidth=1; for(let i=0;i<OH;i+=14){ x.beginPath(); x.moveTo(0,i); x.lineTo(OW,i); x.stroke(); }
    for(const r of geo.regions){
      x.beginPath();
      for(const poly of r.polys){ poly.forEach((p,i)=>{ const px=p[0]*OW, py=p[1]*OH; i?x.lineTo(px,py):x.moveTo(px,py); }); x.closePath(); }
      x.fillStyle=C[r.side]; x.fill('evenodd');
    }
    // borders (thin) — drawn per-ring for crisp coastlines
    x.strokeStyle=C.border; x.lineWidth=1.2;
    for(const r of geo.regions) for(const poly of r.polys){ x.beginPath(); poly.forEach((p,i)=>{ const px=p[0]*OW, py=p[1]*OH; i?x.lineTo(px,py):x.moveTo(px,py); }); x.closePath(); x.stroke(); }
    return true;
  }

  function star(ctx,cx,cy,r,col){ ctx.fillStyle=col; ctx.beginPath();
    for(let i=0;i<10;i++){ const a=-Math.PI/2+i*Math.PI/5, rr=i%2?r*0.45:r; const px=cx+Math.cos(a)*rr, py=cy+Math.sin(a)*rr; i?ctx.lineTo(px,py):ctx.moveTo(px,py);} ctx.closePath(); ctx.fill(); }
  function arrow(ctx,x1,y1,x2,y2,col,sc){ ctx.strokeStyle=col; ctx.fillStyle=col; ctx.lineWidth=Math.max(2,sc*0.004);
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
    const a=Math.atan2(y2-y1,x2-x1), h=Math.max(6,sc*0.014);
    ctx.beginPath(); ctx.moveTo(x2,y2); ctx.lineTo(x2-h*Math.cos(a-0.5),y2-h*Math.sin(a-0.5)); ctx.lineTo(x2-h*Math.cos(a+0.5),y2-h*Math.sin(a+0.5)); ctx.closePath(); ctx.fill(); }

  function draw(ctx, X, Y, W, H, opts){
    opts=opts||{};
    if(!off){ if(!bake()){ ctx.fillStyle=C.sea; ctx.fillRect(X,Y,W,H); return; } }
    const sm=ctx.imageSmoothingEnabled;
    ctx.imageSmoothingEnabled = opts.pixel ? false : true;   // smooth real coastlines (not blocky)
    ctx.drawImage(off, X, Y, W, H);
    ctx.imageSmoothingEnabled=sm;
    const nx=lon=>X+((lon-B.LON0)/(B.LON1-B.LON0))*W, ny=lat=>Y+((B.LAT1-lat)/(B.LAT1-B.LAT0))*H;
    ctx.textAlign='center'; ctx.textBaseline='middle';
    for(const l of SEAS){ ctx.fillStyle='#356c88'; ctx.font='italic '+Math.max(8,l[3]*0.001*H)+'px Georgia'; ctx.fillText(l[0],nx(l[1]),ny(l[2])); }
    for(const l of LAND){ ctx.font='bold '+Math.max(8,l[3]*0.001*H)+'px Georgia';
      ctx.fillStyle='rgba(255,255,255,0.55)'; ctx.fillText(l[0],nx(l[1])+1,ny(l[2])+1);
      ctx.fillStyle='#22201a'; ctx.fillText(l[0],nx(l[1]),ny(l[2])); }
    for(const a of ARROWS) arrow(ctx,nx(a[0]),ny(a[1]),nx(a[2]),ny(a[3]),a[4],H);
    const tw=0.85+0.15*Math.sin((opts.t||0)*4);
    for(const b of BATTLES){ const r=Math.max(4,0.014*H)*tw, cx=nx(b[1]), cy=ny(b[2]);
      star(ctx,cx,cy,r,'#c01a1a'); star(ctx,cx,cy,r*0.5,'#ff5a4a');
      ctx.font='italic '+Math.max(7,0.012*H)+'px Georgia'; ctx.fillStyle='#2a1410'; ctx.textAlign='left';
      ctx.fillText(b[0],cx+r+2,cy); ctx.textAlign='center'; }
    if(opts.title){ const bw=W*0.52,bx=X+W/2-bw/2,by=Y-2,bh=Math.max(16,0.05*H);
      ctx.fillStyle='#f3ead0'; ctx.fillRect(bx,by,bw,bh); ctx.strokeStyle='#2a2418'; ctx.lineWidth=2; ctx.strokeRect(bx,by,bw,bh);
      ctx.fillStyle='#1a140d'; ctx.font='bold '+Math.max(11,0.032*H)+'px Georgia'; ctx.textBaseline='middle';
      ctx.fillText('WORLD WAR I IN EUROPE',X+W/2,by+bh/2); }
    if(opts.legend!==false){ const lw=W*0.21, lh=H*0.25, lx=X+W-lw-6, ly=Y+6;
      ctx.fillStyle='rgba(255,252,244,0.93)'; ctx.fillRect(lx,ly,lw,lh); ctx.strokeStyle='#2a2418'; ctx.lineWidth=1; ctx.strokeRect(lx,ly,lw,lh);
      const items=[['Allied Powers',C.allied],['Central Powers',C.central],['Neutral nations',C.neutral]];
      ctx.textAlign='left'; ctx.textBaseline='middle'; const fs=Math.max(8,0.020*H);
      items.forEach((it,i)=>{ const yy=ly+lh*0.16+i*lh*0.20; ctx.fillStyle=it[1]; ctx.fillRect(lx+6,yy-fs*0.5,fs*1.4,fs); ctx.strokeRect(lx+6,yy-fs*0.5,fs*1.4,fs); ctx.fillStyle='#2a2418'; ctx.font=fs+'px Georgia'; ctx.fillText(it[0],lx+6+fs*1.9,yy); });
      const sy=ly+lh*0.80; star(ctx,lx+6+fs*0.7,sy,fs*0.7,'#c01a1a'); ctx.fillStyle='#2a2418'; ctx.fillText('Major battles',lx+6+fs*1.9,sy); }
    ctx.textAlign='left'; ctx.textBaseline='alphabetic';
  }
  global.WarMap = { draw, rebuild:()=>{off=null;} };
})(window);
