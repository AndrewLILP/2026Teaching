/**
 * ct-interactive.js
 * Computing Technology 7–10 | Heavy interactions
 * NSW Computing Technology Syllabus (2022)
 * Maintained by: Andrew Leary
 *
 * Load ONLY on pages that use these features — never in ct-core.js.
 * Link after ct-core.js and after chart.min.js (if charts are on page).
 *
 * Responsibilities:
 *   1. MCQ self-check engine
 *   2. Trace table (desk check / NSW pseudocode)     [skills pages]
 *   3. Drag-and-drop classifier                      [skills pages]
 *   4. Pseudocode stepper                            [skills pages]
 *
 * ─── MCQ MARKUP PATTERN ────────────────────────────────────────
 *
 *  <div class="mcq-card" data-q="1" data-correct="B">
 *    <div class="mcq-question">Question text here</div>
 *    <div class="mcq-options" role="group" aria-label="Question 1 options">
 *      <button class="mcq-option" data-idx="A">Option A text</button>
 *      <button class="mcq-option" data-idx="B">Option B text</button>
 *      <button class="mcq-option" data-idx="C">Option C text</button>
 *      <button class="mcq-option" data-idx="D">Option D text</button>
 *    </div>
 *    <div class="mcq-feedback" id="mcq-feedback-1"></div>
 *    <button class="mcq-reset" id="mcq-reset-1">↩ Try again</button>
 *  </div>
 *
 *  Feedback messages supplied via data-feedback-[a|b|c|d] attributes:
 *    <div class="mcq-card"
 *         data-q="1"
 *         data-correct="B"
 *         data-feedback-a="Incorrect — reason..."
 *         data-feedback-b="✓ Correct — reason..."
 *         data-feedback-c="Incorrect — reason..."
 *         data-feedback-d="Incorrect — reason...">
 *
 * ────────────────────────────────────────────────────────────── */

(function () {
  'use strict';


  /* ─────────────────────────────────────────────────────────────
     1. MCQ SELF-CHECK ENGINE
  ───────────────────────────────────────────────────────────── */

  function initMCQ() {
    var cards = document.querySelectorAll('.mcq-card');
    if (!cards.length) return;

    cards.forEach(function (card) {
      var qId      = card.dataset.q;
      var correct  = (card.dataset.correct || '').toUpperCase();
      var options  = card.querySelectorAll('.mcq-option');
      var feedback = card.querySelector('.mcq-feedback');
      var reset    = card.querySelector('.mcq-reset');

      if (!options.length) return;

      // ── Handle option click ──
      options.forEach(function (btn) {
        btn.addEventListener('click', function () {
          // Don't do anything if already answered
          if (card.classList.contains('mcq-answered')) return;

          card.classList.add('mcq-answered');

          var chosen    = (btn.dataset.idx || '').toUpperCase();
          var isCorrect = chosen === correct;

          // Mark all options: highlight correct, flag chosen-wrong
          options.forEach(function (opt) {
            opt.disabled = true;
            var optIdx = (opt.dataset.idx || '').toUpperCase();
            if (optIdx === correct) {
              opt.classList.add('correct');
            }
            if (optIdx === chosen && !isCorrect) {
              opt.classList.add('incorrect');
            }
          });

          // Show feedback text
          if (feedback) {
            var msg = card.dataset['feedback' + chosen.toUpperCase()]  // → 'feedbackA' ✓
            feedback.innerHTML = msg;
            feedback.className = 'mcq-feedback visible ' + (isCorrect ? 'correct' : 'incorrect');
          }

          // Show reset button
          if (reset) reset.classList.add('visible');
        });
      });

      // ── Handle reset click ──
      if (reset) {
        reset.addEventListener('click', function () {
          card.classList.remove('mcq-answered');

          options.forEach(function (opt) {
            opt.disabled = false;
            opt.classList.remove('correct', 'incorrect');
          });

          if (feedback) {
            feedback.className = 'mcq-feedback';
            feedback.innerHTML = '';
          }

          reset.classList.remove('visible');
        });
      }
    });
  }


  /* ─────────────────────────────────────────────────────────────
     2. TRACE TABLE
     Markup: <div class="trace-table" data-algo="algo-id">
     Algorithm steps live in a separate <template id="algo-id">.
     Students fill in cells; correct values revealed on check.
  ───────────────────────────────────────────────────────────── */

  function initTraceTable() {
    // Implemented when first skills page is built.
    // Placeholder to avoid errors if called early.
  }


  /* ─────────────────────────────────────────────────────────────
     3. DRAG-AND-DROP CLASSIFIER
     Markup: <div class="dnd-classifier" data-categories="A,B,C">
     Students drag items into category buckets.
  ───────────────────────────────────────────────────────────── */

  function initDragClassifier() {
    // Implemented when first skills page that needs it is built.
  }


  /* ─────────────────────────────────────────────────────────────
     4. PSEUDOCODE STEPPER
     Markup: <div class="pseudo-stepper">
               <div class="pseudo-step" data-var-watch="x,y">...</div>
             </div>
     Reveals steps one at a time; tracks variable values.
  ───────────────────────────────────────────────────────────── */

  function initPseudoStepper() {
    // Implemented when first skills page that needs it is built.
  }


  /* ─────────────────────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────────────────────── */

  function init() {
    initMCQ();
    initTraceTable();
    initDragClassifier();
    initPseudoStepper();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());


/* ─────────────────────────────────────────────────────────────
   MCQ COMPONENT STYLES
   Injected here so ct-interactive.js is the single file to
   include for MCQ — no separate CSS file needed.
   These styles depend on tokens defined in ct-shared.css.
───────────────────────────────────────────────────────────── */

(function injectMCQStyles() {
  if (document.getElementById('ct-mcq-styles')) return;

  var style = document.createElement('style');
  style.id = 'ct-mcq-styles';
  style.textContent = [

    /* Card wrapper */
    '.mcq-card {',
    '  background: var(--color-surface-2);',
    '  border: 1px solid var(--color-border);',
    '  border-radius: var(--radius-lg);',
    '  padding: var(--space-5);',
    '  margin-bottom: var(--space-4);',
    '}',

    /* Question text */
    '.mcq-question {',
    '  font-weight: 600;',
    '  color: var(--color-text-primary);',
    '  margin-bottom: var(--space-4);',
    '  font-size: var(--text-base);',
    '  line-height: 1.5;',
    '}',

    /* Options group */
    '.mcq-options {',
    '  display: flex;',
    '  flex-direction: column;',
    '  gap: var(--space-2);',
    '}',

    /* Individual option button */
    '.mcq-option {',
    '  display: flex;',
    '  align-items: flex-start;',
    '  gap: var(--space-3);',
    '  padding: var(--space-3) var(--space-4);',
    '  background: var(--color-surface-3);',
    '  border: 1px solid var(--color-border);',
    '  border-radius: var(--radius-md);',
    '  cursor: pointer;',
    '  font-size: var(--text-sm);',
    '  color: var(--color-text-secondary);',
    '  transition: all var(--transition-fast);',
    '  text-align: left;',
    '  width: 100%;',
    '  font-family: var(--font-body);',
    '  line-height: 1.5;',
    '  min-height: 44px;',
    '}',

    '.mcq-option:hover:not(:disabled) {',
    '  border-color: var(--accent-border);',
    '  color: var(--color-text-primary);',
    '  background: var(--accent-surface);',
    '}',

    '.mcq-option:focus-visible {',
    '  outline: 2px solid var(--accent-bright);',
    '  outline-offset: 2px;',
    '}',

    '.mcq-option:disabled { cursor: default; }',

    /* Correct / incorrect states */
    '.mcq-option.correct {',
    '  border-color: var(--color-phase-produce);',
    '  background: rgba(52,211,153,0.10);',
    '  color: var(--color-phase-produce);',
    '}',

    '.mcq-option.incorrect {',
    '  border-color: var(--color-grade-e);',
    '  background: rgba(248,113,113,0.10);',
    '  color: var(--color-grade-e);',
    '}',

    /* Option letter (A / B / C / D) */
    '.mcq-option-letter {',
    '  font-weight: 700;',
    '  flex-shrink: 0;',
    '  font-family: var(--font-mono);',
    '  min-width: 1.2em;',
    '}',

    /* Feedback panel */
    '.mcq-feedback {',
    '  display: none;',
    '  margin-top: var(--space-3);',
    '  padding: var(--space-3) var(--space-4);',
    '  border-radius: var(--radius-md);',
    '  font-size: var(--text-sm);',
    '  line-height: 1.65;',
    '}',

    '.mcq-feedback.visible { display: block; }',

    '.mcq-feedback.correct {',
    '  background: rgba(52,211,153,0.10);',
    '  color: var(--color-phase-produce);',
    '  border: 1px solid rgba(52,211,153,0.30);',
    '}',

    '.mcq-feedback.incorrect {',
    '  background: rgba(248,113,113,0.10);',
    '  color: var(--color-grade-e);',
    '  border: 1px solid rgba(248,113,113,0.30);',
    '}',

    /* Reset button */
    '.mcq-reset {',
    '  display: none;',
    '  margin-top: var(--space-3);',
    '  font-size: var(--text-xs);',
    '  color: var(--color-text-muted);',
    '  background: none;',
    '  border: 1px solid var(--color-border);',
    '  border-radius: var(--radius-sm);',
    '  padding: var(--space-1) var(--space-3);',
    '  cursor: pointer;',
    '  font-family: var(--font-body);',
    '  transition: all var(--transition-fast);',
    '  min-height: 28px;',
    '}',

    '.mcq-reset.visible { display: inline-block; }',

    '.mcq-reset:hover {',
    '  color: var(--color-text-secondary);',
    '  border-color: var(--color-border-mid);',
    '}',

    '.mcq-reset:focus-visible {',
    '  outline: 2px solid var(--accent-bright);',
    '  outline-offset: 2px;',
    '}'

  ].join('\n');

  document.head.appendChild(style);
}());
