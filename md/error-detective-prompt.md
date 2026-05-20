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

## CONTENT TO BUILD

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

### Tab 2 — Fractions: Operations

**Case 1 — Adding Fractions**

Intro: A student adds 2/3 + 3/4. Find the line containing the error.

Lines:
1. LCD(3, 4) = 12 ✓
2. Convert 2/3: multiply top and bottom by 4 → 8/12 ✓
3. Convert 3/4: multiply top and bottom by 4 → 12/12 ← **ERROR** (should multiply by 3, not 4)
4. 8/12 + 12/12 = 20/12
5. 20/12 = 1 and 8/12 = 1 and 2/3

Error type: Wrong Multiplier When Converting to LCD
Explanation: To convert 3/4 to twelfths, the denominator 4 needs to be multiplied by 3 (not 4) to reach 12. The student used the same multiplier (×4) for both fractions. The multiplier must reflect what each individual denominator needs to reach the LCD: 3 × 4 = 12 so the first fraction uses ×4; 4 × 3 = 12 so the second uses ×3.
Correct working: 3/4 × (3/3) = 9/12 → 8/12 + 9/12 = 17/12 = 1 and 5/12

---

**Case 2 — Dividing Fractions**

Intro: A student calculates 5/6 ÷ 3/4. Find the error.

Lines:
1. Dividing by a fraction — I'll use Keep, Change, Flip. ✓
2. Flip the first fraction: 6/5 — Change ÷ to ×: 6/5 × 3/4 ← **ERROR** (should keep first, flip second)
3. Multiply: 6 × 3 / 5 × 4 = 18/20
4. Simplify: HCF(18, 20) = 2 → 9/10

Error type: Flipped the Wrong Fraction
Explanation: Keep, Change, Flip means: Keep the first fraction (5/6) unchanged, Change ÷ to ×, and Flip only the second fraction (3/4 → 4/3). The student flipped the first fraction instead. An estimate confirms the error: since 5/6 ≈ 1 and 3/4 ≈ 1, the answer should be close to 1 ÷ 1 = 1. The correct answer 1 and 1/9 ≈ 1.11 is near 1; the student's 9/10 = 0.9 is not.
Correct working: 5/6 ÷ 3/4 = 5/6 × 4/3 = 20/18 = 10/9 = 1 and 1/9

---

### Tab 3 — Decimals & Number Types

**Case 1 — Rounding Decimals**

Intro: A student rounds 4.682 to 2 decimal places. Find the error.

Lines:
1. I'll round 4.682 to 2 decimal places. ✓
2. First, I'll round to 1 decimal place: the 2nd decimal is 8 ≥ 5, so 4.682 → 4.7 ← **ERROR** (rounding in stages — must round directly to the required place)
3. Now round 4.7 to 2 decimal places: 4.7 = 4.70
4. Answer: 4.70

Error type: Rounding in Stages (Cascade Error)
Explanation: The student rounded to 1 decimal place first (getting 4.7), then rounded that result to 2 decimal places (getting 4.70). This introduces a cascade error — the intermediate rounding corrupts the final result. The correct method is to round directly to the required number of decimal places in a single step, looking only at the digit immediately after the required position.
Correct working: Round 4.682 to 2 dp → look at 3rd decimal: 2 < 5 → keep 2nd decimal unchanged → 4.68

---

**Case 2 — Converting a Recurring Decimal to a Percentage**

Intro: A student converts 2/3 to a decimal and then a percentage. Find the error.

Lines:
1. 2/3 = 2 ÷ 3. Long division: 3 into 20 is 6 times (6 × 3 = 18), remainder 2. ✓
2. Remainder 2 repeats → the decimal is 0.666… = 0.6 (recurring) ✓
3. 2/3 = 0.6 recurring — rational, recurring decimal ✓
4. As a percentage: 0.6 recurring × 100 = 6.6 recurring % ← **ERROR** (0.666… × 100 = 66.6…%, not 6.6…%)

Error type: Incorrect Decimal-to-Percentage Conversion
Explanation: To convert a decimal to a percentage, multiply by 100 — this moves the decimal point two places to the right. The student produced 6.6̄%, which results from moving the decimal only one place (multiplying by 10). 0.666… × 100 = 66.666…% = 66.6̄%.
Correct working: 0.6̄ × 100 = 66.6̄% (equivalently 66 and 2/3 %)

---

### Tab 4 — Percentages

**Case 1 — Calculating Percentage Increase**

Intro: A price increased from $80 to $100. A student calculates the percentage increase. Find the error.

Lines:
1. Percentage increase = (new value − original value) ÷ ??? × 100 ✓ (formula setup)
2. = (100 − 80) ÷ 100 × 100 = 20/100 × 100 = 20% ← **ERROR** (must divide by original value $80, not new value $100)
3. The price increased by 20%.

Error type: Dividing by the New Value Instead of the Original
Explanation: Percentage change is always relative to the original (starting) value — the base you are measuring the change from. The student divided the $20 change by $100 (the new price) instead of $80 (the original price). This produces the profit as a percentage of selling price, not the percentage increase.
Correct working: (100 − 80) ÷ 80 × 100 = 20 ÷ 80 × 100 = 25% increase

---

**Case 2 — Successive Percentage Changes**

Intro: A $200 item is increased by 20%, then decreased by 20%. A student calculates the final price. Find the error.

Lines:
1. After 20% increase: $200 × 1.20 = $240 ✓
2. 20% decrease: 20% of $200 = $40, so subtract $40 from $240 ← **ERROR** (the 20% decrease applies to $240, not the original $200)
3. Final price: $240 − $40 = $200
4. Conclusion: The price returns to its original value.

Error type: Applying the Second Percentage to the Wrong Base
Explanation: After the 20% increase, the price is $240 — this is now the current value and the base for the next change. The 20% decrease must be calculated from $240, not from the original $200. Because 20% of $240 ($48) is more than 20% of $200 ($40), the decrease removes more than the increase added, giving a net loss of 4%.
Correct working: 20% of $240 = $48 → $240 − $48 = $192. Or: $200 × 1.20 × 0.80 = $200 × 0.96 = $192 (a 4% net decrease)

---

## END OF CONTENT

Build the complete single HTML file now. Do not ask clarifying questions — build directly.
