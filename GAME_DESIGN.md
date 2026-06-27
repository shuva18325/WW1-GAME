# IRON & FAITH — *Command of the Central Powers*
## SECTION 2 — GAME DESIGN DOCUMENT

> This document specifies the game itself: overview, every campaign, every unit, faction buffs/debuffs, special abilities, offence/defence modes, loading screen, art style, and extra mechanics. The playable prototype that implements this design lives in `index.html` + `/js`. (Background, philosophy, tech trees, and the full mechanic/event/unit ideation are in `PLANNING.md`.)

---

## 1. GAME OVERVIEW

**Iron & Faith** is a **WW1 campaign strategy game** where you are a **commander / general of the Central Powers**, not a soldier.

You:
- **Spawn, command, reinforce, and position** pixel-art troops on a tactical battlefield.
- **Choose campaigns** across multiple historical fronts.
- Face **unique mechanics, terrain, enemies, and events** on each front.
- Spend resources (**Manpower, Supply, Industry**) to build and sustain an army.
- Build and upgrade **trenches, bunkers, wire, and weapons** via engineers.
- Trigger a faction-defining **Special Ability** at the decisive moment.
- Manage **morale, desertion, supply, weather, and front-specific meters** (Caliphate Loyalty, Ethnic Cohesion, Heat, Cold).

**Game type:** real-time tactical commander / trench-warfare RTS with lane-and-depth positioning.

**First loading screen:** the **Central Powers leaders + flags** image (Reference Image 2 of the brief — the leadership/flags banner). It is the very first thing shown on launch, before the main menu.

**Core loop:**
> Deploy line → dig & wire (engineers) → resist the assault (defence) or push under a barrage (offence) → manage morale/supply/events → spend the special ability at the crisis → capture/hold the objective → bank veterans & War Points → research → next mission.

---

## 2. CAMPAIGN LIST

### ⭐ WESTERN FRONT — GERMANY
- **Years / sub-arcs:** 1916 → 1917 → 1918.
- **Mode:** mixed offence/defence.
- **Difficulty (full 7-tier ladder):** Super Easy → Easy → Medium → Hard → East Demon → Medium Demon → IMPOSSIBLE DEMON.
- **Terrain:** churned brown trench mud, craters, barbed wire, duckboards (matches Battle Reference image).
- **Features:**
  - **French & British tanks** (rhomboid + FT) — the headline threat.
  - **Brutal trench warfare** — deep, multi-tier trench lines.
  - **German industry** = fast troop production.
  - **German engineering** = trench upgrades, concrete bunkers.
  - **High discipline**, **high morale**.
  - **Fear mechanic** when tanks appear (until A7V tech).
- **German Troops:** Stormtroopers · Machine-gun squads · Armored cars · Heavy artillery · Grenadiers · Elite trench infantry · Engineers · (late) A7V Tank.
- **German voice lines (English, German-flavored):**
  - "Hold the line! Armor incoming!"
  - "Stormtroopers, advance!"
  - "Engineers, reinforce the trench!"
  - "For the Empire!"
  - "We stand firm!"

### ⭐ GALLIPOLI — OTTOMAN EMPIRE
- **Mode:** **pure defence** (hold the heights).
- **Difficulty:** Easy → Medium → Hard.
- **Terrain (special case):** **beach + cliff** — ochre sand, blue Aegean, British/French wading off **landing boats** below, Ottomans dug into the heights above. (NOT the brown trench map.)
- **Features:**
  - **British naval bombardment** (off-shore battleships, telegraphed shelling).
  - **Ottoman low equipment but high morale.**
  - **Muslim colonial troops may defect** to the Ottoman side.
  - **Defensive building system** (cliff redoubts, MG nests).
  - **British aggressive generals** (relentless landing waves).
  - **Harsh terrain** (cliffs, ravines).
  - **High religious motivation.**
  - **Caliphate loyalty events.**
- **Ottoman Troops:** Camel infantry · Regular infantry · Elite infantry · Desert scouts · Machine-gun detachments · Engineers · Mortar teams.
- **Ottoman voice lines (English, Turkish-Islamic flavor):**
  - "Brothers, stand firm! This land is ours!"
  - "For the Caliphate! Hold the cliffs!"
  - "Allah's strength is with us!"
  - "Sultan's banner flies above us!"
  - "Stay together, kardeşlerim!"
- **British colonial Muslim troops (defection event lines):**
  - "I cannot fight my brothers… I'm switching sides."
  - "My heart belongs with the Caliphate."

### ⭐ PALESTINE FRONT — OTTOMAN EMPIRE
- **Mode:** defence-leaning, mobile.
- **Terrain:** open desert, oases, dunes.
- **Features:**
  - **Desert warfare.**
  - **Oasis supply points** (capture/hold for supply).
  - **Camel cavalry.**
  - **British armored cars.**
  - **Ottoman morale swings.**
  - **German advisors** (buff + advisor voice-lines).
  - **Supply difficulty.**
  - **Heat exhaustion mechanic** (off-supply attrition).
- **Ottoman voice lines:**
  - "Desert winds won't break us!"
  - "For the Caliphate, ileri!"
  - "Camels ready, commander!"
- **German advisor lines:**
  - "Ottoman troops show impressive resolve."
  - "Reinforcements arriving soon."

### ⭐ EGYPTIAN / SUEZ FRONT — OTTOMAN EMPIRE
- **Mode:** **defence**, scarcity-driven.
- **Terrain:** Suez canal-zone desert.
- **Features:**
  - **Suez Canal events** (canal-crossing set-pieces, sabotage).
  - **British colonial troops** (defection-eligible).
  - **Defensive warfare.**
  - **Ottoman morale tied to religious speeches** (sermon = the lifeline).
  - **Supply scarcity** (harshest logistics in the game).

### ⭐ CAUCASUS / EASTERN EUROPE FRONT — OTTOMANS + AUSTRIA-HUNGARY
- **Mode:** mixed.
- **Terrain:** snow mountains, frozen passes, snow trenches.
- **Features:**
  - **Mountain warfare.**
  - **Snow trenches.**
  - **Russian mass infantry** (human waves).
  - **Winter attrition** (cold mechanic).
  - **Multi-ethnic morale system** (Austrian ethnic cohesion).
  - **Artillery dominance** (the great equaliser here).
- **Austro-Hungarian Troops:** Heavy artillery · Mixed-ethnic infantry · Mountain infantry · Engineers.
- **Austro-Hungarian voice lines:**
  - "Artillery ready, commander!"
  - "Hold the ridge!"
  - "Our men stand united today."

### ⭐ BULGARIAN FRONT — BULGARIA
- **Mode:** **defence**.
- **Terrain:** rocky mountains, ridgelines, chokepoints.
- **Features:**
  - **Mountain warfare.**
  - **Defensive bonuses.**
  - **Ambush mechanics.**
  - **Harsh terrain.**
  - **Limited equipment but strong positioning.**
- **Bulgarian Troops:** Mountain infantry · Ambushers · Defensive riflemen · Engineers.
- **Bulgarian voice lines:**
  - "Mountains protect us — hold your ground!"
  - "Ambush ready!"
  - "For Bulgaria!"

### ⭐ ARAB REVOLT — ENEMY CAMPAIGN
- **Mode:** **enemy offence** (you play the raiders, or defend Ottoman lines against them — see prototype note below).
- **Terrain:** open desert, Hejaz railway.
- **Features:**
  - **Guerrilla warfare.**
  - **Ambushes.**
  - **Hit-and-run.**
  - **Desert mobility.**
  - **Sabotage events.**
  - **Ottoman morale penalties** (raids erode the enemy).
  - **Supply-line attacks.**
- **Arab Revolt Troops:** Camel raiders · Desert ambushers · Saboteurs · Light riflemen.
- **Arab Revolt voice lines:**
  - "Strike fast, vanish faster."
  - "Cut their supply lines!"
  - "The desert hides us."

---

## 3. UNIT SYSTEM (ALL FACTIONS)

Every unit has: **Cost** (Manpower / Supply), **HP**, **Armor**, **Damage**, **Range**, **Rate-of-fire**, **Move speed**, **Morale**, **Role**, and optional **Abilities**. Stats are tuned per faction identity.

### Ottoman Units
| Unit | Role | Notes |
|---|---|---|
| Camel infantry | Mobile line | Fast on sand, weak in trenches |
| Desert scout | Recon | Spots ambushes, fast, fragile |
| Regular infantry | Line | Cheap, high morale, low kit |
| Elite infantry | Line/hold | Die-in-place defenders, top morale |
| Machine-gun team | Support | Lane-locking fire (cliff defence) |
| Mortar | Indirect | Plunging fire onto beaches/trenches |
| Engineer | Builder | Redoubts, cisterns, repairs |

### German Units
| Unit | Role | Notes |
|---|---|---|
| Stormtrooper | Assault | Grenades + SMG, infiltration |
| Armored car | Mobile | Fast, light armour, anti-infantry |
| Machine-gun squad | Support | Heavy suppression |
| Grenadier | Close assault | Anti-trench specialist |
| Tank (late war, A7V) | Breakthrough | Ends tank-fear; rifle-immune |
| Engineer/Pioneer | Builder | Bunkers, dugouts, flamethrower at tech |
| Heavy artillery | Indirect | Bombardment + creeping barrage |

### Austria-Hungary Units
| Unit | Role | Notes |
|---|---|---|
| Heavy artillery | Indirect | Best guns in the game (Skoda) |
| Mixed infantry | Line | Numerous, morale-variable |
| Mountain infantry | Specialist | Alpine bonuses (Kaiserjäger) |
| Engineer | Builder | Mountain forts, emplacements |

### Bulgarian Units
| Unit | Role | Notes |
|---|---|---|
| Mountain infantry | Line | Terrain bonus in mountains |
| Ambusher | Concealment | Hidden first-strike burst |
| Defensive riflemen | Hold | Entrenched sharpshooters |
| Engineer | Builder | Sangars, pre-sited killzones |

### Enemy Units (AI)
British/French line infantry · ANZAC assault · rhomboid & FT tanks · armoured cars · colonial troops (defection-eligible) · Russian human-wave infantry · Arab raiders/ambushers/saboteurs.

---

## 4. FACTION BUFFS & DEBUFFS

### Ottoman Empire
- **Buffs:** Very high morale · Religious motivation · Strong defence · Camel mobility.
- **Debuffs:** Low industry · Slow tech · Desertion events.

### Germany
- **Buffs:** High industry · Fast tech · Strong engineering · Elite stormtroopers · Tanks.
- **Debuffs:** Fear of tanks early · High supply cost.

### Austria-Hungary
- **Buffs:** Strong artillery · Good defensive lines.
- **Debuffs:** Multi-ethnic morale instability.

### Bulgaria
- **Buffs:** Mountain warfare · Ambush bonuses.
- **Debuffs:** Low equipment.

*(Implemented as global stat multipliers + meter-driven event tables; see `js/data.js` `FACTIONS`.)*

---

## 5. SPECIAL ABILITIES PER FACTION

Each faction has ONE signature, charge/cooldown-based ability surfaced as the big central command-deck button.

### Ottoman Empire — "GERMAN SUPPORT"
Summons: **1 German tank** + **3 German elite stormtroopers**, plus an **instant morale boost** across the line. Cooldown ability. (Embodies the alliance and patches the equipment gap.)

### Germany — "INDUSTRIAL SURGE"
**Instant production-speed boost** + a **free stormtrooper squad** + **trench reinforcement** (all current trenches gain a level/HP).

### Austria-Hungary — "ARTILLERY BARRAGE"
**Heavy artillery strike** on a target lane + **morale boost** for friendlies + **enemy suppression** (accuracy/move debuff in the blast zone).

### Bulgaria — "MOUNTAIN HOLD"
**Massive defensive buff** + **ambush activation** (concealed units strike) + **reduced damage taken** for the duration.

---

## 6. OFFENSE & DEFENSE MODES

- **Offense:** capture enemy trenches / objectives by advancing across no-man's-land.
- **Defense:** hold the line — survive a timer or N waves.
- **Per-front mode mapping:**
  - **Gallipoli** = defence.
  - **Western Front** = mixed.
  - **Eastern Front (Caucasus)** = mixed/offence.
  - **Palestine / Egypt** = defence.
  - **Caucasus** = mixed.
  - **Arab Revolt** = enemy offence (raiders).

---

## 7. LOADING SCREEN

The **first loading screen** is the **Central Powers leaders + flags** image (the brief's leadership/flags banner). On launch the game shows this full-screen with a progress bar and a rotating period quote, then transitions to the main menu → campaign select. The prototype reproduces this as a pixel-art rendition (four leader silhouettes beneath the four national flags: German Imperial, Austro-Hungarian, Ottoman, Bulgarian) so it ships without external assets, and supports dropping in the real banner image if provided.

---

## 8. ART STYLE

- **All units match the reference pixel-art soldier**: chunky pixels, tan/khaki base, cloth/steel helmet, high backpack, horizontal rifle, brown boots/belt, neutral face — re-coloured per nationality.
- **Nationality variations are explicit:** Ottomans may wear a **fez** or kabalak and look **under-equipped** (e.g. a missing puttee/"sock"); Germans wear the **Stahlhelm**; British the **Brodie**; French the **Adrian** (horizon-blue); Arab raiders wear **keffiyeh** and robes.
- **Battles match the reference battle scene** (brown trench field, central trench line, craters, wire, muzzle-flash tracers, planted flag, tank in no-man's-land, smoke) — **except Gallipoli**, which is the beach-and-cliff scene with British/French coming off landing boats.
- **Tanks match the reference tank** (olive rhomboid with nose stripes & hull number) for British/French; **German A7V** is boxier and grey.
- Rendered at integer scale with nearest-neighbour (no smoothing).

---

## 9. EXTRA MECHANICS (implemented / specified)

- **Weather** (rain→mud, snow→cold, sandstorm→blind, night→ambush).
- **Supply lines** (depot/road radius; off-supply penalties).
- **Engineering** (build/upgrade trenches, wire, MG nests, bunkers).
- **Trench building** (tiers: ditch → sandbag → reinforced → concrete).
- **Naval bombardment** (Gallipoli/Egypt; telegraphed off-shore shelling).
- **Tank fear** (morale/accuracy debuff aura until counter-tech).
- **Officer quotes** (faction voice-lines as speech bubbles + log).
- **Reinforcement waves** (timed convoys on the road).
- **Industrial production** (Germany's economic engine).
- **Terrain modifiers** (cover, high ground, mud, sand, snow).
- **Religious morale boosts** (Ottoman sermons/speeches).
- **Caliphate loyalty events** (defections, Martyr's Resolve).
- **Ambush mechanics** (Bulgaria, Arab Revolt — concealed first strike).
- **Desert attrition** (heat) **& winter attrition** (cold).

---

## 10. PROTOTYPE — WHAT THE PLAYABLE BUILD IMPLEMENTS

The shipped browser prototype (`index.html`) is a vertical slice of the design above. It is data-driven, so every faction/unit/campaign/event below is defined in editable tables (`js/data.js`).

**Implemented now:**
- **Loading screen** (Central Powers leaders + four flags, pixel-art) → **Main menu** → **Campaign select** → **Difficulty select** → **Battle**.
- **All four Central Powers** + the **Arab Revolt** as a playable inversion campaign, each with their roster, buffs/debuffs, voice-lines, and **unique special ability**.
- **All eight fronts** selectable, each with its own palette, terrain modifier, enemy set, mode (offence/defence/mixed), and event table.
- **Core combat:** lane-and-depth battlefield, spawn-from-command-deck, auto-engage with Advance/Hold/Fall-Back orders, projectiles, casualties, corpses.
- **Resource triad** (Manpower / Supply / Industry) with faction-tuned regen.
- **Morale, rout, and desertion**; **supply radius**; **engineering & trench tiers**; **tanks + tank-fear**; **artillery**; **naval bombardment** (coastal fronts); **ambush** (Bulgaria/Arab); **heat/cold/weather** modifiers.
- **Faction special abilities** (German Support summon, Industrial Surge, Artillery Barrage, Mountain Hold).
- **Event system** firing the events from `PLANNING.md §16` (defection, tanks appear, gas, sandstorm, blizzard, supply convoy, sabotage, German advisor, etc.).
- **Pixel-art renderer** drawing per-nationality soldiers (Stahlhelm / fez / Brodie / Adrian / keffiyeh), tanks (rhomboid & A7V), trenches, wire, craters, flags, and the Gallipoli beach exception.
- **Win/Lose** conditions per mode (capture vs. hold-timer/waves), with an aftermath summary.

**Designed, stubbed for expansion (data present, deeper UI later):** full multi-mission campaign threading, the complete per-faction tech-tree UI, veteran permadeath ledger, and the Grand Coalition capstone. These are authored as data and hooks so they can be expanded without re-architecting.

---

## 11. FILE / CODE MAP

```
WW1-GAME/
├── index.html          # entry point: canvas + screen containers
├── css/style.css       # map-table UI theme, pixelated rendering
├── js/
│   ├── sprites.js      # indexed pixel-grid sprites + per-faction palettes + draw cache
│   ├── data.js         # FACTIONS, UNITS, CAMPAIGNS, EVENTS, VOICE_LINES, DIFFICULTY
│   ├── game.js         # game loop, entities, combat, AI, morale/supply/events
│   ├── ui.js           # screens (loading→menu→campaign→difficulty→battle→aftermath), HUD
│   └── main.js         # bootstrap & wiring
├── PLANNING.md         # Section 1 — full planning section
├── GAME_DESIGN.md      # Section 2 — this document
└── README.md
```

---

## 12. CONTROLS (prototype)

- **Click a unit card** (bottom deck) → spends resources → unit deploys at your HQ and moves up its lane.
- **Click a lane / drag** → set the active lane for spawns & the special ability target.
- **Order buttons (left rail):** Advance / Hold / Fall Back / Focus-Fire.
- **Engineer build menu:** dig/upgrade trench, lay wire, build MG nest/bunker.
- **Special Ability button (center):** fires the faction power when charged.
- **Spacebar:** tactical pause (disabled on IMPOSSIBLE DEMON).
- **1–7:** quick-select unit cards. **Esc:** pause menu.

---

*End of Section 2 — Game Design Document. The full background/planning is in `PLANNING.md`; the playable build is `index.html`.*
