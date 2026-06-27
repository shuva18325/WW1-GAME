/* =========================================================================
 * IRON & FAITH — sprites.js
 * Procedural chunky pixel-art renderer.
 * Soldiers are drawn from blocks so they can be re-coloured & re-helmeted
 * per nationality, matching the reference soldier sprite.
 * ========================================================================= */
(function (global) {
  'use strict';

  // -- per-nationality palettes -------------------------------------------
  // Base soldier matches the reference: tan/khaki uniform, cloth helmet,
  // high backpack, brown boots, horizontal rifle.
  const PAL = {
    german:   { uniform:'#5b6650', uni2:'#454e3d', helmet:'#5a5f55', skin:'#e8c39e', pack:'#6e5a3c', boots:'#3a2a1c', belt:'#241a10', metal:'#b9bcb6', accent:'#1f2a1a' },
    ottoman:  { uniform:'#b89a6a', uni2:'#9c8052', helmet:'#a98c5c', skin:'#d9ad7c', pack:'#7c5f3a', boots:'#4a3520', belt:'#2e2012', metal:'#c9ccc6', accent:'#3a2e18', fez:'#9e2b25' },
    austria:  { uniform:'#8a93a0', uni2:'#6f7884', helmet:'#7c848e', skin:'#e3bd96', pack:'#5e5142', boots:'#3a2c1e', belt:'#26201a', metal:'#bcc0c4', accent:'#2a3038' },
    bulgaria: { uniform:'#7c6f4f', uni2:'#62583d', helmet:'#6b5f42', skin:'#dcb083', pack:'#5b4a30', boots:'#3a2a1a', belt:'#241a10', metal:'#bcbfb9', accent:'#2c2618' },
    arab:     { uniform:'#cdbb97', uni2:'#b3a079', helmet:'#e8e2d2', skin:'#caa173', pack:'#8a7350', boots:'#5a4426', belt:'#3a2c18', metal:'#c4c7c1', accent:'#7a1f1f', cloth:'#e8e2d2' },
    british:  { uniform:'#7d7142', uni2:'#655b34', helmet:'#6f6638', skin:'#e6c098', pack:'#5a4d2e', boots:'#33271a', belt:'#241c10', metal:'#bcbfb9', accent:'#3a3420' },
    french:   { uniform:'#5f76a6', uni2:'#4a5e88', helmet:'#56688f', skin:'#e6c098', pack:'#4a4030', boots:'#2c2418', belt:'#1e1810', metal:'#bcbfb9', accent:'#b9b08a' },
    russian:  { uniform:'#6f6a4e', uni2:'#57523b', helmet:'#5c5740', skin:'#e6c098', pack:'#534830', boots:'#2c2418', belt:'#1e160c', metal:'#bcbfb9', accent:'#7a6f4a' }
  };

  // helmet style per nationality (overridable per-unit)
  const HELMET_BY_NATION = {
    german:'stahlhelm', ottoman:'kabalak', austria:'stahlhelm',
    bulgaria:'cap', arab:'keffiyeh', british:'brodie', french:'adrian', russian:'cap'
  };

  function pal(nation){ return PAL[nation] || PAL.german; }

  // block draw in local grid coords
  function B(ctx,x,y,w,h,c,s){ ctx.fillStyle=c; ctx.fillRect((x*s)|0,(y*s)|0,Math.ceil(w*s),Math.ceil(h*s)); }

  // ----------------------------------------------------------------------
  // SOLDIER  (local grid ~14 wide x 22 tall, origin top-left)
  // opts: { nation, helmet, pose('idle'|'walk'|'fire'), facing(1|-1),
  //         ragged(bool, ottoman low-equipment look), s(scale) }
  // ----------------------------------------------------------------------
  function drawSoldier(ctx, px, py, opts){
    opts = opts||{};
    const s = opts.s||3;
    const p = pal(opts.nation);
    const helmet = opts.helmet || HELMET_BY_NATION[opts.nation] || 'stahlhelm';
    const pose = opts.pose||'idle';
    const facing = opts.facing||1;
    const t = opts.t||0;

    ctx.save();
    ctx.translate(px, py);
    if (facing < 0){ ctx.scale(-1,1); }      // mirror enemies / direction
    ctx.translate(0,0);

    const legSwing = pose==='walk' ? Math.round(Math.sin(t*0.4))*1 : 0;
    const recoil   = pose==='fire' ? 1 : 0;

    // backpack (behind torso, toward the back = left side when facing right)
    B(ctx, 2, 7, 4, 7, p.pack, s);
    B(ctx, 2, 7, 1, 7, '#00000033', s);
    B(ctx, 3, 9, 2, 1, p.belt, s);

    // legs / trousers
    B(ctx, 5, 14, 2, 5+legSwing, p.uniform, s);
    B(ctx, 8, 14, 2, 5-legSwing, p.uniform, s);
    // boots
    B(ctx, 5, 19+legSwing, 2, 2, p.boots, s);
    B(ctx, 8, 19-legSwing, 2, 2, p.boots, s);
    // ragged ottoman: a missing puttee/"sock" -> show skin on one shin
    if (opts.ragged){ B(ctx, 8, 17, 2, 2, p.skin, s); }

    // torso
    B(ctx, 5, 7, 5, 7, p.uniform, s);
    B(ctx, 5, 7, 1, 7, p.uni2, s);          // shade
    // buttons / detail
    B(ctx, 7, 8, 1, 1, p.accent, s);
    B(ctx, 7, 10, 1, 1, p.accent, s);
    B(ctx, 7, 12, 1, 1, p.accent, s);
    // belt + buckle
    B(ctx, 5, 13, 5, 1, p.belt, s);
    B(ctx, 7, 13, 1, 1, '#c9a23a', s);

    // head + face
    B(ctx, 6, 4, 4, 3, p.skin, s);
    B(ctx, 6, 4, 1, 3, '#00000022', s);

    // helmet variants
    switch(helmet){
      case 'stahlhelm':
        B(ctx, 5, 3, 6, 2, p.helmet, s);
        B(ctx, 4, 4, 1, 1, p.helmet, s);    // side flare
        B(ctx, 10, 4, 1, 1, p.helmet, s);
        B(ctx, 5, 3, 6, 1, '#ffffff14', s);
        break;
      case 'brodie':
        B(ctx, 3, 4, 8, 1, p.helmet, s);    // wide flat brim
        B(ctx, 6, 2, 4, 2, p.helmet, s);    // dome
        B(ctx, 6, 2, 4, 1, '#ffffff18', s);
        break;
      case 'adrian':
        B(ctx, 5, 3, 6, 2, p.helmet, s);
        B(ctx, 7, 1, 2, 2, p.helmet, s);    // crest ridge
        B(ctx, 7, 1, 2, 1, p.accent, s);
        break;
      case 'fez':
        B(ctx, 6, 1, 4, 3, p.fez||'#9e2b25', s);
        B(ctx, 9, 1, 1, 3, '#2a1a14', s);   // tassel
        break;
      case 'kabalak':
        B(ctx, 5, 2, 6, 3, p.helmet, s);    // wrapped cloth
        B(ctx, 5, 3, 6, 1, '#00000022', s);
        B(ctx, 5, 4, 6, 1, '#ffffff10', s);
        break;
      case 'keffiyeh':
        B(ctx, 5, 2, 6, 3, p.cloth||'#e8e2d2', s);
        B(ctx, 4, 4, 2, 4, p.cloth||'#e8e2d2', s);   // drape down side
        B(ctx, 5, 2, 6, 1, p.accent, s);             // band
        break;
      default: // soft cap
        B(ctx, 5, 3, 6, 2, p.helmet, s);
        B(ctx, 9, 3, 2, 1, p.helmet, s);    // peak
    }

    // arms + rifle (rifle is long, horizontal, pointing forward)
    const ry = 10 - recoil;
    B(ctx, 9, 9, 3, 3, p.uniform, s);        // forward arm
    B(ctx, 8, 9, 2, 3, p.uni2, s);           // rear arm
    B(ctx, 9, ry, 6, 1, '#7d7468', s);       // barrel
    B(ctx, 14-recoil, ry, 1, 1, '#3a342c', s);// muzzle
    B(ctx, 8, ry, 2, 2, '#4a3a26', s);       // wooden stock at body
    if (pose==='fire'){ // muzzle flash
      B(ctx, 15-recoil, ry-1, 2, 3, '#ffd24a', s);
      B(ctx, 16-recoil, ry, 1, 1, '#fff3b0', s);
    }

    ctx.restore();
  }

  // approximate footprint so callers can place/scale
  drawSoldier.size = function(s){ return { w: 17*s, h: 21*s }; };

  // ----------------------------------------------------------------------
  // CORPSE
  // ----------------------------------------------------------------------
  function drawCorpse(ctx, px, py, opts){
    const s=opts.s||3, p=pal(opts.nation);
    ctx.save(); ctx.translate(px,py);
    B(ctx, 1, 14, 10, 3, p.uniform, s);
    B(ctx, 1, 14, 10, 1, p.uni2, s);
    B(ctx, 10, 13, 2, 2, p.skin, s);
    B(ctx, 2, 16, 9, 1, '#00000033', s);
    ctx.restore();
  }

  // ----------------------------------------------------------------------
  // TANK  type: 'rhomboid' (British/French), 'a7v' (German), 'ft' (light)
  // matches reference: olive rhomboid, nose stripes, hull number, mud track
  // ----------------------------------------------------------------------
  function drawTank(ctx, px, py, opts){
    const s=opts.s||3; const facing=opts.facing||1;
    const type=opts.type||'rhomboid';
    ctx.save(); ctx.translate(px,py); if(facing<0) ctx.scale(-1,1);

    if (type==='a7v'){
      const body='#5a5f4e', dk='#3f4437';
      B(ctx, 0, 4, 22, 9, dk, s);          // boxy hull
      B(ctx, 1, 3, 20, 9, body, s);
      B(ctx, 1, 3, 20, 1, '#ffffff14', s);
      B(ctx, 7, 1, 8, 3, body, s);         // superstructure
      B(ctx, 2, 6, 18, 1, dk, s);
      B(ctx, 18, 6, 3, 2, '#2a2a2a', s);   // gun
      B(ctx, 21, 6, 3, 1, '#222', s);
      B(ctx, 0, 12, 22, 2, '#3a2a1c', s);  // track mud
      // iron cross
      B(ctx, 4, 7, 3, 3, '#e9e9e9', s); B(ctx,5,7,1,3,'#1a1a1a',s); B(ctx,4,8,3,1,'#1a1a1a',s);
    } else if (type==='ft'){
      const body='#5d6b48', dk='#46512f';
      B(ctx, 0, 7, 16, 5, dk, s);
      B(ctx, 1, 6, 12, 5, body, s);
      B(ctx, 9, 3, 5, 4, body, s);         // turret
      B(ctx, 13, 4, 5, 1, '#2a2a2a', s);   // gun
      B(ctx, 0, 11, 16, 2, '#3a2a1c', s);
    } else { // rhomboid (reference)
      const body='#5c623f', dk='#454a2e', lt='#6b714a';
      // rhomboid silhouette
      B(ctx, 2, 5, 26, 8, body, s);
      B(ctx, 0, 8, 4, 4, body, s);         // nose dip
      B(ctx, 28, 7, 4, 4, body, s);        // tail
      B(ctx, 2, 5, 26, 1, lt, s);
      B(ctx, 2, 12, 28, 2, dk, s);         // lower track
      B(ctx, 2, 6, 26, 1, '#ffffff10', s);
      // nose recognition stripes (white/red)
      B(ctx, 1, 6, 2, 6, '#e7e2d6', s);
      B(ctx, 3, 6, 2, 6, '#8e2a26', s);
      // sponson + gun
      B(ctx, 10, 7, 5, 4, dk, s);
      B(ctx, 6, 9, 5, 1, '#2a2a2a', s);    // hull gun barrel forward
      B(ctx, 4, 9, 2, 1, '#222', s);
      // hull number
      B(ctx, 6, 7, 1, 2, '#cfcaba', s); B(ctx,8,7,1,2,'#cfcaba',s);
      // track mud wake
      B(ctx, 0, 13, 32, 2, '#3b2c1d', s);
    }
    ctx.restore();
  }
  drawTank.size = function(s,type){ return { w:(type==='a7v'?24:type==='ft'?18:34)*s, h:16*s }; };

  // ----------------------------------------------------------------------
  // CAMEL + rider (Ottoman camel infantry / Arab raider)
  // ----------------------------------------------------------------------
  function drawCamel(ctx, px, py, opts){
    const s=opts.s||3, p=pal(opts.nation), facing=opts.facing||1;
    ctx.save(); ctx.translate(px,py); if(facing<0) ctx.scale(-1,1);
    const c='#c2a878', cd='#a98f63';
    B(ctx, 3, 10, 12, 5, c, s);            // body
    B(ctx, 3, 10, 12, 1, '#ffffff14', s);
    B(ctx, 7, 7, 4, 3, c, s);              // hump
    B(ctx, 13, 6, 3, 5, c, s);             // neck
    B(ctx, 15, 4, 3, 3, c, s);             // head
    B(ctx, 17, 5, 1, 1, '#1a1a1a', s);     // eye
    B(ctx, 4, 15, 2, 5, cd, s);            // legs
    B(ctx, 12, 15, 2, 5, cd, s);
    // rider
    B(ctx, 7, 3, 4, 5, p.uniform, s);
    B(ctx, 7, 1, 4, 2, p.cloth||p.helmet, s);
    B(ctx, 10, 4, 5, 1, '#7d7468', s);     // rifle
    ctx.restore();
  }
  drawCamel.size=function(s){ return {w:18*s,h:20*s}; };

  // ----------------------------------------------------------------------
  // STRUCTURES & TERRAIN BITS
  // ----------------------------------------------------------------------
  function drawTrench(ctx, x, y, w, level, theme){
    // level 1..4 ditch->sandbag->reinforced->concrete
    const top = theme.trenchTop||'#3a2c1c';
    const dark= theme.trenchDark||'#241a10';
    ctx.fillStyle=dark; ctx.fillRect(x, y, w, 26);
    ctx.fillStyle=top;  ctx.fillRect(x, y, w, 6);
    // parapet sandbags
    for(let i=0;i<w;i+=14){
      ctx.fillStyle = level>=2 ? '#7c6a44' : '#4a3a24';
      ctx.fillRect(x+i, y-6, 12, 8);
      ctx.fillStyle='#00000033'; ctx.fillRect(x+i, y-1, 12, 2);
    }
    if(level>=3){ ctx.fillStyle='#6b6f64'; ctx.fillRect(x,y-9,w,4); } // reinforced beam
    if(level>=4){ ctx.fillStyle='#8c8f88'; ctx.fillRect(x,y-12,w,4); ctx.fillStyle='#5a5d56'; ctx.fillRect(x,y-12,w,1);} // concrete
  }

  function drawWire(ctx,x,y,w){
    ctx.strokeStyle='#6b6253'; ctx.lineWidth=1;
    for(let i=0;i<w;i+=8){
      ctx.beginPath(); ctx.moveTo(x+i,y); ctx.lineTo(x+i+4,y-6); ctx.lineTo(x+i+8,y); ctx.stroke();
      ctx.fillStyle='#8a8170'; ctx.fillRect(x+i+3,y-4,2,2);
    }
  }

  function drawCrater(ctx,x,y,r){
    ctx.fillStyle='#241a10'; ctx.beginPath(); ctx.ellipse(x,y,r,r*0.5,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#3a2c1c'; ctx.beginPath(); ctx.ellipse(x,y-1,r*0.7,r*0.35,0,0,Math.PI*2); ctx.fill();
  }

  function drawMGNest(ctx,x,y){
    ctx.fillStyle='#5b4a30'; ctx.fillRect(x-8,y-2,16,8);
    ctx.fillStyle='#3a2c1c'; ctx.fillRect(x-8,y+4,16,3);
    ctx.fillStyle='#2a2a2a'; ctx.fillRect(x+6,y,8,2);
  }

  function drawFlag(ctx,x,y,nation){
    ctx.fillStyle='#2a2018'; ctx.fillRect(x,y-26,2,30);     // pole
    const bands = FLAGS[nation]||FLAGS.german;
    const fw=18, fh=12;
    for(let i=0;i<bands.length;i++){
      ctx.fillStyle=bands[i];
      ctx.fillRect(x+2, y-26 + i*(fh/bands.length), fw, fh/bands.length);
    }
  }

  // Flag colour bands (top->bottom)
  const FLAGS = {
    german:  ['#111','#fff','#c8102e'],            // black-white-red (Imperial)
    austria: ['#c8102e','#fff','#c8102e'],
    ottoman: ['#c8102e','#c8102e','#c8102e'],      // red field (crescent drawn separately)
    bulgaria:['#fff','#1a7a3a','#c8102e'],
    british: ['#012169','#fff','#c8102e'],
    french:  ['#0055a4','#fff','#ef4135'],
    russian: ['#fff','#0039a6','#d52b1e']
  };

  function drawOttomanCrescent(ctx,x,y){
    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(x+9,y-20,3,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#c8102e'; ctx.beginPath(); ctx.arc(x+10,y-20,2.4,0,Math.PI*2); ctx.fill();
  }

  global.Sprites = {
    PAL, FLAGS, pal, drawSoldier, drawCorpse, drawTank, drawCamel,
    drawTrench, drawWire, drawCrater, drawMGNest, drawFlag, drawOttomanCrescent,
    block:B
  };

})(window);
