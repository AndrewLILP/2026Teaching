# components.py — shared page shell and components for the Analysing Data lesson pages.
# Output must match the markup of lesson01.html / lesson02.html (and the photo journal reference).
from html import escape

def attr(s):
    """Escape text for a double-quoted HTML attribute (keeps inline HTML like <code> as entities)."""
    return escape(s, quote=True)

CHEVRON = '<svg class="expand-card__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 8l5 5 5-5"/></svg>'

def expand(title, body):
    return f'''
        <div class="expand-card">
          <button class="expand-card__header" type="button" aria-expanded="false">
            {title}
            {CHEVRON}
          </button>
          <div class="expand-card__body">
            {body}
          </div>
        </div>'''

def flips(cards):
    out = []
    for term, d in cards:
        out.append(f'''
          <button class="flip-card" type="button" aria-pressed="false">
            <span class="flip-card__inner">
              <span class="flip-card__face flip-card__face--front" aria-hidden="false">
                <span class="flip-card__term">{term}</span>
                <span class="flip-card__hint">Tap to reveal</span>
              </span>
              <span class="flip-card__face flip-card__face--back" aria-hidden="true">
                <span class="flip-card__def">{d}</span>
              </span>
            </span>
          </button>''')
    return '<div class="flip-card-grid">' + "".join(out) + '\n        </div>'

def sort_activity(items, choices):
    """items: (text_html, answer, explain, aria_label); choices: [(value, label)]"""
    lis = []
    for text, ans, explain, aria in items:
        btns = "\n".join(f'                <button type="button" class="sort-choice" data-choice="{v}" aria-pressed="false">{l}</button>' for v, l in choices)
        lis.append(f'''
            <li class="sort-item" data-answer="{ans}" data-explain="{attr(explain)}">
              <p class="sort-item__text">{text}</p>
              <div class="sort-item__choices" role="group" aria-label="{attr(aria)}">
{btns}
              </div>
              <p class="sort-item__feedback" aria-live="polite"></p>
            </li>''')
    return f'''
        <div class="sort-activity">
          <ol class="sort-items">{"".join(lis)}
          </ol>
          <div class="sort-actions">
            <button type="button" class="sort-check">Check my sort</button>
            <button type="button" class="sort-reset">Start again</button>
          </div>
          <p class="sort-score" aria-live="polite"></p>
        </div>'''

def mcqs(qs):
    """qs: list of (question_html, correct_letter, [4 options], [4 feedbacks]). Correct feedback must start with ✓."""
    out = []
    for i, (q, c, opts, fbs) in enumerate(qs, 1):
        fb_attrs = "\n".join(f'             data-feedback-{l.lower()}="{attr(f)}"' for l, f in zip("ABCD", fbs))
        options = "\n".join(f'            <button class="mcq-option" type="button" data-idx="{l}"><span class="mcq-option-letter">{l}</span>{o}</button>' for l, o in zip("ABCD", opts))
        out.append(f'''
        <div class="mcq-card" data-q="{i}" data-correct="{c}"
{fb_attrs}>
          <div class="mcq-question">{i}. {q}</div>
          <div class="mcq-options" role="group" aria-label="Question {i} options">
{options}
          </div>
          <div class="mcq-feedback" id="mcq-feedback-{i}" aria-live="polite"></div>
          <button class="mcq-reset" type="button" id="mcq-reset-{i}">↩ Try again</button>
        </div>''')
    return "".join(out)

def tiers(f, c, e):
    """each: (title, body_html)"""
    def card(cls, label, t):
        return f'''
          <div class="tier-card">
            <span class="tier-badge tier-{cls}">{label}</span>
            <h4>{t[0]}</h4>
            {t[1]}
          </div>'''
    return f'''
      <section class="content-section tier-tasks" id="tasks">
        <h2>Your task</h2>
        <p>Choose the level that challenges you. You can move up a level once you finish.</p>
        <div class="tier-grid">{card("foundation","Foundation",f)}{card("core","Core",c)}{card("extension","Extension",e)}
        </div>
      </section>'''

def exam(marks, stem_html, question_html, guide_rows, sample, common_error):
    rows = "\n".join(f'                  <tr><td>{c}</td><td>{m}</td></tr>' for c, m in guide_rows)
    body = f'''<div class="spec-table-wrap">
              <table class="spec-table">
                <caption class="sr-caption">Marking guide</caption>
                <thead><tr><th scope="col">Criteria</th><th scope="col">Marks</th></tr></thead>
                <tbody>
{rows}
                </tbody>
              </table>
            </div>
            <p><strong>Sample answer:</strong> {sample}</p>
            <p><strong>Common error:</strong> {common_error}</p>'''
    return f'''
      <section class="content-section" id="exam">
        <h2>Exam-style question</h2>
        <div class="case-study-box">
          <p class="case-study-box__eyebrow">Short answer <span class="exam-marks">{marks} marks</span></p>
          {stem_html}
          <p class="case-study-box__question"><strong>Question:</strong> {question_html}</p>
        </div>
        <p>Write your answer in your notebook before opening the marking guide.</p>
{expand("Marking guide and sample answer", body)}
      </section>'''

CPD_DPM = [
    "Skilfully applies appropriate iterative processes to produce computing solutions.",
    "Applies appropriate iterative processes to produce computing solutions.",
    "Applies iterative processes to produce computing solutions.",
    "Uses processes to produce computing solutions.",
    "Identifies processes that may produce a computing solution.",
]

def cpd(intro_area, stems, details):
    grades = "".join(f'''
          <div class="cpd-grade cpd-grade-{g}" tabindex="0" role="button">
            <span class="grade-label">{g.upper()}</span>
            <p><strong>{s}</strong> {d}</p>
          </div>''' for g, s, d in zip("abcde", stems, details))
    return f'''
      <section class="cpd-section" id="grades">
        <h2>What success looks like</h2>
        <p class="cpd-intro">These are the course performance descriptors for {intro_area}. Tap a grade to see what it looks like in today's lesson.</p>
        <div class="cpd-strip">{grades}
        </div>
      </section>'''

def reflection(n, prompts):
    lis = "\n".join(f'''          <li>{q}
            <span class="sentence-starter">{s}</span></li>''' for q, s in prompts)
    return f'''
      <section class="notebook-prompt" id="reflect">
        <p class="notebook-prompt__label">Notebook reflection</p>
        <ul>
{lis}
        </ul>
        <label for="reflection-l{n}" class="sidebar-label">Your reflection (saves automatically on this device)</label>
        <textarea id="reflection-l{n}" class="reflection-textarea" data-progress-reflection></textarea>
        <span class="reflection-status" data-progress-reflection-status aria-live="polite"></span>
      </section>'''

def checkpoint(qs):
    return f'''
      <section class="content-section" id="checkpoint">
        <h2>Checkpoint</h2>
        <p>Answer all six. The first two are Foundation, the middle two are Core and the last two are Extension.</p>
{mcqs(qs)}

        <div class="progress-recap" data-progress-recap></div>
      </section>'''

def page(n, title, desc, toc, outcomes, phase_pills_sidebar, hero_intro, hero_pills, body, prev, nxt):
    nn = f"{n:02d}"
    toc_html = "\n".join(f'          <a href="#{a}">{t}</a>' for a, t in toc)
    out_html = "\n".join(f'          <span class="outcome-tag">{o}</span>' for o in outcomes)
    side_pills = "\n        ".join(phase_pills_sidebar)
    hero_p = "\n          ".join(hero_pills)
    return f'''<!DOCTYPE html>
<html lang="en-AU">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Lesson {n}: {title} | Analysing Data | CT Stage 5</title>
  <meta name="description" content="Stage 5 Computing Technology — Enterprise information systems: Analysing data. Lesson {n} of 25: {desc}">

  <link rel="stylesheet" href="../../../assets/css/ct-shared.css">
  <link rel="stylesheet" href="../../../assets/css/ct-lessons.css">

  <!-- Page-level accent: Enterprise information systems — analysing data (amber, paper-safe values from ct-lessons.css accent reference) -->
  <style>
    :root {{
      --accent:         #92400e;
      --accent-dim:     #78350f;
      --accent-bright:  #854d0e;
      --accent-surface: rgba(245, 158, 11, 0.14);
      --accent-border:  rgba(180, 83, 9, 0.35);
    }}
    .dart-text {{
      background: var(--color-surface);
      border: 1px solid var(--color-border-mid);
      border-radius: var(--radius-md);
      padding: var(--space-5) var(--space-6);
      margin: var(--space-4) 0;
      font-size: var(--text-base);
      line-height: 1.9;
      color: var(--color-text-primary);
      max-width: none;
    }}
    .dart-key {{
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-3);
      margin: var(--space-3) 0;
      font-size: var(--text-sm);
    }}
    /* Carried from the lesson01 reference page (candidates for shared CSS) */
    .page-wrap > * {{ min-width: 0; }}
    mark.paper-hl--yellow {{ background: rgba(250, 204, 21, 0.45); }}
    mark.paper-hl--green  {{ background: rgba(74, 222, 128, 0.40); }}
    mark.paper-hl--pink   {{ background: rgba(244, 114, 182, 0.35); }}
    .raw-row {{ overflow-wrap: anywhere; }}
    /* ct-shared.css pads .case-study-box with var(--space-7), which isn't defined,
       so the padding collapses to 0. Candidate fix for ct-shared.css. */
    .case-study-box {{ padding: var(--space-6) var(--space-8); }}
    .exam-marks {{
      display: inline-block;
      font-size: var(--text-xs);
      font-weight: 800;
      letter-spacing: var(--letter-spacing-label);
      text-transform: uppercase;
      color: var(--accent-bright);
      border: 1px solid var(--accent-border);
      border-radius: var(--radius-full);
      padding: 0 var(--space-3);
      margin-left: var(--space-2);
    }}
  </style>
</head>

<body class="font-nunito">

  <a class="skip-link" href="#main">Skip to main content</a>

  <header class="ct-nav">
    <a class="ct-logo" href="../../../index.html">CT<span>_</span><em>5</em></a>
    <div class="ct-nav-context">
      <span class="ct-nav-course">Stage 5</span>
      <span class="ct-nav-sep" aria-hidden="true">/</span>
      <span>Analysing data</span>
    </div>
    <div class="ct-nav-actions">
      <div class="font-toggle" role="group" aria-label="Font preference">
        <button class="font-btn" type="button" data-font="nunito" aria-pressed="true">Aa</button>
        <button class="font-btn" type="button" data-font="system" aria-pressed="false">Sys</button>
        <button class="font-btn" type="button" data-font="dyslexia" aria-pressed="false">Dys</button>
      </div>
      <a class="ct-nav-btn" href="index.html">Unit hub</a>
    </div>
  </header>

  <nav class="ct-breadcrumb" aria-label="Breadcrumb">
    <ol>
      <li><a href="../../../index.html">Computing</a></li>
      <li><a href="../../index.html">Stage 5</a></li>
      <li><a href="../index.html">Enterprise information systems</a></li>
      <li><a href="index.html">Analysing data</a></li>
      <li aria-current="page">Lesson {n}</li>
    </ol>
  </nav>

  <div class="page-wrap">

    <aside class="ct-sidebar" aria-label="Lesson sidebar">
      <div class="paper-binder-holes" aria-hidden="true"><span></span><span></span><span></span></div>

      <div class="sidebar-section">
        <p class="sidebar-label">On this page</p>
        <nav class="sidebar-toc" id="sidebar-toc" aria-label="Table of contents">
{toc_html}
        </nav>
      </div>

      <div class="sidebar-section">
        <p class="sidebar-label">Phase</p>
        {side_pills}
      </div>

      <div class="sidebar-section">
        <p class="sidebar-label">Outcomes</p>
        <div class="outcome-tags">
{out_html}
        </div>
      </div>
    </aside>

    <main class="main-col" id="main" tabindex="-1">

      <!-- ═══ HERO ═══ -->
      <header class="page-hero">
        <p class="page-eyebrow">Lesson {n} of 25 · 55 minutes</p>
        <h1>{title}</h1>
        <p class="page-intro">{hero_intro}</p>
        <div class="phase-pills">
          {hero_p}
        </div>
      </header>
{body}

      <nav class="lesson-nav" aria-label="Lesson navigation">
        <a class="lesson-nav__link lesson-nav__link--prev" href="{prev[0]}">
          <span class="lesson-nav__dir">← Previous</span>
          <span class="lesson-nav__title">{prev[1]}</span>
        </a>
        <a class="lesson-nav__link lesson-nav__link--next" href="{nxt[0]}">
          <span class="lesson-nav__dir">Next →</span>
          <span class="lesson-nav__title">{nxt[1]}</span>
        </a>
      </nav>

    </main>
  </div>

  <script src="../../../assets/js/ct-core.js"></script>
  <script src="../../../assets/js/ct-interactive.js"></script>
  <script src="../../../assets/js/ct-progress.js"></script>
  <script>
    (function () {{
      'use strict';
      function boot() {{
        if (!window.CTProgress) return;
        window.CTProgress.initLessonPage({{
          unitId: 'analysing-data-2027',
          lessonId: 'lesson{nn}',
          totalQuestions: 6
        }});
      }}
      if (document.readyState !== 'loading') {{
        boot();
      }} else {{
        var onReady = function () {{
          if (document.readyState === 'loading') return;
          document.removeEventListener('readystatechange', onReady);
          boot();
        }};
        document.addEventListener('readystatechange', onReady);
      }}
    }}());
  </script>
</body>
</html>
'''

PILL = {
    "identify": '<span class="phase-pill phase-identify">Identifying &amp; defining</span>',
    "research": '<span class="phase-pill phase-research">Researching &amp; planning</span>',
    "produce": '<span class="phase-pill phase-produce">Producing &amp; implementing</span>',
    "test": '<span class="phase-pill phase-test">Testing &amp; evaluating</span>',
}
