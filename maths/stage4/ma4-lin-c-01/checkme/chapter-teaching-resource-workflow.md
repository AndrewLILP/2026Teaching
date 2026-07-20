# Chapter Teaching Resource — Build Workflow

**Last updated:** 20 July 2026

> **Companion doc required:** upload `design-and-standards-reference.md` alongside this file at the start of every build chat. It holds the design constants, accessibility rules, fraction rendering, MCQ safety pattern, Error Detective spec, Newman's pattern, and the Cartesian plane engine — this doc only covers what's specific to building a Chapter Teaching Resource.

---

## What this resource is

A self-contained HTML interactive teaching resource, one file per sub-topic (chapter) within an outcome. Each chapter follows an explicit-teaching lesson arc and is linked from an outcome hub (`index.html`) page. Together, one hub + N chapter files = a complete unit.

**This resource is the teach layer.** The Topic Review Notebook is the practise and retrieve layer. They are designed to complement each other — same outcome, same sub-topics, separate files, separate chats.

---

## Lesson arc (per chapter file)

### Mandatory core tabs — every chapter, every topic

| Tab | Name | Purpose |
|---|---|---|
| 1 | Hook | Activating curiosity — a real-world scenario, image prompt, or provocative question to launch the sub-topic |
| 2 | Learn | **Explicit teaching.** Contains both the **I Do** phase (fully worked modelling, step-reveal worked examples at three tiers) and the **We Do** phase (guided practice, support gradually reduced) |
| 3 | Practise | **You Do** — independent fluency. Tiered self-marking questions (Foundation / Core / Extension) |
| 4 | Reflect | Metacognitive close — Error Detective case + Newman's word problem + journal prompt saved to localStorage |

**Hook, Learn, Practise, and Reflect are non-negotiable.** Every chapter file must have these four tabs, in this order, and the I Do / We Do / You Do phase labels must be visibly present on the Learn and Practise tabs (`phase-label` spans).

### Optional tab — decided per chapter, per topic

A 5th tab may be inserted **between Learn and Practise** when the topic genuinely benefits from student-led investigation before independent practice. This is **not automatic** — it's a deliberate decision made during Step 3a for each chapter.

- If included: tab order is Hook → Learn → **[Optional tab]** → Practise → Reflect
- If omitted: tab order is Hook → Learn → Practise → Reflect (4 tabs)
- Name the tab to fit the activity — "Investigate", "Explore", "Pattern Hunt", "Match It", "Sort It Out", etc.
- Different chapters within the same unit can make different decisions.

---

## Pedagogical features per chapter

### Frayer model flip cards (Learn tab)
Key vocabulary as interactive flip cards. Design rules in `design-and-standards-reference.md`. Back includes: definition + example + non-example. Foundation tier back also includes a diagram.

### Step-reveal worked examples (Learn tab — I Do phase)
- Three tiers: Foundation / Core / Extension (student-chosen).
- Each step hidden behind a "Show next step" button; final step reveals the complete solution.
- If the worked example involves a graph, **build the visual progressively as steps are revealed** (e.g. plot points on step 2, draw the line on step 3) rather than showing the finished graph immediately — the point is to model the process, not just show the answer.
- Fractions: see `design-and-standards-reference.md`.
- Wrap in `<span class="phase-label phase-ido">I Do — Worked Examples</span>`.

### Guided practice (Learn tab — We Do phase)
Sits after the I Do worked examples, inside the Learn tab. Cues and prompts provided, support gradually reduced across items (full cue → partial cue → minimal cue). If the chapter's core skill involves reading a graph, table, or diagram, **each guided item should include one**, not just text — reading skill should be practised visually, not just algebraically.
Wrap in `<span class="phase-label phase-wedo">We Do — Guided Practice</span>`.

### Error Detective (Reflect tab)
Spec in `design-and-standards-reference.md`.

### Newman's word problem (Reflect tab)
Spec and required Stage 5 "Show worked solution" reveal in `design-and-standards-reference.md`. Five stages: Read → Comprehend → Transform → Process → Encode. Scaffold sentence frames provided (collapsible) for EAL/D and Foundation students.

### Tiered self-marking MCQs (Practise tab — You Do phase)
- Foundation: 4 questions (MC only).
- Core: 4 questions (MC + type-in mix).
- Extension: 4 questions (MC + type-in + one multi-step).
- MCQ safety pattern and answer-distribution self-check: see `design-and-standards-reference.md` — **run the distribution check before presenting the file, not just when asked.**
- Wrap the tab intro in `<span class="phase-label phase-youdo">You Do — Independent Practice</span>`.

### Metacognitive journal (Reflect tab)
Free-text input saved to localStorage. Prompt changes per chapter. Not submitted or collected — private to the student's device. Displayed as a notebook-style lined textarea.

### Progress tracking
Chapter completion saved to localStorage when the student reaches the Reflect tab. Hub `index.html` reads these keys and updates progress pills per chapter.

---

## File architecture

The hub is **always** `index.html` — never `[outcome-code]-hub.html`. GitHub Pages auto-serves `index.html` at the folder URL.

```
[outcome-code]/
├── index.html                          ← hub / unit landing page (ALWAYS this filename)
├── [outcome-code]-ch1-[slug].html      ← Chapter 1
├── [outcome-code]-ch2-[slug].html      ← Chapter 2
...
├── [outcome-code]-chN-[slug].html      ← Chapter N (adjust to match number of NESA content groups)
└── [outcome-code]-topic-review.html    ← Topic Review Notebook (built in the companion workflow/chat)
```

**Note:** the number of chapters must match the number of NESA content groups for the outcome (typically 4–6) — don't assume 5. A single dense content group can be deliberately split into two chapters if it covers genuinely distinct skills (confirm with the person during Step 3a).

Each chapter file is fully self-contained. The hub is a separate file. All files work offline except for Google Fonts.

---

## Starting a new topic — open a new chat and say:

> "Guide me through the chapter teaching resource workflow for [OUTCOME CODE]"

---

## Step 1 — Upload workflow files

Upload `chapter-teaching-resource-workflow.md` **and** `design-and-standards-reference.md` at the start of the chat.

---

## Step 2 — Syllabus screenshots to upload

| Screenshot | What to capture | Why |
|---|---|---|
| **Outcome overview** | Outcome code, description, and all content group headings | Confirms chapter titles and NESA wording |
| **Life Skills view** | Related Life Skills content | Foundation tier anchor — entry point for the lowest-complexity version of each concept |
| **Teaching advice — Key ideas & Background knowledge** | Key ideas dot points and background knowledge list | Shapes the Hook tab and any optional investigation tab; informs prior learning to surface |
| **Teaching advice — Making connections** | Full connections table | Cross-subject contexts for Hook scenarios and Newman's word problems |
| **Teaching advice — Non-routine problem solving** | Non-routine problems list | Extension-tier and Error Detective source material |
| **Content with Examples (all content groups)** | Toggle Examples on; capture each group separately | NESA examples define expected question types, worked example structure, and appropriate contexts |

> Screenshot each content group separately so Claude can match examples to the correct chapter. Paste all in one message labelled by chapter number.

---

## Step 3 — Pre-build conversation (before any code is written)

### 3a — Confirm chapter titles, slugs, and tab structure
Name each chapter using NESA content group headings exactly. Confirm file slugs. For **each chapter**, decide: does this topic benefit from an optional investigation tab? If yes — what does the student do, and what's the tab called? Decided chapter-by-chapter.

### 3b — Hook scenario workshop (one per chapter)
Propose a real-world scenario, image prompt, or provocative question per chapter. Sources: Making connections table, NESA non-routine problems, Australian contexts. Review each for genuine curiosity value, age-appropriateness, and cultural relevance.

### 3c — Worked example decisions
For each chapter: the Foundation worked example (simplest case, visual scaffold), Core (standard NESA example), Extension (multi-step or unfamiliar context). Confirm the difficulty gradient is right — this flows directly into the step-reveal structure. **Double-check any numbers reused across worked examples in the same chapter don't accidentally collide** (e.g. two different "described points" landing on the same coordinate) — this has happened and produces a confusing diagram.

### 3d — Error Detective case workshop
One case per chapter. Review: is the error a genuine misconception (not just an arithmetic slip)? Is the worked solution realistic? Is the step count appropriate (3–5)?

### 3e — Newman's word problem workshop
One per chapter. Review: does it require reading, comprehension, transformation, processing, and encoding as distinct steps? Is the context authentic? Are the sentence frame scaffolds useful without being patronising?

### 3f — Accent colour decisions
Each chapter uses a distinct accent colour from within the outcome's strand palette (or a single-hue lightness ramp — see `design-and-standards-reference.md`). Propose a palette for the full outcome; confirm contrast ratios against both white and near-black text before committing.

**Strand palette guidance:**
- Number & algebra outcomes → slate-blue family
- Measurement & space outcomes → forest-green family
- Statistics & probability outcomes → purple family

### 3g — Final spec confirmation
Write a clean spec table covering: chapter titles, slugs, tab structure, Hook scenarios, worked example contexts, Error Detective errors, Newman's problems, and accent colours. Approve before any code is written.

---

## Step 4 — Build order

Build one chapter at a time. Recommended order:
1. Hub `index.html` (stub — navigation only, no progress data yet)
2. Chapter 1 (full build, review, fix)
3. Chapters 2–N (each reviewed before the next begins)
4. Hub update (add progress pills once all chapters are confirmed)

Say **"build Chapter [N]"** to trigger each file.

---

## Step 5 — Review and fix (per chapter)

Beyond the general accessibility/technical checks in `design-and-standards-reference.md`, check:

- Hook, Learn, Practise, Reflect load and switch correctly (plus the optional tab, if included)
- I Do / We Do phase labels visible in Learn; You Do label visible in Practise
- Frayer cards flip both directions, sized generously, front/back contrast correct
- Step-reveal worked examples advance correctly at all three tiers, and any graphs build up progressively rather than appearing finished
- Foundation/Core/Extension tier selection works independently per tab
- **MCQ answer-letter distribution counted and balanced** (see `design-and-standards-reference.md`)
- Type-in answers accept correct values with appropriate tolerance
- Error Detective identifies the correct step and locks on correct selection
- Newman's stages accumulate correctly (don't hide feedback) and Stage 5 has a worked-solution reveal
- Journal text saves to localStorage; progress key written on Reflect tab visit
- Hub `index.html` reads progress keys and updates pills correctly
- Font preference toggle present and functional
- If the chapter uses any Cartesian plane: gridlines/numbers visible, axis arrows present, lines clipped to the card boundary, any SVG text labels use real Unicode characters (not HTML entities)

Report bugs as a numbered list per chapter file. Fix targeted sections — no full rebuild unless required.

---

## Chapter-specific design constants

(General constants — fonts, palette, accessibility — are in `design-and-standards-reference.md`.)

| Element | Value |
|---|---|
| Background | `#F4EFE9` warm off-white |
| Card background | `#FFFFFF` white |
| Chapter accent | Unique per chapter (proposed during Step 3f) |
| Tab style | Horizontal pill tabs, active tab uses chapter accent colour |

---

## localStorage key schema

| Data | Key pattern | Example |
|---|---|---|
| Chapter completion | `[code]-ch[n]-complete` | `rat-ch1-complete` |
| Journal entry | `[code]-ch[n]-journal` | `rat-ch1-journal` |

The unit `index.html` reads `[code]-ch[n]-complete` keys to display progress dots. Follow these patterns exactly.

---

## Key technical rules

- **Tab switching:** never use `event.currentTarget` inside functions called from inline `onclick`. Match via explicit ID.
- **Duplicate function guard:** never wrap an existing function in a `const _orig = fn` pattern — causes infinite recursion.
- **Canvas:** if used, must be `devicePixelRatio`-aware. (Prefer SVG for graphs — see the Cartesian plane engine in the standards doc.)
- **localStorage keys:** follow the schema above exactly.

---

## Differentiation rules

### Foundation tier
- MC questions only in Practise tab.
- Visual scaffolds in worked examples (diagrams, colour-coded steps).
- Sentence frames always visible (not hidden) in Newman's problem.
- Frayer card back includes a diagram.
- Hook scenario uses concrete, familiar context.

### Core tier
- Mix of MC and type-in in Practise tab.
- Standard worked example following NESA model.
- Sentence frames collapsible in Newman's problem.
- Frayer card back includes example and non-example.

### Extension tier
- MC + type-in + one multi-step in Practise tab.
- Unfamiliar or multi-step context in worked example.
- No sentence frames in Newman's problem (student writes own structure).
- Error Detective case uses a more subtle error (e.g. wrong formula rearrangement, not just arithmetic).
- Hook scenario asks a deeper "what if" question.

**Tier selection is always student-chosen, never teacher-assigned.**

---

## Hub index page

The hub is a lightweight navigation page, **always saved as `index.html`**, that:
- Lists all chapters with title, learning intention, and estimated time.
- Shows a progress pill per chapter (reads `[code]-ch[n]-complete` localStorage keys).
- Links directly to each chapter HTML file.
- Includes the outcome code, outcome description, and MAO-WM-01 reference.
- Gives the Topic Review Notebook a dedicated card above the chapter cards, not just a nav-grid entry.
- Includes an "About this resource" panel (privacy / accessibility / curriculum alignment / how it was built / scope & limitations) — see recent builds for current wording.
- Does not require a server — all relative links, works from a folder on any device or GitHub Pages.

---

## Relationship to the Topic Review Notebook

| Feature | Chapter Teaching Resource | Topic Review Notebook |
|---|---|---|
| Primary purpose | Teach the concept | Practise and retrieve |
| Question volume | ~12 per chapter (mixed types) | ~18 per sub-topic (fluency focus) |
| Worked examples | Yes (step-reveal, 3 tiers) | No |
| Frayer cards | Yes | No |
| Newman's problems | Yes (1 per chapter) | No |
| Error Detective | Yes (1 per chapter, Reflect tab) | Yes (1 per section, exit slip) |
| Spaced retrieval | No | Yes (Section 3 retrieves prior sub-topic) |
| Homework component | No | Yes (Section 3) |
| Confidence rating | No | Yes (Section 2) |
| Teacher projection use | Hook tab (whole class) | Section 1 pre-lesson (whole class) |
| Background colour | `#F4EFE9` warm off-white | `#C8BFB0` outer / `#F7F4EE` paper |
| File count | `index.html` + N chapters per outcome | 1 file per outcome (`[outcome-code]-topic-review.html`) |

---

## Changelog

- **20 July 2026** — Split shared content (design constants, accessibility, fraction rendering, MCQ pattern, Error Detective, Newman's pattern, Cartesian plane engine) into `design-and-standards-reference.md`. This doc now covers only chapter-resource-specific process and structure. Added guidance on progressive graph build-up during step-reveal, guided-practice items including visuals when the chapter's skill is graph-reading, and a reminder to check for coordinate/number collisions across worked examples in the same chapter.
- **20 July 2026 (earlier)** — Formalised Hook / Learn / Practise / Reflect as the four mandatory tabs; the 5th "Explore/Investigate" tab is now optional and decided per chapter in Step 3a. Standardised the hub filename to always be `index.html`. Renamed "Daily Review Notebook" to "Topic Review Notebook" throughout, matching the companion workflow doc rename.
- **13 June 2026** — I Do / We Do / You Do phase labels formalised as a requirement on the Learn and Practise tabs.
