/* =========================================================================
 * IRON & FAITH — audio.js
 * Procedural WW1 soundscape via the Web Audio API (no external assets).
 * Weapon SFX, explosions, flamethrower roar, tank rumble, per-theme ambience,
 * a march-music loop, and officer "shout" stingers. All synthesized.
 * ========================================================================= */
(function (global) {
  'use strict';
  let ctx=null, master=null, muted=false, started=false;
  let noiseBuf=null;
  let ambGain=null, ambNodes=[], musicTimer=null, rumble=null, rumbleGain=null;
  const last={};           // throttle map

  function ensure(){
    if(ctx) return;
    const AC = global.AudioContext||global.webkitAudioContext; if(!AC) return;
    ctx=new AC();
    master=ctx.createGain(); master.gain.value=muted?0:0.7; master.connect(ctx.destination);
    // 2s white-noise buffer
    noiseBuf=ctx.createBuffer(1, ctx.sampleRate*2, ctx.sampleRate);
    const d=noiseBuf.getChannelData(0);
    for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
  }
  function resume(){ ensure(); if(ctx && ctx.state==='suspended') ctx.resume(); }

  function noise(dur,filterType,freq,q,gain,attack){
    if(!ctx) return;
    const src=ctx.createBufferSource(); src.buffer=noiseBuf; src.loop=true;
    const f=ctx.createBiquadFilter(); f.type=filterType||'bandpass'; f.frequency.value=freq||1000; f.Q.value=q||1;
    const g=ctx.createGain(); const t=ctx.currentTime; const a=attack||0.001;
    g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(gain||0.4,t+a);
    g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    src.connect(f); f.connect(g); g.connect(master); src.start(t); src.stop(t+dur+0.02);
    return {src,f,g};
  }
  function tone(freq,dur,type,gain,slideTo){
    if(!ctx) return;
    const o=ctx.createOscillator(); o.type=type||'sine'; const g=ctx.createGain();
    const t=ctx.currentTime; o.frequency.setValueAtTime(freq,t);
    if(slideTo) o.frequency.exponentialRampToValueAtTime(slideTo,t+dur);
    g.gain.setValueAtTime(gain||0.3,t); g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    o.connect(g); g.connect(master); o.start(t); o.stop(t+dur+0.02);
  }
  function throttle(key,ms){ const n=performance.now(); if(last[key]&&n-last[key]<ms) return false; last[key]=n; return true; }

  const SFX = {
    rifle(){ if(!ctx||!throttle('rifle',55))return; noise(0.12,'highpass',1800,1,0.35); tone(220,0.05,'square',0.08,90); },
    mg(){ if(!ctx||!throttle('mg',70))return; for(let i=0;i<3;i++) setTimeout(()=>{noise(0.06,'highpass',2200,1,0.22);},i*28); },
    artillery(){ if(!ctx||!throttle('arty',120))return; tone(70,0.7,'sine',0.5,28); noise(0.6,'lowpass',400,1,0.5,0.005); },
    tank(){ if(!ctx||!throttle('tankc',140))return; tone(55,0.9,'sine',0.6,22); noise(0.7,'lowpass',300,1,0.55,0.004); },
    explosion(r){ if(!ctx||!throttle('exp',60))return; tone(60,0.8,'sine',0.55,24); noise(0.7,'lowpass',520,1,0.6,0.004); },
    flame(){ if(!ctx||!throttle('flame',90))return; noise(0.3,'bandpass',700,0.6,0.3,0.05); },
    sparks(){ if(!ctx||!throttle('spark',80))return; noise(0.08,'highpass',4000,1,0.12); },
    naval(){ if(!ctx)return; tone(48,1.1,'sine',0.6,20); noise(0.9,'lowpass',300,1,0.6,0.01); },
    // officer command shout (synth formant sweep — flavour, real VO is specced)
    shout(){ if(!ctx)return; tone(180,0.18,'sawtooth',0.18,260); tone(140,0.22,'square',0.08,200); },
    click(){ if(!ctx)return; tone(440,0.05,'square',0.12,660); },
    victory(){ if(!ctx)return; [392,494,587,784].forEach((f,i)=>setTimeout(()=>tone(f,0.4,'triangle',0.3),i*180)); },
    defeat(){ if(!ctx)return; [330,294,247,196].forEach((f,i)=>setTimeout(()=>tone(f,0.5,'sine',0.3),i*220)); }
  };

  // ----- ambience per theme (wind / sea / mountain) -----
  function startAmbience(theme){
    stopAmbience(); if(!ctx) return;
    ambGain=ctx.createGain(); ambGain.gain.value=0.0; ambGain.connect(master);
    ambGain.gain.linearRampToValueAtTime(theme==='beach'?0.16:0.12, ctx.currentTime+2);
    const src=ctx.createBufferSource(); src.buffer=noiseBuf; src.loop=true;
    const f=ctx.createBiquadFilter();
    f.type='lowpass'; f.frequency.value = theme==='desert'?500 : theme==='snow'?350 : theme==='beach'?700 : 420;
    // slow wind swell via LFO on filter
    const lfo=ctx.createOscillator(); lfo.frequency.value=0.08; const lg=ctx.createGain(); lg.gain.value=150;
    lfo.connect(lg); lg.connect(f.frequency); lfo.start();
    src.connect(f); f.connect(ambGain); src.start();
    ambNodes=[src,lfo];
  }
  function stopAmbience(){ if(ambGain){ try{ambNodes.forEach(n=>n.stop&&n.stop());}catch(e){} ambGain.disconnect(); ambGain=null; ambNodes=[]; } }

  // tank engine rumble (on while armour is on field)
  function setRumble(on){
    if(!ctx) return;
    if(on && !rumble){ rumble=ctx.createOscillator(); rumble.type='sawtooth'; rumble.frequency.value=42;
      rumbleGain=ctx.createGain(); rumbleGain.gain.value=0; const f=ctx.createBiquadFilter(); f.type='lowpass'; f.frequency.value=120;
      rumble.connect(f); f.connect(rumbleGain); rumbleGain.connect(master); rumble.start();
      rumbleGain.gain.linearRampToValueAtTime(0.10, ctx.currentTime+0.6); }
    else if(!on && rumble){ rumbleGain.gain.linearRampToValueAtTime(0, ctx.currentTime+0.5);
      const r=rumble; setTimeout(()=>{try{r.stop();}catch(e){}},600); rumble=null; }
  }

  // ----- march music loop (drums + horn motif) -----
  function startMusic(){
    stopMusic(); if(!ctx) return;
    const motif=[262,262,330,392, 392,330,294,262]; // simple martial line
    let step=0;
    musicTimer=setInterval(()=>{
      if(muted) return;
      const f=motif[step%motif.length];
      // horn
      const o=ctx.createOscillator(); o.type='sawtooth'; const g=ctx.createGain();
      const lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=1200;
      const t=ctx.currentTime; g.gain.setValueAtTime(0.0,t); g.gain.linearRampToValueAtTime(0.06,t+0.04); g.gain.exponentialRampToValueAtTime(0.0001,t+0.45);
      o.frequency.value=f; o.connect(lp); lp.connect(g); g.connect(master); o.start(t); o.stop(t+0.5);
      // drum every other step
      if(step%2===0){ tone(90,0.18,'sine',0.18,40); noise(0.08,'lowpass',200,1,0.12); }
      step++;
    }, 420);
  }
  function stopMusic(){ if(musicTimer){ clearInterval(musicTimer); musicTimer=null; } }

  function setMuted(m){ muted=m; if(master) master.gain.value=m?0:0.7; }
  function isMuted(){ return muted; }

  global.Sound = { resume, SFX, startAmbience, stopAmbience, startMusic, stopMusic, setRumble, setMuted, isMuted,
    get ready(){ return !!ctx; } };
})(window);
