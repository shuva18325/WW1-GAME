/* =========================================================================
 * IRON & FAITH — game.js
 * Real-time tactical commander engine + pixel-art battlefield renderer.
 * ========================================================================= */
(function (global) {
  'use strict';
  const D = global.GameData, S = global.Sprites;

  const W = 960, H = 540;          // logical resolution (rendered pixelated)
  const NLANES = 5;
  const TOP = 96, BOT = H - 26;
  const laneH = (BOT - TOP) / NLANES;
  const PLAYER_HQ_X = 46, ENEMY_HQ_X = W - 46;
  const PLAYER_TRENCH = Math.round(W * 0.30);
  const ENEMY_TRENCH  = Math.round(W * 0.70);
  const SS = 2;                    // soldier pixel scale
  const SUPPLY_RADIUS = W * 0.46;
  const TEMPO = 1.5;               // global damage tempo (faster, livelier fights)
  const MAX_UNITS = 56;            // perf cap

  const THEMES = {
    mud:     { sky:'#5a4a36', ground:'#3a2c1c', ground2:'#33271a', trenchTop:'#4a3826', trenchDark:'#241a10', dust:'#6e5a3c' },
    beach:   { sky:'#2f6f9e', ground:'#c7a55f', ground2:'#b8964f', sea:'#2f6f9e', trenchTop:'#9c8052', trenchDark:'#6e5a3a', dust:'#d8bf86' },
    desert:  { sky:'#c98f4a', ground:'#cda866', ground2:'#bd9856', trenchTop:'#a9874f', trenchDark:'#7c5f34', dust:'#e0c184' },
    snow:    { sky:'#8aa0b4', ground:'#d7dde4', ground2:'#c4ccd6', trenchTop:'#aab4bf', trenchDark:'#6f7884', dust:'#eef2f6' },
    mountain:{ sky:'#6f7e6a', ground:'#6b6a55', ground2:'#5a5a48', trenchTop:'#6b5f44', trenchDark:'#3a3424', dust:'#8a8770' }
  };

  let cv, ctx, hud = {};            // hud = callbacks into ui.js
  let G = null;                     // game state
  let raf = null, lastT = 0;

  // ---------------------------------------------------------------- helpers
  const rnd = (a,b)=>a+Math.random()*(b-a);
  const rint=(a,b)=>Math.floor(rnd(a,b+1));
  const pick=arr=>arr[(Math.random()*arr.length)|0];
  const clamp=(v,a,b)=>v<a?a:v>b?b:v;
  function laneY(l){ return TOP + l*laneH + laneH*0.78; }   // feet line

  // ---------------------------------------------------------------- init
  function init(canvas, callbacks){
    cv = canvas; ctx = cv.getContext('2d');
    cv.width = W; cv.height = H; ctx.imageSmoothingEnabled = false;
    hud = callbacks || {};
  }

  // ---------------------------------------------------------------- start
  function start(cfg){
    const camp = D.CAMPAIGNS.find(c=>c.id===cfg.campaignId);
    const fac  = D.FACTIONS[camp.faction];
    const diff = D.DIFFICULTY[cfg.difficulty] || D.DIFFICULTY['Medium'];
    const theme= THEMES[camp.theme] || THEMES.mud;

    G = {
      cfg, camp, fac, diff, theme,
      mode: camp.mode,
      res: { m: fac.start.m*diff.econ, s: fac.start.s*diff.econ, i: fac.start.i },
      charge: 0, chargeMax: fac.ability.charge,
      time: 0, elapsed: 0,
      limit: camp.mode==='defence' ? 165 : 210,    // seconds
      units: [], projectiles: [], effects: [], corpses: [],
      hqPlayer: 100, hqEnemy: 100,
      activeLane: 2, order: 'hold',
      cooldowns: {},               // per-unit-id spawn cooldown
      paused: false, over: false, won: false,
      weather: 'clear', weatherT: 0,
      meters: { caliphate: 60, cohesion: camp.rules.multiethnic?55:100, heat: 0, cold: 0 },
      tankResearched: false,
      enemyTimer: rnd(2,4), eventTimer: 12, eventIdx: 0,
      naval: { active:false, t:0, lane:0 },
      stats: { kills:0, lost:0, defected:0 },
      voiceCool: 0,
      bg: buildBackground(theme, camp)
    };

    // starting defensive structures (trench segments per lane)
    G.trenches = [];
    for(let l=0;l<NLANES;l++){
      G.trenches.push({ side:'player', lane:l, x:PLAYER_TRENCH, level:1, hp:100 });
      G.trenches.push({ side:'enemy',  lane:l, x:ENEMY_TRENCH,  level:1, hp:100 });
    }

    hud.onStart && hud.onStart(G);
    log(`${camp.name} — ${cfg.difficulty}`, 'system');
    log(camp.brief, 'brief');
    // opening voice line
    speakFaction('spawn');

    G.over=false; lastT = performance.now();
    if(raf) cancelAnimationFrame(raf);
    loop(lastT);
  }

  function buildBackground(theme, camp){
    // craters & rocks positions cached
    const craters=[], rocks=[];
    for(let i=0;i<22;i++) craters.push({x:rnd(W*0.18,W*0.82), y:rnd(TOP, BOT), r:rnd(8,20)});
    for(let i=0;i<26;i++) rocks.push({x:rnd(0,W), y:rnd(TOP,BOT), s:rnd(2,5)});
    return { craters, rocks };
  }

  // ---------------------------------------------------------------- loop
  function loop(t){
    raf = requestAnimationFrame(loop);
    let dt = (t - lastT)/1000; lastT = t;
    if(dt>0.05) dt=0.05;
    if(!G || G.over) { render(); return; }
    if(!G.paused){ update(dt); }
    render();
  }

  // ---------------------------------------------------------------- update
  function update(dt){
    G.time += dt; G.elapsed += dt; G.voiceCool -= dt;

    // economy
    G.res.m = Math.min(140, G.res.m + G.fac.regen.m*dt*G.diff.econ);
    G.res.s = Math.min(140, G.res.s + G.fac.regen.s*dt*G.diff.econ);
    G.charge = Math.min(G.chargeMax, G.charge + dt* (G.surge? 3.2 : 1.6));
    if(G.surge){ G.surge-=dt; if(G.surge<0)G.surge=0; }
    if(G.holdT){ G.holdT-=dt; if(G.holdT<0)G.holdT=0; }

    // spawn cooldowns
    for(const k in G.cooldowns){ G.cooldowns[k]-=dt; if(G.cooldowns[k]<0) delete G.cooldowns[k]; }

    // weather timer
    if(G.weather!=='clear'){ G.weatherT-=dt; if(G.weatherT<=0){ G.weather='clear'; } }

    // naval bombardment
    if(G.naval.active){
      G.naval.t-=dt;
      if(G.naval.t<=0){
        navalStrike(); G.naval.t=rnd(1.2,2.2); G.naval.shots=(G.naval.shots||5)-1;
        if(G.naval.shots<=0) G.naval.active=false;
      }
    }

    // enemy AI spawns
    G.enemyTimer-=dt;
    if(G.enemyTimer<=0){ enemyWave(); G.enemyTimer = rnd(2.0,3.4)/G.diff.enemyRate; }

    // scheduled events
    G.eventTimer-=dt;
    if(G.eventTimer<=0 && G.camp.events.length){
      fireEvent(G.camp.events[G.eventIdx % G.camp.events.length]); G.eventIdx++;
      G.eventTimer = rnd(16,26);
    }

    updateUnits(dt);
    updateProjectiles(dt);
    updateEffects(dt);

    // win / lose
    if(G.hqPlayer<=0){ endGame(false); return; }
    if(G.mode==='defence'){
      if(G.elapsed>=G.limit){ endGame(true); return; }
    } else {
      if(G.hqEnemy<=0){ endGame(true); return; }
      if(G.elapsed>=G.limit){ endGame(G.hqEnemy < 40); return; } // partial: more damage = win
    }

    // push HUD
    hud.onTick && hud.onTick(snapshot());
  }

  // ---------------------------------------------------------------- units
  function updateUnits(dt){
    const live=[];
    for(const u of G.units){
      if(!u.alive){ continue; }
      u.animT += dt*10;

      // environmental attrition (off supply)
      const inSupply = u.side==='player' ? (u.x < SUPPLY_RADIUS) : (u.x > W-SUPPLY_RADIUS);
      if(G.camp.rules.heat || G.weather==='sandstorm'){ if(!inSupply){ u.morale-=dt*4*G.diff.desert; u.hp-=dt*1.5; } }
      if(G.camp.rules.cold || G.weather==='cold'){ if(!inSupply){ u.morale-=dt*3*G.diff.desert; u.hp-=dt*1.2; } }

      // morale regen in supply
      if(inSupply && !u.routing){
        u.morale = Math.min(u.maxMorale, u.morale + dt*(2.2)*(u.side==='player'? (G.fac.mult.moraleRegen||1):1));
        if(u.hp<u.maxhp) u.hp = Math.min(u.maxhp, u.hp+dt*1.5);
      }

      // tank fear (player faction with tankFear & not researched)
      if(u.side==='player' && G.fac.mult.tankFear && !G.tankResearched){
        for(const e of G.units){ if(e.alive && e.side==='enemy' && e.def.flags.isTank && Math.abs(e.x-u.x)<200 && Math.abs(e.lane-u.lane)<=1){
          u.morale -= dt*10*G.diff.tankFear; u.fear=0.6; break; } }
      }
      if(u.fear>0) u.fear-=dt;

      // morale -> rout -> rally / desert
      if(u.morale<=0 && !u.routing){ u.routing=true; u.routTimer=rnd(3,6); speak(u,'…fall back!'); }
      if(u.routing){
        u.routTimer-=dt;
        const home = u.side==='player'?PLAYER_HQ_X:ENEMY_HQ_X;
        u.x += (home-u.x>0?1:-1) * u.def.speed*1.2*dt;
        // desertion
        const dch = (u.side==='player'? (G.fac.mult.desertChance||1):1) * (inSupply?0.2:1);
        if(Math.random()< dt*0.05*dch && u.morale<8){ u.alive=false; if(u.side==='player')G.stats.lost++; addCorpse(u); continue; }
        if(u.routTimer<=0){ u.routing=false; u.morale=Math.max(25,u.maxMorale*0.35); }
        live.push(u); continue;
      }

      behave(u, dt, inSupply);
      if(u.hp<=0){ killUnit(u); continue; }
      if(u.alive) live.push(u);
    }
    G.units = live;
  }

  function behave(u, dt, inSupply){
    const d=u.def, dirToEnemy = u.side==='player'?1:-1;
    // engineers: go to own trench and build
    if(d.flags.isEngineer){
      const tr = ownTrench(u);
      if(tr && Math.abs(u.x-tr.x)>6){ u.x += (tr.x-u.x>0?1:-1)*d.speed*dt; u.pose='walk'; return; }
      // upgrade trench
      tr.buildP=(tr.buildP||0)+dt;
      if(tr.buildP>3 && tr.level<4){ tr.level++; tr.hp=100; tr.buildP=0; speak(u, d.nation==='german'?'Bunker reinforced.':'Trench reinforced.'); }
      u.pose='idle'; return;
    }
    // saboteur (arab): rush enemy HQ to sabotage
    if(d.flags.saboteur){
      u.x += dirToEnemy*d.speed*dt; u.pose='walk';
      if((dirToEnemy>0 && u.x>ENEMY_HQ_X-20)||(dirToEnemy<0 && u.x<PLAYER_HQ_X+20)){
        G.hqEnemy-=12; addEffect({type:'explosion',x:u.x,y:u.y,t:0.5,r:30}); u.alive=false; return; }
      return;
    }

    // find target
    const tgt = acquire(u);
    const rng = d.range * (G.weather==='sandstorm' && !d.flags.indirect ? 0.5 : 1);

    if(d.flags.indirect){
      // artillery / mortar: hold back, lob shells
      const back = u.side==='player'? PLAYER_HQ_X+90 : ENEMY_HQ_X-90;
      if(Math.abs(u.x-back)>10){ u.x += (back-u.x>0?1:-1)*d.speed*dt; u.pose='walk'; return; }
      u.pose='idle';
      u.cd-=dt;
      if(u.cd<=0 && tgt){ lobShell(u,tgt); u.cd = 1/d.fireRate; }
      return;
    }

    if(tgt && dist(u,tgt) <= rng){
      // in range: fire
      u.pose='fire'; u.cd-=dt;
      if(u.cd<=0){ shoot(u,tgt,rng); u.cd = 1/d.fireRate; }
      // ambushers reveal & burst
      return;
    }

    // movement by order
    let move=0;
    if(u.order==='fallback'){ move = -dirToEnemy; }
    else if(u.order==='hold'){
      const line = ownTrench(u) ? ownTrench(u).x : (u.side==='player'?PLAYER_TRENCH:ENEMY_TRENCH);
      if((dirToEnemy>0 && u.x<line)||(dirToEnemy<0 && u.x>line)) move=dirToEnemy; else move=0;
    } else { move = dirToEnemy; } // advance

    if(move!==0){
      let sp=d.speed;
      if(G.weather==='mud') sp*=0.7;
      if(d.flags.mountain && (G.camp.theme==='mountain'||G.camp.theme==='snow')) sp*=1.0;
      u.x += move*sp*dt; u.pose='walk';
    } else u.pose='idle';

    // reached enemy HQ?
    if(dirToEnemy>0 && u.x>=ENEMY_HQ_X-14){ G.hqEnemy=Math.max(0,G.hqEnemy-18*dt); u.x=ENEMY_HQ_X-14; u.pose='fire'; }
    if(dirToEnemy<0 && u.x<=PLAYER_HQ_X+14){ G.hqPlayer=Math.max(0,G.hqPlayer-18*dt); u.x=PLAYER_HQ_X+14; u.pose='fire'; }
  }

  function acquire(u){
    let best=null, bd=1e9;
    for(const e of G.units){
      if(!e.alive || e.side===u.side) continue;
      if(!u.def.flags.indirect && Math.abs(e.lane-u.lane)>1) continue;
      const dd=Math.abs(e.x-u.x);
      const forward = u.side==='player'? e.x>=u.x-30 : e.x<=u.x+30;
      if(!u.def.flags.indirect && !forward) continue;
      if(dd<bd){ bd=dd; best=e; }
    }
    return best;
  }
  function dist(a,b){ return Math.hypot(a.x-b.x,(a.lane-b.lane)*laneH*0.5); }

  function shoot(u, tgt, rng){
    // hitscan with tracer
    let dmg = u.def.dmg * TEMPO * (u.vet?1+0.12*u.vet:1);
    if(u.def.flags.ambush && u.ambushReady){ dmg*= (G.fac.mult.ambushPower||1.4); u.ambushReady=false; }
    // armour
    if(tgt.def.armor>0 && !u.def.flags.indirect){
      const ignore = u.def.flags.antitrench || u.def.flags.antitank;
      dmg *= ignore?1: Math.max(0.14, 1 - tgt.def.armor*0.14);
    }
    // suppressed accuracy
    if(u.fear>0) dmg*=0.5;
    // trench cover for target
    if(inOwnTrench(tgt)) dmg*= 0.7 / Math.max(1, trenchLevelAt(tgt)*0.12+0.6);
    applyDamage(tgt, dmg, u);
    addEffect({type:'muzzle',x:u.x+(u.side==='player'?12:-12),y:u.y-22,t:0.08});
    addEffect({type:'tracer',x1:u.x+(u.side==='player'?14:-14),y1:u.y-22,x2:tgt.x,y2:tgt.y-22,t:0.06});
  }

  function lobShell(u,tgt){
    const tx=tgt.x, ty=tgt.y;
    addEffect({type:'shell',x:u.x,y:u.y-20,tx,ty,t:0,dur:0.9,
      onLand:()=>{ explode(tx,ty,46, u.def.dmg*(G.fac.mult.artyPower||1), u.side, true); }});
  }

  function explode(x,y,r,dmg,side,ignoreArmor){
    addEffect({type:'explosion',x,y,t:0.5,r});
    for(const e of G.units){ if(!e.alive||e.side===side) continue;
      if(Math.hypot(e.x-x,(laneY(e.lane))-y)<r){ applyDamage(e, dmg*(ignoreArmor?1:0.7), null); e.morale-=18; } }
    // damage trenches
    for(const tr of G.trenches){ if(tr.side!==side && Math.abs(tr.x-x)<r && Math.abs(laneY(tr.lane)-y)<r){ tr.hp-=30; if(tr.hp<=0&&tr.level>1){tr.level--;tr.hp=60;} } }
  }

  function applyDamage(t, dmg, from){
    if(t.side==='player' && G.holdT>0) dmg*=0.5;          // Mountain Hold dmg reduction
    if(t.side==='player' && inOwnTrench(t)) dmg*=0.85;     // trench cover
    t.hp -= dmg;
    t.morale -= dmg*0.35;
    if(t.hp<=0){ killUnit(t); if(from){ from.kills=(from.kills||0)+1; if(from.kills%4===0){from.vet=(from.vet||0)+1;} if(from.side==='player') G.charge=Math.min(G.chargeMax,G.charge+1.5); } }
  }

  function killUnit(u){
    if(!u.alive) return;
    u.alive=false; addCorpse(u);
    if(u.side==='player') G.stats.lost++; else G.stats.kills++;
    // nearby allies lose morale
    for(const a of G.units){ if(a.alive&&a.side===u.side&&Math.abs(a.x-u.x)<70&&a.lane===u.lane) a.morale-=8; }
  }

  // ---------------------------------------------------------------- spawn
  function spawnUnit(unitId){
    if(!G||G.over) return false;
    const def = D.UNITS[unitId]; if(!def) return false;
    if(G.cooldowns[unitId]>0) return false;
    const cost = def.cost; if(!cost) return false;
    const supCost = cost.s * (G.fac.mult.supplyCost||1);
    if(G.units.filter(u=>u.side==='player').length >= MAX_UNITS*0.7){ hud.onDenied&&hud.onDenied('Command limit reached'); return false; }
    if(G.res.m < cost.m || G.res.s < supCost){ hud.onDenied&&hud.onDenied('Insufficient resources'); return false; }
    G.res.m-=cost.m; G.res.s-=supCost;
    G.cooldowns[unitId]= def.cd / (G.fac.spawnSpeed*(G.surge?1.8:1));
    makeUnit(unitId,'player', G.activeLane, PLAYER_HQ_X+rnd(0,18));
    if(def.flags.isTank) G.tankResearched=true; // fielding armour cures tank-fear
    if(def.flags.isEngineer) speakFaction('engineer');
    else if(def.role==='assault') speakFaction('advance');
    return true;
  }

  function makeUnit(unitId, side, lane, x){
    const def = D.UNITS[unitId];
    let hp=def.hp, dmg=def.dmg, morale=def.morale;
    // faction equip debuff
    if(side==='player' && G.fac.mult.equip) { dmg*=G.fac.mult.equip; }
    if(side==='enemy'){ hp*=(0.85+0.3*G.diff.enemySize*0.5); }
    const u={ id:unitId, def, side, nation:def.nation, lane:clamp(lane,0,NLANES-1),
      x, y:laneY(clamp(lane,0,NLANES-1)),
      hp, maxhp:hp, dmg, morale, maxMorale:morale, cd:rnd(0,0.6),
      order: side==='player'? G.order : 'advance',
      pose:'idle', animT:rnd(0,10), facing: side==='player'?1:-1,
      alive:true, routing:false, vet:0, fear:0,
      ambushReady: !!def.flags.ambush };
    G.units.push(u);
    return u;
  }

  // ---------------------------------------------------------------- enemy AI
  function enemyWave(){
    if(G.units.filter(u=>u.side==='enemy').length > MAX_UNITS*0.6) return;
    const n = Math.round(rnd(1,3)*G.diff.enemySize);
    for(let i=0;i<n;i++){
      let pool = G.camp.enemies.filter(id=>!D.UNITS[id].flags.isTank);
      let id = pick(pool);
      // tanks after a while
      if(G.elapsed>30 && G.camp.enemyTank && Math.random()<0.10*G.diff.tankFear){ id=pick(G.camp.enemyTank); }
      if(G.diff.combinedArms && Math.random()<0.15){ id = pick(G.camp.enemies); }
      makeUnit(id,'enemy', rint(0,NLANES-1), ENEMY_HQ_X-rnd(0,18));
    }
  }

  function navalStrike(){
    const lane=rint(0,NLANES-1);
    const x=rnd(W*0.12,W*0.4);
    explode(x, laneY(lane), 60, 40, 'enemy', true);
    addEffect({type:'naval',x,y:laneY(lane),t:0.6});
    speak(null,'⚓ Naval shells incoming!');
  }

  // ---------------------------------------------------------------- ability
  function fireAbility(){
    if(!G||G.over||G.charge<G.chargeMax) return false;
    G.charge=0;
    const id=G.fac.ability.id;
    speakFaction('ability');
    addEffect({type:'flash',t:0.4});
    switch(id){
      case 'industrial_surge':
        G.surge=10; G.res.m+=30; G.res.s+=20;
        makeUnit('g_storm','player',G.activeLane,PLAYER_HQ_X);
        makeUnit('g_storm','player',G.activeLane,PLAYER_HQ_X+14);
        for(const tr of G.trenches) if(tr.side==='player'&&tr.level<4){tr.level++;tr.hp=100;}
        banner('INDUSTRIAL SURGE','Production doubled · free stormtroopers · trenches reinforced');
        break;
      case 'german_support':
        makeUnit('g_tank','player',G.activeLane,PLAYER_HQ_X);
        for(let i=0;i<3;i++) makeUnit('g_storm','player',G.activeLane,PLAYER_HQ_X+10+i*12);
        G.tankResearched=true;
        for(const u of G.units) if(u.side==='player') u.morale=Math.min(u.maxMorale,u.morale+30);
        banner('GERMAN SUPPORT','A German tank and elite stormtroopers join the line!');
        break;
      case 'artillery_barrage':
        for(let i=0;i<5;i++){ const x=rnd(W*0.5,W*0.85), l=rint(0,NLANES-1);
          addEffect({type:'shell',x:PLAYER_HQ_X,y:H*0.3,tx:x,ty:laneY(l),t:0,dur:0.7,onLand:()=>explode(x,laneY(l),52,40,'player',true)}); }
        for(const u of G.units) if(u.side==='player') u.morale=Math.min(u.maxMorale,u.morale+15);
        banner('ARTILLERY BARRAGE','Skoda guns hammer the enemy line!');
        break;
      case 'mountain_hold':
        G.holdT=10;
        for(const u of G.units) if(u.side==='player'){ u.morale=u.maxMorale; if(u.def.flags.ambush)u.ambushReady=true; }
        banner('MOUNTAIN HOLD','Defences locked · ambush sprung · damage reduced');
        break;
      case 'desert_raid':
        for(let i=0;i<3;i++) makeUnit('r_raider','player',rint(0,NLANES-1),PLAYER_HQ_X+i*12);
        G.hqEnemy=Math.max(0,G.hqEnemy-8);
        banner('DESERT RAID','Raiders strike and the supply line burns!');
        break;
    }
    if(G.holdT) {/* damage reduction applied in applyDamage via flag check */}
    return true;
  }

  // ---------------------------------------------------------------- events
  function fireEvent(key){
    const ev=D.EVENTS[key]; if(!ev) return;
    banner(ev.title, ev.text);
    if(ev.voice) speak(null, ev.voice);
    switch(ev.effect){
      case 'spawnEnemyTank': makeUnit(pick(G.camp.enemyTank||['e_tank_rhom']),'enemy',rint(0,NLANES-1),ENEMY_HQ_X); break;
      case 'gas': G.weather='gas'; G.weatherT=8; for(const u of G.units)if(u.x>W*0.4&&u.x<W*0.7)u.morale-=15; break;
      case 'supply': G.res.s=Math.min(140,G.res.s+40); G.res.m=Math.min(140,G.res.m+20); break;
      case 'chargeAbility': G.charge=Math.min(G.chargeMax,G.charge+G.chargeMax*0.5); break;
      case 'wave': for(let i=0;i<Math.round(4*G.diff.enemySize);i++) makeUnit(pick(G.camp.enemies),'enemy',rint(0,NLANES-1),ENEMY_HQ_X-rnd(0,30)); break;
      case 'naval': G.naval={active:true,t:0.5,shots:6}; break;
      case 'defect': defectColonial(); break;
      case 'moraleAll': for(const u of G.units)if(u.side==='player')u.morale=u.maxMorale; G.meters.caliphate=Math.min(100,G.meters.caliphate+20); break;
      case 'sandstorm': G.weather='sandstorm'; G.weatherT=10; break;
      case 'advisor': for(const u of G.units)if(u.side==='player')u.morale=Math.min(u.maxMorale,u.morale+12); G.res.s+=15; break;
      case 'heat': for(const u of G.units){const ins=u.side==='player'?u.x<SUPPLY_RADIUS:false; if(!ins)u.morale-=12;} break;
      case 'cold': G.weather='cold'; G.weatherT=12; break;
      case 'cohesionDrop': G.meters.cohesion=Math.max(0,G.meters.cohesion-25); for(const u of G.units)if(u.side==='player'&&u.def.flags.multiethnic)u.morale-=20; break;
      case 'sabotage': G.hqEnemy=Math.max(0,G.hqEnemy-14); break;
      case 'enemyMoraleDrop': for(const u of G.units)if(u.side==='enemy')u.morale-=25; break;
    }
  }

  function defectColonial(){
    // convert nearest enemy 'muslim' unit to player side
    let cand=G.units.filter(u=>u.alive&&u.side==='enemy'&&u.def.flags.muslim);
    if(!cand.length){ // spawn one defector
      const u=makeUnit('o_regular','player',rint(0,NLANES-1),W*0.6); u.x=W*0.6; speak(u,'My heart belongs with the Caliphate.'); G.stats.defected++; return;
    }
    const c=pick(cand); c.side='player'; c.facing=1; c.id='o_regular'; c.def=D.UNITS.o_regular; c.nation='ottoman'; c.order=G.order; c.morale=c.maxMorale;
    speak(c,'I cannot fight my brothers… I’m switching sides.'); G.stats.defected++;
    G.meters.caliphate=Math.min(100,G.meters.caliphate+10);
  }

  // ---------------------------------------------------------------- structures helpers
  function ownTrench(u){ return G.trenches.find(t=>t.side===u.side && t.lane===u.lane); }
  function inOwnTrench(u){ const t=ownTrench(u); return t && Math.abs(u.x-t.x)<30; }
  function trenchLevelAt(u){ const t=ownTrench(u); return t?t.level:1; }

  function buildAction(type){
    // spend supply to upgrade active-lane player trench / wire
    if(!G||G.over) return;
    const tr=G.trenches.find(t=>t.side==='player'&&t.lane===G.activeLane);
    if(type==='trench'){ if(G.res.s>=10 && tr.level<4){ G.res.s-=10; tr.level++; tr.hp=100; speakFaction('engineer'); } }
    if(type==='wire'){ if(G.res.s>=6){ G.res.s-=6; tr.wire=true; } }
  }

  // ---------------------------------------------------------------- orders
  function setOrder(o){ if(!G)return; G.order=o; for(const u of G.units) if(u.side==='player'&&!u.def.flags.isEngineer&&!u.def.flags.indirect) u.order=o; }
  function selectLane(i){ if(!G)return; G.activeLane=clamp(i,0,NLANES-1); }
  function togglePause(){ if(!G)return; if(G.diff.pause===false)return; G.paused=!G.paused; }

  // ---------------------------------------------------------------- effects
  function addEffect(e){ G.effects.push(e); }
  function addCorpse(u){ G.corpses.push({x:u.x,lane:u.lane,nation:u.nation,t:8}); if(G.corpses.length>60)G.corpses.shift(); }
  function updateProjectiles(dt){}
  function updateEffects(dt){
    const live=[];
    for(const e of G.effects){
      e.t+=dt;
      if(e.type==='shell'){ if(e.t>=e.dur){ e.onLand&&e.onLand(); continue; } }
      else if(e.t> (e.life|| (e.type==='explosion'?0.5:e.type==='naval'?0.6:e.type==='flash'?0.4:0.3))) continue;
      live.push(e);
    }
    for(const c of G.corpses) c.t-=dt;
    G.corpses=G.corpses.filter(c=>c.t>0);
    G.effects=live;
  }

  // ---------------------------------------------------------------- speech / log
  function speak(u, text){ if(u) addEffect({type:'speech',x:u.x,y:u.y-50,text,t:0,life:2.2}); log(text,'voice'); }
  function speakFaction(ctxKey){
    if(G.voiceCool>0) return; G.voiceCool=2.2;
    const v=G.fac.voice; let arr=v[ctxKey]||v.spawn; if(!arr)return;
    const line=pick(arr); log(line,'voice');
  }
  function banner(title,text){ hud.onBanner&&hud.onBanner(title,text); log(title+' — '+text,'event'); }
  function log(text,kind){ hud.onLog&&hud.onLog(text,kind); }

  // ---------------------------------------------------------------- end
  function endGame(won){
    if(G.over)return; G.over=true; G.won=won;
    hud.onEnd && hud.onEnd({won, stats:G.stats, camp:G.camp, time:Math.round(G.elapsed)});
  }

  // ---------------------------------------------------------------- snapshot for HUD
  function snapshot(){
    return { res:G.res, charge:G.charge, chargeMax:G.chargeMax,
      hqPlayer:G.hqPlayer, hqEnemy:G.hqEnemy, mode:G.mode,
      time:Math.max(0,Math.ceil(G.limit-G.elapsed)),
      meters:G.meters, weather:G.weather, activeLane:G.activeLane,
      order:G.order, cooldowns:G.cooldowns, fac:G.fac, camp:G.camp,
      paused:G.paused, units:G.units.length,
      tankResearched:G.tankResearched };
  }

  /* =====================================================================
   * RENDER
   * ===================================================================== */
  function render(){
    if(!G){ ctx.fillStyle='#111'; ctx.fillRect(0,0,W,H); return; }
    const th=G.theme;
    // sky / backdrop
    ctx.fillStyle=th.sky; ctx.fillRect(0,0,W,TOP);
    // ground
    ctx.fillStyle=th.ground; ctx.fillRect(0,TOP,W,H-TOP);
    // Gallipoli: sea on the enemy (right) side + beach
    if(G.camp.theme==='beach'){
      ctx.fillStyle='#2f6f9e'; ctx.fillRect(W*0.66,TOP,W*0.34,H-TOP);
      ctx.fillStyle='#3a82b4'; for(let i=0;i<6;i++){ctx.fillRect(W*0.66, TOP+i*18+ (G.time*10%18), W*0.34, 3);}
      // landing boats
      for(let l=0;l<NLANES;l++){ ctx.fillStyle='#3a2c1c'; ctx.fillRect(W*0.78, laneY(l)-6, 26,8); }
    }
    // ground texture rows
    ctx.fillStyle=th.ground2;
    for(let y=TOP+10;y<H;y+=22) ctx.fillRect(0,y,W,3);
    // craters & rocks
    for(const c of G.bg.craters) S.drawCrater(ctx,c.x,c.y,c.r);
    for(const r of G.bg.rocks){ ctx.fillStyle='#00000022'; ctx.fillRect(r.x,r.y,r.s*2,r.s); }

    // lane separators (subtle)
    ctx.fillStyle='#00000018';
    for(let l=1;l<NLANES;l++){ ctx.fillRect(0,TOP+l*laneH,W,1); }
    // active lane highlight
    ctx.fillStyle='#ffd24a14'; ctx.fillRect(0,TOP+G.activeLane*laneH,W,laneH);

    // supply radius ring (player)
    ctx.strokeStyle='#9fe08a33'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(SUPPLY_RADIUS,TOP); ctx.lineTo(SUPPLY_RADIUS,H); ctx.stroke();

    // trenches
    for(const tr of G.trenches){
      const y=laneY(tr.lane)+8;
      S.drawTrench(ctx, tr.x-26, y, 52, tr.level, th);
      if(tr.wire) S.drawWire(ctx, tr.x-26, y-2, 52);
    }
    // central road/line (reference look)
    ctx.fillStyle='#2a2018'; ctx.fillRect(W*0.5-2,TOP,4,H-TOP);

    // HQ markers + flags
    S.drawFlag(ctx, PLAYER_HQ_X, TOP+30, G.fac.nation);
    if(G.fac.nation==='ottoman') S.drawOttomanCrescent(ctx, PLAYER_HQ_X, TOP+30);
    S.drawFlag(ctx, ENEMY_HQ_X, TOP+30, G.camp.enemyNation||'british');
    // HQ bunkers
    ctx.fillStyle='#3a3026'; ctx.fillRect(PLAYER_HQ_X-16,TOP+34,30,H-TOP-40);
    ctx.fillStyle='#332a20'; ctx.fillRect(ENEMY_HQ_X-14,TOP+34,30,H-TOP-40);

    // corpses
    for(const c of G.corpses){ ctx.globalAlpha=clamp(c.t/8,0,1); S.drawCorpse(ctx,c.x-14,laneY(c.lane)-SS*21,{nation:c.nation,s:SS}); ctx.globalAlpha=1; }

    // units sorted by lane then x for depth
    const us=[...G.units].sort((a,b)=> a.lane-b.lane || a.x-b.x);
    for(const u of us) drawUnit(u);

    // effects
    for(const e of G.effects) drawEffect(e);

    // weather overlays
    drawWeather();

    // top status strip
    drawTopStrip();
  }

  function drawUnit(u){
    const y=u.y, scale=SS;
    // selection of sprite by kind
    if(u.def.flags.isTank){
      S.drawTank(ctx, u.x - (u.facing>0? 0: S.drawTank.size(scale,u.def.flags.tankType).w), y - 16*scale, {s:scale, facing:u.facing, type:u.def.flags.tankType});
    } else if(u.def.flags.vehicle){
      S.drawTank(ctx, u.x, y-16*scale, {s:scale-0.5<1?1:scale, facing:u.facing, type:'ft'});
    } else if(u.def.flags.isCamel){
      S.drawCamel(ctx, u.x-9*scale, y-20*scale, {s:scale, facing:u.facing, nation:u.nation});
    } else {
      S.drawSoldier(ctx, u.x-8*scale, y-21*scale, {
        s:scale, nation:u.nation, facing:u.facing,
        helmet:u.def.helmet, ragged:u.def.flags.ragged,
        pose: u.routing?'walk':u.pose, t:u.animT });
    }
    // health/morale micro-bars
    const bx=u.x-12, by=y-21*scale-6;
    ctx.fillStyle='#000'; ctx.fillRect(bx,by,24,3);
    ctx.fillStyle = u.side==='player'?'#7ec860':'#c85a5a'; ctx.fillRect(bx,by,24*clamp(u.hp/u.maxhp,0,1),3);
    ctx.fillStyle='#000'; ctx.fillRect(bx,by+3,24,2);
    ctx.fillStyle = u.morale>40?'#6aa0d8':'#d8a23a'; ctx.fillRect(bx,by+3,24*clamp(u.morale/u.maxMorale,0,1),2);
    if(u.routing){ ctx.fillStyle='#ff5a5a'; ctx.font='8px monospace'; ctx.fillText('!',u.x-1,by-2); }
    if(u.fear>0){ ctx.fillStyle='#ff444433'; ctx.beginPath(); ctx.arc(u.x,y-18,22,0,Math.PI*2); ctx.fill(); }
  }

  function drawEffect(e){
    switch(e.type){
      case 'muzzle': ctx.fillStyle='#ffd24a'; ctx.fillRect(e.x-3,e.y-3,6,6); ctx.fillStyle='#fff3b0'; ctx.fillRect(e.x-1,e.y-1,3,3); break;
      case 'tracer': ctx.strokeStyle='#ffe07a'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(e.x1,e.y1); ctx.lineTo(e.x2,e.y2); ctx.stroke(); break;
      case 'shell': {
        const p=clamp(e.t/e.dur,0,1); const x=e.x+(e.tx-e.x)*p; const y=e.y+(e.ty-e.y)*p - Math.sin(p*Math.PI)*120;
        ctx.fillStyle='#222'; ctx.fillRect(x-2,y-2,4,4); break; }
      case 'explosion': { const p=clamp(e.t/0.5,0,1); const r=(e.r||30)*p; ctx.fillStyle='rgba(255,180,60,'+(1-p)+')'; ctx.beginPath(); ctx.arc(e.x,e.y,r,0,Math.PI*2); ctx.fill(); ctx.fillStyle='rgba(80,70,60,'+(1-p)*0.6+')'; ctx.beginPath(); ctx.arc(e.x,e.y,r*1.3,0,Math.PI*2); ctx.fill(); break; }
      case 'naval': { ctx.fillStyle='rgba(255,255,255,'+(1-e.t/0.6)+')'; ctx.beginPath(); ctx.arc(e.x,e.y,40*(e.t/0.6),0,Math.PI*2); ctx.fill(); break; }
      case 'flash': ctx.fillStyle='rgba(255,255,255,'+(0.5-e.t)+')'; ctx.fillRect(0,0,W,H); break;
      case 'speech': {
        const a=clamp(1-(e.t/e.life),0,1); ctx.globalAlpha=a;
        ctx.font='10px monospace'; const w=ctx.measureText(e.text).width+10;
        ctx.fillStyle='#1a140e'; ctx.fillRect(e.x-w/2,e.y-12-e.t*8,w,14);
        ctx.fillStyle='#ffe9b0'; ctx.fillText(e.text,e.x-w/2+5,e.y-2-e.t*8);
        ctx.globalAlpha=1; break; }
    }
  }

  function drawWeather(){
    if(G.weather==='clear')return;
    if(G.weather==='sandstorm'){ ctx.fillStyle='rgba(200,160,90,0.30)'; ctx.fillRect(0,0,W,H); }
    if(G.weather==='gas'){ ctx.fillStyle='rgba(120,180,80,0.22)'; ctx.fillRect(W*0.4,TOP,W*0.3,H-TOP); }
    if(G.weather==='cold'){ ctx.fillStyle='rgba(220,235,245,0.22)'; ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#fff'; for(let i=0;i<40;i++){const x=(i*53+G.time*40)%W,y=(i*37+G.time*60)%H; ctx.fillRect(x,y,2,2);} }
    if(G.weather==='mud'){ ctx.fillStyle='rgba(40,30,20,0.15)'; ctx.fillRect(0,TOP,W,H-TOP); }
  }

  function drawTopStrip(){
    ctx.fillStyle='rgba(10,8,6,0.55)'; ctx.fillRect(0,0,W,TOP);
    // HQ integrity bars
    ctx.font='11px monospace';
    ctx.fillStyle='#cfc6b0'; ctx.fillText(G.fac.name,12,18);
    bar(12,24, 200, G.hqPlayer/100, '#7ec860'); ctx.fillStyle='#9a9382'; ctx.fillText('HQ',218,33);
    ctx.textAlign='right'; ctx.fillStyle='#cfc6b0'; ctx.fillText((G.camp.enemyNation||'enemy').toUpperCase(),W-12,18); ctx.textAlign='left';
    bar(W-212,24, 200, G.hqEnemy/100, '#c85a5a');
    // objective text
    ctx.fillStyle='#ffe9b0'; ctx.textAlign='center';
    const obj = G.mode==='defence'? ('DEFEND — '+snapshot().time+'s') : ('ASSAULT — enemy HQ '+Math.round(G.hqEnemy)+'%');
    ctx.fillText(obj, W/2, 18); ctx.textAlign='left';
    if(G.paused){ ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.fillRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.font='30px monospace'; ctx.textAlign='center'; ctx.fillText('— PAUSED —',W/2,H/2); ctx.textAlign='left'; }
  }
  function bar(x,y,w,p,col){ ctx.fillStyle='#000'; ctx.fillRect(x,y,w,8); ctx.fillStyle=col; ctx.fillRect(x,y,w*clamp(p,0,1),8); ctx.strokeStyle='#00000088'; ctx.strokeRect(x,y,w,8); }

  // ---------------------------------------------------------------- public
  global.Engine = {
    init, start, spawnUnit, fireAbility, buildAction, setOrder, selectLane, togglePause,
    get state(){ return G; }, W, H, NLANES,
    laneFromY:(y)=>clamp(Math.floor((y-TOP)/laneH),0,NLANES-1)
  };

})(window);
