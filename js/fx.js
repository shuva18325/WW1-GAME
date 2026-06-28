/* =========================================================================
 * IRON & FAITH — fx.js
 * Particle system, screen shake, shockwaves, dynamic lighting, onomatopoeia,
 * and weather animation. Used by the renderer in game.js.
 * ========================================================================= */
(function (global) {
  'use strict';
  const rnd=(a,b)=>a+Math.random()*(b-a);

  const FX = {
    parts: [],
    shake: 0,            // current shake magnitude (px)
    flash: 0,            // dynamic-lighting flash 0..1
    flashCol: '255,220,120',
    light: 0,            // lingering battlefield light (barrage glow)

    reset(){ this.parts.length=0; this.shake=0; this.flash=0; this.light=0; },

    shakeNow(a){ this.shake = Math.min(22, this.shake + a); },
    flashNow(amt, col){ this.flash = Math.min(1, this.flash + amt); if(col) this.flashCol=col; },

    add(p){ if(this.parts.length<900) this.parts.push(p); },

    // muzzle smoke + sparks at a gun
    muzzle(x,y,dir,kind){
      const k = kind||'rifle';
      const n = k==='mg'?2 : k==='arty'?10 : k==='tank'?12 : k==='flame'?0 : 3;
      for(let i=0;i<n;i++) this.add({type:'smoke', x,y, vx:dir*rnd(8,40)+rnd(-10,10), vy:rnd(-26,-6),
        life:0, max:rnd(.4,.9), size:rnd(2,5)*(k==='arty'||k==='tank'?2:1), col:'200,195,185'});
      const sp = k==='arty'?8 : k==='tank'?7 : 2;
      for(let i=0;i<sp;i++) this.add({type:'spark', x,y, vx:dir*rnd(40,150), vy:rnd(-40,40),
        life:0, max:rnd(.12,.3), size:rnd(1,2), col:'255,210,90'});
    },

    // big explosion: fireball + shockwave ring + debris + smoke + shake + light
    explosion(x,y,r){
      this.add({type:'ring', x,y, life:0, max:.45, r0:6, r1:r*1.7, col:'255,230,160'});
      this.add({type:'fire', x,y, life:0, max:.4, size:r, col:'255,150,50'});
      for(let i=0;i<14;i++){ const a=rnd(0,Math.PI*2), sp=rnd(60,220);
        this.add({type:'debris', x,y, vx:Math.cos(a)*sp, vy:Math.sin(a)*sp-40, g:340,
          life:0, max:rnd(.5,1.1), size:rnd(1,3), col:'90,72,52'}); }
      for(let i=0;i<8;i++){ const a=rnd(0,Math.PI*2), sp=rnd(20,80);
        this.add({type:'smoke', x,y:y-rnd(0,8), vx:Math.cos(a)*sp, vy:-rnd(20,60),
          life:0, max:rnd(.8,1.6), size:rnd(4,9), col:'70,64,58'}); }
      this.shakeNow(Math.min(16, r*0.28));
      this.flashNow(Math.min(.5, r*0.008));
      this.light = Math.min(1, this.light+0.5);
    },

    // hit sparks (e.g. rounds off tank armour)
    sparks(x,y,dir){ for(let i=0;i<6;i++) this.add({type:'spark', x,y,
      vx:dir*rnd(-30,120), vy:rnd(-90,40), g:200, life:0, max:rnd(.15,.4), size:rnd(1,2), col:'255,225,140'}); },

    // moving dust kicked up by tank treads / camels
    dust(x,y){ this.add({type:'dust', x,y, vx:rnd(-12,12), vy:rnd(-14,-2), life:0, max:rnd(.5,1.0), size:rnd(3,7), col:'150,130,95'}); },

    // flamethrower jet: short-lived flame + smoke particles streaming forward
    flame(x,y,dir){
      for(let i=0;i<5;i++){ const sp=rnd(60,170);
        this.add({type:'flame', x,y:y+rnd(-3,3), vx:dir*sp, vy:rnd(-20,12), life:0, max:rnd(.25,.5),
          size:rnd(4,9), col: i<3?'255,180,40':'255,90,20'}); }
      if(Math.random()<.6) this.add({type:'smoke', x:x+dir*40, y:y-rnd(4,16), vx:dir*rnd(10,40), vy:-rnd(20,50), life:0, max:rnd(.8,1.4), size:rnd(5,10), col:'40,36,32'});
    },

    // a unit on fire (burning DoT visual)
    burning(x,y){ if(Math.random()<.7) this.add({type:'flame', x:x+rnd(-6,6), y:y+rnd(-18,0), vx:rnd(-8,8), vy:-rnd(30,70), life:0, max:rnd(.3,.6), size:rnd(3,6), col:Math.random()<.5?'255,170,40':'255,80,20'}); },

    // onomatopoeia popup ("bang bang", "BRRRRT", "KRAA-THOOM!")
    popup(x,y,text,col){ this.add({type:'popup', x,y, vx:0, vy:-22, life:0, max:.9, text, col:col||'255,235,180'}); },

    // ground crater scorch decal
    scorch(x,y,r){ this.add({type:'scorch', x,y, life:0, max:6, size:r, col:'20,16,12'}); },

    update(dt){
      this.shake *= Math.pow(0.0001, dt);   // fast decay
      if(this.shake<0.2) this.shake=0;
      this.flash = Math.max(0, this.flash - dt*2.2);
      this.light = Math.max(0, this.light - dt*0.7);
      const live=[];
      for(const p of this.parts){
        p.life+=dt; if(p.life>=p.max) continue;
        if(p.vx!==undefined) p.x+=p.vx*dt;
        if(p.vy!==undefined){ p.y+=p.vy*dt; if(p.g) p.vy+=p.g*dt; }
        if(p.type==='smoke'||p.type==='dust') p.vx*=0.96;
        live.push(p);
      }
      this.parts=live;
    },

    shakeOffset(){ if(this.shake<=0) return {x:0,y:0};
      return { x:(Math.random()*2-1)*this.shake, y:(Math.random()*2-1)*this.shake }; },

    // draws world-space particles (call inside the shaken transform)
    drawWorld(ctx){
      for(const p of this.parts){
        const t=p.life/p.max, a=1-t;
        switch(p.type){
          case 'scorch': ctx.fillStyle='rgba('+p.col+','+(0.5*a)+')'; ctx.beginPath(); ctx.ellipse(p.x,p.y,p.size,p.size*0.5,0,0,7); ctx.fill(); break;
          case 'ring': { const r=p.r0+(p.r1-p.r0)*t; ctx.strokeStyle='rgba('+p.col+','+(a)+')'; ctx.lineWidth=3*a+1; ctx.beginPath(); ctx.arc(p.x,p.y,r,0,7); ctx.stroke(); break; }
          case 'fire': { const r=p.size*(0.5+t*0.8); ctx.fillStyle='rgba('+p.col+','+(a*0.9)+')'; ctx.beginPath(); ctx.arc(p.x,p.y,r,0,7); ctx.fill(); ctx.fillStyle='rgba(255,240,180,'+(a*0.7)+')'; ctx.beginPath(); ctx.arc(p.x,p.y,r*0.5,0,7); ctx.fill(); break; }
          case 'flame': { const r=p.size*(1-t*0.4); ctx.fillStyle='rgba('+p.col+','+(a)+')'; ctx.beginPath(); ctx.arc(p.x,p.y,r,0,7); ctx.fill(); break; }
          case 'smoke': { const r=p.size*(1+t*1.4); ctx.fillStyle='rgba('+p.col+','+(a*0.5)+')'; ctx.beginPath(); ctx.arc(p.x,p.y,r,0,7); ctx.fill(); break; }
          case 'dust': { const r=p.size*(1+t); ctx.fillStyle='rgba('+p.col+','+(a*0.45)+')'; ctx.beginPath(); ctx.arc(p.x,p.y,r,0,7); ctx.fill(); break; }
          case 'debris': ctx.fillStyle='rgba('+p.col+','+a+')'; ctx.fillRect(p.x,p.y,p.size,p.size); break;
          case 'spark': ctx.fillStyle='rgba('+p.col+','+a+')'; ctx.fillRect(p.x,p.y,p.size,p.size); break;
          case 'popup': { ctx.font='bold 13px monospace'; ctx.textAlign='center';
            ctx.fillStyle='rgba(0,0,0,'+(a*0.7)+')'; ctx.fillText(p.text,p.x+1,p.y+1);
            ctx.fillStyle='rgba('+p.col+','+a+')'; ctx.fillText(p.text,p.x,p.y); ctx.textAlign='left'; break; }
        }
      }
    },

    // screen-space weather overlay (call after world, in screen space)
    drawWeather(ctx, weather, W, H, time){
      if(weather==='rain'){
        ctx.strokeStyle='rgba(170,190,210,0.35)'; ctx.lineWidth=1;
        for(let i=0;i<120;i++){ const x=(i*97 + time*900)%W, y=(i*53 + time*900)%H;
          ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x-4,y+12); ctx.stroke(); }
        ctx.fillStyle='rgba(30,40,55,0.18)'; ctx.fillRect(0,0,W,H);
      } else if(weather==='fog'){
        for(let i=0;i<5;i++){ const y=(i*H/5 + Math.sin(time*0.3+i)*20);
          ctx.fillStyle='rgba(200,205,210,0.10)'; ctx.fillRect(0,y,W,H/4); }
        ctx.fillStyle='rgba(210,215,220,0.14)'; ctx.fillRect(0,0,W,H);
      } else if(weather==='snow'||weather==='cold'){
        ctx.fillStyle='rgba(220,235,245,0.16)'; ctx.fillRect(0,0,W,H);
        ctx.fillStyle='#fff';
        for(let i=0;i<90;i++){ const x=(i*53 + Math.sin(time+i)*16 + time*40)%W, y=(i*37 + time*70)%H; ctx.fillRect(x,y,2,2); }
      } else if(weather==='sandstorm'){
        ctx.fillStyle='rgba(200,160,90,0.30)'; ctx.fillRect(0,0,W,H);
        ctx.fillStyle='rgba(225,195,130,0.25)';
        for(let i=0;i<70;i++){ const x=(i*61 + time*1400)%W, y=(i*43 + Math.sin(time*2+i)*30)%H; ctx.fillRect(x,y,7,2); }
      } else if(weather==='gas'){
        ctx.fillStyle='rgba(120,180,80,0.20)'; ctx.fillRect(0,0,W,H);
      }
    }
  };

  global.FX = FX;
})(window);
