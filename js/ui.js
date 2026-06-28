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
  function buildMenu(){ /* menu is now a canvas signboard scene (see startMenuScene) */ }

  // ---------------------------------------------------------------- CAMPAIGNS
  function buildCampaignSelect(){
    const grid=$('campGrid'); grid.innerHTML='';
    const mkHead=(t)=>{ const h=el('div','grid-head',t); grid.appendChild(h); };
    const mkCard=(c)=>{
      const fac=D.FACTIONS[c.faction];
      const card=el('div','camp-card');
      if(c.type==='cutscene'){
        card.classList.add('cutscene-card');
        card.innerHTML=`<h3>📜 ${c.name}</h3><div class="sub">${c.subtitle}</div>
          <div class="desc">${c.brief}</div><div><span class="tag">HISTORICAL SCENE</span></div>`;
        card.onclick=()=>showCutscene(c);
      } else {
        const modeTag=(c.mode||'').toUpperCase();
        card.innerHTML=`<h3>${c.name}</h3><div class="sub">${c.subtitle}</div>
          <div class="desc">${c.brief}</div>
          <div><span class="tag">${fac?fac.name:''}</span><span class="tag">${modeTag}</span>
          <span class="tag enemy">${c.intel||''}</span></div>`;
        card.onclick=()=>{ curCampaign=c; buildDifficulty(c); show('difficulty-select'); };
      }
      grid.appendChild(card);
    };
    const prewar=D.CAMPAIGNS.filter(c=>c.era==='prewar');
    const treaty=D.CAMPAIGNS.filter(c=>c.era==='treaty');
    const wwi=D.CAMPAIGNS.filter(c=>!c.era);
    if(prewar.length){ mkHead('⏳ PRE-WAR'); prewar.forEach(mkCard); }
    mkHead('⚔ THE GREAT WAR — CENTRAL POWERS'); wwi.forEach(mkCard);
    if(treaty.length){ mkHead('📜 TREATIES & OUTCOMES'); treaty.forEach(mkCard); }
  }

  // ---------------------------------------------------------------- CUTSCENES (pre-war scenes + treaties)
  const CUTSCENE_TEXT = {
    khedivate:`<p><b>Cairo, 18 December 1914.</b></p>
      <p>With the Ottoman Empire now at war alongside the Central Powers, Britain severs Egypt from Constantinople: the <b>Khedivate is dissolved</b>, the pro‑Ottoman Khedive Abbas II Hilmi is deposed, and Egypt is proclaimed a <b>Sultanate under British protection</b>.</p>
      <p>The green standard of the Sultan is lowered over the Citadel of Cairo; the Union Jack rises beside the Nile. The road to Gallipoli, Sinai and the Suez is set.</p>`,
    treaty_brest:`<p><b>A Central Powers victory in the East.</b></p>
      <p>Outcome — Russia cedes <b>Poland, Lithuania, the Baltic provinces, Finland and Ukraine</b>; the Eastern Front collapses and German divisions turn west for the 1918 offensive. The empire's high-water mark.</p>`,
    treaty_versailles:`<p><b>The Hall of Mirrors, Versailles.</b></p>
      <p>Outcome — Germany accepts the <b>War Guilt clause</b>, an army capped at 100,000, a demilitarised Rhineland, crushing <b>reparations</b>, and the loss of Alsace‑Lorraine and all colonies. A peace that sows the next war.</p>`,
    treaty_st_germain:`<p><b>The Dual Monarchy dissolved.</b></p>
      <p>Outcome — Austria‑Hungary is broken into <b>Austria, Hungary, Czechoslovakia, Yugoslavia</b> and ceded lands. The eleven‑tongued empire is no more; the multi‑ethnic army you once held together is scattered into new nations.</p>`,
    treaty_sevres:`<p><b>Sèvres, 1920 — the Caliphate hollowed out.</b></p>
      <p>Outcome — the Ottoman Empire is <b>partitioned</b>: the Arab provinces, Smyrna and the Straits are stripped away; the realm shrinks to a rump. The Sultan‑Caliph keeps a throne in name only — <b>the Caliphate is now a hollow shell</b>.</p>
      <p><i>(History's reply: the resistance under Mustafa Kemal would tear up Sèvres at Lausanne — and abolish the Caliphate altogether in 1924.)</i></p>`
  };
  function showCutscene(c){
    show('cutscene');
    const cv=$('cutsceneCanvas'); cv.width=720; cv.height=300; const x=cv.getContext('2d'); x.imageSmoothingEnabled=false;
    if(c.id==='khedivate') drawKhedivate(x);
    else if(c.id.startsWith('treaty_')) drawTreaty(x, c);
    $('cutsceneTitle').textContent=c.name;
    $('cutsceneText').innerHTML = `<p style="color:#ffe9b0"><b>${c.subtitle}</b></p>` + (CUTSCENE_TEXT[c.id]||`<p>${c.brief}</p>`);
    Sound.resume(); Sound.SFX.defeat();
  }
  // signing-hall scene: victor flag raised, defeated flag lowered/faded
  function drawTreaty(x, c){
    const victor = c.enemyNation || 'french', loser = c.flag || 'german';
    // panelled hall
    const g=x.createLinearGradient(0,0,0,300); g.addColorStop(0,'#5a3f2a'); g.addColorStop(1,'#3a2716'); x.fillStyle=g; x.fillRect(0,0,720,300);
    x.fillStyle='#6b4a2e'; for(let i=0;i<720;i+=60) x.fillRect(i,0,2,220);          // wall panelling
    x.fillStyle='#caa45a'; x.fillRect(0,40,720,4);                                   // gilt cornice
    x.fillStyle='#2a1c10'; x.fillRect(0,220,720,80);                                  // floor
    x.fillStyle='#3a2818'; for(let i=0;i<720;i+=40) x.fillRect(i,220,2,80);
    // tall windows
    for(let i=0;i<4;i++){ const wx=70+i*180; x.fillStyle='#bcd6e0'; x.fillRect(wx,60,46,120); x.fillStyle='#8aabb8'; x.fillRect(wx+22,60,2,120); x.fillStyle='#caa45a'; x.fillRect(wx-3,57,52,4); }
    // long signing table + documents
    x.fillStyle='#23502f'; x.fillRect(140,210,440,26); x.fillStyle='#1c3f25'; x.fillRect(140,232,440,8);
    x.fillStyle='#efe7d2'; for(let i=0;i<5;i++) x.fillRect(180+i*86,214,40,14);       // papers
    // delegations (silhouettes)
    x.fillStyle='#1a120a'; for(let i=0;i<6;i++){ const sx=170+i*70; x.fillRect(sx,180,14,32); x.beginPath(); x.arc(sx+7,176,7,0,7); x.fill(); }
    // flags on the wall: victor raised bright, loser lowered & faded
    x.save(); S.drawFlag(x, 150, 150, victor, 6); if(victor==='ottoman') S.drawOttomanCrescent(x,150,150); x.restore();
    x.globalAlpha=0.45; S.drawFlag(x, 540, 196, loser, 0); if(loser==='ottoman') S.drawOttomanCrescent(x,540,196); x.globalAlpha=1;
    // a torn map being divided (for Sèvres / partitions)
    x.fillStyle='#e8dcc0'; x.fillRect(300,150,120,46); x.strokeStyle='#7a1f1f'; x.lineWidth=2;
    x.beginPath(); x.moveTo(360,150); x.lineTo(360,196); x.stroke();                 // partition line
    x.strokeStyle='#3a2c1c'; x.lineWidth=1; x.strokeRect(300,150,120,46);
    x.fillStyle='rgba(0,0,0,0.25)'; x.fillRect(0,0,720,28);
    x.fillStyle='#ffe9b0'; x.font='bold 14px Georgia'; x.textAlign='center'; x.fillText('THE PEACE IS DICTATED', 360, 19); x.textAlign='left';
  }
  function drawKhedivate(x){
    // desert sky + Nile + pyramids + citadel; Ottoman flag lowering, Union Jack rising
    const sky=x.createLinearGradient(0,0,0,300); sky.addColorStop(0,'#e9b86a'); sky.addColorStop(1,'#f0d9a0'); x.fillStyle=sky; x.fillRect(0,0,720,300);
    x.fillStyle='#caa45a'; x.fillRect(0,210,720,90);                       // desert
    x.fillStyle='#3f7ba0'; x.fillRect(0,250,720,16);                       // Nile strip
    // pyramids
    x.fillStyle='#c79a55'; [ [120,210,90],[210,210,64],[600,210,80] ].forEach(p=>{ x.beginPath(); x.moveTo(p[0],p[1]); x.lineTo(p[0]+p[2],p[1]); x.lineTo(p[0]+p[2]/2,p[1]-p[2]*0.9); x.fill(); });
    x.fillStyle='#b98a45'; [ [120,210,90],[600,210,80] ].forEach(p=>{ x.beginPath(); x.moveTo(p[0]+p[2]/2,p[1]-p[2]*0.9); x.lineTo(p[0]+p[2],p[1]); x.lineTo(p[0]+p[2]*0.62,p[1]); x.fill(); });
    // citadel / mosque with dome + minaret
    x.fillStyle='#d8c6a0'; x.fillRect(300,150,120,60); x.fillStyle='#c2ad82'; x.fillRect(300,150,120,6);
    x.fillStyle='#cdbb90'; x.beginPath(); x.arc(360,150,26,Math.PI,0); x.fill();
    x.fillStyle='#b59a6a'; x.fillRect(412,120,8,90); x.beginPath(); x.arc(416,120,6,Math.PI,0); x.fill(); // minaret
    // flagpoles: Ottoman lowering (left), Union Jack rising (right)
    x.fillStyle='#3a2a18'; x.fillRect(330,96,2,60); x.fillRect(392,96,2,60);
    // Ottoman flag low on pole
    S.drawFlag(x, 332, 150, 'ottoman', 6); S.drawOttomanCrescent(x, 332, 150);
    // British flag high on pole
    S.drawFlag(x, 394, 116, 'british', 6);
    // crowd silhouettes
    x.fillStyle='#3a2c1c'; for(let i=0;i<22;i++){ const sx=20+i*32; x.fillRect(sx,266,8,18); x.fillRect(sx+1,260,6,6); }
    x.fillStyle='rgba(0,0,0,0.2)'; x.fillRect(0,0,720,30);
  }

  function buildDifficulty(c){
    const fac=D.FACTIONS[c.faction];
    $('diffTitle').textContent=c.name;
    $('diffTitle').style.color = fac.color || '#e8dcc0';
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
    // shore battery for naval / coastal fronts
    if(camp && (camp.rules.naval || camp.rules.coastalArty)){
      const sb=el('div','card build'); sb.style.borderColor='#2e5a7a';
      sb.innerHTML=`<div class="hk">B</div><div class="nm">Shore Battery</div><div class="co">📦14</div>`;
      sb.onclick=()=>Engine.buildAction('shore'); deck.appendChild(sb);
    }
    // AIR RAID buttons (bomber always; zeppelin for German / industrial fronts)
    const ar=el('div','card build'); ar.id='airBtn'; ar.style.borderColor='#5a4a7a';
    ar.innerHTML=`<div class="hk">G</div><div class="nm">✈ Bomber Raid</div><div class="co">📦14 ⛽10</div><div class="cool"></div>`;
    ar.onclick=()=>Engine.launchAirRaid('bomber'); deck.appendChild(ar);
    if(camp && camp.faction==='german'){
      const zp=el('div','card build'); zp.id='zepBtn'; zp.style.borderColor='#5a4a7a';
      zp.innerHTML=`<div class="hk">Z</div><div class="nm">Zeppelin</div><div class="co">📦18 ⛽16</div><div class="cool"></div>`;
      zp.onclick=()=>Engine.launchAirRaid('zeppelin'); deck.appendChild(zp);
    }
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
    // manual artillery control toggle
    const art=el('div','ord arty','🎯 Artillery (T)'); art.id='artyBtn';
    art.onclick=()=>{ Engine.toggleArtyMode(); };
    o.appendChild(art);
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
      $('rf').textContent=Math.floor(s.res.f);
      $('rt').textContent=s.time;
      $('runits').textContent=s.units;
      // air raid cooldown overlay
      ['airBtn','zepBtn'].forEach(id=>{ const b=$(id); if(b){ const co=b.querySelector('.cool');
        if(s.airRaidCd>0){ co.style.display='flex'; co.textContent=s.airRaidCd.toFixed(1); } else co.style.display='none'; } });
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
      // artillery control button state
      const ab=$('artyBtn');
      if(ab){ ab.classList.toggle('active', s.artyMode);
        ab.textContent = s.artyMode ? (s.artyCd>0?('🎯 Reload '+s.artyCd.toFixed(1)):'🎯 AIMING') : '🎯 Artillery (T)'; }
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
    const fac=D.FACTIONS[r.camp.faction];
    // epic, faction-flavoured end-of-campaign summary
    const winLines={
      german:'Flanders holds. The stormtroopers stand victorious amid the smoke — and the Empire endures another day.',
      ottoman:'The cliffs are held, the faithful unbroken. Word of the Caliphate’s defiance will travel far.',
      austria:'The eleven-tongued line held as one. The guns fall silent over a field that is, today, yours.',
      bulgaria:'The mountain kept its promise. The passes are sealed and the enemy streams back down the slopes.',
      arab:'The desert swallows the raiders once more — the railway burns, the garrison starves.'
    };
    const loseLines={
      german:'The line breaks. The grey ranks fall back through the wire, and the guns roll on without them.',
      ottoman:'The heights are lost. The faithful are scattered to the ravines — but the war is not yet over.',
      austria:'The brigade fractures and the line gives way. The patchwork empire bleeds again.',
      bulgaria:'The pass is forced. The mountain wall is breached and the valley lies open.',
      arab:'The raid fails — the counter falls, and the sands close over the column.'
    };
    $('resSub').textContent = (r.won?winLines:loseLines)[r.camp.faction] || (r.won?'Victory.':'Defeat.');
    // medals / achievements
    const medals=[
      {name:'Veteran', got:true},
      {name:'Iron Wall', got:r.stats.lost<=8},
      {name:'Butcher’s Bill', got:r.stats.kills>=30},
      {name:'Faithful', got:r.stats.defected>0},
      {name:'Triumphant', got:r.won}
    ];
    const medalHtml = '<div class="medals">'+medals.map(m=>
      `<div class="medal ${m.got?'':'locked'}"><div class="disc"></div><div class="ribbon"></div>${m.name}</div>`).join('')+'</div>';
    $('resStats').innerHTML = medalHtml +
      `<div class="stat"><span>Front</span><b>${r.camp.name}</b></div>
       <div class="stat"><span>Faction</span><b>${fac.name}</b></div>
       <div class="stat"><span>Enemy losses</span><b>${r.stats.kills}</b></div>
       <div class="stat"><span>Your losses</span><b>${r.stats.lost}</b></div>
       <div class="stat"><span>Defections won</span><b>${r.stats.defected}</b></div>
       <div class="stat"><span>Duration</span><b>${r.time}s</b></div>`;
    show('aftermath');
  }

  // ---------------------------------------------------------------- input
  function bindInput(){
    // canvas click -> fire artillery (in arty mode) or select lane
    const cv=$('game');
    function toGame(e){ const r=cv.getBoundingClientRect();
      return { x:(e.clientX-r.left)/r.width*Engine.W, y:(e.clientY-r.top)/r.height*Engine.H }; }
    cv.addEventListener('mousemove',e=>{ const s=Engine.state; if(s&&s.artyMode){ const g=toGame(e); Engine.setArtyAim(g.x,g.y); } });
    cv.addEventListener('click',e=>{
      const s=Engine.state;
      if(s&&s.artyMode){ const g=toGame(e); Engine.setArtyAim(g.x,g.y); Engine.fireArty(); return; }
      selLane(Engine.laneFromY(toGame(e).y));
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
      else if(k==='b'){ Engine.buildAction('shore'); }
      else if(k==='g'){ Engine.launchAirRaid('bomber'); }
      else if(k==='z'){ Engine.launchAirRaid('zeppelin'); }
      else if(k==='t'){ Engine.toggleArtyMode(); }
      else if(k==='r'){ Engine.fireAbility(); }
      else if(k==='m'){ const m=!Sound.isMuted(); Sound.setMuted(m); $('mutebtn').textContent=m?'🔇 Muted':'🔊 Sound'; }
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
    // resume Web Audio on first user gesture (autoplay policy)
    const wake=()=>{ Sound.resume(); document.removeEventListener('pointerdown',wake); document.removeEventListener('keydown',wake); };
    document.addEventListener('pointerdown',wake); document.addEventListener('keydown',wake);
    // menu navigation
    $('menuScene').addEventListener('click', menuClick);
    $('btnHelp').onclick=()=>show('help');
    document.querySelectorAll('.back-to-menu').forEach(b=>b.onclick=()=>{ show('menu'); startMenuScene(); });
    document.querySelectorAll('.back-to-camp').forEach(b=>b.onclick=()=>show('campaign-select'));
    $('btnReplay').onclick=()=>show('campaign-select');
    $('introSkip').onclick=()=>endIntro();
    // mute toggle
    $('mutebtn').onclick=()=>{ const m=!Sound.isMuted(); Sound.setMuted(m); $('mutebtn').textContent=m?'🔇 Muted':'🔊 Sound'; };
    // loading -> intro -> menu
    show('loading');
    runLoading(()=>runIntro(()=>{ show('menu'); startMenuScene(); }));
  }

  // ---------------------------------------------------------------- INTRO CINEMATIC
  let introRaf=null, introDone=null;
  function runIntro(done){
    introDone=done;
    show('intro');
    Sound.resume(); Sound.startMusic();
    const c=$('introCanvas'); c.width=720; c.height=360; const x=c.getContext('2d'); x.imageSmoothingEnabled=false;
    const lines=['The world is at war.','Command your empire.','Shape history.'];
    let t=0;
    function frame(){
      introRaf=requestAnimationFrame(frame); t+=1/60;
      const zoom=1+t*0.05;
      x.fillStyle='#0d1418'; x.fillRect(0,0,720,360);
      // PIXELATED WW1 situation map (real theatre + active fronts), zooming in
      x.save(); x.translate(360,180); x.scale(zoom,zoom); x.translate(-360,-180);
      WarMap.draw(x, 20, 24, 680, 312, {title:false, legend:false, t});
      x.restore();
      // flags rising from the bottom
      const nations=['german','austria','ottoman','bulgaria'];
      for(let i=0;i<4;i++){ const rise=Math.min(1,Math.max(0,(t-0.4-i*0.25))); const fy=360-rise*120;
        S.drawFlag(x, 210+i*100, fy, nations[i], t*12); if(nations[i]==='ottoman') S.drawOttomanCrescent(x,210+i*100,fy); }
      // vignette + caption band
      x.fillStyle='rgba(0,0,0,0.40)'; x.fillRect(0,0,720,40); x.fillRect(0,300,720,60);
      const li=Math.floor(t/1.5);
      if(li<lines.length){ const la=Math.min(1,(t/1.5-li)); x.globalAlpha=la;
        x.fillStyle='#ffe9b0'; x.font='bold 26px Georgia'; x.textAlign='center';
        x.fillText(lines[li],360,338); x.textAlign='left'; x.globalAlpha=1; }
      if(Math.floor(t*2)!==Math.floor((t-1/60)*2) && !Sound.isMuted()) Sound.SFX.shout();
      if(t>5.6) endIntro();
    }
    frame();
  }
  function endIntro(){ if(introRaf){cancelAnimationFrame(introRaf); introRaf=null;} const d=introDone; introDone=null; if(d)d(); }

  // ---------------------------------------------------------------- MENU SCENE (wooden signboard + theatre map)
  let menuRaf=null, menuHot={};
  function woodPanel(x,X,Y,W,Hh){
    x.fillStyle='#6e4a26'; x.fillRect(X,Y,W,Hh);
    for(let i=0;i<W;i+=Math.max(18,W/8)){ x.fillStyle=(i/18)%2?'#7a5430':'#674427'; x.fillRect(X+i,Y,Math.max(18,W/8)-2,Hh); }
    x.fillStyle='#4a3018'; x.fillRect(X,Y,W,4); x.fillRect(X,Y+Hh-5,W,5);   // frame top/bottom
    x.fillStyle='#3a2614'; x.fillRect(X,Y,4,Hh); x.fillRect(X+W-4,Y,4,Hh);
    x.fillStyle='#2a1c0e'; [[X+7,Y+7],[X+W-11,Y+7],[X+7,Y+Hh-11],[X+W-11,Y+Hh-11]].forEach(p=>x.fillRect(p[0],p[1],4,4)); // bolts
  }
  function startMenuScene(){
    const c=$('menuScene'); if(!c) return;
    const x=c.getContext('2d');
    if(menuRaf) cancelAnimationFrame(menuRaf);
    let t=0;
    function frame(){
      if(!$('menu').classList.contains('active')){ menuRaf=null; return; }
      menuRaf=requestAnimationFrame(frame); t+=1/60;
      const W=c.clientWidth||window.innerWidth, H=c.clientHeight||window.innerHeight;
      if(c.width!==W||c.height!==H){ c.width=W; c.height=H; }
      // --- outdoor scene: sky + green field (matches the park-signboard look) ---
      const sky=x.createLinearGradient(0,0,0,H*0.45); sky.addColorStop(0,'#9fc4e0'); sky.addColorStop(1,'#cfe3ec'); x.fillStyle=sky; x.fillRect(0,0,W,H*0.45);
      // drifting clouds
      x.fillStyle='rgba(255,255,255,0.7)'; for(let i=0;i<4;i++){ const cx=((t*12+i*260)%(W+200))-100, cy=40+i*22; x.beginPath(); x.ellipse(cx,cy,46,16,0,0,7); x.ellipse(cx+34,cy+6,34,13,0,0,7); x.fill(); }
      const grd=x.createLinearGradient(0,H*0.45,0,H); grd.addColorStop(0,'#7fa55a'); grd.addColorStop(1,'#5c8040'); x.fillStyle=grd; x.fillRect(0,H*0.45,W,H*0.55);
      // dirt path + tufts
      x.fillStyle='#a98a55'; x.beginPath(); x.moveTo(W*0.42,H); x.lineTo(W*0.48,H*0.55); x.lineTo(W*0.55,H*0.55); x.lineTo(W*0.62,H); x.fill();
      x.fillStyle='#4e6e36'; for(let i=0;i<40;i++){ const gx=(i*97)%W, gy=H*0.5+((i*53)%(H*0.5)); x.fillRect(gx,gy,3,5); }
      // distant trees
      for(let i=0;i<6;i++){ const tx=60+i*((W-120)/5), ty=H*0.45; x.fillStyle='#3f5a30'; x.beginPath(); x.ellipse(tx,ty-26,26,30,0,0,7); x.fill(); x.fillStyle='#5a3a1c'; x.fillRect(tx-4,ty-4,8,18); }

      // --- LEFT control panel (START) ---
      const lpW=Math.min(190,W*0.18), lpH=Math.min(300,H*0.5), lpX=W*0.05, lpY=H*0.22;
      x.fillStyle='#3a2614'; x.fillRect(lpX+lpW*0.42,lpY+lpH,10,H-(lpY+lpH));   // post
      woodPanel(x,lpX,lpY,lpW,lpH);
      // small flag plate (top)
      S.drawFlag(x, lpX+lpW*0.5-9, lpY+34, 'german', t*10);
      x.fillStyle='#e8dcc0'; x.font='bold 11px Georgia'; x.textAlign='center'; x.fillText('CENTRAL POWERS', lpX+lpW*0.5, lpY+46);
      // green START!! button
      const bW=lpW*0.74, bH=44, bX=lpX+lpW*0.5-bW/2, bY=lpY+lpH*0.40, pulse=0.5+0.5*Math.sin(t*4);
      x.fillStyle='#0d5a22'; x.fillRect(bX+3,bY+4,bW,bH);
      x.fillStyle=`rgb(${30+pulse*20|0},${150+pulse*40|0},${50+pulse*20|0})`; x.fillRect(bX,bY,bW,bH);
      x.strokeStyle='#0a3a16'; x.lineWidth=2; x.strokeRect(bX,bY,bW,bH);
      x.fillStyle='#063312'; x.font='bold 22px Georgia'; x.fillText('START!!', bX+bW/2+1, bY+bH/2+8);
      x.fillStyle='#eafff0'; x.fillText('START!!', bX+bW/2, bY+bH/2+7);
      menuHot.start={x:bX,y:bY,w:bW,h:bH};
      // up/down arrows
      x.fillStyle='#e8dcc0'; const ay=bY+bH+26;
      x.beginPath(); x.moveTo(lpX+lpW*0.5,ay-10); x.lineTo(lpX+lpW*0.5-10,ay); x.lineTo(lpX+lpW*0.5+10,ay); x.fill();
      x.beginPath(); x.moveTo(lpX+lpW*0.5,ay+30); x.lineTo(lpX+lpW*0.5-10,ay+20); x.lineTo(lpX+lpW*0.5+10,ay+20); x.fill();
      x.font='10px Georgia'; x.fillText('choose front', lpX+lpW*0.5, ay+12);

      // --- MAIN signboard with the WW1 map ---
      const bw=Math.min(W*0.62,H*1.05), bh=bw*0.60, bx2=W*0.32, by2=H*0.16;
      x.fillStyle='#3a2614'; x.fillRect(bx2+bw*0.2,by2+bh,12,H-(by2+bh)); x.fillRect(bx2+bw*0.8,by2+bh,12,H-(by2+bh)); // posts
      woodPanel(x,bx2-10,by2-10,bw+20,bh+20);
      WarMap.draw(x, bx2+6, by2+18, bw-12, bh-26, {title:true, legend:true, t});

      // game title carved above
      x.fillStyle='#1a120a'; x.font='bold 34px Georgia'; x.textAlign='center';
      x.fillText('IRON & FAITH', W*0.5+2, by2-22); x.fillStyle='#f0d9a0'; x.fillText('IRON & FAITH', W*0.5, by2-24);
    }
    frame();
  }
  function menuClick(e){
    const c=$('menuScene'), r=c.getBoundingClientRect();
    const mx=(e.clientX-r.left)*(c.width/r.width), my=(e.clientY-r.top)*(c.height/r.height);
    const h=menuHot.start;
    if(h && mx>=h.x&&mx<=h.x+h.w&&my>=h.y&&my<=h.y+h.h){ Sound.SFX.click(); show('campaign-select'); }
  }

  global.UI = { init };

})(window);
