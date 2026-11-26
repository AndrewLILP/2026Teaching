/**
 * solar.js
 * Computing Technology 7–10 | "How fast is solar growing?" demo double lesson
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
 *   2. Class survey model — saved to localStorage so Lesson 2 on the
 *      same computer reuses Lesson 1's data
 *   3. Rooftop tally     [data-sv-tally]        with total verification
 *   4. Rooftop chart     [data-sv-rooftop]      class vs Australia
 *   5. Guess dot plots   [data-sv-dotplot]      validation + outliers + truth line
 *   6. World growth      [data-sv-growth]       linear / log / yearly additions
 *   7. Evaluate          [data-sv-evaluate]     fair view + three misleading views
 *   8. Prediction        [data-sv-predict]      straight line vs constant % growth
 *   9. Growth table      [data-sv-growth-table] conditional formatting + IF demo
 *
 * DATA: cumulative solar PV capacity, gigawatts. IRENA Renewable Energy
 * Statistics, processed by Our World in Data (accessed November 2026).
 */

(function () {
  'use strict';

  var SVGNS = 'http://www.w3.org/2000/svg';

  /* ── Data ───────────────────────────────────────────────────── */

  var WORLD = [
    [2000, 0.76], [2001, 1.02], [2002, 1.34], [2003, 1.85], [2004, 2.92],
    [2005, 4.39], [2006, 5.91], [2007, 8.27], [2008, 14.45], [2009, 22.48],
    [2010, 39.85], [2011, 70.43], [2012, 99.54], [2013, 134.73], [2014, 172.97],
    [2015, 220.15], [2016, 291.69], [2017, 384.92], [2018, 479.05], [2019, 580.47],
    [2020, 710.73], [2021, 854.81], [2022, 1045.69], [2023, 1410.56], [2024, 1866.90],
    [2025, 2378.04]
  ];
  var AUSTRALIA = [
    [2000, 0.025], [2001, 0.029], [2002, 0.034], [2003, 0.039], [2004, 0.046],
    [2005, 0.052], [2006, 0.061], [2007, 0.070], [2008, 0.082], [2009, 0.329],
    [2010, 1.088], [2011, 1.418], [2012, 2.508], [2013, 3.309], [2014, 4.134],
    [2015, 5.033], [2016, 5.878], [2017, 7.238], [2018, 11.125], [2019, 15.450],
    [2020, 19.770], [2021, 24.394], [2022, 28.884], [2023, 33.179], [2024, 37.370],
    [2025, 42.440]
  ];
  var SOURCE = 'Source: IRENA Renewable Energy Statistics, via Our World in Data. Cumulative solar PV capacity, gigawatts (GW).';

  /* ── Helpers ────────────────────────────────────────────────── */

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
  function addTitle(node, text) { node.appendChild(svgEl('title', null, text)); return node; }
  function niceStep(range, ticks) {
    var raw = range / (ticks || 5);
    var mag = Math.pow(10, Math.floor(Math.log10(raw || 1)));
    var steps = [1, 2, 2.5, 5, 10];
    for (var i = 0; i < steps.length; i++) if (steps[i] * mag >= raw) return steps[i] * mag;
    return 10 * mag;
  }
  function fmt(n, dp) {
    if (n === null || n === undefined || isNaN(n)) return '–';
    var p = Math.pow(10, dp === undefined ? 1 : dp);
    return String(Math.round(n * p) / p);
  }
  function fmtGW(n) {
    return n >= 100 ? Math.round(n).toLocaleString('en-AU') : fmt(n, 1);
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
  function valueAt(series, year) {
    for (var i = 0; i < series.length; i++) if (series[i][0] === year) return series[i][1];
    return NaN;
  }
  function switcher(labels, current, onPick, aria) {
    var wrap = htmlEl('div', { className: 'sv-views', role: 'group', 'aria-label': aria || 'Choose a view' });
    Object.keys(labels).forEach(function (id) {
      var b = htmlEl('button', { type: 'button', className: 'sv-btn', 'aria-pressed': String(id === current), 'data-view': id }, labels[id]);
      b.addEventListener('click', function () {
        wrap.querySelectorAll('button[data-view]').forEach(function (x) {
          x.setAttribute('aria-pressed', String(x === b));
        });
        onPick(id);
      });
      wrap.appendChild(b);
    });
    return wrap;
  }
  function panel() {
    var p = htmlEl('div', { className: 'sv-chart' });
    p.headline = htmlEl('p', { className: 'sv-chart__headline' });
    p.sub = htmlEl('p', { className: 'sv-chart__sub' });
    p.holder = htmlEl('div');
    p.legend = htmlEl('div', { className: 'sv-chart__legend' });
    p.source = htmlEl('p', { className: 'sv-chart__source' });
    p.appendChild(p.headline);
    p.appendChild(p.sub);
    p.appendChild(p.holder);
    p.appendChild(p.legend);
    p.appendChild(p.source);
    return p;
  }

  /* Generic x/y line chart. opts: series [{data, cls, label, dashed}], x0, x1,
     yMax, log, yLabel, labelEnds, markers [{y, label}], hideTicks */
  function lineChart(svg, opts) {
    var W = 720, H = 320, left = 62, right = 34, top = 22, bottom = 42;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    var x0 = opts.x0, x1 = opts.x1;
    var x = function (yr) { return left + ((yr - x0) / (x1 - x0)) * (W - left - right); };
    var plotH = H - top - bottom;
    var y, ticks = [];
    if (opts.log) {
      var lo = opts.logMin || 0.1, hi = opts.yMax;
      var l0 = Math.log10(lo), l1 = Math.log10(hi);
      y = function (v) { return top + plotH - ((Math.log10(Math.max(v, lo)) - l0) / (l1 - l0)) * plotH; };
      for (var p = Math.ceil(l0); p <= Math.floor(l1); p++) ticks.push(Math.pow(10, p));
    } else {
      var step = opts.step || niceStep(opts.yMax - (opts.yMin || 0), 5);
      var yMin = opts.yMin || 0;
      var yMax = Math.ceil(opts.yMax / step) * step;
      y = function (v) { return top + plotH - ((v - yMin) / (yMax - yMin)) * plotH; };
      for (var t = yMin; t <= yMax + 1e-9; t += step) ticks.push(t);
    }
    var grid = svgEl('g', { 'class': 'sv-grid' });
    var axis = svgEl('g', { 'class': 'sv-axis' });
    ticks.forEach(function (t) {
      grid.appendChild(svgEl('line', { x1: left, x2: W - right, y1: y(t), y2: y(t) }));
      if (!opts.hideTicks) axis.appendChild(svgEl('text', { x: left - 8, y: y(t) + 4, 'text-anchor': 'end' }, t >= 1000 ? t.toLocaleString('en-AU') : fmt(t, 2)));
    });
    var xStep = (x1 - x0) > 12 ? 5 : ((x1 - x0) > 6 ? 2 : 1);
    for (var yr = x0; yr <= x1; yr++) {
      if ((yr - x0) % xStep === 0 || yr === x1) {
        axis.appendChild(svgEl('text', { x: x(yr), y: H - bottom + 18, 'text-anchor': 'middle' }, yr));
      }
    }
    axis.appendChild(svgEl('line', { x1: left, x2: W - right, y1: top + plotH, y2: top + plotH }));
    if (opts.yLabel) {
      axis.appendChild(svgEl('text', { x: 14, y: top + plotH / 2, 'text-anchor': 'middle', transform: 'rotate(-90 14 ' + (top + plotH / 2) + ')' }, opts.yLabel));
    }
    svg.appendChild(grid);
    svg.appendChild(axis);
    (opts.markers || []).forEach(function (m) {
      svg.appendChild(svgEl('line', { 'class': 'sv-ref', x1: left, x2: W - right, y1: y(m.y), y2: y(m.y) }));
      svg.appendChild(svgEl('text', { 'class': 'sv-label', x: left + 6, y: y(m.y) - 6 }, m.label));
    });
    opts.series.forEach(function (s) {
      var pts = s.data.filter(function (p) { return p[0] >= x0 && p[0] <= x1; });
      svg.appendChild(svgEl('polyline', { 'class': s.cls || 'sv-line', points: pts.map(function (p) { return x(p[0]) + ',' + y(p[1]); }).join(' ') }));
      if (s.dots !== false) {
        pts.forEach(function (p) {
          var c = svgEl('circle', { 'class': s.dotCls || 'sv-dot', cx: x(p[0]), cy: y(p[1]), r: pts.length > 14 ? 4.5 : 6 });
          addTitle(c, p[0] + ': ' + fmtGW(p[1]) + ' GW' + (s.label ? ' (' + s.label + ')' : ''));
          svg.appendChild(c);
        });
      }
      if (s.endLabel && pts.length) {
        var last = pts[pts.length - 1];
        svg.appendChild(svgEl('text', { 'class': 'sv-label sv-label--strong', x: x(last[0]) - 6, y: y(last[1]) - 10, 'text-anchor': 'end' }, s.endLabel));
      }
    });
    return { x: x, y: y };
  }

  function barChart(svg, items, opts) {
    var W = 720, H = 320, left = 62, right = 14, top = 26, bottom = 42;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    var base = opts.base || 0, maxV = opts.max;
    var plotH = H - top - bottom;
    var y = function (v) { return top + plotH - ((v - base) / (maxV - base)) * plotH; };
    var step = opts.step || niceStep(maxV - base, 5);
    var grid = svgEl('g', { 'class': 'sv-grid' });
    var axis = svgEl('g', { 'class': 'sv-axis' });
    for (var v = base; v <= maxV + 1e-9; v += step) {
      grid.appendChild(svgEl('line', { x1: left, x2: W - right, y1: y(v), y2: y(v) }));
      axis.appendChild(svgEl('text', { x: left - 8, y: y(v) + 4, 'text-anchor': 'end' }, v >= 1000 ? v.toLocaleString('en-AU') : fmt(v, 1)));
    }
    axis.appendChild(svgEl('line', { x1: left, x2: W - right, y1: y(base), y2: y(base) }));
    svg.appendChild(grid);
    svg.appendChild(axis);
    var slot = (W - left - right) / items.length;
    var bw = Math.min(opts.barMax || 90, slot * 0.7);
    items.forEach(function (it, i) {
      var cx = left + slot * i + slot / 2;
      var yTop = y(it.value);
      var rect = svgEl('rect', { 'class': it.cls || 'sv-bar--better', x: cx - bw / 2, y: yTop, width: bw, height: Math.max(0, y(base) - yTop), rx: 2 });
      addTitle(rect, it.tip || (it.label + ': ' + it.value));
      svg.appendChild(rect);
      if (opts.valueLabels !== false) svg.appendChild(svgEl('text', { 'class': 'sv-label sv-label--strong', x: cx, y: yTop - 6, 'text-anchor': 'middle' }, it.text || it.value));
      if (opts.everyLabel || items.length <= 12 || i % 5 === 0 || i === items.length - 1) {
        svg.appendChild(svgEl('text', { 'class': 'sv-label', x: cx, y: H - bottom + 18, 'text-anchor': 'middle' }, it.label));
      }
    });
  }


  /* ─────────────────────────────────────────────────────────────
     1. PRESENT MODE
  ───────────────────────────────────────────────────────────── */

  function initPresent() {
    var btn = document.querySelector('.sv-present-btn');
    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-slide]'));
    if (!btn || !slides.length) return;

    var bar = htmlEl('div', { className: 'sv-present-bar', role: 'toolbar', 'aria-label': 'Slide controls' });
    bar.innerHTML =
      '<button type="button" data-act="prev" aria-label="Previous slide">&larr;</button>' +
      '<span class="sv-present-bar__count" aria-live="polite"></span>' +
      '<span class="sv-present-bar__title"></span>' +
      '<button type="button" data-act="next" aria-label="Next slide">&rarr;</button>' +
      '<button type="button" data-act="full" aria-label="Toggle full screen">Full screen</button>' +
      '<button type="button" data-act="exit">Exit</button>';
    document.body.appendChild(bar);
    var countEl = bar.querySelector('.sv-present-bar__count');
    var titleEl = bar.querySelector('.sv-present-bar__title');
    var prevBtn = bar.querySelector('[data-act="prev"]');
    var nextBtn = bar.querySelector('[data-act="next"]');
    var idx = 0, on = false;

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
      var start = 0;
      slides.forEach(function (s, n) { if (s.getBoundingClientRect().top < window.innerHeight * 0.4) start = n; });
      on = true;
      document.documentElement.classList.add('sv-presenting');
      document.body.classList.add('sv-presenting');
      show(start);
    }
    function exit() {
      on = false;
      document.documentElement.classList.remove('sv-presenting');
      document.body.classList.remove('sv-presenting');
      slides.forEach(function (s) { s.classList.remove('is-current'); });
      if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen();
      slides[idx].scrollIntoView({ block: 'start' });
      btn.focus({ preventScroll: true });
    }
    function toggleFull() {
      try {
        if (document.fullscreenElement) document.exitFullscreen();
        else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
      } catch (e) { /* full screen not allowed — carry on windowed */ }
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
      if (isTyping(e.target)) { if (k === 'Escape') e.target.blur(); return; }
      if (k === 'ArrowRight' || k === 'PageDown' || (k === ' ' && !isActivatable(e.target))) { e.preventDefault(); show(idx + 1); }
      else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); show(idx - 1); }
      else if (k === 'Home') { e.preventDefault(); show(0); }
      else if (k === 'End') { e.preventDefault(); show(slides.length - 1); }
      else if (k === 'Escape') { exit(); }
      else if (k === 'f' || k === 'F') { toggleFull(); }
    });
  }


  /* ─────────────────────────────────────────────────────────────
     2. CLASS SURVEY MODEL
  ───────────────────────────────────────────────────────────── */

  var STORE_KEY = 'sv-solar-survey';
  var ANSWERS = [
    { id: 'yes',     label: 'Yes' },
    { id: 'no',      label: 'No' },
    { id: 'unsure',  label: 'Not sure' },
    { id: 'private', label: 'Prefer not to say' }
  ];
  var SAMPLE_TALLY = { slips: 26, yes: 9, no: 11, unsure: 5, private: 1 };

  function emptyModel() {
    return { slips: null, yes: null, no: null, unsure: null, private: null, isSample: false, guesses: {} };
  }
  var model = (function () {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (raw) { var m = JSON.parse(raw); if (m && 'slips' in m) { m.guesses = m.guesses || {}; return m; } }
    } catch (e) { /* storage unavailable */ }
    return emptyModel();
  }());
  var listeners = [];
  function onChange(fn) { listeners.push(fn); }
  function changed() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(model)); } catch (e) {}
    listeners.forEach(function (fn) { fn(); });
  }
  function tallyComplete() {
    return ANSWERS.every(function (a) { return model[a.id] !== null && model[a.id] !== undefined; });
  }
  function tallyTotal() {
    return ANSWERS.reduce(function (s, a) { return s + (model[a.id] || 0); }, 0);
  }


  /* ─────────────────────────────────────────────────────────────
     3. ROOFTOP TALLY
  ───────────────────────────────────────────────────────────── */

  function initTally(root) {
    var controls = htmlEl('div', { className: 'sv-tally__controls' });
    var id = 'sv-slips-' + Math.random().toString(36).slice(2, 7);
    controls.appendChild(htmlEl('label', { 'for': id }, 'Slips collected'));
    var slipsIn = htmlEl('input', { className: 'sv-input', id: id, type: 'number', min: '0', max: '60', inputmode: 'numeric' });
    controls.appendChild(slipsIn);
    var sampleBtn = htmlEl('button', { type: 'button', className: 'sv-btn' }, 'Load sample data');
    var clearBtn = htmlEl('button', { type: 'button', className: 'sv-btn' }, 'Clear');
    var status = htmlEl('span', { className: 'sv-verify sv-verify--none', 'aria-live': 'polite' });
    controls.appendChild(sampleBtn);
    controls.appendChild(clearBtn);
    controls.appendChild(status);
    root.appendChild(controls);

    var table = htmlEl('table');
    var hr = htmlEl('tr');
    hr.appendChild(htmlEl('th', { scope: 'col' }, 'Question 1: solar panels on your home’s roof?'));
    ANSWERS.forEach(function (a) { hr.appendChild(htmlEl('th', { scope: 'col' }, a.label)); });
    hr.appendChild(htmlEl('th', { scope: 'col' }, 'Total'));
    var thead = htmlEl('thead'); thead.appendChild(hr); table.appendChild(thead);
    var tr = htmlEl('tr');
    tr.appendChild(htmlEl('td', { className: 'sv-tally__topic' }, 'Hands up'));
    var inputs = {};
    ANSWERS.forEach(function (a) {
      var td = htmlEl('td');
      var inp = htmlEl('input', { className: 'sv-input', type: 'number', min: '0', max: '60', inputmode: 'numeric', 'aria-label': a.label });
      inp.addEventListener('input', function () {
        var v = inp.value.trim();
        var n = v === '' ? null : Math.max(0, Math.floor(Number(v)));
        model[a.id] = (n === null || isNaN(n)) ? null : n;
        model.isSample = false;
        changed();
      });
      inputs[a.id] = inp;
      td.appendChild(inp);
      tr.appendChild(td);
    });
    var totalTd = htmlEl('td', { className: 'sv-tally__topic' }, '–');
    tr.appendChild(totalTd);
    var tbody = htmlEl('tbody'); tbody.appendChild(tr); table.appendChild(tbody);
    var wrap = htmlEl('div', { className: 'spec-table-wrap' });
    wrap.style.margin = '0';
    wrap.appendChild(table);
    root.appendChild(wrap);

    slipsIn.addEventListener('input', function () {
      var v = slipsIn.value.trim();
      var n = v === '' ? null : Math.floor(Number(v));
      model.slips = (n === null || isNaN(n) || n <= 0) ? null : n;
      model.isSample = false;
      changed();
    });
    sampleBtn.addEventListener('click', function () {
      var g = model.guesses;
      model = emptyModel();
      Object.keys(SAMPLE_TALLY).forEach(function (k) { model[k] = SAMPLE_TALLY[k]; });
      model.isSample = true;
      model.guesses = g;
      changed();
      fill();
    });
    clearBtn.addEventListener('click', function () {
      var g = model.guesses;
      model = emptyModel();
      model.guesses = g;
      changed();
      fill();
    });

    function fill() {
      slipsIn.value = model.slips === null ? '' : model.slips;
      ANSWERS.forEach(function (a) { inputs[a.id].value = model[a.id] === null ? '' : model[a.id]; });
      verify();
    }
    function verify() {
      totalTd.textContent = tallyComplete() ? String(tallyTotal()) : '–';
      if (!tallyComplete() || !model.slips) {
        status.className = 'sv-verify sv-verify--none';
        status.textContent = 'Enter the number of slips, then the hands-up counts';
      } else if (tallyTotal() === model.slips) {
        status.className = 'sv-verify sv-verify--ok';
        status.textContent = '✓ Total ' + tallyTotal() + ' = ' + model.slips + ' slips' + (model.isSample ? ' (sample data)' : '');
      } else {
        status.className = 'sv-verify sv-verify--bad';
        status.textContent = '✗ Total ' + tallyTotal() + ' ≠ ' + model.slips + ' slips — recount';
      }
    }
    onChange(verify);
    fill();
  }


  /* ─────────────────────────────────────────────────────────────
     4. ROOFTOP CHART — class vs Australia
     Australia: "over a third of households" (Clean Energy Council,
     2025); "approximately one in three" (ABS). Drawn as 33%.
  ───────────────────────────────────────────────────────────── */

  function initRooftop(root) {
    var p = panel();
    root.appendChild(p);
    p.legend.innerHTML =
      '<span><i class="sv-swatch sv-swatch--better" aria-hidden="true"></i>Yes, solar on the roof</span>' +
      '<span><i class="sv-swatch sv-swatch--worse" aria-hidden="true"></i>No</span>' +
      '<span><i class="sv-swatch sv-swatch--same" aria-hidden="true"></i>Not sure / not known</span>' +
      '<span><i class="sv-swatch sv-swatch--private" aria-hidden="true"></i>Prefer not to say</span>';
    p.source.textContent = 'Australia: “over a third” of households have rooftop solar (Clean Energy Council, 2025); “approximately one in three” (ABS). Shown here as 33%.';

    function render() {
      p.holder.innerHTML = '';
      if (!tallyComplete() || tallyTotal() === 0) {
        p.headline.textContent = '';
        p.sub.textContent = '';
        p.holder.appendChild(htmlEl('p', { className: 'sv-empty' }, 'No class data yet. Enter the hands-up counts (or load the sample data) to draw this chart.'));
        return;
      }
      var n = tallyTotal();
      var pctYes = 100 * model.yes / n;
      p.headline.textContent = 'Solar on the roof: our class compared with Australia';
      p.sub.textContent = 'Percentage of survey slips (n = ' + n + (model.isSample ? ', sample data' : '') + ') and of Australian households.';
      var W = 720, labelW = 170, rowH = 44, gap = 22, top = 6, axisH = 30;
      var H = top + 2 * (rowH + gap) + axisH;
      var svg = svgEl('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img',
        'aria-label': 'Our class: ' + fmt(pctYes, 0) + '% of slips said yes. Australia: about 33% of households.' });
      var x = function (v) { return labelW + (v / 100) * (W - labelW - 20); };
      var grid = svgEl('g', { 'class': 'sv-grid' }), axis = svgEl('g', { 'class': 'sv-axis' });
      for (var v = 0; v <= 100; v += 20) {
        grid.appendChild(svgEl('line', { x1: x(v), x2: x(v), y1: top, y2: H - axisH + 4 }));
        axis.appendChild(svgEl('text', { x: x(v), y: H - 8, 'text-anchor': 'middle' }, v + '%'));
      }
      svg.appendChild(grid); svg.appendChild(axis);
      var rows = [
        { label: 'Our class (n = ' + n + ')', parts: ANSWERS.map(function (a) { return { id: a.id, label: a.label, v: 100 * (model[a.id] || 0) / n, count: model[a.id] || 0 }; }) },
        { label: 'Australian households', parts: [{ id: 'yes', label: 'Yes', v: 33, count: null }, { id: 'unsure', label: 'No / not known', v: 67, count: null }] }
      ];
      rows.forEach(function (r, i) {
        var y = top + i * (rowH + gap);
        svg.appendChild(svgEl('text', { 'class': 'sv-label sv-label--strong', x: 0, y: y + rowH / 2 + 4 }, r.label));
        var acc = 0;
        r.parts.forEach(function (part) {
          if (part.v <= 0) return;
          var x0 = x(acc), x1 = x(acc + part.v), w = Math.max(0, x1 - x0 - 2);
          var cls = i === 1 && part.id === 'unsure' ? 'sv-bar--other' : 'sv-bar--' + part.id;
          var rect = svgEl('rect', { 'class': cls, x: x0, y: y, width: w, height: rowH, rx: 3 });
          addTitle(rect, r.label + ' — ' + part.label + ': ' + fmt(part.v, 0) + '%' + (part.count !== null ? ' (' + part.count + ' slips)' : ''));
          svg.appendChild(rect);
          if (w >= 34) {
            svg.appendChild(svgEl('text', {
              'class': (part.id === 'yes' || part.id === 'no') ? 'sv-label--in' : 'sv-label--in-dark',
              x: x0 + w / 2, y: y + rowH / 2 + 4, 'text-anchor': 'middle', 'pointer-events': 'none'
            }, fmt(part.v, 0) + '%'));
          }
          acc += part.v;
        });
      });
      p.holder.appendChild(svg);
    }
    onChange(render);
    render();
  }


  /* ─────────────────────────────────────────────────────────────
     5. DOT PLOT — validation, outliers, truth line
     Attributes: data-key (model key), data-min, data-max, data-sample,
     data-title, data-unit, data-truth, data-truth-label, data-bin
  ───────────────────────────────────────────────────────────── */

  function parseValues(text, min, max) {
    var valid = [], invalid = [];
    text.split(/[,\s;]+/).forEach(function (tok) {
      var t = tok.trim();
      if (!t) return;
      var n = Number(t);
      if (!isFinite(n) || /^0x/i.test(t)) invalid.push({ token: t, reason: 'type check: not a number' });
      else if (n < min || n > max) invalid.push({ token: t, reason: 'range check: outside ' + min + '–' + max });
      else valid.push(n);
    });
    return { valid: valid, invalid: invalid };
  }
  function median(s) {
    var n = s.length;
    if (!n) return NaN;
    return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
  }
  function summarise(values) {
    var s = values.slice().sort(function (a, b) { return a - b; });
    var n = s.length;
    var q1 = median(s.slice(0, Math.floor(n / 2)));
    var q3 = median(s.slice(Math.ceil(n / 2)));
    var iqr = q3 - q1, lo = q1 - 1.5 * iqr, hi = q3 + 1.5 * iqr;
    var sum = function (a) { return a.reduce(function (p, c) { return p + c; }, 0); };
    var kept = s.filter(function (v) { return v >= lo && v <= hi; });
    return {
      n: n, sorted: s, med: median(s), q1: q1, q3: q3, lo: lo, hi: hi,
      outliers: s.filter(function (v) { return v < lo || v > hi; }),
      mean: n ? sum(s) / n : NaN,
      meanKept: kept.length ? sum(kept) / kept.length : NaN,
      min: s[0], max: s[n - 1]
    };
  }

  function initDotPlot(root) {
    var key = root.getAttribute('data-key') || 'values';
    var min = Number(root.getAttribute('data-min') || 0);
    var max = Number(root.getAttribute('data-max') || 100);
    var sample = root.getAttribute('data-sample') || '';
    var unit = root.getAttribute('data-unit') || '';
    var truth = root.hasAttribute('data-truth') ? Number(root.getAttribute('data-truth')) : null;
    var truthLabel = root.getAttribute('data-truth-label') || '';
    var bin = Number(root.getAttribute('data-bin') || 1);
    var dp = Number(root.getAttribute('data-dp') || 1);
    var title = root.getAttribute('data-title') || 'Values';

    var id = 'sv-dp-' + Math.random().toString(36).slice(2, 7);
    var label = htmlEl('label', { 'for': id }, root.getAttribute('data-label') || 'Values, separated by commas');
    label.style.fontWeight = '700';
    label.style.fontSize = 'var(--text-sm)';
    var ta = htmlEl('textarea', { className: 'sv-textarea', id: id, spellcheck: 'false' });
    var ctr = htmlEl('div', { className: 'sv-tally__controls' });
    ctr.style.marginTop = 'var(--space-3)';
    var plotBtn = htmlEl('button', { type: 'button', className: 'sv-btn sv-btn--primary' }, 'Validate and plot');
    var sampleBtn = htmlEl('button', { type: 'button', className: 'sv-btn' }, 'Load sample data');
    var clearBtn = htmlEl('button', { type: 'button', className: 'sv-btn' }, 'Clear');
    var truthBtn = truth !== null ? htmlEl('button', { type: 'button', className: 'sv-btn', 'aria-pressed': 'false' }, 'Show the answer') : null;
    ctr.appendChild(plotBtn); ctr.appendChild(sampleBtn); ctr.appendChild(clearBtn);
    if (truthBtn) ctr.appendChild(truthBtn);
    var invalidOut = htmlEl('p', { className: 'sv-invalid-list', 'aria-live': 'polite' });
    var stats = htmlEl('div', { className: 'sv-stats' });
    var p = panel();
    p.headline.textContent = title;
    p.sub.textContent = 'One dot per valid slip. Red dots are outliers by the 1.5 × IQR rule.';
    root.appendChild(label); root.appendChild(ta); root.appendChild(ctr);
    root.appendChild(invalidOut); root.appendChild(stats); root.appendChild(p);

    var showTruth = false;
    function stat(l, v) {
      var d = htmlEl('div', { className: 'sv-stat' });
      d.appendChild(htmlEl('span', { className: 'sv-stat__label' }, l));
      d.appendChild(htmlEl('span', { className: 'sv-stat__value' }, v));
      return d;
    }
    function run(save) {
      if (save) { model.guesses[key] = ta.value; changed(); }
      var parsed = parseValues(ta.value, min, max);
      invalidOut.textContent = parsed.invalid.length
        ? 'Rejected by validation: ' + parsed.invalid.map(function (x) { return '“' + x.token + '” — ' + x.reason; }).join(' · ')
        : '';
      stats.innerHTML = '';
      p.holder.innerHTML = '';
      if (!parsed.valid.length) {
        p.holder.appendChild(htmlEl('p', { className: 'sv-empty' }, 'No valid values yet. Type the values read from the slips, or load the sample data.'));
        return;
      }
      var s = summarise(parsed.valid);
      stats.appendChild(stat('Valid slips', s.n));
      stats.appendChild(stat('Rejected', parsed.invalid.length));
      stats.appendChild(stat('Median', fmt(s.med, dp)));
      stats.appendChild(stat('Mean', fmt(s.mean, dp)));
      stats.appendChild(stat('Outliers', s.outliers.length ? s.outliers.join(', ') : 'none'));

      var W = 720, H = 230, left = 24, right = 24, axisY = H - 40;
      var lo = Math.min(s.min, truth !== null && showTruth ? truth : s.min);
      var hi = Math.max(s.max, truth !== null && showTruth ? truth : s.max);
      var step = niceStep(Math.max(1, hi - lo), 8);
      var x0 = Math.floor(lo / step) * step, x1 = Math.ceil(hi / step) * step;
      if (x1 === x0) x1 = x0 + step;
      var x = function (v) { return left + ((v - x0) / (x1 - x0)) * (W - left - right); };
      var svg = svgEl('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img',
        'aria-label': title + '. ' + s.n + ' values, median ' + fmt(s.med, dp) + '. Outliers: ' + (s.outliers.length ? s.outliers.join(', ') : 'none') + '.' });
      var axis = svgEl('g', { 'class': 'sv-axis' });
      axis.appendChild(svgEl('line', { x1: left, x2: W - right, y1: axisY, y2: axisY }));
      for (var v = x0; v <= x1 + 1e-9; v += step) {
        axis.appendChild(svgEl('line', { x1: x(v), x2: x(v), y1: axisY, y2: axisY + 5 }));
        axis.appendChild(svgEl('text', { x: x(v), y: axisY + 20, 'text-anchor': 'middle' }, fmt(v, 2)));
      }
      axis.appendChild(svgEl('text', { x: W / 2, y: H - 2, 'text-anchor': 'middle' }, unit));
      svg.appendChild(axis);
      var stacks = {};
      var maxLevel = 0;
      s.sorted.forEach(function (val) {
        var k = String(Math.round(val / bin) * bin);
        stacks[k] = (stacks[k] || 0) + 1;
        var level = stacks[k] - 1;
        maxLevel = Math.max(maxLevel, level);
        var out = val < s.lo || val > s.hi;
        var c = svgEl('circle', { 'class': 'sv-dot' + (out ? ' sv-dot--flag' : ''), cx: x(Math.round(val / bin) * bin), cy: axisY - 10 - Math.min(level, 9) * 14, r: 6.2 });
        addTitle(c, val + ' ' + unit + (out ? ' — outlier' : ''));
        svg.appendChild(c);
      });
      s.outliers.forEach(function (val, i) {
        if (s.outliers.indexOf(val) !== i) return;
        var k = String(Math.round(val / bin) * bin);
        var yTop = axisY - 10 - Math.min(stacks[k] - 1, 9) * 14;
        svg.appendChild(svgEl('text', { 'class': 'sv-flag-label', x: x(Math.round(val / bin) * bin), y: yTop - 13, 'text-anchor': 'middle' }, 'Outlier: ' + val));
      });
      svg.appendChild(svgEl('line', { x1: x(s.med), x2: x(s.med), y1: 26, y2: axisY, style: 'stroke: var(--color-text-secondary); stroke-dasharray: 4 4;' }));
      svg.appendChild(svgEl('text', { 'class': 'sv-label sv-label--strong', x: x(s.med) + 6, y: 22 }, 'class median ' + fmt(s.med, dp)));
      if (truth !== null && showTruth) {
        svg.appendChild(svgEl('line', { 'class': 'sv-truth-line', x1: x(truth), x2: x(truth), y1: 38, y2: axisY }));
        var anchor = x(truth) > W * 0.6 ? 'end' : 'start';
        svg.appendChild(svgEl('text', { 'class': 'sv-truth-label', x: x(truth) + (anchor === 'end' ? -6 : 6), y: 50, 'text-anchor': anchor }, truthLabel));
      }
      p.holder.appendChild(svg);
    }
    plotBtn.addEventListener('click', function () { run(true); });
    sampleBtn.addEventListener('click', function () { ta.value = sample; run(true); });
    clearBtn.addEventListener('click', function () { ta.value = ''; run(true); });
    if (truthBtn) truthBtn.addEventListener('click', function () {
      showTruth = !showTruth;
      truthBtn.setAttribute('aria-pressed', String(showTruth));
      truthBtn.textContent = showTruth ? 'Hide the answer' : 'Show the answer';
      run(false);
    });
    ta.value = model.guesses[key] || '';
    run(false);
  }


  /* ─────────────────────────────────────────────────────────────
     6. WORLD GROWTH — linear, log, yearly additions
  ───────────────────────────────────────────────────────────── */

  function additions(series) {
    var out = [];
    for (var i = 1; i < series.length; i++) out.push([series[i][0], series[i][1] - series[i - 1][1]]);
    return out;
  }

  function drawWorldLinear(svg, x0) {
    lineChart(svg, {
      series: [{ data: WORLD, endLabel: fmtGW(valueAt(WORLD, 2025)) + ' GW' }],
      x0: x0 || 2000, x1: 2025, yMax: 2500, step: 500, yLabel: 'Gigawatts (GW)',
      markers: [{ y: 1000, label: '1 terawatt = 1,000 GW' }, { y: 2000, label: '2 terawatts' }]
    });
  }
  function drawWorldLog(svg, hideTicks) {
    lineChart(svg, {
      series: [{ data: WORLD, endLabel: fmtGW(valueAt(WORLD, 2025)) + ' GW' }],
      x0: 2000, x1: 2025, log: true, logMin: 0.1, yMax: 10000, hideTicks: hideTicks,
      yLabel: hideTicks ? '' : 'GW (log scale: each line ×10)'
    });
  }
  function drawWorldAdditions(svg) {
    var add = additions(WORLD).filter(function (p) { return p[0] >= 2010; });
    barChart(svg, add.map(function (p) {
      return { label: String(p[0]).slice(2) === '10' || p[0] % 5 === 0 || p[0] === 2025 ? String(p[0]) : '', value: Math.round(p[1]), text: p[0] >= 2021 ? Math.round(p[1]) : '', tip: p[0] + ': ' + Math.round(p[1]) + ' GW added' };
    }), { base: 0, max: 600, step: 100, everyLabel: true, barMax: 26 });
  }

  function initGrowth(root) {
    var views = {
      linear: { button: 'Total (normal scale)', headline: 'World solar capacity, 2000–2025', sub: 'Total solar panels installed and working, gigawatts.', draw: function (s) { drawWorldLinear(s); } },
      log:    { button: 'Total (log scale)', headline: 'The same data on a log scale', sub: 'Each gridline is 10 times the one below it. A straight line means a steady growth rate; flattening means the growth rate is slowing.', draw: function (s) { drawWorldLog(s, false); } },
      annual: { button: 'Added each year', headline: 'New solar capacity added each year', sub: 'Gigawatts added in each year (this year’s total minus last year’s).', draw: drawWorldAdditions }
    };
    var current = 'linear';
    var labels = {}; Object.keys(views).forEach(function (k) { labels[k] = views[k].button; });
    var p = panel();
    p.source.textContent = SOURCE;
    root.appendChild(switcher(labels, current, function (id) { current = id; render(); }, 'Choose a view of the world solar data'));
    root.appendChild(p);
    function render() {
      var v = views[current];
      p.headline.textContent = v.headline;
      p.sub.textContent = v.sub;
      p.holder.innerHTML = '';
      var s = svgEl('svg', { viewBox: '0 0 720 320', role: 'img', 'aria-label': v.headline + '. ' + v.sub });
      p.holder.appendChild(s);
      v.draw(s);
    }
    render();
  }


  /* ─────────────────────────────────────────────────────────────
     7. EVALUATE — one fair view, three misleading views
  ───────────────────────────────────────────────────────────── */

  function initEvaluate(root) {
    var v24 = valueAt(WORLD, 2024), v25 = valueAt(WORLD, 2025);
    var base = 1800;
    var views = {
      fair: {
        button: 'A. Line, full range',
        headline: 'World solar capacity has more than tripled since 2020',
        sub: 'Cumulative solar PV capacity, gigawatts, 2000–2025.',
        source: SOURCE,
        draw: function (s) { drawWorldLinear(s); },
        problem: 'Fair. The axis starts at zero, the whole period is shown, units and source are given, and the headline is supported (711 GW in 2020 to 2,378 GW in 2025 is about 3.3 times).'
      },
      cherry: {
        button: 'B. Solar going nowhere',
        headline: 'Solar power is going nowhere',
        sub: 'World solar capacity, gigawatts.',
        source: '',
        draw: function (s) {
          lineChart(s, { series: [{ data: WORLD, endLabel: '' }], x0: 2000, x1: 2008, yMax: 16, step: 2, yLabel: 'GW' });
        },
        problem: 'Cherry-picked. Only 2000–2008 is shown, before the boom. The years that would contradict the headline are left out, and there is no source.'
      },
      log: {
        button: 'C. Growth is slowing',
        headline: 'Solar growth is slowing down',
        sub: 'World solar capacity.',
        source: '',
        draw: function (s) { drawWorldLog(s, true); },
        problem: 'An unlabelled log scale. Each gridline is 10 times the last, but nothing says so. The flattening line shows the growth rate falling from about 77% a year (2010) to about 27% (2025). Yet 2025 added more than ever before (511 GW). The headline is half true and the chart hides the other half.'
      },
      truncated: {
        button: 'D. Solar explodes',
        headline: 'Solar EXPLODES in 2025!',
        sub: 'World solar capacity, gigawatts.',
        source: SOURCE,
        draw: function (s) {
          barChart(s, [
            { label: '2024', value: Math.round(v24), cls: 'sv-bar--better', tip: '2024: ' + Math.round(v24) + ' GW' },
            { label: '2025', value: Math.round(v25), cls: 'sv-bar--better', tip: '2025: ' + Math.round(v25) + ' GW' }
          ], { base: base, max: 2400, step: 100 });
        },
        problem: 'Truncated axis. The bars start at ' + base.toLocaleString('en-AU') + ' GW, so the 2025 bar is drawn ' +
          fmt((v25 - base) / (v24 - base), 1) + ' times taller than 2024. The real increase is ' + fmt(v25 / v24, 2) + ' times (about 27%).'
      }
    };
    var current = 'fair', revealed = false;
    var labels = {}; Object.keys(views).forEach(function (k) { labels[k] = views[k].button; });
    var p = panel();
    root.appendChild(switcher(labels, current, function (id) { current = id; revealed = false; render(); }, 'Choose a chart'));
    root.appendChild(p);
    var revealBtn = htmlEl('button', { type: 'button', className: 'sv-btn sv-btn--primary', 'aria-expanded': 'false' }, 'Reveal: what’s wrong with it?');
    var revealBox = htmlEl('div', { className: 'sv-reveal', 'aria-live': 'polite' });
    revealBox.hidden = true;
    revealBtn.addEventListener('click', function () { revealed = !revealed; render(); });
    root.appendChild(revealBtn);
    root.appendChild(revealBox);
    function render() {
      var v = views[current];
      p.headline.textContent = v.headline;
      p.sub.textContent = v.sub;
      p.source.textContent = v.source;
      p.holder.innerHTML = '';
      var s = svgEl('svg', { viewBox: '0 0 720 320', role: 'img', 'aria-label': v.headline + '. ' + v.sub });
      p.holder.appendChild(s);
      v.draw(s);
      revealBtn.setAttribute('aria-expanded', String(revealed));
      revealBtn.textContent = revealed ? 'Hide the answer' : 'Reveal: what’s wrong with it?';
      revealBox.hidden = !revealed;
      revealBox.textContent = revealed ? v.problem : '';
    }
    render();
  }


  /* ─────────────────────────────────────────────────────────────
     8. PREDICTION EXPLORER — straight line vs constant % growth
  ───────────────────────────────────────────────────────────── */

  function initPredict(root) {
    var datasets = { world: { label: 'World', data: WORLD, unit: 'GW' }, aus: { label: 'Australia', data: AUSTRALIA, unit: 'GW' } };
    var ds = root.getAttribute('data-start') || 'world';
    var method = 'line';
    var BASE0 = 2020, BASE1 = 2025, TARGET = 2030;

    var row1 = switcher({ world: 'World', aus: 'Australia' }, ds, function (id) { ds = id; growth = defaultGrowth(); slider.value = Math.round(growth * 100); render(); }, 'Choose a dataset');
    var row2 = switcher({ line: 'Straight line (same amount each year)', growth: 'Constant % growth (same rate each year)' }, method, function (id) { method = id; render(); }, 'Choose a prediction method');
    var sliderWrap = htmlEl('div', { className: 'sv-slider' });
    var sid = 'sv-g-' + Math.random().toString(36).slice(2, 7);
    sliderWrap.appendChild(htmlEl('label', { 'for': sid }, 'Growth rate per year:'));
    var slider = htmlEl('input', { type: 'range', id: sid, min: '0', max: '60', step: '1' });
    var sliderOut = htmlEl('span', { 'aria-live': 'polite' });
    var resetBtn = htmlEl('button', { type: 'button', className: 'sv-btn' }, 'Use 2020–2025 average');
    sliderWrap.appendChild(slider); sliderWrap.appendChild(sliderOut); sliderWrap.appendChild(resetBtn);
    var result = htmlEl('p');
    result.style.margin = 'var(--space-3) 0';
    var p = panel();
    p.source.textContent = SOURCE + ' Predictions are calculated on this page.';
    p.legend.innerHTML =
      '<span><i class="sv-swatch sv-swatch--line" style="background: var(--sv-better)" aria-hidden="true"></i>Actual</span>' +
      '<span><i class="sv-swatch sv-swatch--line sv-swatch--alt" aria-hidden="true"></i>Prediction</span>';
    root.appendChild(row1); root.appendChild(row2); root.appendChild(sliderWrap); root.appendChild(result); root.appendChild(p);

    function series() { return datasets[ds].data; }
    function defaultGrowth() {
      var d = series();
      return Math.pow(valueAt(d, BASE1) / valueAt(d, BASE0), 1 / (BASE1 - BASE0)) - 1;
    }
    var growth = defaultGrowth();
    slider.value = Math.round(growth * 100);
    slider.addEventListener('input', function () { growth = Number(slider.value) / 100; render(); });
    resetBtn.addEventListener('click', function () { growth = defaultGrowth(); slider.value = Math.round(growth * 100); render(); });

    function predict() {
      var d = series();
      var last = valueAt(d, BASE1);
      var perYear = (last - valueAt(d, BASE0)) / (BASE1 - BASE0);
      var out = [[BASE1, last]];
      for (var yr = BASE1 + 1; yr <= TARGET; yr++) {
        var prev = out[out.length - 1][1];
        out.push([yr, method === 'line' ? prev + perYear : prev * (1 + growth)]);
      }
      return { pts: out, perYear: perYear };
    }
    function render() {
      var d = series();
      var pr = predict();
      var final = pr.pts[pr.pts.length - 1][1];
      sliderWrap.style.display = method === 'growth' ? 'flex' : 'none';
      sliderOut.textContent = slider.value + '%';
      result.innerHTML = '';
      result.appendChild(document.createTextNode(datasets[ds].label + ', predicted for ' + TARGET + ': '));
      result.appendChild(htmlEl('span', { className: 'sv-result' }, fmtGW(final) + ' GW'));
      result.appendChild(document.createTextNode(method === 'line'
        ? '  (adds the 2020–2025 average of ' + fmtGW(pr.perYear) + ' GW every year)'
        : '  (grows by ' + slider.value + '% every year)'));
      p.headline.textContent = datasets[ds].label + ': actual solar capacity and a prediction to ' + TARGET;
      p.sub.textContent = method === 'line' ? 'Method: straight line. Each year adds the same amount.' : 'Method: constant percentage growth. Each year multiplies by the same rate.';
      p.holder.innerHTML = '';
      var s = svgEl('svg', { viewBox: '0 0 720 320', role: 'img', 'aria-label': p.headline.textContent + '. Predicted ' + fmtGW(final) + ' GW.' });
      p.holder.appendChild(s);
      var maxV = Math.max(final, valueAt(d, BASE1)) * 1.08;
      lineChart(s, {
        series: [
          { data: d.filter(function (q) { return q[0] >= 2010; }) },
          { data: pr.pts, cls: 'sv-line--alt', dotCls: 'sv-dot sv-dot--alt', label: 'prediction', endLabel: fmtGW(final) + ' GW' }
        ],
        x0: 2010, x1: TARGET, yMax: maxV, yLabel: 'Gigawatts (GW)'
      });
    }
    render();
  }


  /* ─────────────────────────────────────────────────────────────
     9. GROWTH TABLE — conditional formatting + decision formula demo
  ───────────────────────────────────────────────────────────── */

  function initGrowthTable(root) {
    var ctr = htmlEl('div', { className: 'sv-slider' });
    var id = 'sv-th-' + Math.random().toString(36).slice(2, 7);
    ctr.appendChild(htmlEl('label', { 'for': id }, 'Highlight growth above:'));
    var th = htmlEl('input', { className: 'sv-input', id: id, type: 'number', min: '0', max: '400', step: '5', value: '50' });
    ctr.appendChild(th);
    ctr.appendChild(document.createTextNode('%'));
    var count = htmlEl('span', { className: 'sv-verify sv-verify--none', 'aria-live': 'polite' });
    ctr.appendChild(count);
    root.appendChild(ctr);
    var wrap = htmlEl('div', { className: 'sv-growth-wrap' });
    wrap.style.marginTop = 'var(--space-3)';
    root.appendChild(wrap);

    function render() {
      var limit = Number(th.value) / 100;
      var rows = '';
      var booms = 0;
      for (var i = 0; i < AUSTRALIA.length; i++) {
        var yr = AUSTRALIA[i][0], v = AUSTRALIA[i][1];
        var inc = i ? v - AUSTRALIA[i - 1][1] : null;
        var g = i ? inc / AUSTRALIA[i - 1][1] : null;
        var boom = g !== null && g > limit;
        if (boom) booms++;
        rows += '<tr><td>' + yr + '</td><td>' + fmt(v, 3) + '</td><td>' + (inc === null ? '' : fmt(inc, 3)) + '</td>' +
          '<td' + (boom ? ' class="is-boom"' : '') + '>' + (g === null ? '' : fmt(g * 100, 1) + '%') + '</td>' +
          '<td' + (boom ? ' class="is-boom"' : '') + '>' + (boom ? 'Boom year' : '') + '</td></tr>';
      }
      wrap.innerHTML =
        '<table class="spec-table sv-growth-table"><thead><tr>' +
        '<th>A · Year</th><th>B · GW</th><th>C · Increase<br><code>=B3-B2</code></th>' +
        '<th>D · Growth<br><code>=(B3-B2)/B2</code></th><th>E · Decision<br><code>=IF(D3&gt;' + th.value + '%,"Boom year","")</code></th>' +
        '</tr></thead><tbody>' + rows + '</tbody></table>';
      count.className = 'sv-verify ' + (booms ? 'sv-verify--bad' : 'sv-verify--ok');
      count.textContent = booms + ' year' + (booms === 1 ? '' : 's') + ' highlighted';
    }
    th.addEventListener('input', render);
    render();
  }


  /* ─────────────────────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────────────────────── */

  function init() {
    initPresent();
    document.querySelectorAll('[data-sv-tally]').forEach(initTally);
    document.querySelectorAll('[data-sv-rooftop]').forEach(initRooftop);
    document.querySelectorAll('[data-sv-dotplot]').forEach(initDotPlot);
    document.querySelectorAll('[data-sv-growth]').forEach(initGrowth);
    document.querySelectorAll('[data-sv-evaluate]').forEach(initEvaluate);
    document.querySelectorAll('[data-sv-predict]').forEach(initPredict);
    document.querySelectorAll('[data-sv-growth-table]').forEach(initGrowthTable);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  // Exposed for testing only
  window.SolarLesson = { WORLD: WORLD, AUSTRALIA: AUSTRALIA, summarise: summarise, parseValues: parseValues };
}());
