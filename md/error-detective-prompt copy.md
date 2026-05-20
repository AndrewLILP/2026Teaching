# Error Detective — Standalone Page Builder Prompt

Copy the section below and paste it directly to Claude. Fill in the bracketed content fields for your topic before sending.

---

## THE PROMPT

Please build a single self-contained HTML file: an **Error Detective** activity page. No external dependencies beyond Google Fonts (Nunito, loaded via `@import`).

---

### What Error Detective is

Each case shows anonymous worked mathematics with **exactly one deliberate error**. Students read each line, click the line they think is wrong, then reveal a full explanation. The format:

- Line numbers on the left
- Clicking a line marks it red (wrong guess) or green (correct guess)
- "Reveal Error & Explanation" button shows a panel with: the **error type name**, a paragraph explaining what went wrong and why it's a common mistake, and the **correct working** in a green box
- Only one line per case carries `data-correct="true"` — this is the line containing the error

---

### Page structure

- A page header (title, subtitle, brief instructions)
- A **tab navigation bar** — one tab per concept area
- Each tab contains **2–4 Error Detective cases**
- All cases use the same card format described below

---

### Design system

```
Font:            Nunito (Google Fonts, @import)
Background:      #F4EFE9  (warm off-white)
Card background: #FFFFFF
Border:          #DDD5CA

Detective card header:  linear-gradient(90deg, #3B1F6B 0%, #6B3FA0 100%) — white text
Detective intro panel:  background #F3F0FA, border-bottom #DDD5F0, text #3B1F6B
Tab nav background:     #3B1F6B
Active tab:             white text, white 3px bottom border
Error line hover:       border #D4ADEA, background #F3E8FC
Error line selected (wrong guess):   border #C75B39, background #FDE8E0
Error line selected (correct guess): border #3D7054, background #E2F0E8
Highlighted error (after reveal):    border #C75B39, background #FDE8E0
Reveal button:          background #6B3FA0, white text
Reveal panel:           background #FDE8E0, border 2px solid #C75B39
Error type name:        font-size .72rem, uppercase, color #C75B39
Correct working box:    background #E2F0E8, border-left 3px solid #3D7054
```

---

### Fraction rendering

All fractions use a `.frac` CSS class — never the slash character.

```html
<!-- Example: x/3 written as: -->
<span class="frac"><span class="num">x</span><span class="den">3</span></span>

<!-- CSS: -->
.frac { display:inline-flex; flex-direction:column; align-items:center;
        vertical-align:middle; line-height:1; margin:0 3px; }
.frac .num { border-bottom:1.5px solid currentColor; padding:0 4px 2px;
             font-size:.88em; font-weight:700; }
.frac .den { padding:2px 4px 0; font-size:.88em; font-weight:700; }
```

---

### HTML structure for each Error Detective case

```html
<div class="detective-card" id="det-[TAB-ID]-[CASE-NUMBER]">

  <div class="detective-head">
    <span>🔍</span>
    <span>Case [N] — [Case Title]</span>
  </div>

  <div class="detective-intro">
    [One sentence describing what the student was trying to solve,
     including any relevant numbers/fractions inline.]
  </div>

  <div class="error-steps">

    <div class="error-line" onclick="selectLine(this,'det-[TAB-ID]-[CASE-NUMBER]',false)" data-correct="false">
      <span class="line-num">Line 1</span>
      <span class="line-content">[Line content]</span>
    </div>

    <!-- Repeat for each line. The ONE wrong line gets data-correct="true" -->
    <div class="error-line" onclick="selectLine(this,'det-[TAB-ID]-[CASE-NUMBER]',true)" data-correct="true">
      <span class="line-num">Line N</span>
      <span class="line-content">[The line containing the error]</span>
    </div>

  </div>

  <button class="reveal-error-btn" onclick="revealError('det-[TAB-ID]-[CASE-NUMBER]')">
    Reveal Error &amp; Explanation
  </button>

  <div class="error-reveal-panel" id="det-[TAB-ID]-[CASE-NUMBER]-reveal">
    <div class="error-name">🎯 Error Type: [Short name of the error pattern]</div>
    <p>[Explanation: which line is wrong, why it is wrong, what misconception caused it,
       and why this error is common. 2–3 sentences.]</p>
    <div class="correct-working">
      ✅ Correct: [The correct working for this step/problem]
    </div>
  </div>

</div>
```

---

### JavaScript (include once at the bottom of the file)

```javascript
function showTab(name, btn) {
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  btn.classList.add('active');
}

function selectLine(el, caseId, isCorrect) {
  document.getElementById(caseId).querySelectorAll('.error-line')
    .forEach(l => l.classList.remove('selected-wrong', 'selected-right'));
  el.classList.add(isCorrect ? 'selected-right' : 'selected-wrong');
}

function revealError(caseId) {
  document.getElementById(caseId + '-reveal').classList.add('show');
  document.getElementById(caseId).querySelectorAll('.error-line').forEach(l => {
    if (l.dataset.correct === 'true') l.classList.add('highlighted-error');
  });
}
```

---

### Important rules

- **Exactly one error per case** — all other lines must be correct
- **Never use named fictional students** — cases are always anonymous worked solutions
- **Error types** should be named clearly (e.g. "Incorrect HCF Identification", "Flipping the Wrong Fraction", "Rounding in Stages")
- **Correct working** in the reveal box must be complete, not just the corrected step
- **Lines** should be 3–6 per case — enough context to make the error non-obvious, not so many it becomes a reading task
- **Fractions** must use the `.frac` class — never written as `3/4` inline

---

---

## Example CONTENT TO BUILD

**File title:** Error Detective — Fractions, Decimals & Percentages (MA4-FRC-C-01)

**Page header:**
- Title: Error Detective
- Subtitle: Fractions, Decimals & Percentages · MA4-FRC-C-01 · Stage 4
- Instructions: "Each case contains exactly one error. Read every line carefully, click the line you think is wrong, then reveal the answer and explanation."

**Tabs:** 4 tabs as follows.

---

### Tab 1 — Fractions: Equivalence & Comparison

**Case 1 — Simplifying a Fraction**

Intro: A student simplifies 30/45. Find the line containing the error.

Lines:
1. Factors of 30: 1, 2, 3, 5, 6, 10, 15, 30 ✓
2. Factors of 45: 1, 3, 5, 9, 15, 45 ✓
3. Common factors: 1, 3, 5, 15 → HCF = 5 ← **ERROR** (HCF is 15, not 5)
4. 30 ÷ 5 / 45 ÷ 5 = 6/9
5. HCF(6, 9) = 3, so this is not simplest form yet. Final answer: 2/3

Error type: Incorrect HCF Identification
Explanation: The common factors of 30 and 45 are 1, 3, 5, and 15 — and 15 is the largest, so HCF(30, 45) = 15, not 5. The student stopped at 5 rather than continuing to find the true highest common factor. Using the correct HCF would simplify in one step.
Correct working: HCF(30, 45) = 15 → 30 ÷ 15 / 45 ÷ 15 = 2/3

---

**Case 2 — Comparing Fractions**

Intro: A student compares 2/3 and 3/5 to decide which is larger. Find the error.

Lines:
1. I need a common denominator for 3 and 5. LCM(3, 5) = 15. ✓
2. 2/3 = 10/15 (multiplied numerator and denominator by 5) ✓
3. 3/5 = 8/15 (multiplied numerator and denominator by 3) ← **ERROR** (3 × 3 = 9, not 8)
4. Comparing: 10/15 vs 8/15 → 10 > 8
5. Therefore 2/3 > 3/5

Error type: Incorrect Equivalent Fraction — Multiplication Error
Explanation: To convert 3/5 to fifteenths, multiply both parts by 3: 3 × 3 = 9 (not 8) and 5 × 3 = 15. The denominator was converted correctly but the numerator calculation is wrong — possibly the student added instead of multiplied. The conclusion happens to be correct but was reached using wrong working.
Correct working: 3/5 = 9/15. Comparing 10/15 vs 9/15 → 2/3 > 3/5 ✓

---



## END OF CONTENT

Ask clarifying questions before building the complete HTML file.
