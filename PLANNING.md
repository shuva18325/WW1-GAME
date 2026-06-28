# IRON & FAITH — *Command of the Central Powers*
## SECTION 1 — FULL PLANNING SECTION

> A WW1 campaign-style real-time strategy game in which the player is a **commander / general** of the **Central Powers** — the German Empire, Austria-Hungary, the Ottoman Empire, and the Kingdom of Bulgaria. You do not play a single soldier. You spawn, reinforce, position, supply, and lead pixel-art armies across the great fronts of the Great War.

---

## 1. CORE FANTASY — Commanding the Central Powers

The player is the **iron will behind the trench**. You are not the man with the rifle; you are the mind that decides where the rifles go, when the artillery falls, when the stormtroopers leap from the parapet, and when to spend the last of your manpower or hold it back for the next assault.

The fantasy is built on four pillars:

1. **The Encircled Coalition.** The Central Powers fought surrounded — blockaded by sea, pressed on every land border, perpetually short of everything except courage and clever engineering. The fantasy is *making less do more*: out-thinking richer enemies who can simply outproduce you.
2. **The Coalition of Opposites.** You command Prussian industrial precision in the morning and Ottoman religious fervour in the afternoon. Each faction *feels* alien to the others. Switching campaigns should feel like switching armies, not skins.
3. **The Architect of the Line.** Defence is not passive. You *build* the battlefield — trenches, bunkers, wire, machine-gun nests, listening posts — then dare the enemy to break it. The deepest satisfaction is watching a wave of attackers shatter against a line *you* designed.
4. **The Last Reserve.** Every great moment in the game is a decision about scarcity: commit the reserve or save it, spend the German Support call now or in the next crisis, order the retreat or the death-stand. The player should always feel one good decision away from victory and one bad decision away from collapse.

**Emotional arc of a session:** anxiety (the line is thin) → control (the trench holds) → triumph (the counter-attack lands) → dread (the tanks appear) → resolve (you adapt). The game is a machine for producing that arc over and over.

---

## 2. PIXEL-ART VISUAL IDENTITY

The art target is set by the three reference images supplied:

- **Reference 1 — the soldier sprite.** A tall, chunky-pixel infantryman: tan/khaki uniform, cloth-covered helmet, a high backpack/rucksack on the back, brown leather boots and belt with a brass buckle, neutral skin-tone face, holding a bolt-action rifle horizontally across the body. **This is the master template for ALL infantry**, re-coloured and re-accessorised per nationality.
- **Reference 2 — the battle scene.** Top-down/oblique trench battlefield: churned brown earth, a long horizontal trench/road line dividing the field, scattered rocks and shell craters, soldiers firing yellow muzzle-flash tracers, a national flag planted on the friendly side, a tank in no-man's-land, white smoke puffs. **This is the master template for ALL battle maps** except Gallipoli.
- **Reference 3 — the tank.** A British-style rhomboid heavy tank, olive-green hull, white/red recognition stripes on the nose, hull number "F5x", track mud at the bottom. **This is the master template for tanks**, re-shaped/re-coloured per nationality (German A7V is boxier, etc.).

### 2.1 Pixel-art rules (the "house style")

- **Resolution & scale.** Sprites authored on a small grid (infantry ≈ 16×24 px) and rendered at integer scale (×3–×4) with `image-rendering: pixelated` / nearest-neighbour. No sub-pixel smoothing, ever.
- **Palette discipline.** A limited, earthy master palette: trench browns, khaki tans, feldgrau grey-greens, gunmetal, leather, bone-white, ochre dust, with a few saturated accents (muzzle-flash yellow, blood red, flag colours).
- **Readable silhouettes.** Each unit type must be identifiable from its silhouette alone at gameplay zoom — helmet shape, weapon profile, and pack size do the talking before colour does.
- **Chunky outlines, soft shading.** 1px darker outline on the ground-contact and silhouette edges; 2–3 value steps of shading per material (no gradients).
- **Animation budget.** 2–4 frame cycles: idle breathe, walk (2-step), fire (recoil + muzzle flash), die (fall + corpse). Cheap, legible, period-feeling.
- **Mud is a character.** The ground is never clean. Craters, duckboards, sandbags, splinter-wood and barbed wire are part of the palette, matching Reference 2's churned field.

### 2.2 Per-nationality visual signatures

| Faction | Uniform tone | Headgear | Tells |
|---|---|---|---|
| **Germany** | Feldgrau (grey-green) | Stahlhelm (coal-scuttle helmet) | Stormtroopers carry stick grenades & MP18; cleanest, most uniform ranks |
| **Austria-Hungary** | Pike-grey / hecht-blau | Soft cap or Stahlhelm | Visibly *mixed* sprites — different faces/insignia to show many ethnicities |
| **Ottoman Empire** | Khaki/tan (the reference template) | **Kabalak** wrap, some **fez**, officers in fez | Lean kit, fewer pouches; camel mounts; green standard |
| **Bulgaria** | Brown-khaki | Soft field cap | Mountain kit, rope/picks; earth-toned, blends with rock |
| **British (enemy)** | Khaki-brown | **Brodie** soup-plate helmet | Aggressive postures, heavy on numbers, tanks |
| **French (enemy)** | Horizon-blue | **Adrian** helmet with crest | Bright against mud; tanks (FT & rhomboid) |
| **Arab Revolt (enemy)** | White/sand robes | Keffiyeh + agal | Fast camel raiders, light rifles, no helmets |

### 2.3 Special-case art notes

- **Ottoman irregularities are intentional.** Per the design brief, Ottoman troops should sometimes look under-equipped: a missing sock/puttee, a fez instead of a helmet, mismatched webbing. This *low-equipment* look is a feature, not a bug — it sells the "high morale, poor kit" fantasy.
- **Gallipoli is the exception map.** Instead of the brown trench field, Gallipoli is **beach + cliff**: ochre sand, blue Aegean water, British/French troops wading off landing boats, friendly Ottomans dug into the heights above. (Detailed in Section 2 of the design doc.)
- **Tanks scale the dread.** Enemy tanks are drawn larger and slower than the reference, with heavy track animation and a dust/mud wake, so their on-screen arrival reads as a *threat event*, not just another unit.

---

## 3. TONE, ATMOSPHERE & FACTION PERSONALITY

**Overall tone:** grim, weary, and proud — *defiance under siege*. Not jingoistic celebration of war; rather the stubborn camaraderie of men holding a line they did not choose. Mud, cold, hunger, and the strange gallows-humour of soldiers. Victories are bought, never given.

**Atmosphere delivered through:** a low, droning ambient score (distant shellfire, wind over wire, a lone harmonica in lulls); muddy, desaturated palettes pierced by the yellow of muzzle flashes; officer voice-lines that are clipped and human; and "quiet" beats between waves where the player hears the trench breathe.

**Faction personalities:**

- **Germany — the Machine.** Cold, competent, relentless. Voice is disciplined and clipped. The faction *believes in process*: build it right, supply it well, strike precisely. Its fear is the unknown — the first tanks.
- **Austria-Hungary — the Patchwork Empire.** Brave but brittle, sentimental, internally divided. Eleven languages in one trench. Voice swings between grand imperial pride and anxious morale. Magnificent guns, uncertain men.
- **Ottoman Empire — the Faith.** Out-gunned, out-supplied, never out-willed. Voice is fervent, communal, religious ("kardeşlerim" — my brothers). The empire fights for land, faith, and the Caliphate. Endures the unendurable.
- **Bulgaria — the Mountain.** Quiet, hard, patient. Voice is terse and grounded. Lets the terrain do the killing. The smallest ally with the sharpest defensive teeth.

---

## 4. CAMPAIGN STRUCTURE

The game is organised as a **front-select campaign hub** reached after the loading screen. Each campaign is a self-contained mini-arc of **3–6 battles (missions)** with rising stakes, threaded by a continuity meter (your reserves, veterans, and faction loyalty carry between missions in the same campaign).

**Campaign shell (every front):**
1. **Briefing** — historical framing card + commander's objective + special rules of this front.
2. **Deployment** — choose your starting line, pre-build defences, allocate starting reserves.
3. **Battle** — real-time tactical engagement (the core loop).
4. **Aftermath** — casualties tallied, veterans promoted, events resolved, loyalty/morale updated.
5. **Inter-mission** — spend earned points on tech/upgrades; read flavour events; the front's situation map updates.

**The eight fronts (campaigns):**
1. **Western Front — Germany** (1916 / 1917 / 1918 sub-arcs)
2. **Gallipoli — Ottoman Empire**
3. **Palestine Front — Ottoman Empire**
4. **Egyptian / Suez Front — Ottoman Empire**
5. **Caucasus & Eastern Europe — Ottomans + Austria-Hungary**
6. **Bulgarian Front (Macedonia/Salonika) — Bulgaria**
7. **Arab Revolt — *Enemy* campaign** (you play *against* the Central Powers, or defend Ottoman supply lines against the Revolt — see design doc)
8. **(Meta) Grand Coalition** — an optional capstone unlocked by clearing the others, stitching the fronts into one war.

**Campaign progression logic:** Western Front and Gallipoli are open from the start (one industrial front, one defensive front, to teach both halves of the game). Clearing missions unlocks adjacent fronts and difficulty tiers. The **Arab Revolt** unlocks after the Palestine/Egypt fronts, recontextualising the desert war from the other side.

---

## 5. DIFFICULTY TIERS

Two scales are used. The **Western Front** uses the full seven-rung "Demon ladder"; other fronts use the shorter three-rung ladder, with the Demon rungs unlocked as New Game+ modifiers.

**Western Front ladder (7 tiers):**
1. **Super Easy** — tutorialised, generous resources, timid enemy, no tank fear.
2. **Easy** — forgiving economy, slow enemy waves.
3. **Medium** — the intended baseline; honest economy, competent AI.
4. **Hard** — resource pressure, smarter target priority, earlier tanks.
5. **East Demon** — relentless eastern-style human-wave pressure + attrition.
6. **Medium Demon** — combined-arms enemy: tanks + artillery + gas, supply raids.
7. **IMPOSSIBLE DEMON** — perfect-information AI, brutal economy, permadeath veterans, no special-ability "mercy" cooldown reductions. A score/endurance challenge.

**Three-rung ladder (other fronts):** Easy → Medium → Hard.

**What scales across tiers (not just numbers):**
- Enemy spawn cadence & wave size.
- Enemy AI target priority (random → focus-fire → counter your composition).
- Your economy rate (supply/manpower/industry regen).
- Event severity & frequency (more desertion, more sabotage at higher tiers).
- Tank-fear radius and duration (Germany), morale-fracture chance (Austria), desertion rate (Ottoman), equipment scarcity (Bulgaria).
- Veteran permadeath (on at Demon tiers).

---

## 6. PLAYER PROGRESSION

Three intertwined progression layers:

1. **In-battle progression** (resets each mission): economy ramps, you unlock unit tiers as supply depots are captured/built, special-ability charges build up.
2. **Campaign progression** (persists within a front): **War Points** earned per mission spent on a per-faction **tech tree**; **veterans** (units that survive) gain ranks (Recruit → Regular → Veteran → Elite → Legendary) with stat and ability bonuses; **faction loyalty/morale meters** carry forward.
3. **Meta progression** (persists across the whole game): unlocked fronts, unlocked difficulty tiers, unlocked **Commander Traits** (passive global perks chosen at profile level, e.g. "Quartermaster" +10% supply, "Iron Discipline" −20% rout chance), cosmetic banners, and a **Codex** that fills in as you encounter units/events/history.

**Veteran system detail:** named squads can be promoted; a Legendary squad has a unique pixel banner and a bespoke voice-line set. Losing a Legendary squad on a Demon tier is a permanent, felt loss.

---

## 7. TECHNOLOGY TREES

Each faction has its own tech tree, themed to its identity. Tech is bought with War Points between missions and (for some nodes) requires a prerequisite mission cleared. Trees are split into four branches: **Doctrine, Engineering, Firepower, Logistics**.

### 7.1 Germany — "Industrial Doctrine"
- **Doctrine:** Stormtrooper Tactics → Infiltration Assault → Combined Arms → Hutier Tactics (capstone: free creeping-barrage before each assault).
- **Engineering:** Reinforced Trenches → Concrete Bunkers → Deep Dugouts → Flammenwerfer Pioneers.
- **Firepower:** Heavy Howitzers → Gas Shells → Railway Guns → **A7V Tank Program** (removes the early tank-fear debuff entirely).
- **Logistics:** Standardised Production → Rapid Reinforcement → Forward Depots → Total War Economy (industry surge ability recharges faster).

### 7.2 Austria-Hungary — "Imperial Artillery"
- **Doctrine:** Mixed-Brigade Drill → Common Tongue (reduces morale-fracture) → Imperial Resolve.
- **Engineering:** Mountain Fortifications → Skoda Emplacements.
- **Firepower:** Skoda 305mm → 420mm Siege Mortar → Coordinated Barrage (capstone: empire-wide artillery cooldown cut).
- **Logistics:** Danube Supply → Multi-ethnic Quartermasters.

### 7.3 Ottoman Empire — "Faith & Endurance"
- **Doctrine:** Friday Sermon (morale aura) → Caliphate Call (defection chance up) → Martyr's Resolve (units fight at low HP without routing).
- **Engineering:** Cliff Redoubts → Hidden Galleries → Cistern Network (desert supply).
- **Firepower:** German Krupp Guns → Machine-Gun Detachments → Mountain Mortars.
- **Logistics:** Camel Caravans → Oasis Mapping → German Advisor Mission (capstone: improves the German Support summon).

### 7.4 Bulgaria — "Mountain Wall"
- **Doctrine:** Ambush Drill → Patient Defence → Counter-Charge.
- **Engineering:** Rock Sangars → Tunnel Networks → Pre-sited Killzones.
- **Firepower:** Captured Artillery → Mountain Guns.
- **Logistics:** Mule Trains → Local Foraging (capstone: no supply penalty in mountains).

---

## 8. TROOP VARIETY (Overview — full roster in design doc §3)

Troops are organised into roles so that every faction reads the same tactically even when the sprites differ:

- **Line Infantry** — the backbone; cheap, holds trenches.
- **Elite/Assault** — stormtroopers, elite infantry, grenadiers, counter-attack specialists.
- **Mobile** — armoured cars, camel infantry/cavalry, desert scouts, raiders.
- **Support Weapons** — machine-gun teams, mortar teams, heavy artillery, anti-tank guns.
- **Engineers** — build/upgrade trenches, bunkers, wire; clear obstacles; repair.
- **Special/Faction-unique** — flamethrower pioneers, mountain infantry, ambushers, saboteurs, camel raiders.

Variety axes: range, rate of fire, armour value, morale value, mobility, supply cost, build/abilities. No two faction rosters share the same *shape* — Germany leans elite+armour, Ottomans lean morale+mobility, Austria leans artillery, Bulgaria leans defensive+ambush.

---

## 9. MAP DESIGN

Maps are **side-scrolling/oblique tactical battlefields** built on a shared grid of **lanes × depth**:

- **Friendly edge** (left): spawn/HQ, supply depot, reinforcement road.
- **Your trench line(s):** primary fire positions; can be upgraded by engineers.
- **No-man's-land** (centre): craters, wire, mud, cover nodes; the killing ground.
- **Enemy trench line(s) / objectives** (right): what you capture (offence) or what spawns the enemy (defence).

**Terrain archetypes (one per front family):**
- **Western trench mud** (Reference 2): flat, cratered, wire-heavy; armour-friendly lanes.
- **Gallipoli beach + cliff:** vertical map; enemy lands by boat below, you hold the heights; naval bombardment from off-screen sea.
- **Palestine/Egypt desert:** open, fast, sparse cover; oases as supply nodes; heat zones.
- **Caucasus/Eastern winter mountains:** snow trenches, ridgelines, narrow passes, avalanche-prone slopes; cold attrition.
- **Bulgarian mountains:** rocky, vertical, ambush nooks, chokepoints; defender's paradise.

**Map modifiers** sit on top of terrain: weather (rain→mud, snow→cold, sandstorm→blind), time of day, and front-specific hazards (naval shells, gas drift, avalanches, sandstorms).

---

## 10. UI CONCEPTS

Design principle: **a commander's map, not a soldier's HUD.** Clean, diegetic, period-flavoured (map-table aesthetic — wood, brass, paper, grease-pencil).

- **Top bar — Resources:** Manpower, Supply, Industry/Production, plus front-specific meters (Caliphate Loyalty, Ethnic Cohesion, Heat, Cold).
- **Bottom bar — Command Deck:** unit-spawn cards (cost + cooldown), engineer build menu, and the faction **Special Ability** button (big, central, with charge meter).
- **Left rail — Order modes:** Advance / Hold / Fall Back / Focus-Fire toggle; affects selected units or whole lanes.
- **Right rail — Intel:** wave timer, enemy composition readout, objective progress, active events.
- **Battlefield overlays:** lane health, trench integrity, supply range rings, tank-fear radius (red haze), ambush-ready glints.
- **Voice-line ticker:** officer/commander quotes pop as speech bubbles over the relevant unit *and* log to a side panel (so they're never missed).
- **Pause & assess:** a tactical pause that dims the field and lets you queue orders (off at IMPOSSIBLE DEMON).

Accessibility: colour-blind-safe lane markers, scalable UI, full subtitle log for all voice lines, remappable hotkeys, optional slowed game-speed.

---

## 11. COMMANDER DIALOGUE FLAVOR

Voice-lines are **short, human, period-flavoured, and faction-specific**, surfacing at three moments: **on-spawn**, **on-event**, and **on-crisis** (low morale, tanks, breakthrough). All lines are in English with the faction's cultural flavour; native words are sprinkled for colour (German *Jawohl*, Turkish *kardeşlerim/ileri*, etc.).

**Germany (clipped, disciplined):**
- "Hold the line! Armor incoming!"
- "Stormtroopers, advance!"
- "Engineers, reinforce the trench!"
- "For the Empire!"
- "We stand firm!"

**Ottoman (fervent, communal):**
- "Brothers, stand firm! This land is ours!"
- "For the Caliphate! Hold the cliffs!"
- "Allah's strength is with us!"
- "Sultan's banner flies above us!"
- "Stay together, kardeşlerim!"
- "Desert winds won't break us!"
- "For the Caliphate, ileri!"
- "Camels ready, commander!"

**British colonial Muslim troops (defection event):**
- "I cannot fight my brothers… I'm switching sides."
- "My heart belongs with the Caliphate."

**German advisor (on Ottoman fronts):**
- "Ottoman troops show impressive resolve."
- "Reinforcements arriving soon."

**Austria-Hungary (imperial, anxious-proud):**
- "Artillery ready, commander!"
- "Hold the ridge!"
- "Our men stand united today."

**Bulgaria (terse, grounded):**
- "Mountains protect us — hold your ground!"
- "Ambush ready!"
- "For Bulgaria!"

**Arab Revolt (raiders, sparse & sharp):**
- "Strike fast, vanish faster."
- "Cut their supply lines!"
- "The desert hides us."

---

## 12. HISTORICAL INSPIRATIONS

- **Western Front:** the Somme (1916), Verdun, Cambrai (1917, first mass tank attack — the source of "tank fear"), the Spring/Kaiserschlacht Offensive (1918, peak of stormtrooper *Hutier* infiltration tactics), Hundred Days.
- **Gallipoli (1915):** the Allied landings at Cape Helles & ANZAC Cove, naval bombardment by the Royal Navy, Ottoman defence of the heights (Chunuk Bair, the 57th Regiment's stand), Mustafa Kemal's leadership.
- **Palestine:** Gaza battles, Beersheba, Megiddo; the Yıldırım Army Group; German advisors (von Sanders, von Kressenstein).
- **Egypt/Suez:** the Ottoman raids on the Suez Canal (1915–16), British colonial defence.
- **Caucasus:** Sarıkamış (1914–15, catastrophic winter attrition), Erzurum; the Eastern Front's Brusilov Offensive against Austria-Hungary.
- **Bulgaria:** the Macedonian/Salonika front, Doiran (a Bulgarian defensive masterpiece in mountainous terrain).
- **Arab Revolt (1916–18):** Hejaz railway sabotage, camel-borne raids, T.E. Lawrence & Faisal, Aqaba, guerrilla hit-and-run across the desert.

Tone & restraint: the game dramatises tactics and soldiers' experience. It treats the historical hardships (and the human cost on all sides) with seriousness, and avoids endorsing the politics or atrocities of any belligerent.

---

## 13. WHAT MAKES EACH CAMPAIGN UNIQUE

- **Western Front:** the only fully **industrial, mixed offence/defence** front. Fast production, trench engineering, and the signature **tank-fear** arc — you begin terrified of armour and end by fielding your own A7V. Seven-tier Demon ladder.
- **Gallipoli:** **pure defence** on a vertical beach-and-cliff map. Survive **naval bombardment**, hold the heights, and win hearts: **colonial Muslim troops can defect** to you. Highest religious-morale payoff.
- **Palestine:** **desert mobility** war — camels, oases, **heat exhaustion**, German advisors, and wild **morale swings**. Supply is the real enemy.
- **Egypt/Suez:** **defensive scarcity** — the Suez Canal events, brittle supply, and morale that lives or dies on **religious speeches**.
- **Caucasus/Eastern:** **two factions at once** (Ottoman + Austria-Hungary), **winter attrition**, snow trenches, Russian human waves, and **artillery dominance** as the great equaliser.
- **Bulgaria:** **defensive mountain mastery** — ambushes, chokepoints, terrain bonuses that turn a small, poorly-equipped force into an immovable wall.
- **Arab Revolt:** the **inversion** campaign — fast, fragile **guerrilla offence**: ambush, sabotage, hit-and-run, and striking enemy supply lines, with no trenches to hide behind.

---

## 14. WHAT MAKES EACH FACTION UNIQUE (summary; full buffs/debuffs in design doc §4–5)

- **Germany:** industry & engineering supremacy, elite stormtroopers, eventual tanks; haunted early by tank-fear; expensive supply.
- **Austria-Hungary:** the best artillery and solid defensive lines, but a **multi-ethnic morale instability** that can crack a winning battle.
- **Ottoman Empire:** unmatched morale, religious motivation, strong defence, and camel mobility; crippled by low industry, slow tech, and desertion.
- **Bulgaria:** terrain-warfare and ambush specialists with brutal defensive multipliers in the mountains; chronically under-equipped in the open.

Each faction also has a unique **Special Ability** (German Industrial Surge, Austrian Artillery Barrage, Ottoman German-Support summon, Bulgarian Mountain Hold) that encodes its identity into a single button.

---

## 15. 20+ CORE MECHANICS

1. **Commander spawning** — you place/reinforce units from a command deck; you never directly control a single soldier.
2. **Resource triad** — Manpower (bodies), Supply (ammo/food/fuel), Industry/Production (build & reinforce speed).
3. **Lane & depth grid** — battlefield divided into lanes and depth bands for positioning and orders.
4. **Order modes** — Advance / Hold / Fall Back / Focus-Fire per unit or per lane.
5. **Morale system** — every unit has morale; it drops under fire, near death, near routing friends, and near tanks; at zero, units **rout**.
6. **Desertion** — distinct from rout: under sustained low morale/supply, units may permanently leave (Ottoman/Austria especially).
7. **Supply lines** — units far from depots/roads regenerate ammo slowly and suffer combat penalties; cutting/holding supply is strategic.
8. **Engineering & trench building** — engineers dig, upgrade (sandbag→reinforced→concrete), and add bunkers, wire, MG nests, dugouts.
9. **Trench integrity** — trenches have HP/level; artillery and tanks degrade them; deeper trenches resist bombardment and grant cover.
10. **Cover & terrain modifiers** — craters, rocks, wire, high ground modify accuracy, defence, and movement.
11. **Artillery & creeping barrage** — off-map and on-map guns suppress, kill, and break trenches; creeping barrages screen advances.
12. **Naval bombardment** — front-specific (Gallipoli/Egypt): off-screen shells fall on coastal lanes on a telegraphed timer.
13. **Tank system** — slow armoured breakthrough units; nearly immune to rifles; countered by AT guns, artillery, mines, and (Germany) overcome via tech.
14. **Tank-fear mechanic** — friendly units near an enemy tank lose morale/accuracy until the faction researches its counter (signature German arc).
15. **Gas warfare** — chlorine/mustard drifts with wind, denies trenches, demands masks (an engineering/tech unlock).
16. **Weather & time-of-day** — rain (mud, slows movement), snow (cold attrition), sandstorm (blinds ranged), night (stealth, ambush bonus).
17. **Reinforcement waves** — timed reinforcement convoys arrive on the road; defending/escorting them is a recurring beat.
18. **Faction special ability** — one signature, charge-based power per faction (see §5 of design doc).
19. **Religious morale boosts** — Ottoman speeches/sermons restore morale and can trigger Caliphate-loyalty events.
20. **Caliphate loyalty meter** — Ottoman-only resource gating defection events and Martyr's Resolve.
21. **Ethnic cohesion meter** — Austria-only; low cohesion raises morale-fracture and friendly-fire/refusal events.
22. **Heat & cold attrition** — desert heat and mountain cold drain HP/morale over time off-supply.
23. **Ambush mechanic** — units in cover/concealment (Bulgaria, Arab Revolt) gain a first-strike burst and stay hidden until they fire.
24. **Sabotage & supply-line attacks** — raiders (Arab Revolt) destroy depots, rails, and reinforcement convoys.
25. **Veteran promotion & permadeath** — surviving units rank up; on Demon tiers, death is permanent.
26. **Fear/dread radius** — certain enemies (tanks, flamethrowers) project a morale-debuff aura.
27. **Capture & hold objectives** — offence captures trenches/points; defence holds them for a timer or against waves.
28. **Tactical pause & order queue** — assess and queue orders (disabled at top difficulty).

---

## 16. 20+ EVENTS

In-battle and inter-mission events that fire on triggers (timers, meters, casualties, RNG scaled by difficulty):

1. **Naval Bombardment Incoming** (Gallipoli/Egypt) — coastal lanes shelled on a countdown.
2. **Colonial Muslim Defection** — enemy colonial troops cross to the Ottoman side ("I cannot fight my brothers…").
3. **Caliphate Call** — empire-wide Ottoman morale surge + temporary defection chance.
4. **Friday Sermon** — scheduled Ottoman morale restore.
5. **Ethnic Mutiny** (Austria) — a mixed unit refuses orders / threatens to break.
6. **The Tanks Appear** — first enemy armour rolls in; triggers tank-fear, dramatic camera.
7. **Gas Attack** — wind-borne gas cloud drifts across lanes.
8. **Sandstorm** (desert) — ranged accuracy collapses; melee/ambush favoured.
9. **Blizzard / Cold Snap** (Caucasus/mountains) — cold attrition spikes; supply slows.
10. **Avalanche** (mountains) — terrain hazard buries a lane (friend or foe).
11. **Supply Convoy Arriving** — reinforcement wave on the road; protect it.
12. **Supply Line Cut** (Arab Revolt) — a depot/rail is sabotaged; production penalty.
13. **Hejaz Railway Raid** — scripted Arab Revolt sabotage set-piece.
14. **German Advisor Arrives** — temporary buff + advisor voice-lines on Ottoman fronts.
15. **German Support Granted** — Ottoman summon delivers a tank + stormtroopers.
16. **Industrial Surge Unlocked** (Germany) — production spikes; free stormtrooper squad.
17. **Artillery Barrage Ready** (Austria) — heavy strike charged.
18. **Mountain Hold Triggered** (Bulgaria) — defensive lockdown + ambush activation.
19. **Mass Assault / Human Wave** (Eastern/Demon) — oversized enemy push.
20. **Trench Collapse** — bombardment caves a section; integrity emergency.
21. **Desertion Wave** — low-supply units begin to slip away.
22. **Heroic Last Stand** — a surrounded squad fights to legendary status (veteran payoff).
23. **Christmas / Bayram Truce** (flavour) — brief lull, morale restore, optional.
24. **Sniper Duel** (flavour) — a counter-sniper micro-event in a quiet lane.
25. **POW Surrender** — broken enemy units surrender, granting manpower/intel.
26. **Officer Killed** — losing an officer sprite drops a lane's morale (protect them).

---

## 17. 20+ UNIT IDEAS (cross-faction; full per-faction roster in design doc §3)

1. German **Stormtrooper** (assault, grenades + SMG, infiltration).
2. German **Machine-Gun Squad** (suppressive, lane-locking).
3. German **Armored Car** (fast, light armour, anti-infantry).
4. German **Heavy Artillery** (off-line bombardment).
5. German **Grenadier** (close-assault, anti-trench).
6. German **Elite Trench Infantry** (durable line holder).
7. German **Engineer/Pioneer** (build/upgrade, flamethrower at tech).
8. German **A7V Tank** (late-war breakthrough; ends tank-fear).
9. Ottoman **Camel Infantry** (mobile desert line).
10. Ottoman **Regular Infantry** (cheap, high morale, low kit).
11. Ottoman **Elite Infantry** (the "57th"-style die-in-place defenders).
12. Ottoman **Desert Scout** (recon, fast, spotting/ambush detection).
13. Ottoman **Machine-Gun Detachment** (cliff/redoubt defence).
14. Ottoman **Mortar Team** (indirect, plunging fire onto beaches/trenches).
15. Ottoman **Engineer** (cliff redoubts, cisterns).
16. Austria-Hungary **Heavy Artillery** (Skoda guns — best in game).
17. Austria-Hungary **Mixed-Ethnic Infantry** (numerous, morale-variable).
18. Austria-Hungary **Mountain Infantry (Kaiserjäger)** (alpine specialists).
19. Austria-Hungary **Engineer** (mountain forts, emplacements).
20. Bulgaria **Mountain Infantry** (terrain-bonus line).
21. Bulgaria **Ambusher** (concealed first-strike).
22. Bulgaria **Defensive Riflemen** (entrenched sharpshooters).
23. Bulgaria **Engineer** (sangars, killzones).
24. Arab Revolt **Camel Raider** (fast hit-and-run cavalry).
25. Arab Revolt **Desert Ambusher** (concealment, first strike).
26. Arab Revolt **Saboteur** (destroys depots/rails).
27. Arab Revolt **Light Rifleman** (cheap, mobile, fragile).
28. Enemy **British/French Line Infantry**, **Rhomboid/FT Tanks**, **ANZAC assault**, **colonial troops** (defection-eligible).

---

## 18. DEFENSIVE & OFFENSIVE SYSTEMS

**Defensive systems:**
- **Trench tiers:** open ditch → sandbagged → reinforced → concrete bunker; each raises cover, HP, and bombardment resistance.
- **Obstacles:** barbed wire (slows/stops infantry in the open), mines (anti-tank), tank-traps/dragon's-teeth.
- **Static weapons:** MG nests (lane-locking cones of fire), AT guns (the rifle-proof tank answer), pre-sited mortars.
- **Redoubts & sangars:** Ottoman cliff redoubts and Bulgarian rock sangars give terrain-multiplied defence.
- **Hold mechanics:** Defence missions = survive a timer / N waves; the **Mountain Hold** and **Caliphate Call** abilities exist to win these moments.

**Offensive systems:**
- **Creeping barrage:** artillery walks ahead of your advance, suppressing the enemy trench while infantry crosses no-man's-land.
- **Infiltration assault:** stormtroopers bypass strongpoints, hit depth targets, and unhinge a line (Hutier tactics).
- **Combined arms:** armour leads, infantry follows and holds, engineers consolidate captured trench.
- **Capture & consolidate:** taking a trench is half the job; engineers must reverse-face it before the counter-attack.
- **Tempo & reserves:** offence is about committing reserves at the decisive moment — and not before.

---

## 19. MORALE, DESERTION, SUPPLY, ENGINEERING, TRENCHES, TANKS, ARTILLERY, NAVAL SUPPORT

- **Morale:** a per-unit 0–100 stat. Raised by victories, officers, religious speeches, abilities, holding trenches. Lowered by casualties, suppression, isolation, tanks/flamethrowers, low supply. At 0 → **rout** (flee toward HQ; may rally) → sustained → **desertion** (gone).
- **Desertion:** a slow, attritional drain distinct from rout. Driven by low supply + low morale + faction trait. Ottoman and Austria-Hungary are most vulnerable; Ottoman religious mechanics are the primary counter.
- **Supply:** depots + roads project a supply radius. In-radius units regen ammo/health/morale; out-of-radius units degrade and fight worse. Supply is consumed by abilities, artillery, and sustained fire. Desert/winter accelerate consumption (heat/cold).
- **Engineering:** engineers are the build class — dig/upgrade trenches, lay/clear wire and mines, erect MG nests and bunkers, repair, and (at tech) wield flamethrowers. The backbone of the defensive fantasy.
- **Trenches:** the central terrain object — levelled, damageable, capturable, reversible. The map's defensive spine.
- **Tanks:** slow, armoured, terrifying. Rifle-immune; killed by AT guns, artillery, mines, and (Germany) matched by your own armour. Project **tank-fear**. The enemy's late-war trump and your hardest puzzle.
- **Artillery:** the great equaliser, especially for Austria-Hungary. On-map batteries and off-map fire missions: suppress, kill, and break trenches; creeping barrages enable offence.
- **Naval support:** front-specific (Gallipoli/Egypt). Enemy battleships shell coastal lanes on telegraphed timers — an environmental threat you survive and work around (you generally cannot reach the ships).

---

## 20. OTTOMAN-SPECIFIC MECHANICS

- **Low equipment, high morale:** Ottoman units are cheap and under-kitted (lower armour/firepower, visibly mismatched sprites — fez, missing puttee) but carry the highest base morale and the best morale-recovery.
- **Desertion risk:** when supply collapses, Ottoman line units desert faster than any faction — unless morale is propped up.
- **Camel units:** camel infantry/cavalry — fast desert mobility, strong on open sand, weak in tight trench fighting.
- **Religious motivation:** **Friday Sermon** and commander speeches restore morale across the line; **Martyr's Resolve** tech lets low-HP units keep fighting without routing.
- **Caliphate loyalty:** a meter fuelled by speeches and victories; high loyalty unlocks **defection events** (colonial Muslim troops switch sides) and powers the special ability.
- **German Support summon:** the Ottoman special ability — calls in **1 German tank + 3 elite stormtroopers** and an instant morale boost (cooldown), embodying the alliance and patching the equipment gap.

---

## 21. GERMAN-SPECIFIC MECHANICS

- **Industry:** highest production rate — fastest reinforcement and unit spawning; the Industrial Surge ability spikes it further.
- **Engineering:** best trench upgrades (concrete bunkers, deep dugouts) and the only flamethrower pioneers; defences cost less and build faster.
- **Discipline:** lowest base rout chance and fastest rally; German lines bend before they break.
- **Fear of tanks (early war):** until the **A7V Tank Program** tech, German units suffer the tank-fear morale/accuracy debuff near enemy armour — the signature early-campaign weakness and progression hook.
- **Stormtroopers:** elite infiltration assault troops (grenades + SMG) that bypass strongpoints and hit depth — the offensive identity of the faction.
- **High supply cost:** the cost of quality — German units and abilities consume more supply, so logistics discipline matters.

---

## 22. AUSTRIA-HUNGARY-SPECIFIC MECHANICS

- **Multi-ethnic army:** infantry is drawn from many nationalities (visibly varied sprites); cheap and numerous but **morale-unstable**.
- **Ethnic cohesion meter:** low cohesion raises the chance of **morale fracture** and **ethnic mutiny** events (units refuse orders or break); the Doctrine tree ("Common Tongue", "Imperial Resolve") stabilises it.
- **Artillery strength:** the best gun park in the game (Skoda 305/420mm) — the Austrian answer to everything is overwhelming firepower.
- **Defensive lines:** solid mountain fortifications and emplacements; strong on the defence when the guns are sited.
- **Artillery Barrage special:** the faction ability — a heavy artillery strike + morale boost + enemy suppression.

---

## 23. BULGARIAN-SPECIFIC MECHANICS

- **Mountain warfare:** large defensive and movement bonuses in mountainous terrain; the faction is built to fight *uphill defenders win*.
- **Defensive bonuses:** entrenched Bulgarian units gain outsized cover/HP multipliers; the **Mountain Hold** ability stacks a massive defensive buff + damage reduction.
- **Ambush mechanics:** ambushers and pre-sited killzones deliver concealed first-strike bursts at chokepoints.
- **Harsh terrain mastery:** no movement/supply penalty in mountains (with tech); the enemy, however, is slowed and funnelled.
- **Limited equipment:** poor firepower/armour and weak in the open — Bulgaria must fight on its own ground to win.

---

## 24. GERMANY DEEP-DIVE (Western Front signature)

(Cross-reference design doc §1, §2-Western, §4, §5.)
- **Identity:** the industrial machine — build, supply, strike precisely; only faction with the full 7-tier Demon ladder; the only faction whose campaign arc is *defined* by overcoming tank-fear and then fielding its own armour.
- **Loop:** dig and reinforce → weather French/British assaults and tanks → research → counter-attack with stormtroopers under a creeping barrage → capture and consolidate.

---

## 25. ARAB REVOLT MECHANICS (enemy / inversion campaign)

- **Guerrilla warfare:** no trenches, no holding ground — you fight by **appearing and vanishing**.
- **Ambushes & hit-and-run:** concealed first strikes, then withdraw before the counter lands.
- **Desert mobility:** camel raiders move fast across open sand, outrunning slow Ottoman line units.
- **Sabotage events:** destroy the **Hejaz railway**, depots, and reinforcement convoys to cripple Ottoman supply.
- **Supply-line attacks:** the win condition is often *starving* the enemy, not killing them.
- **Ottoman morale penalties:** successful raids inflict morale/desertion penalties on the Ottoman side — the same Ottoman strengths you mastered elsewhere are now the wall you erode.

---

## 26. PRODUCTION & SCOPE NOTES (planning realism)

- **Engine target:** browser-native HTML5 Canvas + vanilla JS (no install, runs from `index.html`), so the prototype is instantly playable and the pixel-art renderer is fully under our control.
- **Sprite pipeline:** sprites authored as indexed pixel grids + per-faction palettes, drawn procedurally and cached to offscreen canvases — faithful to the reference art and trivially re-coloured per nationality.
- **Vertical slice priority:** ship the Western Front (offence/defence mix, tank-fear arc) and Gallipoli (pure defence, defection, naval bombardment) first — together they exercise every core system; other fronts reuse the same systems with new palettes, units, and event tables.
- **Content scalability:** factions, units, campaigns, and events are all **data-driven tables**, so adding a front is authoring data, not code.

---

---

## 27. ADDENDUM — AESTHETIC, AUDIO & SYSTEMS UPGRADE PACK (v2)

This addendum extends the visual, audio, and gameplay sections above with the upgrade pass now implemented in the build.

### 27.1 Aesthetic & visual upgrades (extends §2)
- **Higher shading depth & dynamic shadows.** Every unit now casts a soft ground shadow; sprites carry extra value steps.
- **Animated idle poses.** Units "breathe" on a subtle 1px bob when idle; walk/fire/reload/command poses are distinct.
- **Per-weapon muzzle flashes + onomatopoeia popups** floating over the firer:
  - Rifle → "bang bang", sharp short flash.
  - Machine gun → "BRRRRT BRRRRT", rapid flashes + **barrel heat glow**.
  - Artillery → "BAAANG!" (siege: "BA-BOOOM!"), big smoke + spark burst.
  - Tank cannon → "KRAA-THOOM!", large flash + screen shake + light flash.
- **Flamethrower unit (Germany)** with animated **flame particles, smoke trails, and a burning damage-over-time** effect on victims.
- **Tank treads animated** (shifting track links), **dust clouds when moving**, and **sparks when rounds ricochet off armour**.
- **Upgraded explosions:** shockwave **rings**, **debris** particles, **smoke**, ground **scorch decals**, and **screen shake**.
- **Weather animations:** rain (streaks + darkening), fog (drifting bands), sandstorm (driven sand), snow/blizzard (falling flakes), gas (green haze).
- **Dynamic lighting** during artillery barrages and naval bombardments (lingering battlefield glow + flash tint).
- **Officer units** with **capes, medals, and a raised-arm command gesture** when calling a fire mission.
- **Steel bunkers** (riveted armoured pillboxes with embrasure slits + sandbag skirts) on Gallipoli & coastal fronts; **off-shore warship silhouettes** that flash when the fleet fires.
- **Waving animated flags** for each faction.

### 27.2 Sound design upgrades (new audio section)
All audio is **synthesized at runtime via the Web Audio API** (no external assets), so it ships in a single static page. Voice acting is **specced** (English lines flavoured by each faction's accent/culture) and represented in-engine by on-screen officer shouts + synth stingers; real recorded VO is the natural next content drop.
- **Weapon sounds:** rifles = sharp cracks · MGs = rattling bursts · artillery = deep concussive booms · flamethrower = roaring jet · tanks = engine rumble + metallic clanks + cannon boom.
- **Environmental ambience** per theme: trench wind, desert wind, mountain/sea air (filtered-noise wind beds with slow LFO swell).
- **Tank engine rumble** loops while armour is on the field.
- **Officer shouts** on ability activation and fire missions.
- **Faction culture cues** (designed): Ottoman morale chants (respectful, historical Caliphate-era tone), German stormtrooper battle cries, Bulgarian mountain echoes, Austro-Hungarian artillery commands.
- **March music loop** (drums + horn motif) on menu/intro/battle, with a **mute toggle** (🔊/🔇, hotkey **M**).

### 27.3 Gameplay upgrades (extends §15)
- **Deployable Officer system:** officers project a **morale aura**, call a **mini-barrage** on cooldown, and **call reinforcements** on deploy (faction-specific basic troops).
- **Naval Attack system (coastal fronts):** the fleet shells the shore on telegraphed timers with **massive shockwaves + screen shake**; the player builds **shore batteries / steel bunkers** that intercept a share of incoming fire and anchor the line; **amphibious landings** drop enemy troops directly on the beach.
- **Pixel-art Artillery Control mode (T):** enter aim mode, move the mouse to place fire, see a **trajectory arc + impact-radius preview**, click to fire, governed by a **cooldown**.
- **Frozen-equipment** (winter): rate of fire halved while the cold snap lasts.

### 27.4 New campaigns (extends §4)
- **Caucasus Winter Offensive** — Ottomans vs Russians; snow trenches, frozen equipment, blizzards, mountain warfare, human waves.
- **Eastern Balkans Push** — Bulgaria + Germany vs Serbia & Romania; mountain passes, river crossings, ambush, offence.
- **Arabian Desert Storm** — Ottomans defending vs the Arab Revolt; guerrilla ambushes, camel raids, supply sabotage, heat exhaustion.
- **Black Sea Naval Clash** — Ottoman coast vs the Russian fleet; coastal artillery, ship bombardments, amphibious landings.

### 27.5 New units (extends §17)
- **Germany:** Flamethrower · Heavy Stormtrooper · Panzerwagen · MG-08 Heavy MG · Trench Shotgun · Officer.
- **Ottoman:** Desert Riflemen (elite) · Camel MG Platform · Heavy Mortar · Officer (morale aura) · Desert Raider Cavalry.
- **Austria-Hungary:** Siege Artillery · Mountain Sharpshooter · Mixed Battalion (morale variance) · Officer.
- **Bulgaria:** Mountain Grenadier · Forest Ambusher · Defensive Bunker Engineer · Officer.
- **Arab Revolt:** Saboteur Demolition Team · Camel Raider Elite · Desert Sniper · Hit-and-Run Cavalry.

### 27.6 Special-effects & animation checklist (implemented)
Rifle recoil · MG barrel heat glow · animated tank treads · flamethrower flame physics · artillery smoke trails · shell-impact craters/scorch · animated faction flags · officer command gesture · idle breathing · unit shadows · ricochet sparks · burning units.

### 27.7 Epic intro & starting menu (new)
- **Opening cinematic:** a pixel-art map of Europe **zooms in**, the **Central Powers flags rise**, drums sound, and the voiceover reads **"The world is at war. Command your empire. Shape history."** (skippable).
- **Animated main menu:** parallax background of trenches, mountains and horizon muzzle-flashes; the four leaders fade in; march music plays.

### 27.8 Final polish (new)
Metallic WW1 UI frame styling · faction-coloured menu accents · animated campaign/aftermath transitions · **victory & defeat cutscenes** with faction-flavoured summaries · **pixel-art achievement medals** · difficulty-scaled economy & enemy AI · epic end-of-campaign stat summaries.

*End of Section 1 — Full Planning Section. Section 2 (the game design document) follows in `GAME_DESIGN.md`, and the playable prototype lives in `index.html` + `js/`.*
