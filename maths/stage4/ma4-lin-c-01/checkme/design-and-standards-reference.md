# Design & Standards Reference

**Last updated:** 20 July 2026

> This doc holds everything that's identical across both resource types — design constants, accessibility rules, and the technical patterns (MCQ, Error Detective, Newman's, Cartesian plane engine) that keep bugs from drifting between files. Both `chapter-teaching-resource-workflow.md` and `topic-review-notebook-workflow.md` point here instead of repeating this content, so a fix only has to happen once.
>
> **Upload this doc alongside whichever workflow doc you're using**, at the start of every build chat.

---

## Why this doc exists

Every built file is self-contained (no shared CSS/JS at runtime — see rationale below), which means a bug fix in one chapter doesn't automatically reach another. This doc is the single source of truth for the *patterns* those files should follow, so that when a bug is found and fixed, it gets fixed here first, then patched into any already-built files that use the same pattern.

**Why files stay self-contained rather than linking a shared stylesheet/script:** these are teaching resources opened from GitHub Pages, downloaded, or handed to a mentee teacher — often outside any folder structure. A shared external file adds a relative-path failure point for no runtime benefit (there's no performance cost to the current duplication; these are small static pages). Self-containment is a deliberate trade: slightly more duplication in exchange for zero broken-link risk. Keep it that way.

---

## Design constants

| Element | Value |
|---|---|
| Fonts | Nunito (headings, labels, badges) + Nunito Sans (body) + Caveat (handwritten accents) |
| Font toggle | Three options in the page header: Nunito Sans (default) / System default / Atkinson Hyperlegible — mandatory on every page |
| Body text | `#1E2A35` near-black (never pure `#000000`) |
| Correct feedback | `#4A7C59` green |
| Wrong feedback | `#C1614F` red |
| Core palette | Slate `#3D5A80`, Amber `#E89C2F`, Forest `#4A7C59`, Terracotta `#C1614F` — safe for deuteranopia/protanopia |
| Border radius | 8px cards, 4px buttons |
| Line height | ≥1.6 body text (1.7 preferred) |
| Font size | 15px minimum question text, 13px minimum feedback |

**Background differs by resource type — this is intentional, not drift:**
- Chapter Teaching Resource: `#F4EFE9` warm off-white, white (`#FFFFFF`) question cards
- Topic Review Notebook: `#C8BFB0` outer / `#F7F4EE` paper / `#EDE8DF` paper-dark (notebook aesthetic)

---

## Accessibility and inclusion notes

- **Fonts:** Nunito and Nunito Sans are evidence-aligned for students with dyslexia — open letterforms, generous x-height, rounded terminals, consistent stroke weight.
- **Specialised dyslexia fonts (OpenDyslexic etc.) are not used** — controlled studies show no improvement over well-designed standard sans-serif fonts.
- **Background:** warm off-white is intentional — the BDA recommends avoiding pure white backgrounds, which cause visual stress for many dyslexic readers. White/off-white cards within the warm background are acceptable.
- **Colour is never used alone:** all feedback uses colour + symbol (✓ / ✗ / 🔍).
- **Colour-safe palette:** avoid green/red pairings for distinction within the same section, and avoid pink/green pairs. The core palette is safe for deuteranopia and protanopia. A single-hue ramp (e.g. shades of one colour, distinguished only by lightness) is also colour-blind-safe and a good option for a chapter-accent ramp within one strand.
- **Text contrast:** any accent colour used as a background must maintain ≥4.5:1 contrast with its text — check both white text and near-black `#1E2A35` text against the shade and use whichever passes.
- **Left-aligned text only** — never centred or justified for reading passages.
- **Avoid italics** for more than 2–3 words.
- All interactive elements have `aria-label` attributes.
- No timed elements anywhere in either resource type.
- Foundation tier always uses MC only (lowest cognitive load for independent reading).

---

## Fraction rendering rules (CRITICAL)

**All fractions must render as stacked numerator-over-denominator with a vinculum, exactly like a printed textbook. Never write fractions as `3/4` or `12/16` inline.** Exception: rate notation (km/h, mL/min) stays as inline slash.

```css
.frac{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin:0 2px;font-size:0.9em;line-height:1.2;}
.frac .num{border-bottom:1.5px solid currentColor;padding:0 3px 1px;text-align:center;}
.frac .den{padding:1px 3px 0;text-align:center;}
```

```html
<span class="frac"><span class="num">12</span><span class="den">16</span></span>
```

**Critical constraint:** never put `.frac` markup inside an `onclick` attribute string — nested quotes break the HTML. Use `÷` instead inside interactive contexts, or move the fraction outside the interactive element.

---

## Inline-attribute quoting safety (generalised MCQ rule)

**This applies to every inline `onclick` string argument, not just MCQ buttons** — `checkTypein()`, `checkWD()`, or any function call passing literal text through an `onclick` attribute is equally at risk.

- **MCQ pattern (mandatory):** every MC button uses `data-result` and `data-msg` attributes plus a single `mcqAns(this)` handler. Never put feedback text directly inside `onclick`.
  ```html
  <button class="mcq-btn" data-result="wrong" data-msg="That adds instead of multiplies." onclick="mcqAns(this)">A. 8</button>
  <button class="mcq-btn" data-result="correct" data-msg="Correct! You multiplied both quantities by the same factor." onclick="mcqAns(this)">B. 12</button>
  ```
- **Any other inline `onclick` with a string argument** (e.g. `checkTypein('id', 42, 0, 'Correct message', 'Wrong message')`): the argument strings must never contain a raw apostrophe. Use an HTML entity (`&#8217;`) instead of an apostrophe, and never hand-escape with a backslash (`\'` inside an already-single-quoted JS string reads correctly, but a doubled or malformed escape like `\\'` silently breaks the attribute and kills the button with no visible error). When in doubt, avoid the apostrophe entirely by rewording.
- **Before presenting any file with type-in or guided-practice questions, grep the file for apostrophes inside `onclick="..."` blocks** and confirm each one is a clean HTML entity, not a raw or malformed backslash escape.

---

## MCQ answer distribution (mandatory self-check)

- 4 options (A–D), exactly 1 correct, 3 misconception-based distractors — each distractor names a specific, real error.
- **No letter correct more than twice within a single tier/section.** No more than 2 consecutive identical correct-letters across the section.
- **Before presenting a Practise/Independent-Practice tab, count the correct-answer letters per tier.** If any letter appears 3+ times, reorder options (swap the position of the correct answer with a distractor) in enough questions to bring it to ≤2. Do this as a matter of course, not only when the person reports it.
- Yes/No questions only have 2 letters to distribute across — treat them the same way; don't let every Yes/No question in a tier default to "A. Yes".

---

## Error Detective pattern (shared — used in both resource types)

- Anonymous worked solution — **no named student characters** (pastoral concern: students sharing those names).
- 3–5 steps displayed, exactly one step contains the error.
- Student clicks the step they believe is wrong.
- Wrong click: highlights, shows why that step is actually correct, clears after 1.8s.
- Correct click: locks all step buttons, shows the full correction.
- If a later step merely restates/propagates the error's consequence (e.g. "the solution is x=11" following a step that misread a coordinate), only the root-cause step is the clickable "correct pick" — the propagating step is not a second error site.

```javascript
function edPick(el){
  if(document.querySelector('.ed-step.locked')) return;
  const step = el.getAttribute('data-step');
  const fb = document.getElementById('edFeedback');
  if(step==='3'){ // the actual error step
    document.querySelectorAll('.ed-step').forEach(s=>s.classList.add('locked'));
    el.classList.add('correct-pick');
    fb.className='mcq-feedback show correct';
    fb.innerHTML='✓ Correct — Step 3 is wrong because...';
  } else {
    el.classList.add('wrong-pick');
    fb.className='mcq-feedback show wrong';
    fb.innerHTML='✗ That step is actually correct — look again at...';
    setTimeout(()=>{ el.classList.remove('wrong-pick'); fb.classList.remove('show'); },1800);
  }
}
```

---

## Newman's Word Problem pattern (Chapter Teaching Resource only)

Five stages: Read → Comprehend → Transform → Process → Encode. Scaffold sentence frames are collapsible (toggle button), differentiated by tier per the Differentiation Rules in the chapter workflow doc.

**Stages must accumulate, not swap.** A version that removes the previous stage's `active` class when advancing will delete that stage's feedback message from view before the student can read it — this was a real, shipped bug. Always add the next stage without removing the current one:

```javascript
// CORRECT — stages accumulate downward, feedback stays visible
function nmNext(stageNum){
  document.getElementById('nm-'+(stageNum+1)).classList.add('active');
}

// WRONG — do not do this, it hides Stage 4's feedback the instant Stage 5 appears
// function nmNext(stageNum){
//   document.getElementById('nm-'+stageNum).classList.remove('active');
//   document.getElementById('nm-'+(stageNum+1)).classList.add('active');
// }
```

**Stage 5 (Encode) must include a "Show worked solution" reveal** — a collapsible toggle showing the fully worked answer in a complete sentence, so students can check their own encoding against a model answer:

```html
<div class="newman-stage" id="nm-5">
  <h4>Stage 5 — Encode</h4>
  <p>Write your final answer in a full sentence, e.g. "..."</p>
  <button class="frame-toggle" onclick="toggleFrame('nmSolution')">Show worked solution</button>
  <div class="sentence-frame" id="nmSolution">Worked steps...<br><b>Full-sentence final answer.</b></div>
</div>
```

---

## Frayer / flip card design (Chapter Teaching Resource; used elsewhere where noted)

- Card containers must be generously sized — minimum height ~270px, minimum column width ~240px in the grid. Cramped containers (170px/160px) were a real, shipped bug; back-face content needs room to breathe.
- **Front face (term):** solid accent colour background, white or near-white text, contrast ratio ≥4.5:1.
- **Back face (definition):** warm off-white background (`#F4EFE9`), near-black text (`#1E2A35`) — this is the reading-task face, use the most legible combination.
- Back-face content should be structured as separate spaced blocks (Definition / Example / Non-example), not run together with `<br>` tags.
- CSS flip animation on click (`transform: rotateY(180deg)` on a `perspective` container).

---

## Reusable Cartesian plane engine (canonical reference)

Use this as the starting point any time a chapter or notebook page needs a graphed Cartesian plane. It's the bug-fixed, arrowhead-equipped version as of 20 July 2026 — copy from here rather than reconstructing from memory.

**Known gotcha:** `element.textContent = label` does **not** parse HTML entities — a label string containing `&minus;` will render as the literal text `&minus;`, not a minus sign. Use the actual Unicode character (`\u2212` or `−`) in any label passed to a JS-drawn SVG text node.

### Symmetric plane (range −r to r, for point-plotting and line comparisons)

```javascript
const svgNS = 'http://www.w3.org/2000/svg';
const planeMeta = {};

function initPlane(svgId, range){
  const svg = document.getElementById(svgId);
  if(!svg) return;
  const size = parseFloat(svg.getAttribute('width'));
  const margin = 20;
  const usable = size - margin*2;
  const scale = usable / (range*2);
  const originPx = size/2;
  planeMeta[svgId] = {scale, originPx, range};

  const defs = document.createElementNS(svgNS,'defs');
  const clip = document.createElementNS(svgNS,'clipPath');
  clip.setAttribute('id','clip-'+svgId);
  const rect = document.createElementNS(svgNS,'rect');
  rect.setAttribute('x',margin); rect.setAttribute('y',margin);
  rect.setAttribute('width',usable); rect.setAttribute('height',usable);
  clip.appendChild(rect); defs.appendChild(clip);
  svg.insertBefore(defs, svg.firstChild);

  const gridLayer = svg.querySelector('.grid-layer');
  const step = range > 8 ? 2 : 1; // thin out labels on wide ranges
  for(let i=-range; i<=range; i+=step){
    const gx = originPx + i*scale, gy = originPx - i*scale;
    const vLine = document.createElementNS(svgNS,'line');
    vLine.setAttribute('x1',gx); vLine.setAttribute('y1',margin-6); vLine.setAttribute('x2',gx); vLine.setAttribute('y2',size-margin+6);
    vLine.setAttribute('stroke', i===0 ? '#3D5A80' : '#EEE7DA');
    vLine.setAttribute('stroke-width', i===0 ? '2' : '1');
    gridLayer.appendChild(vLine);
    const hLine = document.createElementNS(svgNS,'line');
    hLine.setAttribute('x1',margin-6); hLine.setAttribute('y1',gy); hLine.setAttribute('x2',size-margin+6); hLine.setAttribute('y2',gy);
    hLine.setAttribute('stroke', i===0 ? '#3D5A80' : '#EEE7DA');
    hLine.setAttribute('stroke-width', i===0 ? '2' : '1');
    gridLayer.appendChild(hLine);
    if(i!==0){
      const xLabel = document.createElementNS(svgNS,'text');
      xLabel.setAttribute('x', gx-5); xLabel.setAttribute('y', originPx+13);
      xLabel.setAttribute('font-size','9'); xLabel.setAttribute('fill','#55606B');
      xLabel.textContent = i;
      gridLayer.appendChild(xLabel);
      const yLabel = document.createElementNS(svgNS,'text');
      yLabel.setAttribute('x', originPx+4); yLabel.setAttribute('y', gy+3);
      yLabel.setAttribute('font-size','9'); yLabel.setAttribute('fill','#55606B');
      yLabel.textContent = i;
      gridLayer.appendChild(yLabel);
    }
  }

  // arrowheads on both ends of both axes
  const markerId = 'arrow-'+svgId;
  const marker = document.createElementNS(svgNS,'marker');
  marker.setAttribute('id',markerId); marker.setAttribute('markerWidth','8'); marker.setAttribute('markerHeight','8');
  marker.setAttribute('refX','4'); marker.setAttribute('refY','4'); marker.setAttribute('orient','auto');
  const arrowPath = document.createElementNS(svgNS,'path');
  arrowPath.setAttribute('d','M0,0 L8,4 L0,8 z'); arrowPath.setAttribute('fill','#3D5A80');
  marker.appendChild(arrowPath); defs.appendChild(marker);
  const axisExt = 10;
  const xAxis = document.createElementNS(svgNS,'line');
  xAxis.setAttribute('x1', margin-axisExt); xAxis.setAttribute('y1', originPx);
  xAxis.setAttribute('x2', size-margin+axisExt); xAxis.setAttribute('y2', originPx);
  xAxis.setAttribute('stroke','#3D5A80'); xAxis.setAttribute('stroke-width','2');
  xAxis.setAttribute('marker-start','url(#'+markerId+')'); xAxis.setAttribute('marker-end','url(#'+markerId+')');
  gridLayer.appendChild(xAxis);
  const yAxis = document.createElementNS(svgNS,'line');
  yAxis.setAttribute('x1', originPx); yAxis.setAttribute('y1', margin-axisExt);
  yAxis.setAttribute('x2', originPx); yAxis.setAttribute('y2', size-margin+axisExt);
  yAxis.setAttribute('stroke','#3D5A80'); yAxis.setAttribute('stroke-width','2');
  yAxis.setAttribute('marker-start','url(#'+markerId+')'); yAxis.setAttribute('marker-end','url(#'+markerId+')');
  gridLayer.appendChild(yAxis);
}

function planeToPx(svgId, x, y){
  const meta = planeMeta[svgId];
  return [meta.originPx + x*meta.scale, meta.originPx - y*meta.scale];
}

function drawPointOnPlane(prefix, x, y, label){
  const svgId = prefix+'-svg';
  const svg = document.getElementById(svgId);
  if(!svg) return;
  const content = svg.querySelector('.content-layer');
  const [px,py] = planeToPx(svgId, x, y);
  const dot = document.createElementNS(svgNS,'circle');
  dot.setAttribute('cx',px); dot.setAttribute('cy',py); dot.setAttribute('r',4.5); dot.setAttribute('fill','#4A7C59');
  content.appendChild(dot);
  if(label){
    const text = document.createElementNS(svgNS,'text');
    text.setAttribute('x',px+7); text.setAttribute('y',py-7);
    text.setAttribute('font-size','11'); text.setAttribute('fill','#1E2A35'); text.setAttribute('font-weight','700');
    text.textContent = label; // use \u2212 for minus signs here, not &minus;
    content.appendChild(text);
  }
}

function drawLineOnPlane(prefix, m, c, color){
  const svgId = prefix+'-svg';
  const svg = document.getElementById(svgId);
  if(!svg) return;
  const meta = planeMeta[svgId];
  const content = svg.querySelector('.content-layer');
  const x1=-meta.range, x2=meta.range;
  const y1=m*x1+c, y2=m*x2+c;
  const [px1,py1] = planeToPx(svgId, x1, y1);
  const [px2,py2] = planeToPx(svgId, x2, y2);
  const line = document.createElementNS(svgNS,'line');
  line.setAttribute('x1',px1); line.setAttribute('y1',py1); line.setAttribute('x2',px2); line.setAttribute('y2',py2);
  line.setAttribute('stroke', color); line.setAttribute('stroke-width','2.5');
  line.setAttribute('clip-path','url(#clip-'+svgId+')'); // keeps steep lines inside the card
  content.appendChild(line);
}

function drawGuideLine(prefix, x1, y1, x2, y2, color){
  const svgId = prefix+'-svg';
  const svg = document.getElementById(svgId);
  if(!svg) return;
  const content = svg.querySelector('.content-layer');
  const [px1,py1] = planeToPx(svgId, x1, y1);
  const [px2,py2] = planeToPx(svgId, x2, y2);
  const line = document.createElementNS(svgNS,'line');
  line.setAttribute('x1',px1); line.setAttribute('y1',py1); line.setAttribute('x2',px2); line.setAttribute('y2',py2);
  line.setAttribute('stroke', color || '#E89C2F'); line.setAttribute('stroke-width','2.5'); line.setAttribute('stroke-dasharray','4,3');
  line.setAttribute('clip-path','url(#clip-'+svgId+')');
  content.appendChild(line);
}
```

Each `<svg>` using this engine needs `<g class="grid-layer"></g><g class="content-layer"></g>` as its only static children — the JS populates both.

### Quadrant-1 plane (real-world contexts — independent x/y scaling, e.g. hours vs dollars)

Use when the two axes represent genuinely different quantities at different scales (a $0–500 cost axis against a 0–6 hours axis doesn't fit the symmetric plane sensibly). Arrows go only on the open (positive) ends — the origin corner stays closed, since there's no negative direction shown.

```javascript
const q1Meta = {};
function initQ1Plane(svgId, xmax, ymax, xstep, ystep){
  const svg = document.getElementById(svgId);
  if(!svg) return;
  const size = parseFloat(svg.getAttribute('width'));
  const sizeY = parseFloat(svg.getAttribute('height'));
  const marginL=36, marginB=26, marginT=14, marginR=14;
  const usableW = size - marginL - marginR;
  const usableH = sizeY - marginT - marginB;
  const scaleX = usableW/xmax, scaleY = usableH/ymax;
  q1Meta[svgId] = {scaleX, scaleY, marginL, marginB, sizeY};
  const gridLayer = svg.querySelector('.grid-layer');
  for(let x=0; x<=xmax; x+=xstep){
    const gx = marginL + x*scaleX;
    const line = document.createElementNS(svgNS,'line');
    line.setAttribute('x1',gx); line.setAttribute('y1',marginT); line.setAttribute('x2',gx); line.setAttribute('y2',sizeY-marginB);
    line.setAttribute('stroke', x===0 ? '#3D5A80' : '#EEE7DA'); line.setAttribute('stroke-width', x===0 ? '2':'1');
    gridLayer.appendChild(line);
    const label = document.createElementNS(svgNS,'text');
    label.setAttribute('x',gx-4); label.setAttribute('y',sizeY-marginB+14);
    label.setAttribute('font-size','9'); label.setAttribute('fill','#55606B');
    label.textContent = x;
    gridLayer.appendChild(label);
  }
  for(let y=0; y<=ymax; y+=ystep){
    const gy = sizeY-marginB - y*scaleY;
    const line = document.createElementNS(svgNS,'line');
    line.setAttribute('x1',marginL); line.setAttribute('y1',gy); line.setAttribute('x2',size-marginR); line.setAttribute('y2',gy);
    line.setAttribute('stroke', y===0 ? '#3D5A80' : '#EEE7DA'); line.setAttribute('stroke-width', y===0 ? '2':'1');
    gridLayer.appendChild(line);
    const label = document.createElementNS(svgNS,'text');
    label.setAttribute('x',2); label.setAttribute('y',gy+3);
    label.setAttribute('font-size','9'); label.setAttribute('fill','#55606B');
    label.textContent = y;
    gridLayer.appendChild(label);
  }
  // arrowheads on the open (positive) ends only
  const markerId = 'arrow-'+svgId;
  const defsQ1 = document.createElementNS(svgNS,'defs');
  svg.insertBefore(defsQ1, svg.firstChild);
  const marker = document.createElementNS(svgNS,'marker');
  marker.setAttribute('id',markerId); marker.setAttribute('markerWidth','8'); marker.setAttribute('markerHeight','8');
  marker.setAttribute('refX','4'); marker.setAttribute('refY','4'); marker.setAttribute('orient','auto');
  const arrowPath = document.createElementNS(svgNS,'path');
  arrowPath.setAttribute('d','M0,0 L8,4 L0,8 z'); arrowPath.setAttribute('fill','#3D5A80');
  marker.appendChild(arrowPath); defsQ1.appendChild(marker);
  const axisExt = 6;
  const xAxisArrow = document.createElementNS(svgNS,'line');
  xAxisArrow.setAttribute('x1', marginL); xAxisArrow.setAttribute('y1', sizeY-marginB);
  xAxisArrow.setAttribute('x2', size-marginR+axisExt); xAxisArrow.setAttribute('y2', sizeY-marginB);
  xAxisArrow.setAttribute('stroke','#3D5A80'); xAxisArrow.setAttribute('stroke-width','2');
  xAxisArrow.setAttribute('marker-end','url(#'+markerId+')');
  gridLayer.appendChild(xAxisArrow);
  const yAxisArrow = document.createElementNS(svgNS,'line');
  yAxisArrow.setAttribute('x1', marginL); yAxisArrow.setAttribute('y1', sizeY-marginB);
  yAxisArrow.setAttribute('x2', marginL); yAxisArrow.setAttribute('y2', marginT-axisExt);
  yAxisArrow.setAttribute('stroke','#3D5A80'); yAxisArrow.setAttribute('stroke-width','2');
  yAxisArrow.setAttribute('marker-end','url(#'+markerId+')');
  gridLayer.appendChild(yAxisArrow);
}

function q1ToPx(svgId, x, y){
  const m = q1Meta[svgId];
  return [m.marginL + x*m.scaleX, m.sizeY - m.marginB - y*m.scaleY];
}

function drawQ1Line(prefix, m, c, xmax, color){
  const svgId = prefix+'-svg';
  const svg = document.getElementById(svgId);
  if(!svg) return;
  const content = svg.querySelector('.content-layer');
  const [px1,py1] = q1ToPx(svgId, 0, c);
  const [px2,py2] = q1ToPx(svgId, xmax, m*xmax+c);
  const line = document.createElementNS(svgNS,'line');
  line.setAttribute('x1',px1); line.setAttribute('y1',py1); line.setAttribute('x2',px2); line.setAttribute('y2',py2);
  line.setAttribute('stroke', color); line.setAttribute('stroke-width','2.5');
  content.appendChild(line);
}
```

---

## localStorage key schema — shared principle

**All keys are prefixed by outcome code** to avoid collisions across units. The exact key pattern differs by resource type (see each workflow doc for its specific schema) — the shared rule is just: outcome code first, always.

---

## Post-build regression check

Before presenting a *fix* to one file, check whether the same bug pattern shipped in other already-built files for the same outcome (or unit). Fixes found in one chapter don't automatically apply elsewhere — self-containment means every file is a independent copy. A quick grep across sibling files for the same function name or pattern takes seconds and has already caught one live bug (the Newman's stage-swap issue shipped in an earlier chapter, undetected until a later chapter's build surfaced the fix).

---

## Changelog

- **20 July 2026** — Created. Consolidated design constants, accessibility notes, fraction rendering, MCQ safety pattern, and Error Detective spec out of both workflow docs. Added: generalised inline-onclick quoting rule (apostrophe bug), MCQ answer-distribution self-check requirement, Newman's stage-accumulation fix + Stage 5 worked-solution requirement, Frayer card sizing minimums, Cartesian plane engine reference (with arrowheads), SVG textContent/entity gotcha, and the post-build regression-check principle. All sourced from bugs found and fixed during the MA4-LIN-C-01 build.
