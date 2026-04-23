/**
 * SE6-Interactive — Shared Navigation & Progress System
 * Drop-in module for all chapter pages.
 *
 * Usage in any chapter HTML:
 *   <script src="../../assets/js/se-nav.js"></script>
 *   <script>SENav.init({ chapterId: 1 });</script>
 *
 * Public API:
 *   SENav.init(options)
 *   SENav.markActivity(activityId)      — record an activity as complete
 *   SENav.setQuizScore(score, total)    — record quiz result + auto-complete if >= 60%
 *   SENav.markComplete()               — manually mark chapter complete
 *   SENav.getProgress()                — returns full progress object
 */

const SENav = (() => {

  /* ── CHAPTER MANIFEST ──────────────────────────────────────────────── */
  const PARTS = {
    y11p1: { year: 11, label: 'Part 1', name: 'Programming Fundamentals' },
    y11p2: { year: 11, label: 'Part 2', name: 'Object-Oriented Paradigm' },
    y11p3: { year: 11, label: 'Part 3', name: 'Programming Mechatronics' },
    y12p4: { year: 12, label: 'Part 4', name: 'Secure Software Architecture' },
    y12p5: { year: 12, label: 'Part 5', name: 'Programming for the Web' },
    y12p6: { year: 12, label: 'Part 6', name: 'Software Automation' },
    y12p7: { year: 12, label: 'Part 7', name: 'Software Engineering Project' },
  };

  const CHAPTERS = [
    { id:1,  part:'y11p1', title:'Thinking Like a Software Engineer',   file:'chapters/year11/chapter-01.html', outcomes:['SE-11-01','SE-11-02','SE-11-06','SE-11-08'], time:6,  activities:2, quizTotal:5  },
    { id:2,  part:'y11p1', title:'Data & Algorithms',                    file:'chapters/year11/chapter-02.html', outcomes:['SE-11-01','SE-11-02','SE-11-04'],            time:7,  activities:3, quizTotal:6  },
    { id:3,  part:'y11p1', title:'Programming in Python — First Steps',  file:'chapters/year11/chapter-03.html', outcomes:['SE-11-02','SE-11-07','SE-11-08'],            time:8,  activities:3, quizTotal:5  },
    { id:4,  part:'y11p1', title:'Sorting, Searching & Problem Solving', file:'chapters/year11/chapter-04.html', outcomes:['SE-11-01','SE-11-02','SE-11-08'],            time:7,  activities:3, quizTotal:5  },
    { id:5,  part:'y11p2', title:'Objects, Classes & the OOP Way',       file:'chapters/year11/chapter-05.html', outcomes:['SE-11-02','SE-11-06','SE-11-08','SE-11-09'], time:8,  activities:2, quizTotal:5  },
    { id:6,  part:'y11p2', title:'Inheritance, Polymorphism & Encapsulation', file:'chapters/year11/chapter-06.html', outcomes:['SE-11-02','SE-11-06','SE-11-08','SE-11-09'], time:8, activities:2, quizTotal:5 },
    { id:7,  part:'y11p2', title:'Hello Unity — Your First Game Project', file:'chapters/year11/chapter-07.html', outcomes:['SE-11-02','SE-11-06','SE-11-07','SE-11-08','SE-11-09'], time:10, activities:3, quizTotal:5 },
    { id:8,  part:'y11p2', title:'Designing Software Solutions',          file:'chapters/year11/chapter-08.html', outcomes:['SE-11-01','SE-11-06','SE-11-09'],            time:6,  activities:2, quizTotal:5  },
    { id:9,  part:'y11p3', title:'Hardware Meets Software',               file:'chapters/year11/chapter-09.html', outcomes:['SE-11-01','SE-11-03','SE-11-05'],            time:6,  activities:2, quizTotal:5  },
    { id:10, part:'y11p3', title:'Programming Mechatronic Systems',       file:'chapters/year11/chapter-10.html', outcomes:['SE-11-02','SE-11-05','SE-11-07','SE-11-08'], time:8,  activities:3, quizTotal:5  },
    { id:11, part:'y11p3', title:'Mechatronic Project',                   file:'chapters/year11/chapter-11.html', outcomes:['SE-11-01','SE-11-05','SE-11-06','SE-11-07','SE-11-08','SE-11-09'], time:10, activities:1, quizTotal:0 },
    { id:12, part:'y12p4', title:'Threats, Vulnerabilities & Safe Design',file:'chapters/year12/chapter-12.html', outcomes:['SE-12-01','SE-12-04','SE-12-05','SE-12-07'], time:7,  activities:2, quizTotal:5  },
    { id:13, part:'y12p4', title:'Writing Secure Code',                   file:'chapters/year12/chapter-13.html', outcomes:['SE-12-02','SE-12-04','SE-12-07','SE-12-08'], time:8,  activities:3, quizTotal:5  },
    { id:14, part:'y12p4', title:'Privacy, Ethics & the Law',             file:'chapters/year12/chapter-14.html', outcomes:['SE-12-04','SE-12-05'],                      time:5,  activities:2, quizTotal:5  },
    { id:15, part:'y12p5', title:'How the Web Works',                     file:'chapters/year12/chapter-15.html', outcomes:['SE-12-01','SE-12-03','SE-12-06'],            time:6,  activities:2, quizTotal:5  },
    { id:16, part:'y12p5', title:'HTML, CSS & JavaScript',                file:'chapters/year12/chapter-16.html', outcomes:['SE-12-02','SE-12-06','SE-12-07','SE-12-08'], time:9,  activities:3, quizTotal:5  },
    { id:17, part:'y12p5', title:'Back-End Development & Databases',      file:'chapters/year12/chapter-17.html', outcomes:['SE-12-02','SE-12-04','SE-12-06','SE-12-07'], time:9,  activities:3, quizTotal:5  },
    { id:18, part:'y12p6', title:'Artificial Intelligence & ML',          file:'chapters/year12/chapter-18.html', outcomes:['SE-12-01','SE-12-03','SE-12-05'],            time:7,  activities:2, quizTotal:5  },
    { id:19, part:'y12p6', title:'Machine Learning in Practice',          file:'chapters/year12/chapter-19.html', outcomes:['SE-12-02','SE-12-06','SE-12-07','SE-12-08'], time:8,  activities:3, quizTotal:5  },
    { id:20, part:'y12p6', title:'The Societal Impact of Automation',     file:'chapters/year12/chapter-20.html', outcomes:['SE-12-03','SE-12-05'],                      time:5,  activities:2, quizTotal:5  },
    { id:21, part:'y12p7', title:'Planning Your Engineering Project',     file:'chapters/year12/chapter-21.html', outcomes:['SE-12-01','SE-12-06','SE-12-09'],            time:6,  activities:2, quizTotal:0  },
    { id:22, part:'y12p7', title:'Building & Iterating',                  file:'chapters/year12/chapter-22.html', outcomes:['SE-12-02','SE-12-06','SE-12-07','SE-12-08','SE-12-09'], time:10, activities:3, quizTotal:0 },
    { id:23, part:'y12p7', title:'Testing, Evaluating & Presenting',      file:'chapters/year12/chapter-23.html', outcomes:['SE-12-08','SE-12-09'],                      time:8,  activities:2, quizTotal:0  },
  ];

  /* ── PROGRESS STORE ────────────────────────────────────────────────── */
  const STORE_KEY = 'se6-progress-v1';

  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) return JSON.parse(raw);
    } catch(e) {}
    return { chapters: {}, lastVisited: null };
  }

  function saveProgress(prog) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(prog)); } catch(e) {}
  }

  function getChapterProg(prog, id) {
    if (!prog.chapters[id]) {
      prog.chapters[id] = {
        visited: false, complete: false,
        activitiesDone: [], quizScore: null, quizTotal: null
      };
    }
    return prog.chapters[id];
  }

  /* ── ROOT PATH RESOLVER ─────────────────────────────────────────────── */
  // Detects how many directory levels deep we are and returns a relative
  // path back to the project root (index.html location).
  function rootPath() {
    const path = window.location.pathname;
    const depth = (path.match(/\//g) || []).length;
    // Heuristic: if the file is in chapters/yearXX/, depth >= 3 on most servers
    // We count how many path segments follow a known prefix
    if (path.includes('/chapters/year')) return '../../';
    if (path.includes('/chapters/'))     return '../';
    return '';
  }

  /* ── STATE ──────────────────────────────────────────────────────────── */
  let _chapterId = null;
  let _root      = '';
  let _prog      = null;

  /* ── SIDEBAR HTML GENERATOR ─────────────────────────────────────────── */
  function buildSidebar() {
    const prog = _prog;
    let html = `
      <aside class="se-sidebar" id="se-sidebar">
        <div class="se-sb-logo">
          <a href="${_root}index.html" class="se-sb-home-link">
            <div class="se-sb-home-icon">SE</div>
            <div>
              <div class="se-sb-course-name">Software<span>Engineering</span></div>
              <div class="se-sb-course-meta">NSW Stage 6 · 2022 Syllabus</div>
            </div>
          </a>
        </div>
        <div class="se-sb-progress-bar-wrap">
          ${buildMiniProgress(prog)}
        </div>`;

    let lastYear = null;
    let lastPart = null;

    CHAPTERS.forEach(ch => {
      const part   = PARTS[ch.part];
      const cp     = getChapterProg(prog, ch.id);
      const active = ch.id === _chapterId;
      const y12    = part.year === 12;

      if (part.year !== lastYear) {
        if (lastYear !== null) html += `</div>`;
        html += `
          <div class="se-sb-year-block">
          <div class="se-sb-year-label">
            <span class="se-sb-year-pip ${y12 ? 'y12' : 'y11'}"></span>
            Year ${part.year}
          </div>`;
        lastYear = part.year;
        lastPart = null;
      }

      if (ch.part !== lastPart) {
        html += `<div class="se-sb-part-label">${part.label} — ${part.name}</div>`;
        lastPart = ch.part;
      }

      const statusIcon = cp.complete
        ? `<span class="se-sb-status done" title="Complete">✓</span>`
        : cp.visited
        ? `<span class="se-sb-status visited" title="In progress">◑</span>`
        : `<span class="se-sb-status" title="Not started"></span>`;

      const chPath = _root + ch.file;
      html += `
        <a class="se-sb-item ${active ? 'active' : ''} ${y12 ? 'y12' : ''}"
           href="${chPath}">
          <span class="se-sb-num">${String(ch.id).padStart(2,'0')}</span>
          <span class="se-sb-title">${ch.title}</span>
          ${statusIcon}
        </a>`;
    });

    html += `</div></aside>`;
    return html;
  }

  function buildMiniProgress(prog) {
    const total     = CHAPTERS.length;
    const done      = CHAPTERS.filter(ch => (prog.chapters[ch.id]||{}).complete).length;
    const visited   = CHAPTERS.filter(ch => (prog.chapters[ch.id]||{}).visited).length;
    const pct       = Math.round(done / total * 100);
    return `
      <div class="se-mini-prog">
        <div class="se-mini-prog-label">
          <span>${done} of ${total} chapters complete</span>
          <span>${pct}%</span>
        </div>
        <div class="se-mini-prog-track">
          <div class="se-mini-prog-fill" style="width:${pct}%"></div>
          <div class="se-mini-prog-visited" style="width:${Math.round(visited/total*100)}%"></div>
        </div>
      </div>`;
  }

  /* ── HEADER HTML GENERATOR ──────────────────────────────────────────── */
  function buildHeader(ch) {
    const partInfo = ch ? PARTS[ch.part] : null;
    const prev     = ch ? CHAPTERS.find(c => c.id === ch.id - 1) : null;
    const next     = ch ? CHAPTERS.find(c => c.id === ch.id + 1) : null;

    return `
      <header class="se-header" id="se-header">
        <button class="se-menu-toggle" id="se-menu-btn" onclick="SENav.toggleSidebar()" aria-label="Toggle navigation">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <a href="${_root}index.html" class="se-header-logo">
          <div class="se-logo-mark">SE</div>
          <span class="se-logo-text">Software<em>Engineering</em></span>
        </a>
        ${partInfo ? `
        <div class="se-header-context">
          <span class="se-header-year">Year ${partInfo.year}</span>
          <span class="se-header-sep">›</span>
          <span class="se-header-part">${partInfo.label} — ${partInfo.name}</span>
        </div>` : ''}
        <div class="se-header-spacer"></div>
        <div class="se-header-chapter-nav">
          ${prev ? `<a class="se-ch-nav-btn" href="${_root + prev.file}" title="Ch ${prev.id}: ${prev.title}">‹ Ch ${String(prev.id).padStart(2,'0')}</a>` : ''}
          ${ch   ? `<span class="se-ch-current">Ch ${String(ch.id).padStart(2,'0')}</span>` : ''}
          ${next ? `<a class="se-ch-nav-btn" href="${_root + next.file}" title="Ch ${next.id}: ${next.title}">Ch ${String(next.id).padStart(2,'0')} ›</a>` : ''}
        </div>
        ${ch ? `
        <button class="se-complete-btn ${(getChapterProg(_prog, ch.id)).complete ? 'done' : ''}"
                id="se-complete-btn"
                onclick="SENav.markComplete()"
                title="${(getChapterProg(_prog, ch.id)).complete ? 'Marked complete' : 'Mark chapter as complete'}">
          ${(getChapterProg(_prog, ch.id)).complete ? '✓ Complete' : '○ Mark complete'}
        </button>` : ''}
      </header>`;
  }

  /* ── CHAPTER INFO STRIP ─────────────────────────────────────────────── */
  function buildChapterStrip(ch) {
    if (!ch) return '';
    const cp  = getChapterProg(_prog, ch.id);
    const actDone = cp.activitiesDone.length;
    const actTotal = ch.activities;
    const quizPct = ch.quizTotal > 0 && cp.quizScore !== null
      ? Math.round(cp.quizScore / ch.quizTotal * 100)
      : null;

    return `
      <div class="se-chapter-strip" id="se-chapter-strip">
        <div class="se-strip-cell">
          <div class="se-strip-label">Activities</div>
          <div class="se-strip-val">${actDone}/${actTotal}</div>
          <div class="se-strip-bar">
            <div class="se-strip-fill" style="width:${actTotal ? Math.round(actDone/actTotal*100) : 0}%"></div>
          </div>
        </div>
        <div class="se-strip-cell">
          <div class="se-strip-label">Quiz Score</div>
          <div class="se-strip-val ${quizPct !== null ? (quizPct >= 80 ? 'good' : quizPct >= 60 ? 'ok' : 'low') : ''}">
            ${quizPct !== null ? `${cp.quizScore}/${ch.quizTotal} (${quizPct}%)` : '—'}
          </div>
        </div>
        <div class="se-strip-cell">
          <div class="se-strip-label">Outcomes</div>
          <div class="se-strip-outcomes">
            ${ch.outcomes.map(o => `<span class="se-outcome-tag">${o}</span>`).join('')}
          </div>
        </div>
        <div class="se-strip-cell">
          <div class="se-strip-label">Est. Time</div>
          <div class="se-strip-val">${ch.time} hrs</div>
        </div>
      </div>`;
  }

  /* ── CSS INJECTOR ───────────────────────────────────────────────────── */
  function injectStyles() {
    if (document.getElementById('se-nav-styles')) return;
    const style = document.createElement('style');
    style.id = 'se-nav-styles';
    style.textContent = `
/* SE6-Interactive — Shared Navigation Styles */
:root {
  --se-sidebar-w: 272px;
  --se-header-h:  56px;
  --se-accent:    #39e8a2;
  --se-accent2:   #5b8fff;
  --se-gold:      #f0b429;
  --se-bg-void:   #080c14;
  --se-bg-deep:   #0d1220;
  --se-bg-surf:   #131928;
  --se-bg-card:   #1a2235;
  --se-text-1:    #e8edf5;
  --se-text-2:    #7d8fa8;
  --se-text-m:    #3e4f65;
  --se-border:    rgba(255,255,255,0.06);
}

/* ── HEADER ── */
.se-header {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  height: var(--se-header-h);
  background: rgba(8,12,20,0.95);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--se-border);
  display: flex; align-items: center;
  padding: 0 1rem; gap: 0.75rem;
}
.se-menu-toggle {
  background: none; border: 1px solid var(--se-border); border-radius: 5px;
  color: var(--se-text-2); cursor: pointer; padding: 5px 7px;
  display: flex; align-items: center; transition: all 0.15s; flex-shrink: 0;
}
.se-menu-toggle:hover { border-color: var(--se-text-m); color: var(--se-text-1); }
.se-header-logo {
  display: flex; align-items: center; gap: 0.6rem; text-decoration: none; flex-shrink: 0;
}
.se-logo-mark {
  width: 30px; height: 30px; background: var(--se-accent);
  clip-path: polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Exo 2', sans-serif; font-weight: 800; font-size: 11px;
  color: var(--se-bg-void); flex-shrink: 0;
}
.se-logo-text {
  font-family: 'Exo 2', sans-serif; font-weight: 700; font-size: 14px;
  color: var(--se-text-1);
}
.se-logo-text em { font-style: normal; color: var(--se-accent); }
.se-header-context {
  display: flex; align-items: center; gap: 0.4rem;
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  color: var(--se-text-m); white-space: nowrap;
  padding-left: 0.75rem; border-left: 1px solid var(--se-border);
}
.se-header-year  { color: var(--se-accent); }
.se-header-sep   { color: var(--se-text-m); }
.se-header-part  { color: var(--se-text-2); overflow: hidden; text-overflow: ellipsis; max-width: 200px; }
.se-header-spacer { flex: 1; }
.se-header-chapter-nav {
  display: flex; align-items: center; gap: 0.4rem;
}
.se-ch-nav-btn {
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  color: var(--se-text-2); text-decoration: none;
  background: var(--se-bg-surf); border: 1px solid var(--se-border);
  border-radius: 4px; padding: 4px 9px; transition: all 0.15s;
}
.se-ch-nav-btn:hover { color: var(--se-text-1); border-color: var(--se-text-m); }
.se-ch-current {
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  color: var(--se-accent); background: rgba(57,232,162,0.08);
  border: 1px solid rgba(57,232,162,0.2); border-radius: 4px;
  padding: 4px 9px;
}
.se-complete-btn {
  font-family: 'Exo 2', sans-serif; font-size: 12px; font-weight: 600;
  border: 1px solid var(--se-border); border-radius: 5px;
  background: transparent; color: var(--se-text-2);
  cursor: pointer; padding: 5px 12px; transition: all 0.2s; white-space: nowrap;
}
.se-complete-btn:hover { border-color: var(--se-accent); color: var(--se-accent); }
.se-complete-btn.done  {
  border-color: var(--se-accent); color: var(--se-accent);
  background: rgba(57,232,162,0.08);
}

/* ── SIDEBAR ── */
.se-sidebar {
  position: fixed; top: var(--se-header-h); left: 0; bottom: 0;
  width: var(--se-sidebar-w);
  background: var(--se-bg-deep); border-right: 1px solid var(--se-border);
  overflow-y: auto; overflow-x: hidden; z-index: 150;
  transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
}
.se-sidebar::-webkit-scrollbar { width: 3px; }
.se-sidebar::-webkit-scrollbar-thumb { background: var(--se-text-m); border-radius: 2px; }
.se-sidebar.collapsed { transform: translateX(calc(-1 * var(--se-sidebar-w))); }

.se-sb-logo {
  padding: 1rem 1rem 0.75rem;
  border-bottom: 1px solid var(--se-border);
}
.se-sb-home-link {
  display: flex; align-items: center; gap: 0.7rem; text-decoration: none;
}
.se-sb-home-icon {
  width: 30px; height: 30px; background: var(--se-accent);
  clip-path: polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Exo 2', sans-serif; font-weight: 800; font-size: 11px;
  color: var(--se-bg-void); flex-shrink: 0; transition: opacity 0.15s;
}
.se-sb-home-link:hover .se-sb-home-icon { opacity: 0.8; }
.se-sb-course-name {
  font-family: 'Exo 2', sans-serif; font-weight: 700; font-size: 13px;
  color: var(--se-text-1); line-height: 1.2;
}
.se-sb-course-name span { color: var(--se-accent); }
.se-sb-course-meta {
  font-family: 'JetBrains Mono', monospace; font-size: 9px;
  letter-spacing: 1px; color: var(--se-text-m); margin-top: 2px;
}
.se-sb-progress-bar-wrap { padding: 0.75rem 1rem; border-bottom: 1px solid var(--se-border); }
.se-mini-prog-label {
  display: flex; justify-content: space-between;
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  color: var(--se-text-m); margin-bottom: 5px;
}
.se-mini-prog-track {
  height: 4px; background: var(--se-bg-surf);
  border-radius: 2px; overflow: hidden; position: relative;
}
.se-mini-prog-visited {
  position: absolute; top: 0; left: 0; height: 100%;
  background: rgba(57,232,162,0.2); border-radius: 2px;
}
.se-mini-prog-fill {
  position: relative; height: 100%;
  background: linear-gradient(90deg, var(--se-accent), var(--se-accent2));
  border-radius: 2px; z-index: 1;
  transition: width 0.5s ease;
}

.se-sb-year-block { padding-bottom: 0.5rem; }
.se-sb-year-label {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 1rem 1rem 0.5rem;
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  letter-spacing: 2px; text-transform: uppercase; color: var(--se-text-m);
  border-top: 1px solid var(--se-border);
}
.se-sb-year-pip {
  width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
}
.se-sb-year-pip.y11 { background: var(--se-accent); }
.se-sb-year-pip.y12 { background: var(--se-accent2); }
.se-sb-part-label {
  padding: 0.5rem 1rem 0.2rem;
  font-size: 9.5px; letter-spacing: 1px; text-transform: uppercase;
  color: var(--se-text-m); font-family: 'Exo 2', sans-serif;
}
.se-sb-item {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.4rem 1rem; text-decoration: none;
  position: relative; transition: background 0.12s;
}
.se-sb-item:hover { background: rgba(255,255,255,0.03); }
.se-sb-item.active { background: rgba(255,255,255,0.04); }
.se-sb-item.active::before {
  content: ''; position: absolute; left: 0; top: 0; bottom: 0;
  width: 3px; background: var(--se-accent); border-radius: 0 2px 2px 0;
}
.se-sb-item.y12.active::before { background: var(--se-accent2); }
.se-sb-num {
  font-family: 'JetBrains Mono', monospace; font-size: 9.5px;
  color: var(--se-text-m); flex-shrink: 0; min-width: 20px;
}
.se-sb-item.active .se-sb-num { color: var(--se-accent); }
.se-sb-item.y12.active .se-sb-num { color: var(--se-accent2); }
.se-sb-title {
  font-size: 12px; color: var(--se-text-2); line-height: 1.35; flex: 1;
}
.se-sb-item.active .se-sb-title { color: var(--se-accent); }
.se-sb-item.y12.active .se-sb-title { color: var(--se-accent2); }
.se-sb-item:hover .se-sb-title { color: var(--se-text-1); }
.se-sb-status {
  font-size: 11px; flex-shrink: 0; width: 14px;
  text-align: center; color: var(--se-text-m);
}
.se-sb-status.done    { color: var(--se-accent); }
.se-sb-status.visited { color: var(--se-accent2); opacity: 0.7; }

/* ── CHAPTER STRIP ── */
.se-chapter-strip {
  display: flex; gap: 0; flex-wrap: wrap;
  border-bottom: 1px solid var(--se-border);
  background: var(--se-bg-deep);
}
.se-strip-cell {
  padding: 0.7rem 1.5rem; border-right: 1px solid var(--se-border); flex: 1; min-width: 120px;
}
.se-strip-cell:last-child { border-right: none; }
.se-strip-label {
  font-family: 'JetBrains Mono', monospace; font-size: 9px;
  letter-spacing: 1.5px; text-transform: uppercase;
  color: var(--se-text-m); margin-bottom: 0.3rem;
}
.se-strip-val {
  font-family: 'Exo 2', sans-serif; font-size: 16px; font-weight: 700;
  color: var(--se-text-2);
}
.se-strip-val.good { color: var(--se-accent); }
.se-strip-val.ok   { color: var(--se-gold); }
.se-strip-val.low  { color: #ff6b6b; }
.se-strip-bar {
  height: 3px; background: var(--se-bg-surf); border-radius: 2px;
  overflow: hidden; margin-top: 0.4rem;
}
.se-strip-fill {
  height: 100%; background: var(--se-accent); border-radius: 2px;
  transition: width 0.4s ease;
}
.se-strip-outcomes { display: flex; flex-wrap: wrap; gap: 3px; margin-top: 2px; }
.se-outcome-tag {
  font-family: 'JetBrains Mono', monospace; font-size: 9px;
  background: rgba(57,232,162,0.1); color: var(--se-accent);
  border-radius: 3px; padding: 2px 5px; letter-spacing: 0.5px;
}

/* ── TOAST NOTIFICATIONS ── */
.se-toast {
  position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 999;
  background: var(--se-bg-card); border: 1px solid var(--se-border);
  border-radius: 8px; padding: 0.85rem 1.25rem;
  font-family: 'Exo 2', sans-serif; font-size: 13px; font-weight: 600;
  color: var(--se-text-1); box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  display: flex; align-items: center; gap: 0.6rem;
  animation: se-toast-in 0.3s ease;
  max-width: 320px;
}
.se-toast.success { border-left: 3px solid var(--se-accent); }
.se-toast.info    { border-left: 3px solid var(--se-accent2); }
.se-toast .se-toast-icon { font-size: 16px; flex-shrink: 0; }
@keyframes se-toast-in {
  from { opacity:0; transform: translateY(10px); }
  to   { opacity:1; transform: translateY(0); }
}

/* ── BODY OFFSET ── */
body.se-nav-active {
  padding-top: var(--se-header-h);
}
.se-content-wrap {
  margin-left: var(--se-sidebar-w);
  transition: margin-left 0.28s cubic-bezier(0.4,0,0.2,1);
}
.se-sidebar.collapsed ~ * .se-content-wrap,
body.se-sidebar-collapsed .se-content-wrap {
  margin-left: 0;
}

/* ── OVERLAY (mobile) ── */
.se-overlay {
  display: none; position: fixed; inset: 0; z-index: 140;
  background: rgba(0,0,0,0.5); backdrop-filter: blur(2px);
}
.se-overlay.active { display: block; }

@media (max-width: 860px) {
  .se-header-context { display: none; }
  .se-header-part    { display: none; }
  .se-sidebar { transform: translateX(calc(-1 * var(--se-sidebar-w))); }
  .se-sidebar.open   { transform: translateX(0); }
  .se-content-wrap   { margin-left: 0 !important; }
}
    `;
    document.head.appendChild(style);
  }

  /* ── DOM INJECTION ──────────────────────────────────────────────────── */
  function inject(ch) {
    // Insert header before first child of body
    const headerEl = document.createElement('div');
    headerEl.innerHTML = buildHeader(ch);
    document.body.insertBefore(headerEl.firstElementChild, document.body.firstChild);

    // Insert sidebar
    const sidebarEl = document.createElement('div');
    sidebarEl.innerHTML = buildSidebar();
    document.body.insertBefore(sidebarEl.firstElementChild, document.body.children[1]);

    // Insert overlay (for mobile)
    const overlay = document.createElement('div');
    overlay.className = 'se-overlay';
    overlay.id = 'se-overlay';
    overlay.onclick = () => closeSidebar();
    document.body.insertBefore(overlay, document.body.children[2]);

    // Insert chapter strip if on a chapter page
    if (ch) {
      const strip = document.createElement('div');
      strip.innerHTML = buildChapterStrip(ch);
      // Insert after the main content wrapper's first visible element
      const mainEl = document.querySelector('.main') || document.querySelector('main');
      if (mainEl) {
        mainEl.insertBefore(strip.firstElementChild, mainEl.firstChild);
      }
    }

    // Apply body class + content margin
    document.body.classList.add('se-nav-active');
    const contentEl = document.querySelector('.main') || document.querySelector('main');
    if (contentEl) contentEl.classList.add('se-content-wrap');

    // Scroll sidebar active item into view
    setTimeout(() => {
      const active = document.querySelector('.se-sb-item.active');
      if (active) active.scrollIntoView({ block:'center', behavior:'smooth' });
    }, 200);
  }

  /* ── SIDEBAR TOGGLE ─────────────────────────────────────────────────── */
  function toggleSidebar() {
    const sb = document.getElementById('se-sidebar');
    const ov = document.getElementById('se-overlay');
    if (window.innerWidth <= 860) {
      sb.classList.toggle('open');
      ov.classList.toggle('active');
    } else {
      sb.classList.toggle('collapsed');
      document.body.classList.toggle('se-sidebar-collapsed');
      const main = document.querySelector('.se-content-wrap');
      if (main) {
        main.style.marginLeft = sb.classList.contains('collapsed') ? '0' : 'var(--se-sidebar-w)';
      }
    }
  }

  function closeSidebar() {
    const sb = document.getElementById('se-sidebar');
    const ov = document.getElementById('se-overlay');
    sb.classList.remove('open');
    ov.classList.remove('active');
  }

  /* ── TOAST ──────────────────────────────────────────────────────────── */
  function toast(msg, type='info', icon='◉', duration=3000) {
    const existing = document.querySelector('.se-toast');
    if (existing) existing.remove();
    const t = document.createElement('div');
    t.className = `se-toast ${type}`;
    t.innerHTML = `<span class="se-toast-icon">${icon}</span><span>${msg}</span>`;
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity='0'; t.style.transform='translateY(10px)'; t.style.transition='all 0.3s'; setTimeout(()=>t.remove(), 300); }, duration);
  }

  /* ── PUBLIC API ─────────────────────────────────────────────────────── */
  function init(options = {}) {
    _chapterId = options.chapterId || null;
    _root      = options.rootPath  || rootPath();
    _prog      = loadProgress();

    injectStyles();

    const ch = _chapterId ? CHAPTERS.find(c => c.id === _chapterId) : null;

    // Mark chapter as visited
    if (ch) {
      const cp  = getChapterProg(_prog, ch.id);
      cp.visited = true;
      _prog.lastVisited = ch.id;
      saveProgress(_prog);
    }

    // Wait for DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => inject(ch));
    } else {
      inject(ch);
    }
  }

  function markActivity(activityId) {
    if (!_chapterId) return;
    const prog = loadProgress();
    const cp   = getChapterProg(prog, _chapterId);
    if (!cp.activitiesDone.includes(activityId)) {
      cp.activitiesDone.push(activityId);
      saveProgress(prog);
      _prog = prog;
      // Update strip
      const ch = CHAPTERS.find(c => c.id === _chapterId);
      if (ch) {
        const stripEl = document.getElementById('se-chapter-strip');
        if (stripEl) {
          stripEl.outerHTML = buildChapterStrip(ch);
        }
      }
      toast(`Activity complete! (${cp.activitiesDone.length}/${CHAPTERS.find(c=>c.id===_chapterId)?.activities})`, 'success', '✓');
    }
  }

  function setQuizScore(score, total) {
    if (!_chapterId) return;
    const prog = loadProgress();
    const cp   = getChapterProg(prog, _chapterId);
    cp.quizScore  = score;
    cp.quizTotal  = total;
    const pct = total > 0 ? score / total : 0;
    if (pct >= 0.6) cp.complete = true;
    saveProgress(prog);
    _prog = prog;
    // Refresh strip + complete button
    const ch = CHAPTERS.find(c => c.id === _chapterId);
    if (ch) {
      const stripEl = document.getElementById('se-chapter-strip');
      if (stripEl) stripEl.outerHTML = buildChapterStrip(ch);
    }
    const btn = document.getElementById('se-complete-btn');
    if (btn && cp.complete) {
      btn.textContent = '✓ Complete';
      btn.classList.add('done');
    }
    // Refresh sidebar progress bar
    const mpWrap = document.querySelector('.se-sb-progress-bar-wrap');
    if (mpWrap) mpWrap.innerHTML = buildMiniProgress(prog);
    if (cp.complete) toast(`Chapter ${_chapterId} complete! 🎉`, 'success', '✓', 4000);
  }

  function markComplete() {
    if (!_chapterId) return;
    const prog = loadProgress();
    const cp   = getChapterProg(prog, _chapterId);
    cp.complete = !cp.complete;
    saveProgress(prog);
    _prog = prog;
    const btn = document.getElementById('se-complete-btn');
    if (btn) {
      btn.textContent = cp.complete ? '✓ Complete' : '○ Mark complete';
      btn.classList.toggle('done', cp.complete);
    }
    // Refresh sidebar item status icon
    const sidebarItem = document.querySelector(`.se-sb-item[href*="chapter-${String(_chapterId).padStart(2,'0')}"] .se-sb-status`);
    if (sidebarItem) {
      sidebarItem.className = cp.complete ? 'se-sb-status done' : 'se-sb-status visited';
      sidebarItem.textContent = cp.complete ? '✓' : '◑';
    }
    const mpWrap = document.querySelector('.se-sb-progress-bar-wrap');
    if (mpWrap) mpWrap.innerHTML = buildMiniProgress(prog);
    if (cp.complete) toast(`Chapter ${_chapterId} marked complete!`, 'success', '✓', 3000);
  }

  function getProgress() {
    return loadProgress();
  }

  function getChapters() {
    return CHAPTERS;
  }

  function getParts() {
    return PARTS;
  }

  function resetProgress() {
    localStorage.removeItem(STORE_KEY);
    location.reload();
  }

  return { init, markActivity, setQuizScore, markComplete, toggleSidebar, getProgress, getChapters, getParts, resetProgress, CHAPTERS, PARTS };

})();
