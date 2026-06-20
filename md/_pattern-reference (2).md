# NESA Sample Units — Pattern Reference

**Purpose:** This document is the single source of truth for how every NESA Sample Unit page on this site is built. It exists so a unit can be built in its own chat, by an instance of Claude with no memory of how earlier units were built, and still come out visually and structurally consistent.

If you are building a new unit: read this document fully before writing any code. Then read the unit-specific brief (e.g. `brief-mechatronics-timeline.md`) for what content goes *into* these patterns.

---

## 1. Where things live

```
computing/
├── index.html                                    — department landing page
├── ct5/                                           — main Stage 5 strand/skills site (separate from NESA samples)
├── assets/
│   ├── css/ct-shared.css                          — design tokens + all components (Layer 1–5)
│   ├── css/ct-lessons.css                         — paper/notebook aesthetic layer, loads AFTER ct-shared.css
│   └── js/
│       ├── ct-core.js                             — always loaded: font toggle, expand cards, sidebar TOC, CPD strip click, smooth scroll
│       ├── ct-interactive.js                      — loaded only on pages with MCQs, flip cards, lang tabs, bug detective
│       └── ct-progress.js                         — loaded only on lesson pages with a checkpoint/reflection (localStorage progress)
└── NESAsamples/
    ├── index.html                                 — master hub: every NESA sample unit, all focus areas
    ├── mechatronics-investigating-io/              — Unit 1 (built)
    │   ├── index.html
    │   └── lesson01.html, lesson02.html, …
    ├── mechatronics-timeline/                      — Unit 2
    │   ├── index.html
    │   └── lesson01.html, …
    ├── mechatronics-digital-wellbeing/              — Unit 3
    │   ├── index.html
    │   └── lesson01.html, …
    └── [focus-area]-[unit-slug]/                   — pattern for every future unit
        ├── index.html
        └── lesson01.html, lesson02.html, …
```

**Naming convention:** `[focus-area-keyword]-[short-unit-slug]/`, lowercase, hyphenated. Inside the folder, lesson files are just `lesson01.html`, `lesson02.html`, etc. — no unit prefix, because the folder already disambiguates.

**Path depth:** Files inside a unit folder are two levels below `computing/`, so all asset links are `../../assets/...` and the link back to `computing/index.html` is `../../index.html`. The link to the master NESA hub is `../index.html`. The link to that unit's own hub is `index.html`.

---

## 2. Page anatomy (every lesson page, in order)

1. `<!DOCTYPE html>`, meta charset/viewport, `<title>`, meta description
2. `<link>` to `ct-shared.css`, then `ct-lessons.css`
3. A page-level `<style>` block containing **only** the four accent variable overrides (see §3) — nothing else
4. `<body class="font-nunito">`
5. Skip link
6. `.ct-nav` — logo, context label, font toggle, a button back to the unit hub
7. `.ct-breadcrumb` — see §4 for the exact chain
8. `.page-wrap` containing `.ct-sidebar` + `.main-col`
9. Inside `.main-col`: `.page-hero`, an `.info-box` timing breakdown, then `.content-section` blocks for each part of the lesson, then `.cpd-section`, then a prev/next nav
10. Scripts: `ct-core.js`, `ct-interactive.js` (only if needed), `ct-progress.js` (only if there's a checkpoint), then a `CTProgress.initLessonPage(...)` call

Unit hub (`index.html`) pages skip the sidebar/page-wrap entirely — see §7.

---

## 3. Accent colour per focus area

Page-level `<style>` block — copy exactly, only change the five hex/rgba values:

```html
<style>
  :root {
    --accent:         #0e7490;
    --accent-dim:     #0c5f78;
    --accent-bright:  #0891b2;
    --accent-surface: rgba(34, 211, 238, 0.14);
    --accent-border:  rgba(14, 116, 144, 0.30);
  }
</style>
```

| Focus area | `--accent` | `--accent-bright` | Notes |
|---|---|---|---|
| Mechatronic & Automated Systems | `#0e7490` | `#0891b2` | cyan family — used by all 3 mechatronics units above |
| Creating Games & Simulations | `#7c3aed` | `#8b5cf6` | violet family, matches `--color-sd-games` |
| Developing Apps & Web Software | `#0d9488` | `#14b8a8` | teal family, matches `--color-sd-apps` |
| Analysing Data | `#b45309` | `#f59e0b` | amber family, matches `--color-eis-data` |
| Modelling Networks & Social Connections | `#a21caf` | `#e879f9` | magenta family, matches `--color-eis-networks` |
| Designing for UX | `#e11d48` | `#fb7185` | rose family, matches `--color-eis-ux` |

For a unit spanning two focus areas (e.g. the timeline unit is Mechatronics + UX), use the **primary/first-listed** focus area's colour. Don't blend or alternate colours within one unit — pick one and stay consistent across every lesson in that unit.

**Never** touch `--space-*`, `--text-*`, `--line-height-*`, `--font-*`, or the dyslexia toggle. Those are inherited untouched from `ct-shared.css`.

---

## 4. Breadcrumb pattern

Six levels deep for a lesson page, five for a unit hub:

```html
<!-- Lesson page -->
<nav class="ct-breadcrumb" aria-label="Breadcrumb">
  <ol>
    <li><a href="../../index.html">Computing Technology</a></li>
    <li><a href="../../ct5/index.html">Stage 5</a></li>
    <li><a href="../../ct5/software-development/mechatronics/skills.html">Mechatronics</a></li>
    <li><a href="../index.html">NESA Sample Units</a></li>
    <li><a href="index.html">[Unit name]</a></li>
    <li aria-current="page">Lesson N</li>
  </ol>
</nav>

<!-- Unit hub page -->
<nav class="ct-breadcrumb" aria-label="Breadcrumb">
  <ol>
    <li><a href="../../index.html">Computing Technology</a></li>
    <li><a href="../../ct5/index.html">Stage 5</a></li>
    <li><a href="../../ct5/software-development/mechatronics/skills.html">Mechatronics</a></li>
    <li><a href="../index.html">NESA Sample Units</a></li>
    <li aria-current="page">[Unit name]</li>
  </ol>
</nav>
```

Swap the fourth-level path (`.../mechatronics/skills.html`) for whichever focus-area hub the unit actually belongs to (games, apps, data, networks, UX) — ask the user for that path if it isn't obvious from the existing site structure, rather than guessing.

`.ct-nav-context` in the nav bar should show the *unit name*, not a generic "NESA Sample Unit" label — e.g. `<span>Investigating Inputs &amp; Outputs</span>`.

---

## 5. Component markup cookbook

Everything below already exists in `ct-shared.css` / `ct-interactive.js`. Copy the markup verbatim; don't invent parallel components for the same job.

### MCQ checkpoint
```html
<div class="mcq-card" data-q="1" data-correct="B"
     data-feedback-a="Incorrect — reason..."
     data-feedback-b="✓ Correct — reason..."
     data-feedback-c="Incorrect — reason..."
     data-feedback-d="Incorrect — reason...">
  <div class="mcq-question">Question text</div>
  <div class="mcq-options" role="group" aria-label="Question 1 options">
    <button class="mcq-option" data-idx="A"><span class="mcq-option-letter">A</span> Option text</button>
    <button class="mcq-option" data-idx="B"><span class="mcq-option-letter">B</span> Option text</button>
    <button class="mcq-option" data-idx="C"><span class="mcq-option-letter">C</span> Option text</button>
    <button class="mcq-option" data-idx="D"><span class="mcq-option-letter">D</span> Option text</button>
  </div>
  <div class="mcq-feedback" id="mcq-feedback-1"></div>
  <button class="mcq-reset" id="mcq-reset-1">↩ Try again</button>
</div>
```
Always 3 questions per checkpoint unless the brief says otherwise. Requires `ct-interactive.js`.

### Flip-card vocabulary
```html
<div class="flip-card-grid">
  <button class="flip-card" type="button" aria-pressed="false">
    <span class="flip-card__inner">
      <span class="flip-card__face flip-card__face--front" aria-hidden="false">
        <span class="flip-card__term">Term</span>
        <span class="flip-card__hint">Tap to reveal</span>
      </span>
      <span class="flip-card__face flip-card__face--back" aria-hidden="true">
        <span class="flip-card__def">Definition text.</span>
      </span>
    </span>
  </button>
  <!-- repeat per term -->
</div>
```
Use for vocabulary that benefits from active recall (predict-then-reveal). Use the plain `.word-bank` grid instead when there are more than ~8 terms or when students need to scan all definitions at once (flip cards hide content, which is the wrong call for a quick-reference list). Requires `ct-interactive.js`.

### IPO / process flow diagram
```html
<div class="ipo-flow">
  <div class="ipo-step">
    <span class="ipo-step__label">Stage label</span>
    <p>Description</p>
  </div>
  <span class="ipo-arrow" aria-hidden="true">→</span>
  <!-- repeat -->
</div>
```
No JS required — pure CSS/HTML, screen-reader order carries the meaning.

### Tiered tasks (Foundation / Core / Extension)
```html
<div class="tier-grid">
  <div class="tier-card">
    <span class="tier-badge tier-foundation">Foundation · D–E</span>
    <h4>Task title</h4>
    <p>Task description.</p>
  </div>
  <div class="tier-card">
    <span class="tier-badge tier-core">Core · C</span>
    <h4>Task title</h4>
    <p>Task description.</p>
  </div>
  <div class="tier-card">
    <span class="tier-badge tier-extension">Extension · A–B</span>
    <h4>Task title</h4>
    <p>Task description.</p>
  </div>
</div>
```
Always exactly 3 cards, always Foundation → Core → Extension in that order.

### CPD grade strip
```html
<section class="cpd-section" id="cpd">
  <h2>How am I doing?</h2>
  <p class="cpd-intro">Click the grade that best matches your notebook entry and tiered task today.</p>
  <div class="cpd-strip">
    <div class="cpd-grade cpd-grade-a" tabindex="0" role="button" aria-pressed="false">
      <span class="grade-label">A</span>
      <p>Grade A descriptor, condensed from the official syllabus performance descriptor and made specific to today's content.</p>
    </div>
    <!-- repeat for B, C, D, E -->
  </div>
</section>
```
Write a fresh descriptor for every lesson — never reuse one verbatim from another lesson. Each should blend the official NESA course performance descriptor language with the specific content of that lesson (see Lesson 1/2 of the Investigating Inputs and Outputs unit for the established tone). Requires `ct-core.js` (already always loaded).

### Notebook entry with autosave
```html
<section class="content-section" id="notebook">
  <h2>Notebook entry</h2>
  <div class="notebook-prompt">
    <p class="notebook-prompt__label">Project notebook — [D&amp;P phase]</p>
    <ul>
      <li>
        Prompt text.
        <span class="sentence-starter">Sentence starter: "..."</span>
      </li>
    </ul>
    <textarea class="reflection-textarea" data-progress-reflection aria-label="Notebook reflection" placeholder="Write your reflection here — it autosaves as you type."></textarea>
    <span class="reflection-status" data-progress-reflection-status></span>
  </div>
</section>
```
Requires `ct-progress.js` and the `CTProgress.initLessonPage(...)` call (see §6).

### Lesson prev/next nav
```html
<nav class="lesson-nav" aria-label="Lesson navigation">
  <a class="lesson-nav__link lesson-nav__link--prev" href="...">
    <span class="lesson-nav__dir">← Back to</span>
    <span class="lesson-nav__title">Unit hub</span>
  </a>
  <a class="lesson-nav__link lesson-nav__link--next" href="...">
    <span class="lesson-nav__dir">Next →</span>
    <span class="lesson-nav__title">Lesson title</span>
  </a>
</nav>
```
Added when building the Mechatronics Timeline unit's Lesson 1 — no lesson page anywhere on the site had a bottom prev/next nav component until then. Generic on purpose, lives in `ct-shared.css` Layer 5, no JS required. At the start of a sequence, point `--prev` at the unit hub (`index.html`); at the end, point `--next` at the unit hub too rather than a non-existent "lesson 14".

### Flowchart (sensor → decision → actuator)
```html
<div class="flowchart">
  <div class="flowchart-step">
    <span class="flowchart-step__label">Start</span>
    <p>Sensor runs continuously</p>
  </div>
  <span class="flowchart-arrow" aria-hidden="true">↓</span>
  <div class="flowchart-decision"><p>Person detected?</p></div>
  <div class="flowchart-branches">
    <div class="flowchart-branch">
      <span class="flowchart-branch__label flowchart-branch__label--yes">Yes</span>
      <span class="flowchart-arrow" aria-hidden="true">↓</span>
      <div class="flowchart-step"><p>Door opens</p></div>
    </div>
    <div class="flowchart-branch">
      <span class="flowchart-branch__label flowchart-branch__label--no">No</span>
      <span class="flowchart-arrow" aria-hidden="true">↓</span>
      <div class="flowchart-step"><p>Door stays closed</p></div>
    </div>
  </div>
</div>
```
Added building the Mechatronics Timeline unit's Lesson 6, to evidence CT5-OPL-01 (algorithm design) without requiring a programming language. **Deliberately scoped to one decision point with two branches** — not a general flowchart engine. The decision diamond uses `clip-path: polygon(...)` rather than rotate+counter-rotate, so text stays upright; keep decision question text to a handful of words, since clip-path crops a rectangle into a diamond and long text overflows the visible shape. Add `.is-blank` to any `.flowchart-step` or `.flowchart-decision` for a dashed fill-in-the-blank variant (same visual language as `.ipo-flow--blank`). Lives in `ct-shared.css`, no JS.

### Spec table (requirements / test cases)
```html
<div class="spec-table-wrap">
  <table class="spec-table">
    <thead><tr><th>Input</th><th>Expected output</th></tr></thead>
    <tbody>
      <tr><td>...</td><td>...</td></tr>
    </tbody>
  </table>
</div>
```
Added alongside the flowchart (Lesson 6) for NESA's "test cases of inputs and expected outputs" content point. Deliberately separate from `.trace-table`, which is monospaced for code desk-checking — this is plain prose, for requirement/test-case rows that read as sentences.

### Word bank (non-flip vocabulary)
```html
<div class="word-bank">
  <h3>Word bank</h3>
  <div class="word-bank-grid">
    <div class="word-bank-item">
      <p class="word-bank-term">Term</p>
      <p class="word-bank-def">Definition.</p>
    </div>
  </div>
</div>
```

### Tiered task wrapper, example box, info box, analysis box, guided box
All exist already — search `ct-shared.css` for `.example-box`, `.info-box`, `.analysis-box`, `.guided-box` before writing any new inline-styled callout. If none of the existing callout types fit, flag this in the chat rather than inventing a new pattern silently.

### Sticky note / margin note / highlighter (paper aesthetic)
```html
<aside class="paper-sticky paper-sticky--rotate-l">
  <p class="paper-sticky__label">Teacher tip</p>
  <p>Tip text.</p>
</aside>

<p class="paper-margin-note">Margin note text.</p>

<mark class="paper-hl paper-hl--yellow">highlighted term</mark>
```
Use sparingly — 2–3 sticky notes per lesson maximum. Alternate `--rotate-l` / `--rotate-r` for visual variety down the page.

---

## 6. Progress tracking

Every lesson with a checkpoint and/or reflection ends with:

```html
<script src="../../assets/js/ct-core.js"></script>
<script src="../../assets/js/ct-interactive.js"></script>
<script src="../../assets/js/ct-progress.js"></script>
<script>
  CTProgress.initLessonPage({
    unitId: 'nesa-[unit-slug]-2026',
    lessonId: 'lessonNN',
    totalQuestions: 3
  });
</script>
```

`unitId` must be unique **per unit**, not per lesson — every lesson in the same unit shares the same `unitId` so progress aggregates correctly (e.g. `nesa-mechatronics-io-2026`, `nesa-mechatronics-timeline-2026`, `nesa-mechatronics-wellbeing-2026`). `lessonId` is always `lesson01`, `lesson02`, etc., matching the filename. `totalQuestions` matches the number of `.mcq-card` elements on the page (almost always 3).

---

## 7. Unit hub (`index.html`) anatomy

No sidebar, no `.page-wrap` — full-width `.main-col` with `max-width: 980px; margin: 0 auto;` inline on the `<main>` tag. Structure:

1. `.page-hero` — eyebrow naming the NESA source unit, `<h1>` with the unit's actual title, intro paragraph, outcome tags, duration/lesson-count line
2. `.teaching-advice` callout — one paragraph on how this unit relates to the rest of the site (standalone? companion to a longer unit? etc.)
3. A short `.content-section` mapping lessons to D&P phases via `.phase-pills`
4. One `.content-section` per D&P phase, each containing an `.ethics-grid` of `.ethics-card` lesson links (this is a repurposed component — `<h4><a>` for the lesson title/link, `<p>` for a one-sentence description)
5. Optional closing section noting the platform/tool used for any hands-on build lessons

Lesson links inside the hub are always presented uniformly, whether or not that lesson file has actually been built yet — no "coming soon" labels, no visual distinction between built and not-yet-built. This is a deliberate house rule, not an oversight.

---

## 8. Pedagogical non-negotiables (apply to every unit, every lesson)

- **Analysis before construction.** Students look at and annotate real/existing examples before being asked to build anything themselves.
- **NSW pseudocode before any code.** If a lesson includes a programming language (Python, Blocks, etc.), pseudocode comes first, in a `.pseudo-block`.
- **D&P phase tagging.** Every `.content-section` that's clearly within one D&P phase gets a `.section-phase-tag` at its top (`identify` / `research` / `produce` / `test`).
- **Three-tier differentiation** on the main task of the lesson (`.tier-grid`), always Foundation/Core/Extension.
- **CPD grade strip** on every lesson page, descriptors written fresh per lesson.
- **Timing breakdown** in an `.info-box` immediately under the hero, summing to 50 minutes.
- **One MCQ checkpoint** (3 questions) and **one notebook entry** with sentence starters, near the end of the lesson, before the CPD strip.
- **Prev/next nav** at the very bottom, linking to the previous and next lesson (or the unit hub, at the start/end of the sequence).
- Accessibility minimums (15px base font, 1.75 line height, dyslexia toggle, skip link, focus-visible outlines) all come free from `ct-shared.css` — don't override them.

---

## 9. When you genuinely need something new

If a unit's content needs a component that doesn't exist yet (like the flip-card needed for vocabulary recall in the Investigating Inputs and Outputs unit), add it properly:

1. Add the CSS to `ct-shared.css`, in the Layer 5 components section, with a markup-pattern comment block at the top (follow the flip-card or frayer-card precedent).
2. Add any JS behaviour to `ct-interactive.js` as a self-contained IIFE, following the existing pattern (MCQ engine, lang tabs, bug detective).
3. **Test it before shipping it.** Render the page in a headless browser, click/interact with the new component, and check computed styles or bounding boxes — don't assume CSS "should" work. (The flip-card's first version silently failed because `.flip-card__inner` was a `<span>` with `width`/`height` set, which do nothing on an inline element without `display: block`. This was only caught by actually testing it, not by reading the CSS.)
4. Update this reference doc with the new pattern so later units can reuse it.

Never solve a one-off layout need with a page-level `<style>` block beyond the four accent variables — it breaks the "every page styles identically from the same two CSS files" guarantee this whole system depends on.
