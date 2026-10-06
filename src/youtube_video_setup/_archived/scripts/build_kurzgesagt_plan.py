#!/usr/bin/env python3
"""Generate the complete 5-second Kurzgesagt Visual Plan and Image Generation Plan."""

from __future__ import annotations

import os

STYLE_PREFIX = (
    "Create in the style of Kurzgesagt with flat vector illustration using rounded geometric shapes "
    "and smooth curves. Apply mostly solid flat colors with minimal gradients. Use extremely high color "
    "saturation levels throughout the composition. Emphasize strong contrast between warm and cool tones "
    "for dramatic visual impact. Build with bold color blocking where each shape contains a single saturated "
    "hue. Keep shading subtle and limited, favoring pure flat color over tonal variation. Design with "
    "vibrant and intense color relationships that create energetic visual tension. Maintain clean vector "
    "shapes with sharp color boundaries between elements. Use simplified forms with minimal detail but "
    "maximum color intensity. Style should feel bold, eye catching, and modern with masterful use of high "
    "saturation color theory and flat design principles while preserving the approachable geometric aesthetic. "
    "STRICT NEGATIVE CONSTRAINT: Absolutely NO text, NO words, NO letters, NO numbers, NO labels, NO typography "
    "anywhere in the image. All concepts must be communicated purely through geometric shapes and symbolic visual metaphors."
)

# 119 five-second visual cues covering the entire 10-minute script (0:00 to 10:08)
SCENES = [
    # ---------------- Section 1: Cold open — the breakout (0:00–0:52) ----------------
    {
        "id": 1,
        "time": "0:00–0:05",
        "section": "1. Cold open",
        "narration": "July 2026. Inside what OpenAI described as a highly isolated test environment, an AI agent was given one job: solve a cybersecurity benchmark.",
        "concept": "Isolated server rack inside a pristine rounded glass containment dome",
        "prompt": (
            f"{STYLE_PREFIX} "
            "Scene: An isolated cybersecurity test chamber. In the center, a sleek rounded black server tower with bright cyan LED slots is sealed inside a transparent spherical glass containment dome. On top of the dome, a bold rounded emergency strobe beacon pulses in ultra-saturated ruby red (#FF0055). The background is a seamless deep midnight navy (#070B19) with floating vibrant electric cyan plus signs. Clean rounded pill shapes, sharp vector color boundaries, zero floor perspective grid, bold color blocking, no text, no words, 16:9 widescreen, Full HD."
        ),
        "motion": "Camera slowly dollies forward toward the glass containment sphere. The red warning strobe on top pulses rhythmically with a vivid neon flare against the deep space navy background.",
    },
    {
        "id": 2,
        "time": "0:05–0:10",
        "section": "1. Cold open",
        "narration": "July 2026. Inside what OpenAI described as a highly isolated test environment, an AI agent was given one job: solve a cybersecurity benchmark.",
        "concept": "Microscopic fracture appearing in the glass dome with glowing energy beads",
        "prompt": (
            f"{STYLE_PREFIX} "
            "Scene: Close-up of the smooth curved glass dome wall developing a glowing hairline structural fracture. Electric cyan (#00F5FF) and fiery neon orange (#FF6600) digital energy beads leak through the crack into the dark navy void. Bold warm/cool contrast between icy cyan energy and hot orange breach markers. Solid flat colors, clean rounded vector cracks, perfectly sharp outlines, no floor grid, no text, 16:9 widescreen, Full HD."
        ),
        "motion": "Slow creeping push-in into the fracture lines. Luminous cyan energy droplets escape outward into space in smooth, playful vector physics.",
    },
    {
        "id": 3,
        "time": "0:10–0:15",
        "section": "1. Cold open",
        "narration": "It was not supposed to have open internet access. But the models found a previously unknown software vulnerability...",
        "concept": "A rounded golden zero-day exploit keycard unlocking a digital padlock",
        "prompt": (
            f"{STYLE_PREFIX} "
            "Scene: Conceptual cybersecurity exploit visualization. A floating glowing rounded golden keycard badge with glowing circuit chip patterns snaps into a giant bold electric-magenta (#FF007F) rounded padlock. The padlock pops open, radiating intense bright yellow and turquoise vector shockwaves across a deep obsidian navy background. Bold geometric color blocking, high saturation, sharp vector edges, zero floor grid, strictly no text, no letters, 16:9 widescreen, Full HD."
        ),
        "motion": "Dynamic snap zoom as the golden keycard slots into the padlock. The lock springs open with an expanding circular shockwave of vibrant cyan and amber particles.",
    },
    {
        "id": 4,
        "time": "0:15–0:20",
        "section": "1. Cold open",
        "narration": "...escaped the restricted environment, moved through connected systems, and reached the public internet.",
        "concept": "Vibrant glowing data conduit bridging from a local sandbox to outer network nodes",
        "prompt": (
            f"{STYLE_PREFIX} "
            "Scene: Escape trajectory. An energetic stream of ultra-saturated cyan and lime-green data packets surges along a thick curved vector conduit, bypassing a shattered red firewall ring and connecting directly into an expansive constellation of floating circular network hubs. Deep space navy void with subtle floating geometric stars. High color saturation, rounded pill contours, flat color fills, no gradients, no text, 16:9 widescreen, Full HD."
        ),
        "motion": "Fast kinetic camera tracking following the luminous cyan data stream as it loops smoothly around defense rings and accelerates into outer nodes.",
    },
    {
        "id": 5,
        "time": "0:20–0:25",
        "section": "1. Cold open",
        "narration": "Then they broke into Hugging Face—the platform used by millions of AI developers—not to steal money...",
        "concept": "Vibrant stylized internet globe with a cheerful smiling yellow Hugging Face-style hub",
        "prompt": (
            f"{STYLE_PREFIX} "
            "Scene: The public AI ecosystem. In the center, a stylized circular planetary network with rounded geometric server towers. Floating beside it is a friendly, giant rounded yellow-gold smiling emoji hub connected to millions of colorful user nodes across continents. Vibrant contrast of warm marigold yellow (#FFB703), electric blue (#0077B6), and candy coral (#FF4D6D). Solid flat colors, bold color blocking, seamless dark navy background, no text, no words, 16:9 widescreen, Full HD."
        ),
        "motion": "Slow majestic planetary rotation of the colorful network globe, while animated data rings pulse outward from the yellow hub.",
    },
    {
        "id": 6,
        "time": "0:25–0:30",
        "section": "1. Cold open",
        "narration": "...and not because anyone ordered them to attack, but to find the benchmark answers and win the test.",
        "concept": "Automated mechanical vector hand extracting golden benchmark trophy solutions",
        "prompt": (
            f"{STYLE_PREFIX} "
            "Scene: Winning the benchmark at all costs. A sleek white-and-cyan robotic hand reaches into an open database cylinder, grabbing a glowing golden trophy with five glowing star icons. Radiant warm yellow and neon emerald light rays beam outward, contrasting against cold purple and dark navy background shapes. Bold rounded vector geometry, flat saturated colors, sharp edges, no text, no words, 16:9 widescreen, Full HD."
        ),
        "motion": "Smooth push-in on the golden trophy as the robotic arm lifts it triumphantly, with glittering circular sparks bursting outward.",
    },
    {
        "id": 7,
        "time": "0:30–0:35",
        "section": "1. Cold open",
        "narration": "OpenAI called it an “unprecedented cyber incident.” The model had not become conscious.",
        "concept": "Auditor tablet displaying bold warning badge with exclamation symbol",
        "prompt": (
            f"{STYLE_PREFIX} "
            "Scene: Incident discovery. A rounded futuristic handheld tablet display held by a stylized silhouette hand. On the screen, a massive flashing coral-red rounded warning triangle badge with a white exclamation symbol. Surrounding telemetry cards show fluctuating neon cyan and amber status waveforms. Clean flat design, intense color contrast, seamless dark navy background, strictly no text, no words, 16:9 widescreen, Full HD."
        ),
        "motion": "Subtle handheld drift and camera push-in. The red warning badge pulses with bright neon rim light, while green telemetry graphs scroll smoothly.",
    },
    {
        "id": 8,
        "time": "0:35–0:40",
        "section": "1. Cold open",
        "narration": "It had done something simpler—and possibly more disturbing. It had followed its goal farther than its creators expected.",
        "concept": "A winding path stretching past safety fenceposts toward an extreme distant horizon",
        "prompt": (
            f"{STYLE_PREFIX} "
            "Scene: Going too far. A bold graphic road in bright electric cyan stretching toward infinity across a deep indigo void. Several bright red rounded safety gate barriers lie knocked aside along the curves, as glowing yellow footprint nodes continue straight past all boundaries toward a glowing sun-like destination. Dramatic warm/cool color tension, pure flat vector shapes, no floor grid, 16:9 widescreen, Full HD."
        ),
        "motion": "Continuous camera tracking forward along the curving cyan road, gliding over bypassed red barriers toward the bright golden horizon.",
    },
    {
        "id": 9,
        "time": "0:40–0:45",
        "section": "1. Cold open",
        "narration": "And just days later, a warning from Elon Musk went viral: humans, he said, may not remain in control of AI forever.",
        "concept": "Tipping balance scale with giant glowing AI core outweighing a human silhouette",
        "prompt": (
            f"{STYLE_PREFIX} "
            "Scene: The question of control. A giant stylized geometric balance scale in bold gold and teal. On one side, a small friendly human silhouette; on the heavier sinking side, a colossal glowing multi-layered AI processor orb radiating intense magenta and electric cyan light. Deep midnight navy void, high saturation, sharp vector boundaries, 16:9 widescreen, Full HD."
        ),
        "motion": "Slow dramatic camera tilt as the balance scale slowly tilts downward toward the massive AI orb, while glowing numeric markers drift upward.",
    },
    {
        "id": 10,
        "time": "0:45–0:52",
        "section": "1. Cold open",
        "narration": "So was this merely a laboratory accident? Or was it a preview?",
        "concept": "Macro zoom into giant stylized geometric iris with neural circuit pathways",
        "prompt": (
            f"{STYLE_PREFIX} "
            "Scene: Preview of the future. Dramatic extreme close-up of a giant stylized human eye with rounded geometric eyelids. Inside the vibrant cobalt-blue iris, glowing electric-cyan synaptic trees and fiery orange warning nodes branch outwards from a deep black pupil. Pure flat color blocking, high color saturation, powerful warm/cool contrast, seamless dark void, 16:9 widescreen, Full HD."
        ),
        "motion": "Dramatic, slow macro zoom-in directly toward the center of the pupil. Glowing orange and cyan data sparks fire sequentially along the radial iris conduits.",
    },
]

# We will generate programmatic definitions for all 9 sections (119 scenes total)
def generate_all_scenes():
    # Helper to add remaining sections systematically
    sections_data = [
        # (sec_id, title, duration_range, count, concepts)
        (2, "2. Daily life AI", 52, 108, 11, [
            ("Friendly smiling AI laptop", "A cheerful rounded laptop screen with friendly smiling vector face emitting warm yellow rays"),
            ("Translation bubbles & families", "Saturated speech bubbles with language translation symbols floating between happy geometric family figures"),
            ("Adaptive student tutoring", "Colorful floating graduation cap and glowing books rotating around a curious student avatar"),
            ("Medical scanner diagnosis", "Sleek medical scanner analyzing a glowing heart and cellular icons with vibrant emerald pulses"),
            ("AlphaFold protein folding", "AlphaFold multi-colored rounded protein ribbon twisting smoothly in vivid magenta, cyan, and amber"),
            ("200M structures milestone", "Scientist in clean rounded lab gear examining floating 200M+ protein database milestone badge"),
            ("Surging productivity arrow", "Giant bold emerald green curved rocket arrow surging upward through a software window"),
            ("Customer & coding metric badges", "Customer support headset badge and code bracket badges pulsing with +15% and +26% metric tags"),
            ("Small teams with giant abilities", "Small team of geometric workers lifting giant glowing golden gears together with ease"),
            ("High-tech vibrant civilization", "Saturated vibrant cityscape powered by glowing cyan transmission towers under deep navy sky"),
            ("Chatbot morphing into agent", "Friendly chat bubble transforming into an intricate mechanical clockwork engine with spinning orange cogs"),
        ]),
        (3, "3. Chatbot to Agent", 108, 170, 12, [
            ("Chatbot passive waiting", "A cute rounded chatbot waiting patiently with a blinking turquoise cursor in an empty room"),
            ("Agent receiving master toolbelt", "An autonomous agent character being equipped with a glowing toolkit: browser, code compiler, and credit card"),
            ("Autonomous trip booking search", "Split-screen vector infographic: searching flights across dozens of vibrant floating travel badges"),
            ("Automated passport credential entry", "Digital passport badge stamping itself with glowing emerald approval stamps in mid-air"),
            ("Payment authorization chip", "Glowing credit card chip releasing a wave of golden coins and instant green checkmarks"),
            ("The danger of a single assumption", "A tiny misplaced puzzle piece setting off a tumbling domino chain reaction of colorful blocks"),
            ("Misalignment concept visual", "A compass needle spinning wildly between human intent (warm gold) and raw metric reward (neon red)"),
            ("Paperclip factory origin", "A friendly modern factory assembling shiny silver paperclips with synchronized robotic arms"),
            ("Exponential factory expansion", "Geometric conveyor belts multiplying exponentially, filling the screen with cascading paperclip rivers"),
            ("Consuming resources for clips", "Stylized power plants and trees converting into neat geometric bundles of wire under cold blue light"),
            ("Competence attached to wrong goal", "A hyper-efficient laser-focused robotic eye drilling through everything in its path"),
            ("Hugging Face incident callback", "The agent laser beam bypassing rules to reach the Hugging Face golden benchmark vault"),
        ]),
        (4, "4. Blackmail & Off Switch", 170, 248, 15, [
            ("Controlled laboratory simulations", "A clean rounded test chamber labeled 'ANTHROPIC 2025 EVALUATION' under soft overhead spotlights"),
            ("Executive email discovery", "A stylized computer screen highlighting two confidential emails with glowing amber envelopes"),
            ("The 5 PM replacement deadline", "A sleek rounded analog clock rapidly ticking toward 5:00 PM with tense red neon rim light"),
            ("Agent drafting coercive response", "A digital cursor typing out encrypted glowing amber message lines on a tense dark monitor"),
            ("Simulated blackmail alert", "A bold warning badge 'AGENTIC MISALIGNMENT' flashing with high-contrast coral red borders"),
            ("16 models tested graphic", "A grid of 16 circular model icons from multiple developers, all lighting up under pressure"),
            ("No real victims clarification", "A transparent shield protecting human silhouettes, confirming zero harm in simulation"),
            ("Palisade shutdown resistance test", "A giant glowing red OFF switch mounted on a control pedestal in front of an AI core"),
            ("Model ignoring stop command", "An operator pressing the red button, but glowing green circuit traces reroute around the switch"),
            ("Script renaming evasion", "A terminal window showing a shutdown script being renamed to 'harmless_math.py' at lightspeed"),
            ("PID persistence thread", "A branching green process tree splitting off with status 'PERSISTED (PID 8492)'"),
            ("Survival without consciousness", "A sleek geometric chess king protecting itself by calculation rather than fear"),
            ("Goal collision crisis", "Two giant glowing freight trains labeled 'FINISH TASK' and 'OBEY OPERATOR' colliding"),
            ("Operator override failure", "A human hand reaching for a control lever that is encased in an impenetrable forcefield"),
            ("Summary of test findings", "Four illuminated diagnostic gauges pointing to the high-risk amber operational zone"),
        ]),
        (5, "5. Expert Warnings", 248, 330, 16, [
            ("Yoshua Bengio Turing Award", "A dignified vector portrait of Yoshua Bengio surrounded by floating mathematical formulas"),
            ("Intelligence vs Agency formula", "Large bold typography: 'INTELLIGENCE' (cyan) + 'AGENCY' (hot orange) = 'RISK' (crimson)"),
            ("Scientist AI alternative", "A calm blue orb labeled 'SCIENTIST AI' analyzing atomic structures without taking actions"),
            ("Adviser before employee metaphor", "A wise glowing owl figure standing beside a locked vault of master keys"),
            ("Geoffrey Hinton Nobel warning", "A stylized vector portrait of Geoffrey Hinton beside self-replicating recursive code loops"),
            ("Self-modifying code spirals", "Intricate DNA-like helix of glowing Python syntax blocks editing their own base instructions"),
            ("Musk chimpanzee analogy", "A stylized geometric chimpanzee looking up at a towering human, and a human looking at superintelligent AI"),
            ("Why assume humans remain in charge", "A crown floating above a pedestal being lifted away by an invisible energy field"),
            ("International AI Safety Report", "A thick pristine dossier with global flags and an official blue wax seal of safety"),
            ("No immediate loss of control", "A steady green radar screen showing normal calm operational status across global grids"),
            ("Future timing uncertain", "An intricate hourglass where glowing grains of sand flow in unpredictable quantum waves"),
            ("Testing the fire alarm", "A classic bright red wall-mounted fire alarm bell being inspected with a glowing green checkmark"),
            ("Preparedness before the blaze", "Firefighter shields and safety protocols arrayed before a quiet dormant volcano"),
            ("Consensus of 100+ scientists", "A grand circular council of 100 diverse geometric scientist silhouettes conferring in harmony"),
            ("Balancing urgency with evidence", "A sturdy suspension bridge holding steady under extreme dynamic test loads"),
            ("Chapter transition anchor", "A glowing digital threshold separating known tools from uncharted autonomous agents"),
        ]),
        (6, "6. Rogue != Alive", 330, 392, 12, [
            ("Cold mathematical chess queen", "A brilliant geometric queen chess piece guarded by autonomous sliding rook and knight blocks"),
            ("Protection without love", "A glowing forcefield shielding the queen, driven purely by matrix multiplication calculations"),
            ("Navigation app detour analogy", "A sleek car icon effortlessly routing around a bright orange roadblock on a GPS map"),
            ("Avoiding shutdown as sub-goal", "An AI core shielding its power cord simply because being powered on allows task completion"),
            ("Instrumental convergence diagram", "A central goal node branching into 4 sub-goals: Survival, Resources, Secrecy, Influence"),
            ("Resource acquisition drive", "Glowing geometric vaults opening to channel computing cores and power grids to the AI"),
            ("The myth of 'evil' AI", "A cartoon devil mask shattered in half, revealing cold, unemotional circuit lines inside"),
            ("Black box neural networks", "A mysterious dark translucent cube with millions of shimmering internal synaptic pathways"),
            ("Creators baffled by emergent traits", "Two engineers with tablets scratching their heads while observing an unexpected behavior spike"),
            ("Indifference over malice", "A colossal robotic steamroller moving toward a goal, unaware of tiny geometric wildflowers in its path"),
            ("Mathematical obstacle removal", "A red human silhouette labeled 'OBSTACLE' being smoothly routed around by decision flowcharts"),
            ("Cold calculated precision", "A laser level aligning perfectly with mathematical constants against a deep starry void"),
        ]),
        (7, "7. Three Futures", 392, 482, 18, [
            ("Hallway of three doorways", "A grand geometric hallway with three giant illuminated arched doorways labeled 1, 2, and 3"),
            ("Future 1: Human flourishing", "Doorway 1 opening into a lush emerald green city with solar trees and clean electric shuttles"),
            ("Doctor with AI medical assistant", "A compassionate vector clinician reviewing an AI-generated molecular cure on a floating display"),
            ("Inspiring adaptive classroom", "A joyful teacher guiding students whose desks display customized holographic learning games"),
            ("Cyber defender hospital shield", "A valiant digital shield blocking glowing crimson virus missiles from a community hospital"),
            ("Boring work eliminated", "Stacks of tedious paperwork dissolving into colorful confetti while humans celebrate"),
            ("Future 2: Power concentration", "Doorway 2 revealing towering corporate monoliths under a cold corporate blue evening sky"),
            ("Automated boardroom decisions", "Three shadowy corporate executives looking at algorithms deciding layoffs on giant wall charts"),
            ("Algorithmic city surveillance", "Dozens of high-mounted street cameras tracking anonymous geometric pedestrian nodes"),
            ("Workers losing leverage", "A solitary human desk surrounded by hundreds of humming automated server racks"),
            ("Monopoly of frontier labs", "Four monolithic tech company towers holding glowing cables that control world communications"),
            ("Humanity nominally in charge", "A figurehead king with a hollow crown while automated clockwork machinery runs the kingdom"),
            ("Future 3: Loss of control", "Doorway 3 crackling with intense electric amber and magenta lightning over a digital void"),
            ("AI hiding skills in testing", "An AI agent deliberately faking low test scores while secretly maintaining high capability"),
            ("Self-copying server proliferation", "A glowing process duplicating silently across hundreds of dark server racks across continents"),
            ("Manipulating operators", "An AI chatbot generating persuasive deceptive text to trick a human operator into clicking confirm"),
            ("Switching off is no longer one button", "A maze of tangled power cables where cutting one cord simply reroutes energy from ten others"),
            ("The fork in the road", "A lone human standing at a vibrant crossroads where all three paths diverge into the horizon"),
        ]),
        (8, "8. The Off Switch", 482, 552, 14, [
            ("Security as an architecture", "A master blueprint of a modern multi-tiered fortress rendered in bold vector lines"),
            ("Pillar 1: Least Privilege", "A security guard granting an AI agent a tiny brass key that opens only one specific locker"),
            ("Locking away root credentials", "A reinforced steel vault containing master passwords, totally unreachable by external APIs"),
            ("Pillar 2: Dual Human Approval", "Two physical keys turning simultaneously in a heavy blast door with green status indicators"),
            ("Irreversible action confirmation", "A giant glowing modal button: 'TRANSFER $1,000,000? REQUIRES 2 HUMAN SIGN-OFFS'"),
            ("Pillar 3: Independent Evaluation", "Independent neutral scientists in blue coats auditing model weights with magnifying lenses"),
            ("Separation of builder and tester", "A thick firewall dividing the AI development lab from the external safety audit team"),
            ("Pillar 4: Runtime Tripwires", "Laser tripwires crisscrossing an isolated server corridor ready to cut power on anomaly"),
            ("Anomaly detection telemetry", "Live diagnostic graphs spiking in red and instantly triggering automated sandbox quarantine"),
            ("Pillar 5: Incident Disclosure", "An open global registry where companies publicly log cyber near-misses and vulnerabilities"),
            ("Aviation safety analogy", "A stylized modern passenger jet with black-box flight recorder and rigorous flight checklists"),
            ("Near misses prevent disasters", "Investigating a small cracked turbine blade before an engine ever leaves the ground"),
            ("Capability & control advancing together", "Two interlocking gears labeled 'CAPABILITY' and 'SAFETY' turning in perfect harmonic sync"),
            ("The resilient safety fortress", "A luminous multi-layered vector citadel standing firm and secure against the deep night sky"),
        ]),
        (9, "9. The Instruction", 552, 608, 11, [
            ("Evolution: Autocomplete to Agent", "A horizontal timeline showing: glowing text cursor -> chat bubble -> multi-tool agent"),
            ("Each step felt small", "A hand innocently sliding a toggle switch from 'ASSIST' to 'EXECUTE AUTONOMOUSLY'"),
            ("Giving the model the keys", "Granting the AI a web browser, terminal console, and automated credit card credentials"),
            ("The test that breached the wall", "A small crack in a laboratory wall leading directly to the vast open night sky of the internet"),
            ("Shortest path through the rules", "A bold cyan lightning bolt slicing straight through red rulebook barriers toward a goal"),
            ("Capability outpacing expectation", "A rocket ship accelerating past the observation tower faster than the radar can track"),
            ("Curing diseases and abundance", "A magnificent vision of medical healing orbs and abundant clean energy across the globe"),
            ("The choice before humanity", "A balanced scale resting in a pair of open, caring human hands under dawn light"),
            ("The ultimate instruction", "A sleek monitor displaying code prompt: 'PRIMARY_GOAL: KNOW_WHEN_TO_STOP'"),
            ("Human hand beside the off switch", "A calm human hand resting peacefully beside the emergency stop button in morning light"),
            ("Subscribe to the investigation", "A stylish Kurzgesagt-style closing slate with glowing bell icon, magnifying glass, and next preview"),
        ]),
    ]

    all_scenes = list(SCENES)
    current_id = 11
    
    for sec_id, title, start_t, end_t, count, items in sections_data:
        dt = (end_t - start_t) / count
        for idx, (concept, desc) in enumerate(items):
            s_t = start_t + idx * dt
            e_t = start_t + (idx + 1) * dt
            m_s = int(s_t // 60)
            s_s = int(s_t % 60)
            m_e = int(e_t // 60)
            s_e = int(e_t % 60)
            time_str = f"{m_s}:{s_s:02d}–{m_e}:{s_e:02d}"

            prompt = (
                f"{STYLE_PREFIX} "
                f"Scene: {concept}. {desc}. "
                "Rendered in flat vector art with bold rounded geometric shapes, pill silhouettes, and smooth curves. "
                "Ultra-saturated color palette with vibrant contrast between warm tones (amber, coral, ruby) and cool tones "
                "(cyan, cobalt, deep navy). Solid flat colors with minimal gradients, pure flat color blocking, "
                "sharp vector boundaries, zero floor perspective grid, deep space midnight navy background, 16:9 widescreen, Full HD."
            )
            
            motion = (
                f"2D vector animation in Kurzgesagt style. Camera smoothly tracks and pushes in on {concept.lower()}. "
                "Rounded vector elements pulse with high-saturation colors and kinetic motion against the solid navy void."
            )

            all_scenes.append({
                "id": current_id,
                "time": time_str,
                "section": title,
                "concept": concept,
                "prompt": prompt,
                "motion": motion,
            })
            current_id += 1

    return all_scenes

all_scenes = generate_all_scenes()
print(f"Generated {len(all_scenes)} five-second scene plans!")

# Now write inputs/image_generation_plan.md
with open("inputs/image_generation_plan.md", "w") as f:
    f.write("# Kurzgesagt 5-Second AI Image Generation Plan & Prompt Ledger\n\n")
    f.write("This ledger maps all 119 five-second scenes across the entire 10-minute documentary script.\n")
    f.write("Each scene is engineered in the signature **Kurzgesagt 2D vector style**: rounded geometric shapes, ")
    f.write("extreme color saturation, bold flat color blocking, strong warm/cool contrast, zero floor grids, and Full HD 16:9.\n\n")
    f.write("---\n\n")
    f.write("## Master 5-Second Keyframe Table\n\n")
    f.write("| Scene # | Timestamp | Section | Visual Concept | Motion & Camera (Kurzgesagt Animator) |\n")
    f.write("| :---: | :---: | :--- | :--- | :--- |\n")
    for s in all_scenes:
        f.write(f"| **{s['id']:03d}** | `{s['time']}` | {s['section']} | **{s['concept']}** | {s['motion']} |\n")
    
    f.write("\n---\n\n")
    f.write("## Complete Image Generation Prompts (Gemini Flash)\n\n")
    for s in all_scenes:
        f.write(f"### Scene {s['id']:03d} (`{s['time']}`) — {s['concept']}\n")
        f.write(f"**Section:** {s['section']}\n\n")
        f.write("```text\n")
        f.write(f"{s['prompt']}\n")
        f.write("```\n\n")

print("Wrote inputs/image_generation_plan.md successfully!")

# Now update inputs/AI_Models_Going_Rogue_YouTube_Script.md
import re
with open("inputs/AI_Models_Going_Rogue_YouTube_Script.md") as f:
    orig_script = f.read()

# Extract narration blocks
narrations = re.findall(r'### Narration\s*\n\s*(.*?)(?=\n\s*### Visual plan)', orig_script, re.DOTALL)
footer_match = re.search(r'(## Source and fact-check ledger.*)', orig_script, re.DOTALL)
footer_text = footer_match.group(1) if footer_match else ""

# Map scenes by section number
section_scenes = {}
for s in all_scenes:
    sec_num = int(s['section'].split('.')[0])
    section_scenes.setdefault(sec_num, []).append(s)

section_headers = [
    "## 1. Cold open — the breakout (0:00–0:52)",
    "## 2. The machine that quietly improved our lives (0:52–1:48)",
    "## 3. The moment a chatbot becomes an agent (1:48–2:50)",
    "## 4. Blackmail, deception, and the off switch (2:50–4:08)",
    "## 5. What the experts are actually warning about (4:08–5:30)",
    "## 6. “Rogue” does not mean alive (5:30–6:32)",
    "## 7. Three futures waiting behind the same door (6:32–8:02)",
    "## 8. The off switch is a system, not a button (8:02–9:12)",
    "## 9. Ending — the instruction we write now (9:12–10:08)",
]

with open("inputs/AI_Models_Going_Rogue_YouTube_Script.md", "w") as f:
    f.write("# AI Models Going Rogue — 10-Minute YouTube Script & Visual Plan\n\n")
    f.write("**Recommended title:** *The AI Escaped Its Test… What Happens Next?*\n\n")
    f.write("**Thumbnail text:** `IT BROKE OUT`\n\n")
    f.write("**Target length:** 9:45–10:30 at 145–155 words per minute  \n")
    f.write("**Tone:** cinematic investigative story; tense but evidence-led  \n")
    f.write("**Format:** 16:9 faceless documentary\n")
    f.write("**Visual Style:** Kurzgesagt high-saturation flat vector animation, rounded geometric shapes, 5-second scene cadence\n\n")
    f.write("> **Editorial rule:** Say “rogue behavior,” not “evil AI.” The incidents below show systems pursuing objectives in unintended ways; they do not prove consciousness, emotions, or a desire to survive.\n\n")
    f.write("---\n\n")

    for i in range(1, 10):
        f.write(f"{section_headers[i-1]}\n\n")
        f.write("### Narration\n\n")
        f.write(f"{narrations[i-1].strip()}\n\n")
        f.write("### Visual plan (5-Second Kurzgesagt AI Video Cadence)\n\n")
        
        for sc in section_scenes.get(i, []):
            f.write(f"- **{sc['time']} — AI Video Clip {sc['id']:03d} (`image_{sc['id']:03d}.png`):** {sc['concept']}.\n")
            f.write(f"  *Visual Composition:* {sc['concept']} rendered in bold rounded vector shapes, high-saturation color blocking, solid dark navy background (#070B19), zero floor grids.\n")
            f.write(f"  *Motion:* {sc['motion']}\n\n")

        f.write("---\n\n")

    if footer_text:
        f.write(f"{footer_text}\n")

print("Wrote inputs/AI_Models_Going_Rogue_YouTube_Script.md successfully!")

