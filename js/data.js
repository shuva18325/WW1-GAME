/* =========================================================================
 * IRON & FAITH — data.js
 * Data-driven tables: factions, units, campaigns, events, difficulty.
 * Designers can edit these without touching engine code.
 * ========================================================================= */
(function (global) {
  'use strict';

  // ---------------------------------------------------------------- UNITS
  // role: 'line'|'assault'|'support'|'mobile'|'arty'|'engineer'|'tank'
  // flags: isTank, isCamel, isEngineer, antitank, indirect, ambush, ragged
  const UNITS = {
    // ----- GERMANY -----
    g_storm:      { name:'Stormtrooper',     nation:'german', role:'assault', hp:70, armor:1, dmg:9, range:150, fireRate:2.4, speed:42, morale:95, cost:{m:8,s:6}, cd:3, key:'Q', helmet:'stahlhelm', flags:{} },
    g_mg:         { name:'MG Squad',         nation:'german', role:'support', hp:60, armor:0, dmg:5, range:230, fireRate:5.0, speed:20, morale:80, cost:{m:7,s:8}, cd:4, helmet:'stahlhelm', flags:{} },
    g_armoredcar: { name:'Armored Car',      nation:'german', role:'mobile',  hp:120,armor:3, dmg:7, range:180, fireRate:3.0, speed:55, morale:90, cost:{m:10,s:12}, cd:6, helmet:'stahlhelm', flags:{vehicle:true} },
    g_grenadier:  { name:'Grenadier',        nation:'german', role:'assault', hp:75, armor:1, dmg:14,range:120, fireRate:1.2, speed:36, morale:90, cost:{m:7,s:7}, cd:3, helmet:'stahlhelm', flags:{antitrench:true} },
    g_elite:      { name:'Elite Trench Inf.',nation:'german', role:'line',    hp:100,armor:2, dmg:7, range:170, fireRate:2.0, speed:30, morale:92, cost:{m:9,s:6}, cd:3, helmet:'stahlhelm', flags:{} },
    g_engineer:   { name:'Pioneer/Engineer', nation:'german', role:'engineer',hp:70, armor:1, dmg:4, range:90,  fireRate:1.5, speed:30, morale:80, cost:{m:6,s:5}, cd:4, helmet:'stahlhelm', flags:{isEngineer:true} },
    g_arty:       { name:'Heavy Artillery',  nation:'german', role:'arty',    hp:55, armor:0, dmg:30,range:520, fireRate:0.25,speed:10, morale:75, cost:{m:8,s:16}, cd:9, helmet:'stahlhelm', flags:{indirect:true} },
    g_tank:       { name:'A7V Tank',         nation:'german', role:'tank',    hp:300,armor:6, dmg:16,range:200, fireRate:1.2, speed:24, morale:100,cost:{m:14,s:24}, cd:16, flags:{isTank:true, tankType:'a7v'} },

    // ----- OTTOMAN -----
    o_regular:    { name:'Regular Infantry', nation:'ottoman', role:'line',   hp:65, armor:0, dmg:5, range:150, fireRate:1.8, speed:30, morale:90, cost:{m:5,s:3}, cd:2, helmet:'kabalak', flags:{ragged:true} },
    o_elite:      { name:'Elite Infantry',   nation:'ottoman', role:'line',   hp:95, armor:1, dmg:7, range:165, fireRate:2.0, speed:30, morale:98, cost:{m:8,s:5}, cd:3, helmet:'fez', flags:{} },
    o_camel:      { name:'Camel Infantry',   nation:'ottoman', role:'mobile', hp:85, armor:0, dmg:6, range:150, fireRate:1.8, speed:58, morale:92, cost:{m:8,s:6}, cd:4, flags:{isCamel:true} },
    o_scout:      { name:'Desert Scout',     nation:'ottoman', role:'mobile', hp:50, armor:0, dmg:4, range:160, fireRate:2.0, speed:62, morale:85, cost:{m:5,s:4}, cd:3, helmet:'kabalak', flags:{scout:true} },
    o_mg:         { name:'MG Detachment',    nation:'ottoman', role:'support',hp:55, armor:0, dmg:5, range:225, fireRate:4.6, speed:18, morale:85, cost:{m:7,s:7}, cd:4, helmet:'kabalak', flags:{} },
    o_mortar:     { name:'Mortar Team',      nation:'ottoman', role:'arty',   hp:50, armor:0, dmg:22,range:430, fireRate:0.4, speed:14, morale:80, cost:{m:7,s:10}, cd:7, helmet:'kabalak', flags:{indirect:true} },
    o_engineer:   { name:'Engineer',         nation:'ottoman', role:'engineer',hp:60,armor:0, dmg:3, range:90,  fireRate:1.4, speed:28, morale:82, cost:{m:5,s:4}, cd:4, helmet:'kabalak', flags:{isEngineer:true} },

    // ----- AUSTRIA-HUNGARY -----
    a_mixed:      { name:'Mixed Infantry',   nation:'austria', role:'line',   hp:75, armor:1, dmg:6, range:155, fireRate:1.9, speed:30, morale:72, cost:{m:5,s:4}, cd:2, helmet:'stahlhelm', flags:{multiethnic:true} },
    a_mountain:   { name:'Mountain Inf.',    nation:'austria', role:'line',   hp:90, armor:1, dmg:7, range:160, fireRate:2.0, speed:34, morale:84, cost:{m:8,s:6}, cd:3, helmet:'cap', flags:{mountain:true} },
    a_engineer:   { name:'Engineer',         nation:'austria', role:'engineer',hp:65,armor:1, dmg:3, range:90,  fireRate:1.4, speed:28, morale:78, cost:{m:5,s:5}, cd:4, helmet:'stahlhelm', flags:{isEngineer:true} },
    a_arty:       { name:'Skoda Artillery',  nation:'austria', role:'arty',   hp:60, armor:0, dmg:38,range:560, fireRate:0.3, speed:8,  morale:78, cost:{m:9,s:18}, cd:8, helmet:'stahlhelm', flags:{indirect:true} },

    // ----- BULGARIA -----
    b_mountain:   { name:'Mountain Inf.',    nation:'bulgaria', role:'line',  hp:85, armor:1, dmg:6, range:160, fireRate:1.9, speed:34, morale:88, cost:{m:6,s:4}, cd:3, helmet:'cap', flags:{mountain:true} },
    b_ambush:     { name:'Ambusher',         nation:'bulgaria', role:'assault',hp:60,armor:0, dmg:12,range:140, fireRate:1.6, speed:40, morale:90, cost:{m:6,s:5}, cd:4, helmet:'cap', flags:{ambush:true} },
    b_rifle:      { name:'Defensive Rifles', nation:'bulgaria', role:'line',  hp:80, armor:1, dmg:8, range:200, fireRate:1.6, speed:24, morale:86, cost:{m:6,s:4}, cd:3, helmet:'cap', flags:{entrench:true} },
    b_engineer:   { name:'Engineer',         nation:'bulgaria', role:'engineer',hp:65,armor:1,dmg:3, range:90,  fireRate:1.4, speed:28, morale:82, cost:{m:5,s:4}, cd:4, helmet:'cap', flags:{isEngineer:true} },

    // ----- ARAB REVOLT (inversion campaign, player) -----
    r_raider:     { name:'Camel Raider',     nation:'arab', role:'mobile',   hp:70, armor:0, dmg:7, range:150, fireRate:2.0, speed:64, morale:90, cost:{m:7,s:5}, cd:3, flags:{isCamel:true} },
    r_ambush:     { name:'Desert Ambusher',  nation:'arab', role:'assault',  hp:55, armor:0, dmg:13,range:150, fireRate:1.6, speed:44, morale:88, cost:{m:6,s:4}, cd:4, helmet:'keffiyeh', flags:{ambush:true} },
    r_sabo:       { name:'Saboteur',         nation:'arab', role:'engineer', hp:50, armor:0, dmg:5, range:90,  fireRate:1.2, speed:48, morale:85, cost:{m:6,s:6}, cd:5, helmet:'keffiyeh', flags:{saboteur:true} },
    r_light:      { name:'Light Rifleman',   nation:'arab', role:'line',     hp:45, armor:0, dmg:6, range:170, fireRate:1.8, speed:40, morale:82, cost:{m:4,s:3}, cd:2, helmet:'keffiyeh', flags:{} },

    // ----- ENEMY UNITS (AI) -----
    e_brit_line:  { name:'British Infantry', nation:'british', role:'line',   hp:75, armor:1, dmg:6, range:160, fireRate:1.9, speed:30, morale:80, helmet:'brodie', flags:{} },
    e_anzac:      { name:'ANZAC Assault',    nation:'british', role:'assault',hp:85, armor:1, dmg:9, range:140, fireRate:2.0, speed:42, morale:88, helmet:'brodie', flags:{} },
    e_colonial:   { name:'Colonial Troops',  nation:'british', role:'line',   hp:60, armor:0, dmg:5, range:150, fireRate:1.8, speed:32, morale:60, helmet:'cap', flags:{muslim:true} },
    e_french:     { name:'French Infantry',  nation:'french',  role:'line',   hp:78, armor:1, dmg:6, range:160, fireRate:1.9, speed:30, morale:78, helmet:'adrian', flags:{} },
    e_russian:    { name:'Russian Infantry', nation:'russian', role:'line',   hp:70, armor:0, dmg:5, range:150, fireRate:1.7, speed:30, morale:70, helmet:'cap', flags:{horde:true} },
    e_armoredcar: { name:'Armored Car',      nation:'british', role:'mobile', hp:120,armor:3, dmg:7, range:180, fireRate:3.0, speed:55, morale:85, flags:{vehicle:true} },
    e_tank_rhom:  { name:'Mark Tank',        nation:'british', role:'tank',   hp:280,armor:6, dmg:15,range:200, fireRate:1.1, speed:20, morale:100, flags:{isTank:true, tankType:'rhomboid'} },
    e_tank_ft:    { name:'FT Tank',          nation:'french',  role:'tank',   hp:170,armor:5, dmg:11,range:180, fireRate:1.4, speed:30, morale:100, flags:{isTank:true, tankType:'ft'} },
    e_arab_raid:  { name:'Arab Raider',      nation:'arab',    role:'mobile', hp:65, armor:0, dmg:7, range:150, fireRate:2.0, speed:62, morale:88, flags:{isCamel:true} },
    e_ott_def:    { name:'Ottoman Defender', nation:'ottoman', role:'line',   hp:80, armor:1, dmg:6, range:160, fireRate:1.9, speed:26, morale:92, helmet:'kabalak', flags:{ragged:true} }
  };

  // ------------------------------------------------------------- FACTIONS
  // mult: combat/economy multipliers expressing buffs & debuffs.
  const FACTIONS = {
    german: {
      name:'German Empire', nation:'german', color:'#c8102e',
      start:{m:60,s:60,i:1}, regen:{m:3.2, s:3.0}, spawnSpeed:1.35,
      buffs:['High industry','Fast tech','Strong engineering','Elite stormtroopers','Tanks'],
      debuffs:['Fear of tanks (early)','High supply cost'],
      mult:{ routChance:0.6, engBuild:1.5, supplyCost:1.25, tankFear:true },
      ability:{ id:'industrial_surge', name:'INDUSTRIAL SURGE', charge:55,
        desc:'Production surge + free Stormtroopers + trench reinforcement' },
      roster:['g_storm','g_mg','g_grenadier','g_elite','g_armoredcar','g_engineer','g_arty','g_tank'],
      voice:{ spawn:['For the Empire!','We stand firm!','Jawohl, Herr General!'],
        advance:['Stormtroopers, advance!'],
        engineer:['Engineers, reinforce the trench!'],
        tankFear:['Hold the line! Armor incoming!'],
        ability:['Industrial surge — full production!'] }
    },
    ottoman: {
      name:'Ottoman Empire', nation:'ottoman', color:'#1a7a3a',
      start:{m:55,s:35,i:1}, regen:{m:3.0, s:1.7}, spawnSpeed:1.0,
      buffs:['Very high morale','Religious motivation','Strong defence','Camel mobility'],
      debuffs:['Low industry','Slow tech','Desertion events'],
      mult:{ routChance:0.5, defenceBonus:1.2, desertChance:1.4, moraleRegen:1.6 },
      ability:{ id:'german_support', name:'GERMAN SUPPORT', charge:70,
        desc:'Summon 1 German tank + 3 elite Stormtroopers + morale boost' },
      roster:['o_regular','o_elite','o_camel','o_scout','o_mg','o_mortar','o_engineer'],
      voice:{ spawn:['Brothers, stand firm! This land is ours!','Sultan’s banner flies above us!','Stay together, kardeşlerim!','Camels ready, commander!'],
        advance:['For the Caliphate, ileri!'],
        crisis:['Allah’s strength is with us!','For the Caliphate! Hold the cliffs!'],
        desert:['Desert winds won’t break us!'],
        ability:['German support arriving!'] }
    },
    austria: {
      name:'Austria-Hungary', nation:'austria', color:'#c8102e',
      start:{m:60,s:50,i:1}, regen:{m:3.0, s:2.4}, spawnSpeed:1.1,
      buffs:['Strong artillery','Good defensive lines'],
      debuffs:['Multi-ethnic morale instability'],
      mult:{ routChance:1.25, artyPower:1.3, cohesion:true },
      ability:{ id:'artillery_barrage', name:'ARTILLERY BARRAGE', charge:50,
        desc:'Heavy Skoda strike + morale boost + enemy suppression' },
      roster:['a_mixed','a_mountain','a_arty','a_engineer'],
      voice:{ spawn:['Our men stand united today.','For the Empire!'],
        advance:['Hold the ridge!'],
        ability:['Artillery ready, commander!'] }
    },
    bulgaria: {
      name:'Kingdom of Bulgaria', nation:'bulgaria', color:'#1a7a3a',
      start:{m:55,s:40,i:1}, regen:{m:2.8, s:2.0}, spawnSpeed:1.0,
      buffs:['Mountain warfare','Ambush bonuses'],
      debuffs:['Low equipment'],
      mult:{ routChance:0.8, mountainBonus:1.5, equip:0.85 },
      ability:{ id:'mountain_hold', name:'MOUNTAIN HOLD', charge:48,
        desc:'Massive defensive buff + ambush activation + damage reduction' },
      roster:['b_mountain','b_ambush','b_rifle','b_engineer'],
      voice:{ spawn:['For Bulgaria!','Mountains protect us — hold your ground!'],
        ambush:['Ambush ready!'],
        ability:['The mountain holds!'] }
    },
    arab: {
      name:'Arab Revolt', nation:'arab', color:'#8e2a26',
      start:{m:45,s:45,i:1}, regen:{m:2.6, s:2.6}, spawnSpeed:1.2,
      buffs:['Desert mobility','Ambush & hit-and-run','Sabotage'],
      debuffs:['Fragile units','No trenches to hold'],
      mult:{ routChance:0.9, mobility:1.3, ambushPower:1.4 },
      ability:{ id:'desert_raid', name:'DESERT RAID', charge:45,
        desc:'Summon raiders + sabotage enemy supply line' },
      roster:['r_raider','r_ambush','r_sabo','r_light'],
      voice:{ spawn:['The desert hides us.','Strike fast, vanish faster.'],
        sabotage:['Cut their supply lines!'],
        ability:['Raiders, strike!'] }
    }
  };

  // ------------------------------------------------------------- CAMPAIGNS
  // mode: 'offence' (capture enemy line) | 'defence' (hold) | 'mixed'
  const DIFFS_FULL = ['Super Easy','Easy','Medium','Hard','East Demon','Medium Demon','IMPOSSIBLE DEMON'];
  const DIFFS_3    = ['Easy','Medium','Hard'];

  const CAMPAIGNS = [
    {
      id:'western', name:'Western Front', faction:'german', flag:'german',
      subtitle:'German Empire — 1916 · 1917 · 1918',
      mode:'mixed', theme:'mud', difficulties:DIFFS_FULL,
      enemies:['e_brit_line','e_french','e_anzac','e_armoredcar','e_tank_rhom','e_tank_ft'],
      enemyTank:['e_tank_rhom','e_tank_ft'], enemyNation:'british',
      rules:{ tankEvent:true, gas:true },
      events:['tanks_appear','gas_attack','supply_convoy','industrial_surge_ready','mass_assault'],
      brief:'The mud of Flanders. Hold the trench against French and British assaults, then strike back with stormtroopers. The first tanks are coming — your men will fear them until the A7V answers.',
      intel:'Enemy: France & Britain · Tanks confirmed · Mixed offence/defence'
    },
    {
      id:'gallipoli', name:'Gallipoli', faction:'ottoman', flag:'ottoman',
      subtitle:'Ottoman Empire — Defend the Heights',
      mode:'defence', theme:'beach', difficulties:DIFFS_3,
      enemies:['e_brit_line','e_anzac','e_french','e_colonial'],
      enemyNation:'british',
      rules:{ naval:true, defection:true, religious:true },
      events:['naval_bombardment','colonial_defection','caliphate_call','mass_assault'],
      brief:'The Allies land on the beaches below the cliffs. Endure the naval guns, hold the heights, and let faith steady the line. Some among the enemy are Muslims — they may yet turn to the Caliphate.',
      intel:'Enemy: Britain, France, ANZAC · Naval bombardment · DEFENCE'
    },
    {
      id:'palestine', name:'Palestine Front', faction:'ottoman', flag:'ottoman',
      subtitle:'Ottoman Empire — War in the Sand',
      mode:'mixed', theme:'desert', difficulties:DIFFS_3,
      enemies:['e_brit_line','e_armoredcar','e_anzac'],
      enemyNation:'british',
      rules:{ heat:true, oasis:true, advisor:true },
      events:['sandstorm','german_advisor','heat_wave','supply_convoy'],
      brief:'Sun, sand and thirst. Hold the oases for supply, manage the heat, and trust your German advisors. British armoured cars range the dunes — your camels can match them.',
      intel:'Enemy: Britain · Armoured cars · Heat exhaustion'
    },
    {
      id:'egypt', name:'Egyptian / Suez Front', faction:'ottoman', flag:'ottoman',
      subtitle:'Ottoman Empire — The Canal',
      mode:'defence', theme:'desert', difficulties:DIFFS_3,
      enemies:['e_brit_line','e_colonial','e_anzac'],
      enemyNation:'british',
      rules:{ heat:true, scarcity:true, religious:true, defection:true },
      events:['suez_event','colonial_defection','heat_wave','caliphate_call'],
      brief:'The Suez Canal. Supply is scarce and the desert merciless. Keep faith high with the sermon — it is the only thing that will not run dry.',
      intel:'Enemy: Britain & colonial troops · Supply scarcity · DEFENCE'
    },
    {
      id:'caucasus', name:'Caucasus & Eastern Europe', faction:'austria', flag:'austria',
      subtitle:'Austria-Hungary (+ Ottomans) — Winter War',
      mode:'mixed', theme:'snow', difficulties:DIFFS_3,
      enemies:['e_russian','e_russian','e_brit_line'],
      enemyNation:'russian',
      rules:{ cold:true, multiethnic:true, artilleryDom:true, horde:true },
      events:['blizzard','ethnic_mutiny','mass_assault','artillery_ready'],
      brief:'Snow trenches in the mountains. Russian masses come on in waves; your guns are the great equaliser. Hold the eleven-tongued line together before the cold and the cracks break it.',
      intel:'Enemy: Russia (human waves) · Winter attrition · Ethnic instability'
    },
    {
      id:'bulgaria', name:'Bulgarian Front', faction:'bulgaria', flag:'bulgaria',
      subtitle:'Kingdom of Bulgaria — The Mountain Wall',
      mode:'defence', theme:'mountain', difficulties:DIFFS_3,
      enemies:['e_brit_line','e_french','e_french'],
      enemyNation:'british',
      rules:{ ambush:true, mountainBonus:true },
      events:['ambush_ready','mass_assault','mountain_hold_ready'],
      brief:'Few men, poor kit, perfect ground. Funnel the enemy into the passes, spring the ambush, and let the mountain do the killing.',
      intel:'Enemy: Britain & France · Mountain chokepoints · DEFENCE'
    },
    {
      id:'arab_revolt', name:'Arab Revolt', faction:'arab', flag:'british',
      subtitle:'ENEMY CAMPAIGN — Guerrilla War on the Hejaz',
      mode:'offence', theme:'desert', difficulties:DIFFS_3,
      enemies:['e_ott_def','e_ott_def','e_ott_def'],
      enemyNation:'ottoman',
      rules:{ heat:true, sabotage:true, guerrilla:true, supplyAttack:true },
      events:['hejaz_raid','sabotage_event','sandstorm','ottoman_morale_drop'],
      brief:'You are the raiders now. Strike the Hejaz railway, cut the supply lines, and bleed the Ottoman garrison. Appear, kill, and vanish into the desert before the counter falls.',
      intel:'Target: Ottoman supply lines · Guerrilla offence · Hit & run'
    }
  ];

  // ------------------------------------------------------------- DIFFICULTY
  // applied to enemy aggression & player economy
  const DIFFICULTY = {
    'Super Easy':      { enemyRate:0.55, enemySize:0.6, econ:1.6, tankFear:0.4, desert:0.4, pause:true },
    'Easy':            { enemyRate:0.75, enemySize:0.8, econ:1.3, tankFear:0.7, desert:0.6, pause:true },
    'Medium':          { enemyRate:1.0,  enemySize:1.0, econ:1.0, tankFear:1.0, desert:1.0, pause:true },
    'Hard':            { enemyRate:1.3,  enemySize:1.2, econ:0.85,tankFear:1.2, desert:1.2, pause:true },
    'East Demon':      { enemyRate:1.7,  enemySize:1.6, econ:0.75,tankFear:1.3, desert:1.5, pause:true, horde:1.5 },
    'Medium Demon':    { enemyRate:1.9,  enemySize:1.7, econ:0.7, tankFear:1.5, desert:1.6, pause:true, combinedArms:true },
    'IMPOSSIBLE DEMON':{ enemyRate:2.4,  enemySize:2.2, econ:0.6, tankFear:1.8, desert:2.0, pause:false, combinedArms:true, permadeath:true }
  };

  // ------------------------------------------------------------- EVENTS
  // text + voice + effect tag (engine interprets effect)
  const EVENTS = {
    tanks_appear:      { title:'THE TANKS APPEAR', text:'Enemy armour rolls out of the smoke. Your men freeze in fear.', voice:'Hold the line! Armor incoming!', effect:'spawnEnemyTank' },
    gas_attack:        { title:'GAS!', text:'A green cloud drifts across no-man’s-land.', voice:'Masks! Gas in the trench!', effect:'gas' },
    supply_convoy:     { title:'SUPPLY CONVOY', text:'A reinforcement convoy reaches the road. Supplies restored.', voice:'Reinforcements arriving soon.', effect:'supply' },
    industrial_surge_ready:{ title:'INDUSTRY MOBILISED', text:'The factories of the Ruhr hit full output.', voice:'Industrial surge ready!', effect:'chargeAbility' },
    mass_assault:      { title:'MASS ASSAULT', text:'A great wave of enemy infantry charges the line!', voice:'Here they come — brace!', effect:'wave' },
    naval_bombardment: { title:'NAVAL BOMBARDMENT', text:'Allied battleships open fire on the coast!', voice:'Take cover — the guns of the fleet!', effect:'naval' },
    colonial_defection:{ title:'THEY TURN TO US', text:'Muslim colonial troops lay down their arms and cross over.', voice:'I cannot fight my brothers… I’m switching sides.', effect:'defect' },
    caliphate_call:    { title:'CALL OF THE CALIPHATE', text:'The sermon rings out. Faith steels the whole line.', voice:'Allah’s strength is with us!', effect:'moraleAll' },
    sandstorm:         { title:'SANDSTORM', text:'A wall of sand blinds every rifle.', voice:'Desert winds won’t break us!', effect:'sandstorm' },
    german_advisor:    { title:'GERMAN ADVISOR', text:'A German advisor arrives to coordinate the defence.', voice:'Ottoman troops show impressive resolve.', effect:'advisor' },
    heat_wave:         { title:'HEAT EXHAUSTION', text:'The sun saps the strength of every man off-supply.', voice:'Water — the men need water!', effect:'heat' },
    suez_event:        { title:'SUEZ CANAL', text:'The enemy presses toward the canal crossing.', voice:'Hold the canal at all costs!', effect:'wave' },
    blizzard:          { title:'BLIZZARD', text:'A whiteout descends. The cold begins to kill.', voice:'Hold the ridge — and hold each other!', effect:'cold' },
    ethnic_mutiny:     { title:'ETHNIC UNREST', text:'A mixed battalion wavers and threatens to break.', voice:'Our men stand united today — they must!', effect:'cohesionDrop' },
    artillery_ready:   { title:'GUNS READY', text:'The Skoda batteries report ready.', voice:'Artillery ready, commander!', effect:'chargeAbility' },
    ambush_ready:      { title:'AMBUSH SET', text:'Your men melt into the rocks above the pass.', voice:'Ambush ready!', effect:'chargeAbility' },
    mountain_hold_ready:{ title:'THE MOUNTAIN WAITS', text:'Positions sited, fields of fire cleared.', voice:'Mountains protect us — hold your ground!', effect:'chargeAbility' },
    hejaz_raid:        { title:'HEJAZ RAILWAY', text:'The railway lies ahead — blow the tracks!', voice:'Cut their supply lines!', effect:'sabotage' },
    sabotage_event:    { title:'SABOTAGE', text:'Charges set on the enemy depot.', voice:'Strike fast, vanish faster.', effect:'sabotage' },
    ottoman_morale_drop:{ title:'GARRISON SHAKEN', text:'The raids have broken the garrison’s nerve.', voice:'The desert hides us.', effect:'enemyMoraleDrop' }
  };

  global.GameData = { UNITS, FACTIONS, CAMPAIGNS, DIFFICULTY, EVENTS, DIFFS_FULL, DIFFS_3 };

})(window);
