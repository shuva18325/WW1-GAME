/* =========================================================================
 * IRON & FAITH — ui.js
 * Screen flow (loading → menu → campaign → difficulty → battle → aftermath)
 * + battle HUD wired to the Engine.
 * ========================================================================= */
(function (global) {
  'use strict';
  const D = global.GameData, S = global.Sprites;
  let curCampaign = null, curCards = [];

  const QUOTES = [
    '“Gott mit uns.” — buckle of the Imperial German Army',
    '“We have no eternal allies and no perpetual enemies.” — of the Great War',
    '“Hold the heights, and the sea may rage in vain.” — Gallipoli',
    '“The desert is our trench.” — Hejaz front',
    '“Eleven tongues, one trench.” — Austro-Hungarian saying'
  ];

  function $(id){ return document.getElementById(id); }
  function el(tag, cls, html){ const e=document.createElement(tag); if(cls)e.className=cls; if(html!=null)e.innerHTML=html; return e; }
  function show(id){ document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active')); $(id).classList.add('active'); }

  // ---------------------------------------------------------------- LOADING
  function runLoading(done){
    const c=$('loadCanvas'), x=c.getContext('2d');
    c.width=480; c.height=270; x.imageSmoothingEnabled=false;
    drawLoadingArt(x);
    $('loadQuote').textContent = QUOTES[(Math.random()*QUOTES.length)|0];
    let p=0; const bar=$('loadbar');
    const iv=setInterval(()=>{ p+=Math.random()*16+6; bar.style.width=Math.min(100,p)+'%';
      if(p>=100){ clearInterval(iv); setTimeout(done,400); } }, 160);
  }

  // First loading screen = Central Powers leaders + flags.
  // Tries assets/loading.png first; otherwise draws a pixel-art rendition.
  function drawLoadingArt(x){
    const img=new Image();
    img.onload=()=>{ x.drawImage(img,0,0,480,270); overlayTitle(x); };
    img.onerror=()=>{ drawLeadersAndFlags(x); overlayTitle(x); };
    img.src='assets/loading.png';
    // draw fallback immediately in case the image is slow/missing
    drawLeadersAndFlags(x); overlayTitle(x);
  }
  function overlayTitle(x){
    x.fillStyle='rgba(10,8,6,0.55)'; x.fillRect(0,0,480,40);
    x.fillStyle='#e8dcc0'; x.font='bold 22px Georgia'; x.textAlign='center';
    x.fillText('THE CENTRAL POWERS', 240, 27); x.textAlign='left';
  }
  function drawLeadersAndFlags(x){
    x.fillStyle='#241c12'; x.fillRect(0,0,480,270);
    x.fillStyle='#3a2c1c'; for(let y=0;y<270;y+=10)x.fillRect(0,y,480,2);
    const nations=['german','austria','ottoman','bulgaria'];
    const names=['GERMANY','AUSTRIA-HUNGARY','OTTOMAN','BULGARIA'];
    for(let i=0;i<4;i++){
      const cx=70+i*114;
      // flag
      S.drawFlag(x, cx, 96, nations[i]);
      if(nations[i]==='ottoman') S.drawOttomanCrescent(x, cx, 96);
      // leader bust
      drawBust(x, cx-18, 120, nations[i]);
      x.fillStyle='#cbb98e'; x.font='10px monospace'; x.textAlign='center';
      x.fillText(names[i], cx+8, 250); x.textAlign='left';
    }
  }
  function drawBust(x, px, py, nation){
    const p=S.pal(nation);
    // shoulders
    x.fillStyle=p.uniform; x.fillRect(px-6,py+30,48,30);
    x.fillStyle=p.uni2; x.fillRect(px-6,py+30,48,3);
    // medals/braid
    x.fillStyle='#c9a23a'; x.fillRect(px+2,py+36,4,4); x.fillRect(px+2,py+44,4,4);
    // head
    x.fillStyle=p.skin; x.fillRect(px+10,py+8,20,22);
    // mustache (period leaders)
    x.fillStyle='#2a2018'; x.fillRect(px+12,py+24,16,3);
    // headgear per nation
    if(nation==='german'){ x.fillStyle='#2a2018'; x.fillRect(px+8,py,24,8); x.fillRect(px+18,py-8,4,8); } // pickelhaube spike
    else if(nation==='ottoman'){ x.fillStyle='#9e2b25'; x.fillRect(px+10,py-2,20,12); x.fillStyle='#2a1a14'; x.fillRect(px+28,py-2,3,8);} // fez
    else if(nation==='austria'){ x.fillStyle='#6f7884'; x.fillRect(px+8,py+2,24,8); x.fillStyle='#c9a23a'; x.fillRect(px+8,py+8,24,2);} // kepi
    else { x.fillStyle='#62583d'; x.fillRect(px+9,py+2,22,8); } // bulgaria cap
  }

  // ---------------------------------------------------------------- MENU
  function buildMenu(){
    const row=$('menuFlags');
    ['german','austria','ottoman','bulgaria'].forEach(n=>{
      const cc=el('canvas'); cc.width=24; cc.height=40; const cx=cc.getContext('2d');
      S.drawFlag(cx,8,34,n); if(n==='ottoman')S.drawOttomanCrescent(cx,8,34); row.appendChild(cc);
    });
  }

  // ---------------------------------------------------------------- CAMPAIGNS
  function buildCampaignSelect(){
    const grid=$('campGrid'); grid.innerHTML='';
    D.CAMPAIGNS.forEach(c=>{
      const fac=D.FACTIONS[c.faction];
      const card=el('div','camp-card');
      const modeTag = c.mode.toUpperCase();
      card.innerHTML=`<h3>${c.name}</h3><div class="sub">${c.subtitle}</div>
        <div class="desc">${c.brief}</div>
        <div><span class="tag">${fac.name}</span><span class="tag">${modeTag}</span>
        <span class="tag enemy">${c.intel}</span></div>`;
      card.onclick=()=>{ curCampaign=c; buildDifficulty(c); show('difficulty-select'); };
      grid.appendChild(card);
    });
  }

  function buildDifficulty(c){
    $('diffTitle').textContent=c.name;
    $('diffSub').textContent=c.subtitle;
    $('diffBrief').textContent=c.brief;
    const list=$('diffList'); list.innerHTML='';
    c.difficulties.forEach(d=>{
      const b=el('div','diff-btn');
      if(d.includes('Demon')) b.classList.add('demon');
      if(d.includes('IMPOSSIBLE')) b.classList.add('impossible');
      const def=D.DIFFICULTY[d];
      b.innerHTML=`<b>${d}</b> &nbsp; <span style="font-size:11px;color:#9a8d6a">enemy ×${def.enemyRate} · supply ×${def.econ}${def.permadeath?' · permadeath':''}${def.pause===false?' · no pause':''}</span>`;
      b.onclick=()=>startBattle(c.id,d);
      list.appendChild(b);
    });
  }

  // ---------------------------------------------------------------- BATTLE
  function startBattle(campaignId, difficulty){
    const camp=D.CAMPAIGNS.find(c=>c.id===campaignId);
    const fac=D.FACTIONS[camp.faction];
    buildDeck(fac, camp);
    buildOrders();
    buildMeters(camp);
    $('log').innerHTML='';
    $('abilityBtn').textContent=fac.ability.name;
    $('abilityBtn').title=fac.ability.desc;
    show('battle');
    // size canvas to viewport
    Engine.init($('game'), HUD);
    Engine.start({campaignId, faction:camp.faction, difficulty});
  }

  function buildDeck(fac, camp){
    const deck=$('deck'); deck.innerHTML=''; curCards=[];
    fac.roster.forEach((uid,i)=>{
      const def=D.UNITS[uid];
      const card=el('div','card');
      card.innerHTML=`<div class="hk">${i+1}</div><div class="nm">${def.name}</div>
        <div class="co">⚔${def.cost.m} ⛽${Math.round(def.cost.s*(fac.mult.supplyCost||1))}</div>
        <div class="cool"></div>`;
      card.onclick=()=>Engine.spawnUnit(uid);
      card.dataset.uid=uid;
      deck.appendChild(card); curCards.push(card);
    });
    // engineer build buttons
    const t=el('div','card build'); t.innerHTML=`<div class="hk">E</div><div class="nm">Upgrade Trench</div><div class="co">⛽10</div>`;
    t.onclick=()=>Engine.buildAction('trench'); deck.appendChild(t);
    const w=el('div','card build'); w.innerHTML=`<div class="hk">W</div><div class="nm">Lay Wire</div><div class="co">⛽6</div>`;
    w.onclick=()=>Engine.buildAction('wire'); deck.appendChild(w);
  }

  function buildOrders(){
    const o=$('orders'); o.innerHTML='';
    [['advance','▲ Advance'],['hold','■ Hold'],['fallback','▼ Fall Back']].forEach(([k,lbl])=>{
      const b=el('div','ord',lbl); b.dataset.ord=k; if(k==='hold')b.classList.add('active');
      b.onclick=()=>{ Engine.setOrder(k); document.querySelectorAll('.ord').forEach(x=>x.classList.toggle('active',x.dataset.ord===k)); };
      o.appendChild(b);
    });
    const lanes=el('div','lanes');
    for(let i=0;i<Engine.NLANES;i++){ const lb=el('div','lane-b',(i+1)); lb.dataset.lane=i; if(i===2)lb.classList.add('active');
      lb.onclick=()=>selLane(i); lanes.appendChild(lb); }
    o.appendChild(lanes);
  }
  function selLane(i){ Engine.selectLane(i); document.querySelectorAll('.lane-b').forEach((x,idx)=>x.classList.toggle('active',idx===i)); }

  function buildMeters(camp){
    const m=$('meters'); m.innerHTML='';
    const meters=[];
    if(camp.rules.religious||camp.rules.defection) meters.push(['caliphate','Caliphate Loyalty','#1a7a3a']);
    if(camp.rules.multiethnic) meters.push(['cohesion','Ethnic Cohesion','#c8a23a']);
    meters.push(['weather','Weather','#7aa0c8']);
    meters.forEach(([k,lbl])=>{
      const d=el('div','meter'); d.dataset.key=k;
      d.innerHTML=`<div class="mlabel"><span>${lbl}</span><span class="mval"></span></div><div class="mbar"><div class="mfill"></div></div>`;
      m.appendChild(d);
    });
  }

  // ---------------------------------------------------------------- HUD callbacks
  const HUD = {
    onStart(G){ $('intelText').textContent=G.camp.intel; },
    onTick(s){
      $('rm').textContent=Math.floor(s.res.m);
      $('rs').textContent=Math.floor(s.res.s);
      $('rt').textContent=s.time;
      $('runits').textContent=s.units;
      // charge / ability
      const pct=s.charge/s.chargeMax;
      $('chargeBar').style.width=(pct*100)+'%';
      $('abilityBtn').classList.toggle('ready', pct>=1);
      // cards: cooldown + affordability
      curCards.forEach(card=>{
        const uid=card.dataset.uid, def=D.UNITS[uid];
        const cd=s.cooldowns[uid]||0; const co=card.querySelector('.cool');
        if(cd>0){ co.style.display='flex'; co.textContent=cd.toFixed(1); } else co.style.display='none';
        const sup=def.cost.s*(s.fac.mult.supplyCost||1);
        card.classList.toggle('disabled', s.res.m<def.cost.m || s.res.s<sup || cd>0);
      });
      // meters
      document.querySelectorAll('#meters .meter').forEach(d=>{
        const k=d.dataset.key, fill=d.querySelector('.mfill'), val=d.querySelector('.mval');
        if(k==='weather'){ fill.style.width='100%'; fill.style.background=s.weather==='clear'?'#3a5a7a':'#c87a3a'; val.textContent=s.weather; }
        else { const v=s.meters[k]||0; fill.style.width=v+'%'; val.textContent=Math.round(v); }
      });
    },
    onBanner(title,text){
      const b=$('banner'); b.querySelector('h2').textContent=title; b.querySelector('p').textContent=text;
      b.classList.add('show'); clearTimeout(b._t); b._t=setTimeout(()=>b.classList.remove('show'),2600);
    },
    onLog(text,kind){
      const log=$('log'); const d=el('div','l-'+(kind||'system'), text);
      log.insertBefore(d, log.firstChild);
      while(log.children.length>40) log.removeChild(log.lastChild);
    },
    onDenied(msg){ HUD.onLog('⚠ '+msg,'event'); },
    onEnd(r){ showAftermath(r); }
  };

  function showAftermath(r){
    $('resTitle').textContent = r.won?'VICTORY':'DEFEAT';
    $('resTitle').className = r.won?'win':'lose';
    $('resSub').textContent = r.won
      ? (r.camp.mode==='defence'?'The line held. The enemy breaks off the assault.':'The enemy position is taken!')
      : 'The line is broken. The position is lost.';
    $('resStats').innerHTML =
      `<div class="stat"><span>Front</span><b>${r.camp.name}</b></div>
       <div class="stat"><span>Enemy losses</span><b>${r.stats.kills}</b></div>
       <div class="stat"><span>Your losses</span><b>${r.stats.lost}</b></div>
       <div class="stat"><span>Defections won</span><b>${r.stats.defected}</b></div>
       <div class="stat"><span>Time</span><b>${r.time}s</b></div>`;
    show('aftermath');
  }

  // ---------------------------------------------------------------- input
  function bindInput(){
    // canvas click -> select lane
    const cv=$('game');
    cv.addEventListener('click',e=>{
      const r=cv.getBoundingClientRect();
      const y=(e.clientY-r.top)/r.height*Engine.H;
      selLane(Engine.laneFromY(y));
    });
    // ability
    $('abilityBtn').onclick=()=>Engine.fireAbility();
    $('pausebtn').onclick=()=>Engine.togglePause();
    // keyboard
    document.addEventListener('keydown',e=>{
      if(!$('battle').classList.contains('active')) return;
      const k=e.key.toLowerCase();
      if(k>='1'&&k<='9'){ const i=+k-1; const fac=D.FACTIONS[curCampaign.faction]; if(fac.roster[i])Engine.spawnUnit(fac.roster[i]); }
      else if(k==='a'){ Engine.setOrder('advance'); syncOrder('advance'); }
      else if(k==='h'){ Engine.setOrder('hold'); syncOrder('hold'); }
      else if(k==='f'){ Engine.setOrder('fallback'); syncOrder('fallback'); }
      else if(k==='e'){ Engine.buildAction('trench'); }
      else if(k==='w'){ Engine.buildAction('wire'); }
      else if(k==='r'){ Engine.fireAbility(); }
      else if(k===' '){ e.preventDefault(); Engine.togglePause(); }
      else if(k==='arrowup'){ const s=Engine.state; if(s)selLane(Math.max(0,s.activeLane-1)); }
      else if(k==='arrowdown'){ const s=Engine.state; if(s)selLane(Math.min(Engine.NLANES-1,s.activeLane+1)); }
    });
  }
  function syncOrder(k){ document.querySelectorAll('.ord').forEach(x=>x.classList.toggle('active',x.dataset.ord===k)); }

  // ---------------------------------------------------------------- boot
  function init(){
    buildMenu();
    buildCampaignSelect();
    bindInput();
    // menu navigation
    $('btnPlay').onclick=()=>show('campaign-select');
    $('btnHelp').onclick=()=>show('help');
    document.querySelectorAll('.back-to-menu').forEach(b=>b.onclick=()=>show('menu'));
    document.querySelectorAll('.back-to-camp').forEach(b=>b.onclick=()=>show('campaign-select'));
    $('btnReplay').onclick=()=>show('campaign-select');
    // start loading -> menu
    show('loading');
    runLoading(()=>show('menu'));
  }

  global.UI = { init };

})(window);
