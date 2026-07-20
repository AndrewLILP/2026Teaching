# Topic Review Notebook — Build Workflow

**Last updated:** 20 July 2026

> **Companion doc required:** upload `design-and-standards-reference.md` alongside this file at the start of every build chat. It holds the design constants, accessibility rules, fraction rendering, MCQ safety pattern, and Error Detective spec — this doc only covers what's specific to building a Topic Review Notebook.
>
> **Renamed from "Daily Review Notebook" (20 July 2026).** Intentional pivot — the resource was never strictly a once-a-day tool (it's also a pre-lesson warm-up, an exit slip, and a home-study page), so "Topic Review" better describes what it does. Structure and pedagogy are unchanged — only the name, and everything downstream of it.

---

## What this resource is

A self-contained HTML interactive workbook, one file per outcome, structured as a physical notebook with three sections per sub-topic page:

- **Section 1 · Pre-lesson Review** — prerequisite skills, tiered Foundation/Core/Extension, 2 questions per tier, teacher-controlled (~5 min)
- **Section 2 · Exit Slip** — 2 MC + 1 type-in + 1 Error Detective + confidence rating
- **Section 3 · Home Study** — today's sub-topic + one prior sub-topic (spaced retrieval) + notebook reflection prompt

**Design:** Notebook aesthetic (spiral binding, lined paper, tab dividers). Design constants in `design-and-standards-reference.md`.

**Architecture:** Single self-contained HTML/CSS/JS file. No external dependencies except Google Fonts. No backend. localStorage for answer state and confidence ratings.

---

## Starting a new topic — open a new chat and say:

> "Guide me through the topic review notebook workflow for [OUTCOME CODE]"

---

## Step 1 — Upload workflow files

Upload `topic-review-notebook-workflow.md` **and** `design-and-standards-reference.md` at the start of the chat.

---

## Step 2 — Syllabus screenshots to upload

| Screenshot | What to capture | Why |
|---|---|---|
| **Outcome overview** | The outcome code, description, and sub-topic headings (content groups) | Confirms the sub-topics and their exact NESA wording |
| **Life Skills view** | Toggle "View Life Skills" and capture related content | Reveals prerequisite/foundational knowledge → informs Section 1 |
| **Teaching advice — Key ideas & Background knowledge** | Key ideas and background knowledge list | Background knowledge = the prerequisite map for Section 1 |
| **Teaching advice — Making connections** | Full connections table | Cross-outcome links → informs Section 3 spaced retrieval choices |
| **Teaching advice — Non-routine problem solving** | Non-routine problems list | Extension-tier inspiration for Error Detective cases |
| **Content with Examples** | Toggle "Examples" on, capture each content group | Clearest signal of expected question types and contexts |

> Paste all example screenshots in one message.

---

## Step 3 — Pre-build conversation (before any code is written)

### 3a — Confirm sub-topics
Name each sub-topic using NESA wording. Most outcomes have 5 sub-topics — adjust to match the actual number of NESA content groups.

### 3b — Map the prerequisite for each sub-topic (Section 1)
Propose a prerequisite skill per page, drawing from Background knowledge, Life Skills related content, and the Making connections table. Confirm or adjust each.

### 3c — Map the spaced retrieval chain (Section 3)
Page 1 retrieves from the external prerequisite (per Section 1). Pages 2–N retrieve from the previous sub-topic in the unit. Confirm or adjust.

### 3d — Question workshop (10–15 min discussion)
Draft a small sample set for one page (typically Page 1): one MC per tier with 3 misconception distractors, one Error Detective case, one type-in question. Review difficulty, context, and misconception quality before the full build.

### 3e — Final spec confirmation
Write a clean spec table (same format as prior units) and get approval before writing any code.

---

## Step 4 — Build

Write the full file in one pass after spec approval.

**File naming:** `[outcome-code]-topic-review.html`, e.g. `ma4-alg-c-01-topic-review.html`

**Page container IDs:** every page container must carry `id="page-[n]"` (e.g. `id="page-1"`) so the unit `index.html` can deep-link to each page via anchor. Mandatory.

---

## Step 5 — Review and fix

Beyond the general accessibility/technical checks in `design-and-standards-reference.md`, check:

- Tier tab switching (Foundation/Core/Extension)
- Fraction rendering (see standards doc — never inline)
- **MCQ answer-letter distribution counted and balanced** (see standards doc)
- Type-in tolerance (decimals, rounding where needed)
- Error Detective step selection and feedback
- Confidence rating saves to localStorage
- `#page-[n]` anchor IDs present on each page container

Report bugs as a list. Fix targeted sections only — no full rebuild unless required.

---

## Notebook-specific design constants

(General constants — fonts, accessibility — are in `design-and-standards-reference.md`.)

| Element | Value |
|---|---|
| Background | `#C8BFB0` (outer) / `#F7F4EE` paper / `#EDE8DF` paper-dark |
| Section 1 accent | `#3D7AB5` slate blue |
| Section 2 accent | `#4A7C59` forest green |
| Section 3 accent | `#B85C38` terracotta |
| Tab colours | Per-topic (distinct colours, one per sub-topic page) |
| Spiral binding | Left-side decorative strip, 14 coils |
| Lined paper | CSS `repeating-linear-gradient` at 32px intervals |

---

## localStorage key schema

The key infix is `trn` (**T**opic **R**eview **N**otebook), replacing the old `drn` (Daily Review Notebook) infix used in files built before 20 July 2026.

| Data | Key pattern | Example |
|---|---|---|
| Answer state | `[code]-trn-p[n]-s[n]-q[n]` | `rat-trn-p1-s2-q3` |
| Confidence rating | `[code]-trn-conf-p[n]` | `rat-trn-conf-p1` |

Follow these patterns exactly so future tooling and the unit `index.html` can read them consistently.

> **Files built before this rename** (e.g. `ma4-rat-c-01-daily-review.html`) still use the old `-daily-review.html` filename and `drn` keys. This doc governs new builds — retrofitting old files is a separate task, not automatic.

---

## Question type rules

### MC (multiple choice)
4 options, exactly 1 correct, 3 misconception-based distractors. Safety pattern and distribution rule: see `design-and-standards-reference.md`.

### Type-in
Student enters a number. Exact match or explicit tolerance stated in spec. Wrong: clears field after 1.8s, shows redirecting hint. Correct: locks field, shows worked explanation.

### Error Detective
Spec in `design-and-standards-reference.md`.

### Confidence rating
Three-point scale: 😐 Still unsure / 🙂 Getting there / 😊 Got it! Saved to localStorage. Appears at the bottom of Section 2 only.

---

## Homework book note

Section 3 ends with a written reflection prompt, intentionally designed for the physical homework book:
- Students write the reflection by hand in their notebook.
- The digital resource does not collect this — it is a bridge to the pen-and-paper book.
- Teachers can use the reflection as a formative check-in at the start of the next lesson.

---

## Changelog

- **20 July 2026** — Split shared content (design constants, accessibility, fraction rendering, MCQ pattern, Error Detective) into `design-and-standards-reference.md`. This doc now covers only notebook-specific process and structure.
- **20 July 2026 (earlier)** — Renamed "Daily Review Notebook" to "Topic Review Notebook" throughout. File naming changed to `[outcome-code]-topic-review.html`. localStorage infix changed from `drn` to `trn`. Trigger phrase updated. Existing already-built files are not retroactively renamed by this change.
