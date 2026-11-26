/**
 * good-news.js
 * Computing Technology 7–10 | "Is the world really ending?" demo double lesson
 * EIS: Analysing data · Stage 5
 *
 * Page-level script for this folder only. Load AFTER ct-core.js,
 * ct-interactive.js and ct-progress.js. No libraries, no CDN: every
 * chart is hand-built SVG.
 *
 * Responsibilities:
 *   1. Present mode — click through [data-slide] blocks like a slide deck
 *      (→ / PageDown / Space = next, ← / PageUp = back, F = full screen,
 *      Esc = exit, P = start). Clicker remotes send PageDown/PageUp.
 *   2. Class survey model — tallies saved to localStorage so Lesson 2
 *      on the same computer can reuse Lesson 1's data
 *   3. Tally table  [data-gn-tally]   with row-total verification
 *   4. Survey chart [data-gn-chart]   fair view + three misleading views
 *   5. Dot plot     [data-gn-dotplot] type/range validation, IQR outliers
 *   6. Trend chart  [data-gn-trend]   "as typed" vs "verified" dataset
 */

(function () {
  'use strict';

  var SVGNS = 'http://www.w3.org/2000/svg';

  function svgEl(tag, attrs, text) {
    var e = document.createElementNS(SVGNS, tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (text !== undefined && text !== null) e.textContent = String(text);
    return e;
  }

  function htmlEl(tag, attrs, text) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'className') e.className = attrs[k];
      else e.setAttribute(k, attrs[k]);
    });
    if (text !== undefined && text !== null) e.textContent = String(text);
    return e;
  }

  function addTitle(node, text) {
    node.appendChild(svgEl('title', null, text));
    return node;
  }

  function niceStep(range, targetTicks) {
    var raw = range / (targetTicks || 5);
    var mag = Math.pow(10, Math.floor(Math.log10(raw || 1)));
    var steps = [1, 2, 2.5, 5, 10];
    for (var i = 0; i < steps.length; i++) {
      if (steps[i] * mag >= raw) return steps[i] * mag;
    }
    return 10 * mag;
  }

  function fmt(n, dp) {
    if (n === null || n === undefined || isNaN(n)) return '–';
    var p = Math.pow(10, dp === undefined ? 1 : dp);
    return String(Math.round(n * p) / p);
  }

  function isTyping(t) {
    if (!t) return false;
    var tag = (t.tagName || '').toLowerCase();
    return tag === 'input' || tag === 'textarea' || tag === 'select' || t.isContentEditable;
  }

  function isActivatable(t) {
    if (!t) return false;
    var tag = (t.tagName || '').toLowerCase();
    return tag === 'button' || tag === 'a' || tag === 'summary' || t.getAttribute('role') === 'button';
  }


  /* ─────────────────────────────────────────────────────────────
     1. PRESENT MODE
  ───────────────────────────────────────────────────────────── */

  function initPresent() {
    var btn = document.querySelector('.gn-present-btn');
    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-slide]'));
    if (!btn || !slides.length) return;

    var bar = htmlEl('div', { className: 'gn-present-bar', role: 'toolbar', 'aria-label': 'Slide controls' });
    bar.innerHTML =
      '<button type="button" data-act="prev" aria-label="Previous slide">&larr;</button>' +
      '<span class="gn-present-bar__count" aria-live="polite"></span>' +
      '<span class="gn-present-bar__title"></span>' +
      '<button type="button" data-act="next" aria-label="Next slide">&rarr;</button>' +
      '<button type="button" data-act="full" aria-label="Toggle full screen">Full screen</button>' +
      '<button type="button" data-act="exit">Exit</button>';
    document.body.appendChild(bar);

    var countEl = bar.querySelector('.gn-present-bar__count');
    var titleEl = bar.querySelector('.gn-present-bar__title');
    var prevBtn = bar.querySelector('[data-act="prev"]');
    var nextBtn = bar.querySelector('[data-act="next"]');
    var idx = 0;
    var on = false;

    function slideTitle(s) {
      var t = s.getAttribute('data-slide');
      if (t) return t;
      var hd = s.querySelector('h1, h2');
      return hd ? hd.textContent.trim() : '';
    }

    function show(i) {
      idx = Math.max(0, Math.min(slides.length - 1, i));
      slides.forEach(function (s, n) { s.classList.toggle('is-current', n === idx); });
      countEl.textContent = (idx + 1) + ' / ' + slides.length;
      titleEl.textContent = slideTitle(slides[idx]);
      prevBtn.disabled = idx === 0;
      nextBtn.disabled = idx === slides.length - 1;
      window.scrollTo(0, 0);
      if (!slides[idx].hasAttribute('tabindex')) slides[idx].setAttribute('tabindex', '-1');
      slides[idx].focus({ preventScroll: true });
    }

    function enter() {
      // Start from the section nearest the top of the screen
      var start = 0;
      slides.forEach(function (s, n) {
        if (s.getBoundingClientRect().top < window.innerHeight * 0.4) start = n;
      });
      on = true;
      document.documentElement.classList.add('gn-presenting');
      document.body.classList.add('gn-presenting');
      show(start);
    }

    function exit() {
      on = false;
      document.documentElement.classList.remove('gn-presenting');
      document.body.classList.remove('gn-presenting');
      slides.forEach(function (s) { s.classList.remove('is-current'); });
      if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen();
      slides[idx].scrollIntoView({ block: 'start' });
      btn.focus({ preventScroll: true });
    }

    function toggleFull() {
      try {
        if (document.fullscreenElement) document.exitFullscreen();
        else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
      } catch (e) { /* full screen not allowed here — carry on windowed */ }
    }

    btn.addEventListener('click', enter);

    bar.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var act = b.getAttribute('data-act');
      if (act === 'prev') show(idx - 1);
      if (act === 'next') show(idx + 1);
      if (act === 'full') toggleFull();
      if (act === 'exit') exit();
    });

    document.addEventListener('keydown', function (e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      var k = e.key;
      if (!on) {
        if ((k === 'p' || k === 'P') && !isTyping(e.target)) { e.preventDefault(); enter(); }
        return;
      }
      if (isTyping(e.target)) {
        if (k === 'Escape') e.target.blur();
        return;
      }
      if (k === 'ArrowRight' || k === 'PageDown' || (k === ' ' && !isActivatable(e.target))) {
        e.preventDefault(); show(idx + 1);
      } else if (k === 'ArrowLeft' || k === 'PageUp') {
        e.preventDefault(); show(idx - 1);
      } else if (k === 'Home') {
        e.preventDefault(); show(0);
      } else if (k === 'End') {
        e.preventDefault(); show(slides.length - 1);
      } else if (k === 'Escape') {
        exit();
      } else if (k === 'f' || k === 'F') {
        toggleFull();
      }
    });
  }


  /* ─────────────────────────────────────────────────────────────
     2. CLASS SURVEY MODEL
  ───────────────────────────────────────────────────────────── */

  var TOPICS = [
    { id: 'A', label: 'Children surviving to age 5 (worldwide)', short: 'Child survival' },
    { id: 'B', label: 'People surviving cancer',                 short: 'Cancer survival' },
    { id: 'C', label: 'Smoking (fewer smokers counts as better)', short: 'Smoking' },
    { id: 'D', label: 'Clean electricity in Australia',          short: 'Clean electricity' },
    { id: 'E', label: 'The world overall',                       short: 'World overall' }
  ];
  var ANSWERS = [
    { id: 'better', label: 'Better' },
    { id: 'same',   label: 'About the same' },
    { id: 'worse',  label: 'Worse' }
  ];
  var STORE_KEY = 'gn-good-news-survey';
  var SAMPLE = {
    classSize: 28,
    isSample: true,
    rows: {
      A: { better: 9,  same: 7, worse: 12 },
      B: { better: 11, same: 9, worse: 8 },
      C: { better: 15, same: 6, worse: 7 },
      D: { better: 14, same: 8, worse: 6 },
      E: { better: 5,  same: 8, worse: 15 }
    }
  };

  function emptyModel() {
    var rows = {};
    TOPICS.forEach(function (t) { rows[t.id] = { better: null, same: null, worse: null }; });
    return { classSize: null, isSample: false, rows: rows };
  }

  function cloneModel(m) { return JSON.parse(JSON.stringify(m)); }

  var model = (function load() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        var m = JSON.parse(raw);
        if (m && m.rows) return m;
      }
    } catch (e) { /* storage unavailable — start empty */ }
    return emptyModel();
  }());

  var listeners = [];
  function onChange(fn) { listeners.push(fn); }
  function changed() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(model)); } catch (e) {}
    listeners.forEach(function (fn) { fn(); });
  }

  function rowTotal(r) {
    return (r.better || 0) + (r.same || 0) + (r.worse || 0);
  }
  function rowComplete(r) {
    return r.better !== null && r.same !== null && r.worse !== null;
  }
  function completeTopics() {
    return TOPICS.filter(function (t) { return rowComplete(model.rows[t.id]); });
  }
  function scaleMax() {
    var m = model.classSize || 0;
    completeTopics().forEach(function (t) { m = Math.max(m, rowTotal(model.rows[t.id])); });
    return m;
  }
  function nText() {
    return model.classSize ? 'n = ' + model.classSize : 'class size not entered';
  }


  /* ─────────────────────────────────────────────────────────────
     3. TALLY TABLE
  ───────────────────────────────────────────────────────────── */

  function initTally(root) {
    var controls = htmlEl('div', { className: 'gn-tally__controls' });
    var sizeId = 'gn-size-' + Math.random().toString(36).slice(2, 7);
    var sizeLabel = htmlEl('label', { 'for': sizeId }, 'Slips collected');
    var sizeInput = htmlEl('input', { className: 'gn-input', id: sizeId, type: 'number', min: '0', max: '60', inputmode: 'numeric' });
    var sampleBtn = htmlEl('button', { type: 'button', className: 'gn-btn' }, 'Load sample data');
    var clearBtn = htmlEl('button', { type: 'button', className: 'gn-btn' }, 'Clear');
    var status = htmlEl('span', { className: 'gn-verify gn-verify--none', 'aria-live': 'polite' });
    controls.appendChild(sizeLabel);
    controls.appendChild(sizeInput);
    controls.appendChild(sampleBtn);
    controls.appendChild(clearBtn);
    controls.appendChild(status);
    root.appendChild(controls);

    var table = htmlEl('table');
    var thead = htmlEl('thead');
    var hr = htmlEl('tr');
    hr.appendChild(htmlEl('th', { scope: 'col' }, 'Topic'));
    ANSWERS.forEach(function (a) { hr.appendChild(htmlEl('th', { scope: 'col' }, a.label)); });
    hr.appendChild(htmlEl('th', { scope: 'col' }, 'Total'));
    hr.appendChild(htmlEl('th', { scope: 'col' }, 'Verify'));
    thead.appendChild(hr);
    table.appendChild(thead);
    var tbody = htmlEl('tbody');
    var cells = {};

    TOPICS.forEach(function (t) {
      var tr = htmlEl('tr');
      var th = htmlEl('th', { scope: 'row' });
      th.style.background = 'none';
      th.style.textTransform = 'none';
      th.style.letterSpacing = 'normal';
      th.appendChild(htmlEl('span', { className: 'gn-tally__key' }, t.id));
      th.appendChild(htmlEl('span', { className: 'gn-tally__topic' }, t.label));
      tr.appendChild(th);
      cells[t.id] = {};
      ANSWERS.forEach(function (a) {
        var td = htmlEl('td');
        var inp = htmlEl('input', {
          className: 'gn-input', type: 'number', min: '0', max: '60', inputmode: 'numeric',
          'aria-label': t.label + ': ' + a.label
        });
        inp.addEventListener('input', function () {
          var v = inp.value.trim();
          var n = v === '' ? null : Math.max(0, Math.floor(Number(v)));
          model.rows[t.id][a.id] = (n === null || isNaN(n)) ? null : n;
          model.isSample = false;
          changed();
        });
        cells[t.id][a.id] = inp;
        td.appendChild(inp);
        tr.appendChild(td);
      });
      cells[t.id].total = htmlEl('td', { className: 'gn-tally__topic' }, '–');
      cells[t.id].verify = htmlEl('td');
      tr.appendChild(cells[t.id].total);
      tr.appendChild(cells[t.id].verify);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    var wrap = htmlEl('div', { className: 'spec-table-wrap' });
    wrap.style.margin = '0';
    wrap.appendChild(table);
    root.appendChild(wrap);

    sizeInput.addEventListener('input', function () {
      var v = sizeInput.value.trim();
      var n = v === '' ? null : Math.floor(Number(v));
      model.classSize = (n === null || isNaN(n) || n <= 0) ? null : n;
      model.isSample = false;
      changed();
    });
    sampleBtn.addEventListener('click', function () {
      model = cloneModel(SAMPLE);
      changed();
      fill();
    });
    clearBtn.addEventListener('click', function () {
      model = emptyModel();
      changed();
      fill();
    });

    function fill() {
      sizeInput.value = model.classSize === null ? '' : model.classSize;
      TOPICS.forEach(function (t) {
        ANSWERS.forEach(function (a) {
          var v = model.rows[t.id][a.id];
          cells[t.id][a.id].value = v === null ? '' : v;
        });
      });
      verify();
    }

    function verify() {
      var allOk = true;
      var any = false;
      TOPICS.forEach(function (t) {
        var r = model.rows[t.id];
        var c = cells[t.id];
        var tot = rowTotal(r);
        c.total.textContent = rowComplete(r) ? String(tot) : '–';
        c.verify.innerHTML = '';
        var badge;
        if (!rowComplete(r) || !model.classSize) {
          badge = htmlEl('span', { className: 'gn-verify gn-verify--none' }, '–');
          allOk = false;
        } else if (tot === model.classSize) {
          badge = htmlEl('span', { className: 'gn-verify gn-verify--ok' }, '✓ ' + tot + ' = ' + model.classSize);
          any = true;
        } else {
          badge = htmlEl('span', { className: 'gn-verify gn-verify--bad' },
            '✗ ' + tot + ' ≠ ' + model.classSize + ' — recount');
          allOk = false;
          any = true;
        }
        c.verify.appendChild(badge);
      });
      if (allOk) {
        status.className = 'gn-verify gn-verify--ok';
        status.textContent = '✓ Every row adds up to ' + model.classSize + ' slips' + (model.isSample ? ' (sample data)' : '');
      } else if (any) {
        status.className = 'gn-verify gn-verify--bad';
        status.textContent = '✗ Some rows don’t match the number of slips';
      } else {
        status.className = 'gn-verify gn-verify--none';
        status.textContent = 'Enter the number of slips, then the counts';
      }
    }

    onChange(verify);
    fill();
  }


  /* ─────────────────────────────────────────────────────────────
     4. SURVEY CHARTS — one fair view, three misleading views
  ───────────────────────────────────────────────────────────── */

  var VIEWS = {
    fair: {
      button: 'A. Stacked bars',
      headline: function () { return 'How our class thinks things have changed'; },
      sub: function () { return 'Number of students choosing each answer for each topic (' + nText() + (model.isSample ? ', sample data' : '') + ').'; },
      draw: drawStacked,
      legend: true,
      problem: function () {
        return 'This display is fair. The scale starts at zero, every answer is shown, each bar adds up to the whole class, and the legend and labels explain the colours. The headline describes the data instead of shouting about it.';
      }
    },
    cherry: {
      button: 'B. Only the bad news',
      headline: function () { return 'CLASS SAYS THE WORLD IS GETTING WORSE!'; },
      sub: function () { return 'Students who answered “Worse”.'; },
      draw: drawWorseOnly,
      legend: false,
      problem: function () {
        return 'Cherry-picked. Only the “Worse” answers are shown, so you can’t compare them with “Better” or “Same”. The shouting headline frames the data as fear: the same framing trick the video described.';
      }
    },
    truncated: {
      button: 'C. Better vs worse',
      headline: function () { return 'Pessimists crush optimists on “the world overall”'; },
      sub: function () { return 'Students who answered “Better” and “Worse” for topic E.'; },
      draw: drawTruncated,
      legend: false,
      problem: function () {
        var r = model.rows.E;
        var b = r.better || 0, w = r.worse || 0;
        var base = Math.max(0, Math.min(b, w) - 1);
        var hb = b - base, hw = w - base;
        var big = Math.max(hb, hw), small = Math.max(1, Math.min(hb, hw));
        var realBig = Math.max(b, w), realSmall = Math.max(1, Math.min(b, w));
        if (base === 0) {
          return 'With this data the axis already starts at 0, so the bars are not exaggerated. Try the sample data to see the effect.';
        }
        return 'Truncated axis. The vertical axis starts at ' + base + ', not 0. The taller bar is drawn ' +
          fmt(big / small, 1) + ' times the height of the shorter one, but the real counts (' + b + ' and ' + w +
          ') differ by only ' + fmt(realBig / realSmall, 1) + ' times. Bars must start at zero.';
      }
    },
    line: {
      button: 'D. Line across topics',
      headline: function () { return 'Optimism is trending down'; },
      sub: function () { return 'Students who answered “Better”, topic by topic.'; },
      draw: drawLineAcross,
      legend: false,
      problem: function () {
        return 'Wrong chart type. A line suggests change over time, but topics A to E are separate categories with no order. Put the topics in a different order and the “trend” changes completely. Categories need bars, not a line.';
      }
    }
  };

  function chartFrame(w, h, desc) {
    var s = svgEl('svg', { viewBox: '0 0 ' + w + ' ' + h, role: 'img', 'aria-label': desc });
    return s;
  }

  function drawStacked(svg) {
    var topics = completeTopics();
    var W = 720, labelW = 150, rowH = 40, gap = 14, top = 6, axisH = 30;
    var H = top + topics.length * (rowH + gap) + axisH;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    var N = scaleMax();
    var plotW = W - labelW - 20;
    var x = function (v) { return labelW + (v / N) * plotW; };
    var step = niceStep(N, 6);

    var grid = svgEl('g', { 'class': 'gn-grid' });
    var axis = svgEl('g', { 'class': 'gn-axis' });
    for (var v = 0; v <= N + 0.0001; v += step) {
      grid.appendChild(svgEl('line', { x1: x(v), x2: x(v), y1: top, y2: H - axisH + 4 }));
      axis.appendChild(svgEl('text', { x: x(v), y: H - 8, 'text-anchor': 'middle' }, fmt(v, 1)));
    }
    svg.appendChild(grid);
    svg.appendChild(axis);

    topics.forEach(function (t, i) {
      var r = model.rows[t.id];
      var y = top + i * (rowH + gap);
      svg.appendChild(svgEl('text', { 'class': 'gn-label gn-label--strong', x: 0, y: y + rowH / 2 + 4 }, t.id + '  ' + t.short));
      var acc = 0;
      ANSWERS.forEach(function (a) {
        var val = r[a.id] || 0;
        if (val <= 0) return;
        var x0 = x(acc), x1 = x(acc + val);
        var wRect = Math.max(0, x1 - x0 - 2); // 2px surface gap between segments
        var g = svgEl('g', { 'class': 'gn-mark' });
        var rect = svgEl('rect', { 'class': 'gn-bar--' + a.id, x: x0, y: y, width: wRect, height: rowH, rx: 3 });
        addTitle(rect, t.id + ' ' + t.short + ' — ' + a.label + ': ' + val + ' of ' + rowTotal(r) +
          ' (' + Math.round(100 * val / (rowTotal(r) || 1)) + '%)');
        g.appendChild(rect);
        if (wRect >= 22) {
          g.appendChild(svgEl('text', {
            'class': a.id === 'same' ? 'gn-label--in-dark' : 'gn-label--in',
            x: x0 + wRect / 2, y: y + rowH / 2 + 4, 'text-anchor': 'middle', 'pointer-events': 'none'
          }, val));
        }
        svg.appendChild(g);
        acc += val;
      });
    });
  }

  function verticalBars(svg, items, opts) {
    // items: [{label, value, cls, tip}]
    var W = 720, H = 320, left = 46, right = 10, top = 24, bottom = 44;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    var base = opts.base || 0;
    var maxV = opts.max;
    var plotH = H - top - bottom;
    var y = function (v) { return top + plotH - ((v - base) / (maxV - base)) * plotH; };
    var step = opts.step || niceStep(maxV - base, 5);

    var grid = svgEl('g', { 'class': 'gn-grid' });
    var axis = svgEl('g', { 'class': 'gn-axis' });
    for (var v = base; v <= maxV + 0.0001; v += step) {
      grid.appendChild(svgEl('line', { x1: left, x2: W - right, y1: y(v), y2: y(v) }));
      axis.appendChild(svgEl('text', { x: left - 8, y: y(v) + 4, 'text-anchor': 'end' }, fmt(v, 1)));
    }
    axis.appendChild(svgEl('line', { x1: left, x2: W - right, y1: y(base), y2: y(base) }));
    svg.appendChild(grid);
    svg.appendChild(axis);

    var slot = (W - left - right) / items.length;
    var bw = Math.min(90, slot * 0.6);
    items.forEach(function (it, i) {
      var cx = left + slot * i + slot / 2;
      var g = svgEl('g', { 'class': 'gn-mark' });
      var yTop = y(it.value);
      var rect = svgEl('rect', { 'class': it.cls, x: cx - bw / 2, y: yTop, width: bw, height: Math.max(0, y(base) - yTop), rx: 3 });
      addTitle(rect, it.tip);
      g.appendChild(rect);
      g.appendChild(svgEl('text', { 'class': 'gn-label gn-label--strong', x: cx, y: yTop - 6, 'text-anchor': 'middle' }, it.value));
      g.appendChild(svgEl('text', { 'class': 'gn-label', x: cx, y: H - bottom + 18, 'text-anchor': 'middle' }, it.label));
      svg.appendChild(g);
    });
  }

  function drawWorseOnly(svg) {
    var items = completeTopics().map(function (t) {
      var v = model.rows[t.id].worse || 0;
      return { label: t.id + ' ' + t.short, value: v, cls: 'gn-bar--worse', tip: t.short + ' — Worse: ' + v };
    });
    var mx = Math.max.apply(null, items.map(function (i) { return i.value; }).concat([1]));
    var step = niceStep(mx, 5);
    verticalBars(svg, items, { base: 0, max: Math.ceil(mx / step) * step, step: step });
  }

  function drawTruncated(svg) {
    var r = model.rows.E;
    if (!rowComplete(r)) { svg.appendChild(svgEl('text', { 'class': 'gn-label', x: 10, y: 20 }, 'Topic E has no complete tally yet.')); return; }
    var b = r.better || 0, w = r.worse || 0;
    var base = Math.max(0, Math.min(b, w) - 1);
    var top = Math.max(b, w) + 1;
    verticalBars(svg, [
      { label: 'Better', value: b, cls: 'gn-bar--better', tip: 'World overall — Better: ' + b },
      { label: 'Worse',  value: w, cls: 'gn-bar--worse',  tip: 'World overall — Worse: ' + w }
    ], { base: base, max: top, step: 1 });
  }

  function drawLineAcross(svg) {
    var topics = completeTopics();
    var W = 720, H = 300, left = 46, right = 30, top = 24, bottom = 44;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    var vals = topics.map(function (t) { return model.rows[t.id].better || 0; });
    var mx = Math.max.apply(null, vals.concat([1]));
    var step = niceStep(mx, 5);
    var maxV = Math.ceil(mx / step) * step;
    var plotH = H - top - bottom;
    var y = function (v) { return top + plotH - (v / maxV) * plotH; };
    var slot = (W - left - right) / Math.max(1, topics.length);
    var x = function (i) { return left + slot * i + slot / 2; };

    var grid = svgEl('g', { 'class': 'gn-grid' });
    var axis = svgEl('g', { 'class': 'gn-axis' });
    for (var v = 0; v <= maxV + 0.0001; v += step) {
      grid.appendChild(svgEl('line', { x1: left, x2: W - right, y1: y(v), y2: y(v) }));
      axis.appendChild(svgEl('text', { x: left - 8, y: y(v) + 4, 'text-anchor': 'end' }, fmt(v, 1)));
    }
    svg.appendChild(grid);
    svg.appendChild(axis);

    var pts = topics.map(function (t, i) { return x(i) + ',' + y(vals[i]); }).join(' ');
    svg.appendChild(svgEl('polyline', { 'class': 'gn-line', points: pts }));
    topics.forEach(function (t, i) {
      var c = svgEl('circle', { 'class': 'gn-dot', cx: x(i), cy: y(vals[i]), r: 6 });
      addTitle(c, t.short + ' — Better: ' + vals[i]);
      svg.appendChild(c);
      svg.appendChild(svgEl('text', { 'class': 'gn-label gn-label--strong', x: x(i), y: y(vals[i]) - 12, 'text-anchor': 'middle' }, vals[i]));
      svg.appendChild(svgEl('text', { 'class': 'gn-label', x: x(i), y: H - bottom + 18, 'text-anchor': 'middle' }, t.id + ' ' + t.short));
    });
  }

  function initChart(root) {
    var viewIds = (root.getAttribute('data-views') || 'fair').split(',').map(function (s) { return s.trim(); });
    var current = viewIds[0];
    var revealed = false;

    var switcher = null;
    if (viewIds.length > 1) {
      switcher = htmlEl('div', { className: 'gn-views', role: 'group', 'aria-label': 'Choose a chart' });
      viewIds.forEach(function (id) {
        var b = htmlEl('button', { type: 'button', className: 'gn-btn', 'aria-pressed': String(id === current), 'data-view': id }, VIEWS[id].button);
        b.addEventListener('click', function () {
          current = id;
          revealed = false;
          switcher.querySelectorAll('button[data-view]').forEach(function (x) {
            x.setAttribute('aria-pressed', String(x.getAttribute('data-view') === current));
          });
          render();
        });
        switcher.appendChild(b);
      });
      root.appendChild(switcher);
    }

    var panel = htmlEl('div', { className: 'gn-chart' });
    var headline = htmlEl('p', { className: 'gn-chart__headline' });
    var sub = htmlEl('p', { className: 'gn-chart__sub' });
    var holder = htmlEl('div');
    var legend = htmlEl('div', { className: 'gn-chart__legend' });
    legend.innerHTML =
      '<span><i class="gn-swatch gn-swatch--better" aria-hidden="true"></i>Better</span>' +
      '<span><i class="gn-swatch gn-swatch--same" aria-hidden="true"></i>About the same</span>' +
      '<span><i class="gn-swatch gn-swatch--worse" aria-hidden="true"></i>Worse</span>';
    panel.appendChild(headline);
    panel.appendChild(sub);
    panel.appendChild(holder);
    panel.appendChild(legend);
    root.appendChild(panel);

    var revealBtn = null, revealBox = null;
    if (root.hasAttribute('data-reveal')) {
      revealBtn = htmlEl('button', { type: 'button', className: 'gn-btn gn-btn--primary', 'aria-expanded': 'false' }, 'Reveal: what’s wrong with it?');
      revealBox = htmlEl('div', { className: 'gn-reveal', 'aria-live': 'polite' });
      revealBox.hidden = true;
      revealBtn.addEventListener('click', function () {
        revealed = !revealed;
        render();
      });
      root.appendChild(revealBtn);
      root.appendChild(revealBox);
    }

    function render() {
      var v = VIEWS[current];
      holder.innerHTML = '';
      if (!completeTopics().length) {
        headline.textContent = '';
        sub.textContent = '';
        legend.hidden = true;
        holder.appendChild(htmlEl('p', { className: 'gn-empty' }, 'No class data yet. Enter the tallies in the count table (or load the sample data) to draw this chart.'));
        if (revealBtn) { revealBtn.hidden = true; revealBox.hidden = true; }
        return;
      }
      headline.textContent = v.headline();
      sub.textContent = v.sub();
      legend.hidden = !v.legend;
      var s = chartFrame(720, 300, v.headline() + '. ' + v.sub());
      holder.appendChild(s);
      v.draw(s);
      if (revealBtn) {
        revealBtn.hidden = false;
        revealBtn.setAttribute('aria-expanded', String(revealed));
        revealBtn.textContent = revealed ? 'Hide the answer' : 'Reveal: what’s wrong with it?';
        revealBox.hidden = !revealed;
        revealBox.textContent = revealed ? v.problem() : '';
      }
    }

    onChange(render);
    render();
  }


  /* ─────────────────────────────────────────────────────────────
     5. DOT PLOT — validation + outliers
  ───────────────────────────────────────────────────────────── */

  function parseValues(text) {
    var valid = [], invalid = [];
    text.split(/[,\s;]+/).forEach(function (tok) {
      var t = tok.trim();
      if (!t) return;
      var n = Number(t);
      if (!isFinite(n) || /^0x/i.test(t)) invalid.push({ token: t, reason: 'type check: not a number' });
      else if (n < 0 || n > 24) invalid.push({ token: t, reason: 'range check: outside 0–24 hours' });
      else valid.push(n);
    });
    return { valid: valid, invalid: invalid };
  }

  function median(sorted) {
    var n = sorted.length;
    if (!n) return NaN;
    return n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
  }

  // Quartiles: median of the lower and upper halves (median excluded when n is odd)
  function summarise(values) {
    var s = values.slice().sort(function (a, b) { return a - b; });
    var n = s.length;
    var lower = s.slice(0, Math.floor(n / 2));
    var upper = s.slice(Math.ceil(n / 2));
    var q1 = median(lower), q3 = median(upper);
    var iqr = q3 - q1;
    var lo = q1 - 1.5 * iqr, hi = q3 + 1.5 * iqr;
    var outliers = s.filter(function (v) { return v < lo || v > hi; });
    var kept = s.filter(function (v) { return v >= lo && v <= hi; });
    var sum = function (a) { return a.reduce(function (p, c) { return p + c; }, 0); };
    return {
      n: n, sorted: s, med: median(s), q1: q1, q3: q3, lo: lo, hi: hi,
      outliers: outliers,
      mean: n ? sum(s) / n : NaN,
      meanKept: kept.length ? sum(kept) / kept.length : NaN,
      min: s[0], max: s[n - 1]
    };
  }

  function initDotPlot(root) {
    var sample = root.getAttribute('data-sample') || '';
    var id = 'gn-dp-' + Math.random().toString(36).slice(2, 7);
    var label = htmlEl('label', { 'for': id }, 'Hours values, separated by commas');
    label.style.fontWeight = '700';
    label.style.fontSize = 'var(--text-sm)';
    var ta = htmlEl('textarea', { className: 'gn-textarea', id: id, spellcheck: 'false' });
    var ctr = htmlEl('div', { className: 'gn-tally__controls' });
    ctr.style.marginTop = 'var(--space-3)';
    var plotBtn = htmlEl('button', { type: 'button', className: 'gn-btn gn-btn--primary' }, 'Validate and plot');
    var sampleBtn = htmlEl('button', { type: 'button', className: 'gn-btn' }, 'Load sample data');
    var clearBtn = htmlEl('button', { type: 'button', className: 'gn-btn' }, 'Clear');
    ctr.appendChild(plotBtn);
    ctr.appendChild(sampleBtn);
    ctr.appendChild(clearBtn);
    var invalidOut = htmlEl('p', { className: 'gn-invalid-list', 'aria-live': 'polite' });
    var stats = htmlEl('div', { className: 'gn-stats' });
    var panel = htmlEl('div', { className: 'gn-chart' });
    var hl = htmlEl('p', { className: 'gn-chart__headline' }, 'Hours per school day on social media or news feeds');
    var sb = htmlEl('p', { className: 'gn-chart__sub' }, 'One dot per valid slip. Red dots are outliers by the 1.5 × IQR rule.');
    var holder = htmlEl('div');
    panel.appendChild(hl);
    panel.appendChild(sb);
    panel.appendChild(holder);

    root.appendChild(label);
    root.appendChild(ta);
    root.appendChild(ctr);
    root.appendChild(invalidOut);
    root.appendChild(stats);
    root.appendChild(panel);

    function stat(lbl, val) {
      var d = htmlEl('div', { className: 'gn-stat' });
      d.appendChild(htmlEl('span', { className: 'gn-stat__label' }, lbl));
      d.appendChild(htmlEl('span', { className: 'gn-stat__value' }, val));
      return d;
    }

    function run() {
      var p = parseValues(ta.value);
      invalidOut.textContent = p.invalid.length
        ? 'Rejected by validation: ' + p.invalid.map(function (x) { return '“' + x.token + '” — ' + x.reason; }).join(' · ')
        : '';
      stats.innerHTML = '';
      holder.innerHTML = '';
      if (!p.valid.length) {
        holder.appendChild(htmlEl('p', { className: 'gn-empty' }, 'No valid values yet. Type the values read from the slips, or load the sample data.'));
        return;
      }
      var s = summarise(p.valid);
      stats.appendChild(stat('Valid slips', s.n));
      stats.appendChild(stat('Rejected', p.invalid.length));
      stats.appendChild(stat('Median', fmt(s.med, 2)));
      stats.appendChild(stat('Mean (all valid)', fmt(s.mean, 1)));
      stats.appendChild(stat('Mean (no outliers)', fmt(s.meanKept, 1)));
      stats.appendChild(stat('Outliers', s.outliers.length ? s.outliers.join(', ') : 'none'));

      var W = 720, H = 220, left = 20, right = 20, axisY = H - 40;
      var maxX = Math.max(6, Math.ceil(s.max) + 1);
      var x = function (v) { return left + (v / maxX) * (W - left - right); };
      var svg = svgEl('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img',
        'aria-label': 'Dot plot of ' + s.n + ' values. Median ' + fmt(s.med, 2) + ' hours. Outliers: ' + (s.outliers.length ? s.outliers.join(', ') : 'none') + '.' });
      var axis = svgEl('g', { 'class': 'gn-axis' });
      axis.appendChild(svgEl('line', { x1: left, x2: W - right, y1: axisY, y2: axisY }));
      var step = maxX <= 12 ? 1 : 2;
      for (var v = 0; v <= maxX; v += step) {
        axis.appendChild(svgEl('line', { x1: x(v), x2: x(v), y1: axisY, y2: axisY + 5 }));
        axis.appendChild(svgEl('text', { x: x(v), y: axisY + 20, 'text-anchor': 'middle' }, v));
      }
      axis.appendChild(svgEl('text', { x: (W) / 2, y: H - 2, 'text-anchor': 'middle' }, 'Hours per school day'));
      svg.appendChild(axis);

      var stacks = {};
      s.sorted.forEach(function (val) {
        var key = String(Math.round(val * 2) / 2);
        stacks[key] = (stacks[key] || 0) + 1;
        var level = stacks[key] - 1;
        var isOut = val < s.lo || val > s.hi;
        var c = svgEl('circle', { 'class': 'gn-dot' + (isOut ? ' gn-dot--flag' : ''), cx: x(val), cy: axisY - 10 - level * 15, r: 6.5 });
        addTitle(c, val + ' hours' + (isOut ? ' — outlier' : ''));
        svg.appendChild(c);
      });
      s.outliers.forEach(function (val, i) {
        if (s.outliers.indexOf(val) !== i) return;
        var key = String(Math.round(val * 2) / 2);
        var yTop = axisY - 10 - (stacks[key] - 1) * 15;
        svg.appendChild(svgEl('text', { 'class': 'gn-flag-label', x: x(val), y: yTop - 14, 'text-anchor': 'middle' }, 'Outlier: ' + val));
      });
      // median marker
      svg.appendChild(svgEl('line', { x1: x(s.med), x2: x(s.med), y1: 10, y2: axisY, stroke: 'currentColor', 'stroke-dasharray': '4 4', 'class': 'gn-median', style: 'stroke: var(--color-text-secondary)' }));
      svg.appendChild(svgEl('text', { 'class': 'gn-label gn-label--strong', x: x(s.med) + 6, y: 20 }, 'median ' + fmt(s.med, 2)));
      holder.appendChild(svg);
    }

    plotBtn.addEventListener('click', run);
    sampleBtn.addEventListener('click', function () { ta.value = sample; run(); });
    clearBtn.addEventListener('click', function () { ta.value = ''; run(); });
    ta.value = '';
    run();
  }


  /* ─────────────────────────────────────────────────────────────
     6. TREND CHART — verification of a hand-copied dataset
     Source: World Bank indicator SH.DYN.MORT (UN IGME estimates),
     world under-five mortality rate per 1,000 live births.
  ───────────────────────────────────────────────────────────── */

  var U5_VERIFIED = [
    [1990, 93.5], [1995, 87.5], [2000, 76.7], [2005, 62.3],
    [2010, 50.6], [2015, 42.9], [2020, 39.2], [2024, 37.4]
  ];
  var U5_TYPED = U5_VERIFIED.map(function (p) { return p[0] === 2005 ? [2005, 623] : p.slice(); });

  function initTrend(root) {
    var mode = 'typed';
    var switcher = htmlEl('div', { className: 'gn-views', role: 'group', 'aria-label': 'Choose dataset version' });
    var bTyped = htmlEl('button', { type: 'button', className: 'gn-btn', 'aria-pressed': 'true' }, 'As typed (copied by hand)');
    var bVer = htmlEl('button', { type: 'button', className: 'gn-btn', 'aria-pressed': 'false' }, 'Verified against the source');
    switcher.appendChild(bTyped);
    switcher.appendChild(bVer);
    var panel = htmlEl('div', { className: 'gn-chart' });
    var hl = htmlEl('p', { className: 'gn-chart__headline' });
    var sb = htmlEl('p', { className: 'gn-chart__sub' });
    var holder = htmlEl('div');
    var src = htmlEl('p', { className: 'gn-chart__source' }, 'Source: World Bank indicator SH.DYN.MORT, UN Inter-agency Group for Child Mortality Estimation (UN IGME). World under-five mortality rate, deaths per 1,000 live births.');
    panel.appendChild(hl);
    panel.appendChild(sb);
    panel.appendChild(holder);
    panel.appendChild(src);
    root.appendChild(switcher);
    root.appendChild(panel);

    function set(m) {
      mode = m;
      bTyped.setAttribute('aria-pressed', String(m === 'typed'));
      bVer.setAttribute('aria-pressed', String(m === 'verified'));
      render();
    }
    bTyped.addEventListener('click', function () { set('typed'); });
    bVer.addEventListener('click', function () { set('verified'); });

    function render() {
      var data = mode === 'typed' ? U5_TYPED : U5_VERIFIED;
      hl.textContent = mode === 'typed'
        ? 'Child deaths: a huge spike in 2005?'
        : 'The world’s under-five mortality rate has fallen by 60% since 1990';
      sb.textContent = mode === 'typed'
        ? 'Deaths before age 5 per 1,000 live births, world — dataset as copied by hand.'
        : 'Deaths before age 5 per 1,000 live births, world — every value checked against the source.';
      holder.innerHTML = '';
      var W = 720, H = 320, left = 50, right = 30, top = 24, bottom = 40;
      var mx = Math.max.apply(null, data.map(function (p) { return p[1]; }));
      var step = niceStep(mx, 5);
      var maxV = Math.ceil(mx / step) * step;
      var x0 = 1990, x1 = 2024;
      var x = function (yr) { return left + ((yr - x0) / (x1 - x0)) * (W - left - right); };
      var y = function (v) { return top + (H - top - bottom) - (v / maxV) * (H - top - bottom); };
      var svg = svgEl('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': hl.textContent + ' ' + data.map(function (p) { return p[0] + ': ' + p[1]; }).join(', ') });
      var grid = svgEl('g', { 'class': 'gn-grid' });
      var axis = svgEl('g', { 'class': 'gn-axis' });
      for (var v = 0; v <= maxV + 0.0001; v += step) {
        grid.appendChild(svgEl('line', { x1: left, x2: W - right, y1: y(v), y2: y(v) }));
        axis.appendChild(svgEl('text', { x: left - 8, y: y(v) + 4, 'text-anchor': 'end' }, fmt(v, 1)));
      }
      axis.appendChild(svgEl('line', { x1: left, x2: W - right, y1: y(0), y2: y(0) }));
      data.forEach(function (p) {
        axis.appendChild(svgEl('text', { x: x(p[0]), y: H - bottom + 18, 'text-anchor': 'middle' }, p[0]));
      });
      svg.appendChild(grid);
      svg.appendChild(axis);
      svg.appendChild(svgEl('polyline', { 'class': 'gn-line', points: data.map(function (p) { return x(p[0]) + ',' + y(p[1]); }).join(' ') }));
      data.forEach(function (p, i) {
        var flag = mode === 'typed' && p[0] === 2005;
        var c = svgEl('circle', { 'class': 'gn-dot' + (flag ? ' gn-dot--flag' : ''), cx: x(p[0]), cy: y(p[1]), r: 6 });
        addTitle(c, p[0] + ': ' + p[1] + ' per 1,000');
        svg.appendChild(c);
        if (flag) {
          svg.appendChild(svgEl('text', { 'class': 'gn-flag-label', x: x(p[0]) + 12, y: y(p[1]) + 4 }, p[1] + '?  Check the source'));
        } else if (i === 0 || i === data.length - 1 || (mode === 'verified' && p[0] === 2005)) {
          svg.appendChild(svgEl('text', { 'class': 'gn-label gn-label--strong', x: x(p[0]), y: y(p[1]) - 12, 'text-anchor': i === data.length - 1 ? 'end' : 'middle' }, p[1]));
        }
      });
      holder.appendChild(svg);
    }
    render();
  }


  /* ─────────────────────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────────────────────── */

  function init() {
    initPresent();
    document.querySelectorAll('[data-gn-tally]').forEach(initTally);
    document.querySelectorAll('[data-gn-chart]').forEach(initChart);
    document.querySelectorAll('[data-gn-dotplot]').forEach(initDotPlot);
    document.querySelectorAll('[data-gn-trend]').forEach(initTrend);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  // Exposed for testing only
  window.GoodNews = { summarise: summarise, parseValues: parseValues, U5_VERIFIED: U5_VERIFIED };
}());
