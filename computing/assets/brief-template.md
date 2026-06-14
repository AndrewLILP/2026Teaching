# Computing Curriculum — Resource Build Workflow & Brief Template
**NSW Computing Technology 7–10 & Stage 6 | Andrew Leary**
*Master source of truth. Claude reads this file at the start of every new build session.*
*Aligned to: NSW Computing Technology 7–10 Syllabus (2022) and Stage 6 courses*

---

## HOW CLAUDE USES THIS FILE

At the start of every build session, Claude:

1. Reads this file in full
2. Reads the relevant completed focus area brief (e.g. `brief-ct5-sd-apps-web.md`)
3. Reads any screenshots provided for syllabus content extraction
4. Confirms with Andrew which page is being built before writing any code
5. Does NOT write any HTML until the brief is marked `APPROVED`
6. check that existing files for ct-shared.css and ct-interactive.js are uploaded and used along with a sample theory.html page

This file never needs to be explained to Claude again — it is the instruction set.

---

## PART A — FOLDER STRUCTURE

### Root: `/computing/`

Professional project root. Assets shared at the root level, content organised
by course, no duplicate code. Mirrors real-world web project conventions.

```
computing/
│
├── index.html                      ← Computing department landing page
│
├── assets/                         ← SHARED across all courses — never duplicated
│   ├── css/
│   │   ├── ct-shared.css           ← Design system: tokens, typography, components
│   │   └── ct-print.css            ← Print stylesheet (media="print")
│   ├── js/
│   │   ├── ct-core.js              ← Shared UI: sidebar TOC, expand cards, CPD strip,
│   │   │                              smooth scroll, font preference, keyboard nav
│   │   ├── ct-interactive.js       ← Heavy interactions: trace tables, drag-drop,
│   │   │                              classifiers, flowchart builders, MCQ engine
│   │   └── vendor/
│   │       └── chart.min.js        ← Chart.js — LOCAL copy, pinned version 4.4.x
│   ├── fonts/
│   │   ├── nunito-variable.woff2   ← Local fallback (for file:// without internet)
│   │   └── opendyslexic.woff2      ← OpenDyslexic — student accessibility option
│   └── icons/
│       └── ct-icons.svg            ← SVG sprite: phase dots, tier badges, UI icons
│
├── ct4/                            ← Computing Technology Stage 4 (Years 7–8)
│   ├── index.html
│   ├── briefs/
│   │   └── brief-ct4-[focus-area].md
│   └── [focus-area]/
│       ├── index.html
│       ├── theory.html
│       └── skills.html
│
├── ct5/                            ← Computing Technology Stage 5 (Years 9–10)
│   ├── index.html
│   ├── briefs/
│   │   ├── brief-template.md       ← THIS FILE
│   │   ├── brief-ct5-sd-games.md
│   │   ├── brief-ct5-sd-apps-web.md
│   │   ├── brief-ct5-sd-mechatronics.md
│   │   ├── brief-ct5-eis-data.md
│   │   ├── brief-ct5-eis-networks.md
│   │   └── brief-ct5-eis-ux.md
│   ├── software-development/
│   │   ├── index.html
│   │   ├── games-simulations/
│   │   │   ├── index.html
│   │   │   ├── theory.html
│   │   │   └── skills.html - this has evolved into multiple pages
│   │   ├── apps-web/
│   │   │   ├── index.html
│   │   │   ├── theory.html
│   │   │   └── skills.html
│   │   └── mechatronics/
│   │       ├── index.html
│   │       ├── theory.html
│   │       └── skills.html - this has evolved into multiple pages
│   └── enterprise-information-systems/
│       ├── index.html
│       ├── analysing-data/
│       │   ├── index.html
│       │   ├── theory.html
│       │   └── skills.html - this has evolved into multiple pages
│       ├── networks/
│       │   ├── index.html
│       │   ├── theory.html
│       │   └── skills.html - this has evolved into multiple pages
│       └── ux-design/
│           ├── index.html
│           ├── theory.html
│           └── skills.html - this has evolved into multiple pages
│
└── ct6/                            ← Stage 6 courses
    ├── index.html
    ├── software-engineering/
    │   └── [topic]/
    │       ├── theory.html
    │       └── skills.html
    ├── enterprise-computing/
    │   └── [topic]/
    └── industrial-technology-multimedia/
        └── [topic]/
```

### Rationale for key decisions

**`assets/` at root — single source of truth for design**
One update to `ct-shared.css` propagates to CT4, CT5, and CT6 immediately.
No hunting for duplicate colour definitions across 18+ HTML files.

**`vendor/chart.min.js` — local, pinned**
Works offline and via `file://`. Won't silently break if the CDN releases a new
version. Pin to Chart.js 4.4.x. Update deliberately with a changelog note.

**`theory.html` / `skills.html` per focus area — named, not numbered**
`lesson-03.html` breaks every link when topics are reordered.
`theory.html` is stable — the page's purpose doesn't change.

**`briefs/` inside each course folder**
A CT5 brief travels with its CT5 HTML. Won't be confused with a CT4 brief
covering the same focus area at a lower level of complexity.

**`ct-print.css` as a separate file linked with `media="print"`**
Students can print any page for offline study. Navigation, decorative elements,
and dark backgrounds are suppressed. Font sizes increase. Activated automatically
by the browser — zero effort from the student.

---

## PART B — ASSET SPECIFICATIONS

### ct-shared.css — five-layer architecture

Claude writes all five layers when building or updating `ct-shared.css`.
Page-level `<style>` blocks override only the accent colour variables.

```
Layer 1  Custom properties (design tokens)
         All colours, typography scale, spacing, radius, transitions
         Focus area accents defined as tokens, not hardcoded

Layer 2  Reset and base
         box-sizing, margin/padding reset, root font size (16px)
         @font-face declarations for local font fallbacks

Layer 3  Typography
         Font stack declarations
         Type scale: h1–h4, body, code, caption, label
         Dyslexia/accessibility defaults (line-height, letter-spacing)
         .font-dyslexia and .font-system body class overrides

Layer 4  Layout
         .page-wrap (grid: sidebar + main)
         .ct-nav, .ct-breadcrumb, .ct-sidebar, .main-col
         Responsive: sidebar collapses at <=768px

Layer 5  Components
         .cpd-strip, .cpd-grade-[a–e]
         .phase-pill, .phase-[identify|research|produce|test]
         .tier-badge, .tier-[foundation|core|extension]
         .expand-card (accordion + aria-expanded)
         .code-block, .code-new-line, .code-change-banner
         .notebook-prompt
         .outcome-tag
         .word-bank
         .frayer-card
         .analysis-box
         .tier-tasks (three-column task grid)
         .font-toggle, .font-btn
         .ct-logo
         .skip-link (screen reader / keyboard)
         Focus styles (never outline:none without visible replacement)
         @media (prefers-reduced-motion: reduce)
         @media print (basic — ct-print.css handles detail)
```

**CSS naming convention — semantic, not presentational:**

```css
/* GOOD — describes role */
--color-accent
--color-surface
--color-text-primary
--color-phase-identify
--color-tier-extension

/* AVOID — describes appearance */
--purple
--dark-box
--big-font
```

Students who inspect the source learn design token thinking — a real industry
pattern used in every major design system (Material, Tailwind, Apple HIG).

---

### ct-core.js — responsibilities

Vanilla JS, no dependencies, well-commented throughout.

```js
// 1. Sidebar TOC — IntersectionObserver on <section id="..."> elements
//    Highlights the active section link as the user scrolls

// 2. Expand/collapse cards — .expand-card accordion
//    Toggles .is-open, manages aria-expanded, body.hidden

// 3. CPD strip — grade highlight on click/hover
//    Keyboard accessible (Enter/Space)

// 4. Smooth scroll to anchor
//    Respects prefers-reduced-motion (instant if reduce set)

// 5. Keyboard nav — Enter/Space trigger click for all custom elements

// 6. Font preference (see Part C)
//    Reads localStorage('ct-font-preference')
//    Applies .font-nunito / .font-system / .font-dyslexia to body
//    Syncs .font-btn aria-pressed states

// Comment style: plain English explaining WHAT and WHY, not HOW
// Students read this code — it should teach, not obscure
```

---

### ct-interactive.js — loaded on-demand only

Only linked on pages that actually use these features.
Never include it on pages that don't need it (adds ~15KB + parse time).

```js
// 1. Trace table — desk check / NSW pseudocode algorithm tracing
// 2. Drag-and-drop classifier (ISTPO, domain sorting activities)
// 3. Dataset Explorer (Chart.js wrapper — EIS: Analysing Data)
// 4. Pseudocode stepper (step-by-step reveal + variable watch panel)
// 5. MCQ self-check (reveal answer + explanation on selection)
// 6. Flowchart builder (basic SVG node-link diagram)
```

---

### Chart.js rules

```
Version:  4.4.x — local copy at assets/js/vendor/chart.min.js
Fallback: cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js
          (document in HTML comment if used)

Load:     Only on pages that use charts. Not in ct-core.js.
          <script src="../../../assets/js/vendor/chart.min.js"></script>
          <script src="../../../assets/js/ct-interactive.js"></script>

Colours:  All chart colours via CSS custom properties and getComputedStyle()
          Never hardcode hex values inside chart config objects

A11y:     Every chart has a text/table alternative — charts are
          enhancement, not primary content delivery
          Colour-blind safe: avoid red/green as sole distinction
```

---

## PART C — TYPOGRAPHY & FONT STRATEGY

### Primary: Nunito (Google Fonts)

Why Nunito:
- Rounded letterforms reduce b/d/p/q visual confusion (key dyslexia trigger)
- Tall x-height — legible at small sizes and on low-DPI screens
- Variable font — one network request covers all weights 400–800
- Free and widely browser-cached

```html
<!-- In every page <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,400..800;1,400..700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
```

### Font stacks in ct-shared.css

```css
:root {
  /* Body — Nunito, then system fonts with similar proportions */
  --font-body: 'Nunito', 'Trebuchet MS', 'Segoe UI', Arial, sans-serif;

  /* Code / pseudocode */
  --font-mono: 'JetBrains Mono', 'Cascadia Code', 'Fira Code',
               'Consolas', 'Courier New', monospace;

  /* Dyslexia option — applied via .font-dyslexia on <body> */
  --font-dyslexia: 'OpenDyslexic', 'Comic Sans MS', 'Comic Neue',
                   'Trebuchet MS', sans-serif;
}
```

### Student font preference toggle

Three options — persisted in localStorage, applied on every page load.

| Option | Class on body | Font used | When to choose |
|--------|--------------|-----------|----------------|
| **Aa** Nunito | `.font-nunito` | Nunito (default) | Recommended for most students |
| **Sys** System | `.font-system` | OS default | If student has set OpenDyslexic or another accessible font as their system font in Windows/macOS settings |
| **Dy** OpenDyslexic | `.font-dyslexia` | OpenDyslexic (local) | For students who specifically benefit from this font |

```css
/* In ct-shared.css Layer 3 */

/* Default — Nunito */
body, body.font-nunito {
  font-family: var(--font-body);
  line-height: var(--line-height-body);   /* 1.75 */
  letter-spacing: var(--letter-spacing-body);  /* 0.015em */
}

/* System — honours student's OS font */
body.font-system {
  font-family: system-ui, -apple-system, sans-serif;
  /* line-height and letter-spacing unchanged */
}

/* OpenDyslexic — loaded from assets/fonts/ */
@font-face {
  font-family: 'OpenDyslexic';
  src: url('../fonts/opendyslexic.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

body.font-dyslexia {
  font-family: var(--font-dyslexia);
  line-height: 1.9;       /* OpenDyslexic needs more leading */
  letter-spacing: 0.04em;
  word-spacing: 0.15em;
}
```

```js
// In ct-core.js — font preference (full implementation)
const FONT_KEY = 'ct-font-preference';

function applyFont(pref) {
  document.body.classList.remove('font-nunito', 'font-system', 'font-dyslexia');
  document.body.classList.add(`font-${pref}`);
  document.querySelectorAll('.font-btn').forEach(btn => {
    const active = btn.dataset.font === pref;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
}

function initFontToggle() {
  const saved = localStorage.getItem(FONT_KEY) || 'nunito';
  applyFont(saved);
  document.querySelectorAll('.font-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pref = btn.dataset.font;
      localStorage.setItem(FONT_KEY, pref);
      applyFont(pref);
    });
  });
}

document.addEventListener('DOMContentLoaded', initFontToggle);
```

**Why this matters for NSW compliance:**
The NSW CT syllabus teaching advice explicitly requires accessibility adjustments
for students with disability and EAL/D learners. A font toggle is one of the
lowest-effort, highest-impact accessibility features available in a web resource.
It works without any school infrastructure and without identifying a student.

---

## PART D — ACCESSIBILITY REQUIREMENTS

Mandatory on every page. Non-negotiable. Checked in Stage 5 of the workflow.

```
TYPOGRAPHY
  min font size 15px base (0.9375rem at 16px root)
  line-height >= 1.75 on body text
  letter-spacing 0.015em on body
  left-aligned text throughout — never justify
  prose column max-width 680px (prevents >75 char lines)
  short paragraphs — 3–4 sentences max before a visual break
  font-toggle present and functional

COLOUR & CONTRAST
  body text contrast >= 4.5:1 against background
  large text and UI components >= 3:1
  colour never the sole distinguisher — always paired with icon or label
  colour-blind safe: avoid red/green as only distinction
  use amber+rose paired with shapes for status indicators

INTERACTION
  all interactive elements keyboard accessible
  logical tab order
  focus indicators visible (never outline:none without visible replacement)
  click/tap targets >= 44x44px
  aria-expanded on all accordion headers
  aria-label on all icon-only buttons
  no auto-playing animation or audio
  prefers-reduced-motion respected for all transitions

STRUCTURE
  logical heading hierarchy h1 → h2 → h3 (never skip levels)
  skip link at top of page (href="#main-content")
  <main id="main-content" tabindex="-1">
  every code block has plain-English description above it
  every diagram has text description
  technical terms defined on first use (word-bank or inline gloss)

EAL/D LEARNERS (per NSW advice)
  word banks on Theory pages for key technical vocabulary
  concrete familiar examples before abstract ones
  sentence starters provided for all writing-to-learn prompts
  visual representations accompany all conceptual explanations
```

---

## PART E — WORKFLOW (five stages)

### Stage 1 — Capture (Andrew)

Screenshot NESA syllabus viewer:
- Filter: Examples ON, Teaching advice OFF, Life Skills OFF
- All four D&P phases — one screenshot per phase if needed for legibility
- Save: `screenshot-[course]-[focus-area]-[phase].png`
- Upload to Claude with the focus area brief to fill

---

### Stage 2 — Extract & annotate (Claude)

Claude reads screenshots, populates the brief:
- Transcribes all dot points verbatim
- Tags each dot point (domain + type + page assignment — see Section 11 tag legend)
- Notes pseudocode entry point and code language
- Includes all NESA examples verbatim
- Outputs draft brief for Andrew to review

Claude does NOT write any HTML at this stage.

---

### Stage 3 — Design decisions (Andrew approves)

Andrew fills Section 7 of the brief (Design Decisions) and signals approval:

**"brief approved — build [theory / skills / index]"**

Until that phrase appears, Claude asks for approval rather than building.

---

### Stage 4 — Build (Claude, one page at a time)

Build order within a focus area:
1. Theory page
2. Skills page
3. Focus area hub/index page

Andrew approves each before the next begins.
Claude reads this file + the approved brief before writing any HTML.

---

### Stage 5 — Integration checklist (Claude, before presenting file)

```
FILE COMPATIBILITY
  ☐ file:// compatible — no fetch(), no localhost, no ES module imports
  ☐ All asset paths are relative (../../../assets/css/ct-shared.css)
  ☐ Chart.js loaded from assets/js/vendor/chart.min.js — not CDN
  ☐ Google Fonts link in <head>; OpenDyslexic @font-face in ct-shared.css

NAVIGATION & STRUCTURE
  ☐ Skip link present (href="#main-content")
  ☐ Breadcrumb: computing → course → strand → focus area → this page
  ☐ Links to sibling page (Theory ↔ Skills) and focus area hub
  ☐ Font toggle present with three options (Nunito / System / OpenDyslexic)
  ☐ Logical heading hierarchy — h1 → h2 → h3, never skipped
  ☐ Every section has id="" for sidebar anchor

CONTENT
  ☐ Theory: analysis-first activity present
  ☐ Theory: social & ethical considerations section present
  ☐ Skills: NSW pseudocode precedes every code example
  ☐ Skills: NSW pseudocode keywords used (see Section 12)
  ☐ Skills: full file shown at every step (no partial diffs)
  ☐ CPD strip: E–A descriptors, focus-area specific
  ☐ CPD E descriptor starts at Stage 5 (not Stage 4)
  ☐ Three tiered tasks: Foundation (D–E), Core (C), Extension (B–A)
  ☐ Word bank on Theory page
  ☐ Notebook prompts present, linked to correct project notebook
  ☐ Outcome tags correct (from brief Section 1)

ACCESSIBILITY
  ☐ Base font size >= 15px
  ☐ Line height >= 1.75 on body text
  ☐ Text is left-aligned — never justify
  ☐ Prose max-width <= 680px
  ☐ Focus indicators visible
  ☐ All interactive elements keyboard accessible
  ☐ Tap targets >= 44x44px
  ☐ aria-expanded on accordions, aria-label on icon buttons
  ☐ Colour not sole distinguisher anywhere
  ☐ prefers-reduced-motion respected

CSS / JS
  ☐ No inline styles except --accent override in <style> block
  ☐ All colours via CSS custom properties
  ☐ Class names semantic (cpd-strip, tier-foundation) not presentational
  ☐ ct-interactive.js linked only if page uses heavy interactions
  ☐ Chart.js linked only if page uses charts
  ☐ JS comments explain WHAT and WHY (students read this)
```

---

## PART F — BRIEF TEMPLATE

*Copy from here into a new file: `brief-[course]-[focus-area].md`*
*Fill all sections. Delete italicised instructions when done.*

---

# Focus Area Brief: [COURSE] — [FOCUS AREA NAME]

**File:** `brief-[course]-[focus-area].md`
**Strand:** `Software Development` / `Enterprise Information Systems`
**Course:** `CT4` / `CT5` / `CT6`
**Accent colour:** `#______`
**Accent token:** e.g. `--color-sd-apps`
**NSW syllabus reference:** [Full focus area name from NESA viewer]
**Year level:** Year __ Stage __
**Teaching time:** ___ weeks / ___ hours
**Brief created:** [date]
**Brief status:** `DRAFT` / `APPROVED` / `IN PROGRESS` / `COMPLETE`

---

## Section 1 — Outcomes

| Code | Statement |
|------|-----------|
| CT5-OPL-01 | designs, produces and evaluates algorithms and implements them in a general-purpose and/or object-oriented programming language |
| CT5-THI-01 | applies computational, design and systems thinking to the development of computing solutions |
| CT5-DES-01 | designs and creates user interfaces and the user experience |
| CT5-DPM-01 | applies iterative processes to define problems and plan, design, develop and evaluate computing solutions |
| CT5-EVL-01 | understands how innovation, enterprise and automation have inspired the evolution of computing technology |
| CT5-SAF-01 | selects and applies safe, secure and responsible practices in the ethical use of data and computing technology |
| CT5-COL-01 | manages, documents and explains individual and collaborative work practices |
| CT5-COM-01 | communicates ideas, processes and solutions using appropriate media |
| CT5-DAT-01 | *if applicable* |
| CT5-DAT-02 | *if applicable* |

*Delete outcomes not tagged to this focus area.*
**Focus outcomes:** CT5-___-01, CT5-___-01, ...

---

## Section 2 — Syllabus content by D&P phase

*Extracted verbatim from NESA screenshots by Claude. Tagged by Claude.*

### Tag legend

| Tag | Meaning |
|-----|---------|
| `[TECH]` | Technical Knowledge & Skills domain |
| `[SOC]` | Social Awareness domain |
| `[PM]` | Project Management domain |
| `[THINK]` | Thinking Skills domain |
| `[CONCEPT]` | Requires understanding / explanation |
| `[SKILL]` | Requires doing / producing |
| `[CONTEXT]` | Social, historical, or industry context |
| `[DESIGN]` | Design decisions required |
| `[PSEUDO]` | NSW pseudocode needed |
| `[ALGO]` | Algorithm design needed |
| `[CODE]` | Implementation in a programming language |
| `[THEORY]` | Best suited to Theory page |
| `[SKILLS]` | Best suited to Skills page |
| `[BOTH]` | Spans both pages |

---

### 2.1 Identifying and Defining

> *"Students identify and define the needs, opportunities and wants of a computing*
> *challenge. They encounter and practise the technical skills that are essential*
> *to the topic."*
> — NESA Teaching Advice

| # | Dot point (verbatim) | Domain | Type | Page |
|---|----------------------|--------|------|------|
| 1 | | | | |

**NESA Examples:**
```
• [example]
```

---

### 2.2 Researching and Planning

| # | Dot point (verbatim) | Domain | Type | Page |
|---|----------------------|--------|------|------|
| 1 | | | | |

**NESA Examples:**
```
• [example]
```

---

### 2.3 Producing and Implementing

| # | Dot point (verbatim) | Domain | Type | Page |
|---|----------------------|--------|------|------|
| 1 | | | | |

**NESA Examples:**
```
• [example]
```

---

### 2.4 Testing and Evaluating

| # | Dot point (verbatim) | Domain | Type | Page |
|---|----------------------|--------|------|------|
| 1 | | | | |

**NESA Examples:**
```
• [example]
```

---

## Section 3 — Theory / Skills split

### Theory page covers
*Dot points tagged [CONCEPT] [CONTEXT] [SOC] [THINK]*

Dot points: [list by section.number e.g. I&D-1, I&D-3, R&P-2]

**Analysis-first activity (required):**
```
[Be specific. e.g. "Students open three real web apps — Canva, Notion, Gmail —
and annotate their UI against FAUA design qualities before writing requirements"]
```

**Social & ethical section (required on every Theory page):**
```
[Which dot points? What's the context or case study?]
```

---

### Skills page covers
*Dot points tagged [SKILL] [TECH] [PSEUDO] [ALGO] [CODE]*

Dot points: [list by section.number]

**First NSW pseudocode algorithm:**
```
[e.g. "Event handler for form submit: validate field, display error or success"]
```

**Code language:** `C#` / `JavaScript` / `HTML+CSS+JS` / `Python` / `VEXcode EXP`

**Starter code required:** Yes / No
```
[Paste or describe here]
```

---

## Section 4 — CPD descriptors (focus-area specific)

*Use NESA Stage 5 CPD language applied to THIS focus area.*
*Grade E always starts at Stage 5 — never reference Stage 4 content.*

| Grade | Descriptor |
|-------|-----------|
| **A** | |
| **B** | |
| **C** | |
| **D** | |
| **E** | |

---

## Section 5 — Tiered tasks

### Theory page

| Tier | Grade | Task |
|------|-------|------|
| Foundation | D–E | *Structured with scaffolding — identify, label, match* |
| Core | C | *Apply — describe, compare, explain with examples* |
| Extension | B–A | *Evaluate and justify — critique, design, argue* |

### Skills page

| Tier | Grade | Task |
|------|-------|------|
| Foundation | D–E | *Given starter + algorithm, complete guided steps* |
| Core | C | *Modify and extend to meet new requirements* |
| Extension | B–A | *Design and implement from requirements — minimal scaffolding* |

---

## Section 6 — Notebook prompts

### Theory page
- Identifying & Defining: `"[prompt]"`
- Social Awareness: `"[prompt — required]"`

### Skills page
- Producing & Implementing: `"[prompt]"`
- Testing & Evaluating: `"[prompt]"`

---

## Section 7 — Design decisions (Andrew fills before build)

**Brief status:** `DRAFT` → set to `APPROVED` to unlock build

**File paths:**
```
Theory:  computing/ct5/[strand]/[focus-area]/theory.html
Skills:  computing/ct5/[strand]/[focus-area]/skills.html
Hub:     computing/ct5/[strand]/[focus-area]/index.html
```

**Asset path from page to assets root:**
```
../../../assets/css/ct-shared.css
../../../assets/js/ct-core.js
```

**Accent colour:** `#______`

**ct-interactive.js needed:** Yes / No
**Chart.js needed:** Yes / No

**Special interactions:**
```
[or "None — standard layout"]
```

**Student prior knowledge:**
```
[e.g. "Students have completed SD: Games & Simulations.
They know C# but have not written JavaScript or HTML."]
```

**Focus area pedagogy note:**
```
[Anything specific to how this topic is taught in your context]
```

---

## PART G — DESIGN SYSTEM REFERENCE

### Section 8 — Colour tokens

```css
/* ── Base palette ──────────────────────────────────────────────── */
--color-bg:             #0b0d12;
--color-surface:        #13161f;
--color-surface-alt:    #1a1e2a;
--color-border:         #1e2230;
--color-border-focus:   #22d3ee;
--color-muted:          #2a2f42;
--color-text-primary:   #e2e8f0;
--color-text-secondary: #94a3b8;
--color-text-faint:     #475569;

/* ── D&P phase colours ─────────────────────────────────────────── */
--color-phase-identify: #38bdf8;
--color-phase-research: #4ade80;
--color-phase-produce:  #fbbf24;
--color-phase-test:     #fb7185;

/* ── Focus area accents ────────────────────────────────────────── */
--color-sd-games:       #8b5cf6;   /* SD: Games & Simulations — violet */
--color-sd-mechat:      #22d3ee;   /* SD: Mechatronics — cyan */
--color-sd-apps:        #0d9488;   /* SD: Apps & Web Software — teal */
--color-eis-data:       #f59e0b;   /* EIS: Analysing Data — amber */
--color-eis-networks:   #e879f9;   /* EIS: Networks — magenta */
--color-eis-ux:         #fb7185;   /* EIS: UX Design — rose */

/* ── Tier colours ──────────────────────────────────────────────── */
--color-tier-foundation: #64748b;
--color-tier-core:       #38bdf8;
--color-tier-extension:  #a78bfa;

/* ── Status ────────────────────────────────────────────────────── */
--color-success: #4ade80;
--color-warning: #fbbf24;
--color-error:   #fb7185;
--color-info:    #38bdf8;

/* ── Per-page accent (overridden in page <style> block) ────────── */
--accent:         var(--color-sd-games);
--accent-dim:     #6d28d9;
--accent-surface: rgba(139, 92, 246, 0.12);
--accent-border:  rgba(139, 92, 246, 0.25);
```

---

### Section 9 — Typography tokens

```css
/* ── Font stacks ───────────────────────────────────────────────── */
--font-body:    'Nunito', 'Trebuchet MS', 'Segoe UI', Arial, sans-serif;
--font-mono:    'JetBrains Mono', 'Cascadia Code', 'Consolas', monospace;
--font-dyslexia:'OpenDyslexic', 'Comic Sans MS', 'Trebuchet MS', sans-serif;

/* ── Type scale ────────────────────────────────────────────────── */
--text-xs:   0.68rem;     /* tags, labels, metadata */
--text-sm:   0.82rem;     /* secondary UI, captions */
--text-base: 0.9375rem;   /* body (15px at 16px root) */
--text-md:   1.05rem;     /* lead paragraph */
--text-lg:   1.2rem;      /* h4 */
--text-xl:   1.45rem;     /* h3 */
--text-2xl:  1.75rem;     /* h2 */
--text-3xl:  2.1rem;      /* h1 */

/* ── Accessibility defaults ────────────────────────────────────── */
--line-height-body:      1.75;
--line-height-heading:   1.25;
--line-height-code:      1.6;
--letter-spacing-body:   0.015em;
--word-spacing-body:     0.05em;
--prose-max-width:       680px;

/* ── Spacing ───────────────────────────────────────────────────── */
--space-xs:  0.25rem;
--space-sm:  0.5rem;
--space-md:  1rem;
--space-lg:  1.5rem;
--space-xl:  2.5rem;
--space-2xl: 4rem;

/* ── Radius ────────────────────────────────────────────────────── */
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
```

---

### Section 10 — HTML page shell

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Focus Area] — [Theory / Skills] · [CT5]</title>
  <meta name="description" content="[1 sentence]">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,400..800;1,400..700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">

  <!-- Shared design system -->
  <link rel="stylesheet" href="../../../assets/css/ct-shared.css">
  <link rel="stylesheet" href="../../../assets/css/ct-print.css" media="print">

  <!-- Focus area accent override — ONLY these four variables -->
  <style>
    :root {
      --accent:         [HEX];
      --accent-dim:     [HEX darker];
      --accent-surface: rgba([R],[G],[B], 0.12);
      --accent-border:  rgba([R],[G],[B], 0.25);
    }
  </style>
</head>
<body>

  <!-- Skip to main (keyboard / screen reader) -->
  <a class="skip-link" href="#main-content">Skip to content</a>

  <!-- Navigation -->
  <nav class="ct-nav" aria-label="Site navigation">
    <a href="../../../index.html" class="ct-logo" aria-label="Computing home">
      <span>[</span><em>CT</em><span>/]</span>
    </a>
    <div class="ct-nav-context">
      <span class="ct-nav-course">[CT5]</span>
      <span aria-hidden="true">·</span>
      <span class="ct-nav-focus">[Focus Area]</span>
      <span aria-hidden="true">·</span>
      <span class="ct-nav-page">[Theory / Skills]</span>
    </div>
    <div class="ct-nav-actions">
      <a href="[theory.html or skills.html]" class="ct-nav-btn">
        ↔ [Theory / Skills]
      </a>
      <!-- Font preference toggle -->
      <div class="font-toggle" role="group" aria-label="Font preference">
        <button class="font-btn" data-font="nunito" aria-pressed="true">Aa</button>
        <button class="font-btn" data-font="system" aria-pressed="false">Sys</button>
        <button class="font-btn" data-font="dyslexia" aria-pressed="false">Dy</button>
      </div>
    </div>
  </nav>

  <!-- Breadcrumb -->
  <nav class="ct-breadcrumb" aria-label="Breadcrumb">
    <ol>
      <li><a href="../../../index.html">Computing</a></li>
      <li><a href="../../index.html">CT5</a></li>
      <li><a href="../index.html">[Strand]</a></li>
      <li><a href="index.html">[Focus Area]</a></li>
      <li aria-current="page">[Theory / Skills]</li>
    </ol>
  </nav>

  <div class="page-wrap">

    <!-- Sidebar — TOC auto-built by ct-core.js -->
    <aside class="ct-sidebar" aria-label="Page navigation">
      <div class="sidebar-section">
        <div class="sidebar-label">On this page</div>
        <nav class="sidebar-toc" aria-label="Table of contents"></nav>
      </div>
      <div class="sidebar-section">
        <div class="sidebar-label">Outcomes</div>
        <!-- .outcome-tag elements from brief Section 1 -->
      </div>
      <div class="sidebar-section">
        <div class="sidebar-label">D&amp;P Phases</div>
        <!-- .phase-pill elements highlighting active phases for this page -->
      </div>
    </aside>

    <!-- Main content -->
    <main id="main-content" class="main-col" tabindex="-1">

      <!-- Page hero -->
      <header class="page-hero">
        <div class="page-eyebrow">[SD / EIS] · Stage 5</div>
        <h1>[Theory: Understanding [topic] / Skills: Building [topic]]</h1>
        <p class="page-intro">[Plain-English summary of what this page is for.]</p>
        <div class="phase-pills">
          <span class="phase-pill phase-identify">Identifying &amp; Defining</span>
          <!-- add other phases relevant to this page -->
        </div>
      </header>

      <!--
      ══════════════════════════════════════════════════════════════════
      THEORY PAGE SECTIONS
        1. Key vocabulary (word-bank + Frayer cards for 4–6 terms)
        2. Concept explanations ([CONCEPT][CONTEXT] dot points)
        3. Analysis-first activity (examine existing system BEFORE building)
        4. Social & ethical considerations (required — every Theory page)
        5. Check your understanding (tiered MCQ or self-check)
        6. CPD strip (E–A, focus-area specific)
        7. Notebook prompts
      ══════════════════════════════════════════════════════════════════
      SKILLS PAGE SECTIONS
        1. Key vocabulary (technical terms used in code)
        2. Concept recap (2–3 sentences linking to Theory page)
        3. NSW Pseudocode walkthrough (algorithm FIRST — always)
        4. Code walkthrough (full file at every step,
           "// ── NEW IN STEP X ──" on changed lines,
           green line highlight for additions,
           magenta change banner above each block)
        5. Tiered tasks (Foundation / Core / Extension)
        6. Bug Detective / trace table
        7. CPD strip (E–A, focus-area specific)
        8. Notebook prompts
      ══════════════════════════════════════════════════════════════════
      -->

      <!-- [PAGE CONTENT HERE] -->

      <!-- CPD strip — always present, always last before notebook prompts -->
      <section class="cpd-strip" aria-label="Course performance descriptors">
        <div class="cpd-grade cpd-grade-a" tabindex="0" role="button">
          <span class="grade-label" aria-label="Grade A">A</span>
          <p>[descriptor from brief Section 4]</p>
        </div>
        <div class="cpd-grade cpd-grade-b" tabindex="0" role="button">
          <span class="grade-label" aria-label="Grade B">B</span>
          <p>[descriptor]</p>
        </div>
        <div class="cpd-grade cpd-grade-c" tabindex="0" role="button">
          <span class="grade-label" aria-label="Grade C">C</span>
          <p>[descriptor]</p>
        </div>
        <div class="cpd-grade cpd-grade-d" tabindex="0" role="button">
          <span class="grade-label" aria-label="Grade D">D</span>
          <p>[descriptor]</p>
        </div>
        <div class="cpd-grade cpd-grade-e" tabindex="0" role="button">
          <span class="grade-label" aria-label="Grade E">E</span>
          <p>[descriptor — starts at Stage 5]</p>
        </div>
      </section>

      <!-- Notebook prompts -->
      <aside class="notebook-prompt" aria-label="Project notebook prompts">
        <div class="notebook-prompt__label">📓 Project Notebook</div>
        <ul>
          <li>[prompt 1 from brief Section 6]</li>
          <li>[prompt 2]</li>
        </ul>
        <a href="../../../[notebook-path].html" class="notebook-link">
          Open project notebook →
        </a>
      </aside>

    </main>
  </div>

  <!-- Scripts — ct-core.js always last, after DOM -->
  <script src="../../../assets/js/ct-core.js"></script>
  <!-- Include ct-interactive.js ONLY if this page uses heavy interactions -->
  <!-- <script src="../../../assets/js/ct-interactive.js"></script> -->
  <!-- Include Chart.js ONLY if this page uses charts (load before ct-interactive) -->
  <!-- <script src="../../../assets/js/vendor/chart.min.js"></script> -->

</body>
</html>
```

---

## PART H — QUICK REFERENCE

### Section 11 — All six CT5 focus areas

| Focus area | Strand | Token | Hex | Focus outcomes |
|-----------|--------|-------|-----|----------------|
| Creating Games & Simulations | SD | `--color-sd-games` | `#8b5cf6` | OPL-01, THI-01, DES-01, DPM-01 |
| Developing Apps & Web Software | SD | `--color-sd-apps` | `#0d9488` | OPL-01, DES-01, DAT-01, DPM-01 |
| Building Mechatronic & Automated Systems | SD | `--color-sd-mechat` | `#22d3ee` | OPL-01, THI-01, SAF-01, DPM-01 |
| Analysing Data | EIS | `--color-eis-data` | `#f59e0b` | DAT-01, DAT-02, THI-01, SAF-01 |
| Modelling Networks & Social Connections | EIS | `--color-eis-networks` | `#e879f9` | SAF-01, COL-01, DAT-01, DAT-02 |
| Designing for User Experience | EIS | `--color-eis-ux` | `#fb7185` | DES-01, COM-01, SAF-01, EVL-01 |

---

### Section 12 — NSW pseudocode keyword reference

All Skills pages use these keywords. No Python syntax. No generic pseudocode.

```
Program control:   BEGIN  END
Input/Output:      INPUT  OUTPUT  PRINT  READ
Assignment:        ← (left arrow — not equals)
Selection:         IF condition THEN / ELSE / ENDIF
                   CASE expression OF / OTHERWISE / ENDCASE
Counting loop:     FOR variable ← start TO end / NEXT
Condition loop:    WHILE condition DO / ENDWHILE
Post-condition:    REPEAT / UNTIL condition
Subprograms:       FUNCTION name(params) / RETURN value / ENDFUNCTION
                   PROCEDURE name(params) / ENDPROCEDURE
Boolean:           AND  OR  NOT  TRUE  FALSE
Comparison:        =  ≠  <  >  ≤  ≥
Arrays:            ARRAY name[size]
Comments:          // comment text
String concat:     & (ampersand)
```

---

*Last updated: June 2026*
*Maintained by: Andrew Leary*
*NSW Computing Technology 7–10 Syllabus (2022)*
