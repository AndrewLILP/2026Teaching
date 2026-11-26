/**
 * reef.js
 * Computing Technology 7–10 | "Is the reef recovering?" demo lessons (3)
 * EIS: Analysing data · Stage 5
 *
 * Page-level script for this folder only. Load AFTER ct-core.js,
 * ct-interactive.js and ct-progress.js. Lesson 3 also loads
 * vendor/sql-asm.js (sql.js 1.10.3, MIT, offline asm.js build) and reef-db.js.
 * No CDN: everything is local so it works from file://.
 *
 * Responsibilities:
 *   1. Present mode — click through [data-slide] blocks like a slide deck
 *   2. Class survey model — saved to localStorage (shared across lessons)
 *   3. Generic tally        [data-rf-tally]     with total verification
 *   4. Generic bar chart    [data-rf-bars]
 *   5. Dot plot             [data-rf-dotplot]   validation, outliers, truth line
 *   6. Coral cover chart    [data-rf-coral]     three regions, long-term averages
 *   7. Evaluate             [data-rf-evaluate]  fair view + three misleading views
 *   8. Runoff explorer      [data-rf-runoff]    site × measure, trend line
 *   9. SQL runner           [data-rf-sql]       shared in-browser SQLite database
 *
 * CORAL: hard coral cover (%) as reported in each year's AIMS Long-Term
 * Monitoring Program annual summary (manta tow surveys). AIMS re-estimates
 * past years in later reports, so later reports can show slightly different
 * values for the same year. null = no figure published for that year.
 *   2017 Northern 11 (2019 report) · Southern 33 (2018 report)
 *   2018 Central 14, Southern 25 · 2019 N 14, C 12, S 24 (2019 report)
 *   2020 C 14, S 24 (2020 report; Northern reported "stable", no figure)
 *   2021 N 27, C 26, S 39 · 2022 N 36, C 33, S 34
 *   2023 N 35.8, C 30.7, S 34.0 (previous-year values in the 2024 report)
 *   2024 N 39.5, C 34.0, S 39.1 · 2025 N 30.0, C 28.6, S 26.9
 *   2026 N 35.1, C 31.6, S 26.4; long-term averages N 27.0, C 20.0, S 29.3
 *
 * RUNOFF: site names, rivers, land use and trend rates are REAL
 * (James et al. 2026, Journal of Environmental Management). The yearly
 * concentrations are SIMULATED for teaching (see data/reef-runoff.xlsx Notes).
 */

(function () {
  'use strict';

  var SVGNS = 'http://www.w3.org/2000/svg';

  var CORAL = {
    years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026],
    n: [11, null, 14, null, 27, 36, 35.8, 39.5, 30.0, 35.1],
    c: [null, 14, 12, 14, 26, 33, 30.7, 34.0, 28.6, 31.6],
    s: [33, 25, 24, 24, 39, 34, 34.0, 39.1, 26.9, 26.4],
    avg: { n: 27.0, c: 20.0, s: 29.3 }
  };
  var CORAL_SOURCE = 'Source: Australian Institute of Marine Science (AIMS), Long-Term Monitoring Program annual summary reports 2018–2026 (manta tow surveys). Values as reported each year.';

  var RUNOFF = {"sites": [{"id": "NJ-GOO", "name": "North Johnstone River at Goondi", "river": "North Johnstone", "land": "Rainforest and grazing, some sugarcane and bananas", "dinTrend": -0.61, "ssTrend": -1.6}, {"id": "SJ-UCM", "name": "South Johnstone River at Upstream Central Mill", "river": "South Johnstone", "land": "Rainforest, sugarcane and bananas", "dinTrend": -1.3, "ssTrend": -0.0}, {"id": "TUL-GOR", "name": "Tully River at Tully Gorge National Park", "river": "Tully", "land": "Rainforest (about 90% forest)", "dinTrend": -1.0, "ssTrend": -6.3}, {"id": "TUL-EUR", "name": "Tully River at Euramo", "river": "Tully", "land": "Sugarcane and bananas, mostly forested basin", "dinTrend": -0.43, "ssTrend": 0.71}, {"id": "HER-JRB", "name": "Herbert River at John Row Bridge", "river": "Herbert", "land": "Mixed: rainforest, grazing, historical mining, sugarcane", "dinTrend": -1.2, "ssTrend": -2.9}, {"id": "BAR-NTH", "name": "Barratta Creek at Northcote", "river": "Barratta", "land": "Grazing (about 76%) with irrigated sugarcane (about 19%)", "dinTrend": 4.7, "ssTrend": -1.4}, {"id": "BUR-INK", "name": "Burdekin River at Inkerman Bridge", "river": "Burdekin", "land": "Grazing dominant; sugarcane and horticulture on the floodplain", "dinTrend": -2.7, "ssTrend": -4.5}, {"id": "PIO-DUM", "name": "Pioneer River at Dumbleton", "river": "Pioneer", "land": "Mixed: grazing and forest upstream, sugarcane downstream", "dinTrend": -3.0, "ssTrend": -5.9}, {"id": "FIT-FRW", "name": "Fitzroy River at Fitzroy River Water", "river": "Fitzroy", "land": "Grazing dominant, with cropping and upstream coal mining", "dinTrend": -0.0, "ssTrend": -1.3}], "annual": {"BAR-NTH": [[1989, 0.061, 284.4], [1990, 0.075, 270.1], [1991, 0.083, 244.2], [1992, 0.071, 313.3], [1993, 0.081, 216.3], [1994, 0.084, 276.9], [1995, 0.088, 246.0], [1996, 0.104, 244.1], [1997, 0.091, 340.6], [1998, 0.118, 338.0], [1999, 0.1, 254.4], [2000, 0.097, 289.7], [2001, 0.108, 153.0], [2002, 0.134, 209.3], [2003, 0.148, 236.5], [2004, 0.143, 209.6], [2005, 0.152, 282.5], [2006, 0.164, 246.9], [2007, 0.154, 223.3], [2008, 0.18, 244.8], [2009, 0.138, 178.0], [2010, 0.127, 208.7], [2011, 0.225, 208.6], [2012, 0.184, 155.5], [2013, 0.178, 166.3], [2014, 0.277, 221.1], [2015, 0.312, 154.6], [2016, 0.209, 228.0], [2017, 0.262, 172.8], [2018, 0.244, 197.7], [2019, 0.259, 146.7], [2020, 0.28, 220.8], [2021, 0.246, 215.5], [2022, 0.355, 201.1], [2023, 0.291, 124.3], [2024, 0.325, 184.0]], "BUR-INK": [[1988, 0.096, null], [1989, 0.104, null], [1990, 0.118, null], [1991, 0.109, null], [1992, 0.102, null], [1993, 0.114, null], [1994, 0.113, null], [1995, 0.108, null], [1996, 0.091, 527.0], [1997, 0.073, 559.7], [1998, 0.081, 452.6], [1999, 0.076, 515.2], [2000, 0.089, 459.8], [2001, 0.073, 526.1], [2002, 0.088, 388.3], [2003, 0.075, 351.7], [2004, 0.085, 495.4], [2005, 0.073, 480.5], [2006, 0.073, 473.0], [2007, 0.07, 308.7], [2008, 0.061, 306.0], [2009, 0.053, 339.3], [2010, 0.053, 324.3], [2011, 0.069, 363.5], [2012, 0.08, 355.5], [2013, 0.076, 319.4], [2014, 0.051, 307.3], [2015, 0.054, 191.7], [2016, 0.056, 203.0], [2017, 0.06, 248.7], [2018, 0.047, 214.9], [2019, 0.048, 225.1], [2020, 0.049, 183.1], [2021, 0.051, 247.3], [2022, 0.042, 181.8], [2023, 0.044, 222.9], [2024, 0.044, 182.3]], "FIT-FRW": [[1993, 0.082, 554.0], [1994, 0.099, 695.1], [1995, 0.105, 435.5], [1996, 0.124, 590.3], [1997, 0.088, 428.3], [1998, 0.097, 422.7], [1999, 0.145, 447.4], [2000, 0.1, 529.2], [2001, 0.091, 489.0], [2002, 0.105, 343.7], [2003, 0.093, 402.9], [2004, 0.105, 446.5], [2005, 0.12, 413.7], [2006, 0.095, 544.1], [2007, 0.085, 348.7], [2008, 0.108, 254.9], [2009, 0.118, 645.9], [2010, 0.101, 362.5], [2011, 0.089, 272.2], [2012, 0.087, 413.9], [2013, 0.092, 464.1], [2014, 0.096, 502.9], [2015, 0.097, 404.9], [2016, 0.097, 562.2], [2017, 0.149, 639.3], [2018, 0.091, 373.1], [2019, 0.091, 301.1], [2020, 0.099, 372.4], [2021, 0.108, 440.5], [2022, 0.109, 529.1], [2023, 0.111, 359.3], [2024, 0.108, 384.8]], "HER-JRB": [[1989, 0.138, null], [1990, 0.131, null], [1991, 0.159, 263.9], [1992, 0.131, 225.2], [1993, 0.118, 242.9], [1994, 0.13, 190.8], [1995, 0.133, 205.4], [1996, 0.098, 170.6], [1997, 0.137, 221.5], [1998, 0.113, 183.0], [1999, 0.164, 155.7], [2000, 0.098, 165.3], [2001, 0.116, 240.5], [2002, 0.122, 184.8], [2003, 0.104, 230.7], [2004, 0.083, 130.6], [2005, 0.166, 109.3], [2006, 0.138, 179.5], [2007, 0.102, 158.3], [2008, 0.106, 116.6], [2009, 0.087, 161.0], [2010, 0.113, 138.1], [2011, 0.105, 85.9], [2012, 0.111, 153.0], [2013, 0.098, 130.6], [2014, 0.103, 102.7], [2015, 0.1, 100.1], [2016, 0.086, 86.5], [2017, 0.097, 75.2], [2018, 0.088, 123.7], [2019, 0.075, 96.5], [2020, 0.087, 129.4], [2021, 0.11, 122.9], [2022, 0.083, 90.8], [2023, 0.102, 112.7], [2024, 0.098, 75.9]], "NJ-GOO": [[1989, 0.336, null], [1990, 0.328, 57.7], [1991, 0.347, 75.3], [1992, 0.357, 53.1], [1993, 0.376, 59.9], [1994, 0.293, 57.0], [1995, 0.353, 109.7], [1996, 0.231, 69.8], [1997, 0.38, 70.8], [1998, 0.4, 77.1], [1999, 0.421, 55.9], [2000, 0.308, 61.5], [2001, 0.274, 38.0], [2002, 0.323, 64.5], [2003, 0.338, 45.2], [2004, 0.463, 63.8], [2005, 0.322, 59.0], [2006, 0.347, 43.2], [2007, 0.301, 39.9], [2008, 0.302, 48.8], [2009, 0.273, 57.9], [2010, 0.313, 32.4], [2011, 0.33, 55.4], [2012, 0.274, 35.6], [2013, 0.23, 38.4], [2014, 0.258, 50.5], [2015, 0.278, 40.6], [2016, 0.269, 51.5], [2017, 0.257, 36.0], [2018, 0.252, 39.1], [2019, 0.241, 49.0], [2020, 0.27, 67.3], [2021, 0.229, 31.2], [2022, 0.259, 37.6], [2023, 0.316, 34.2], [2024, 0.2, 48.5]], "PIO-DUM": [[2006, 0.368, 124.8], [2007, 0.366, 276.8], [2008, 0.397, 191.8], [2009, 0.249, 244.9], [2010, 0.332, 153.4], [2011, 0.269, 126.4], [2012, 0.249, 159.7], [2013, 0.32, 136.6], [2014, 0.298, 88.5], [2015, 0.262, 92.4], [2016, 0.234, 114.3], [2017, 0.287, 97.1], [2018, 0.263, 78.7], [2019, 0.228, 78.9], [2020, 0.205, 90.8], [2021, 0.163, 69.2], [2022, 0.223, 72.1], [2023, 0.195, 60.3], [2024, 0.206, 56.9]], "SJ-UCM": [[1987, 0.427, 53.3], [1988, 0.377, 45.2], [1989, 0.483, 47.0], [1990, 0.413, 89.0], [1991, 0.342, 37.9], [1992, 0.501, 45.1], [1993, 0.349, 50.3], [1994, 0.317, 63.5], [1995, 0.375, 75.1], [1996, 0.375, 50.5], [1997, 0.455, 55.6], [1998, 0.281, 57.4], [1999, 0.471, 63.8], [2000, 0.333, 91.3], [2001, 0.488, 72.2], [2002, 0.271, 55.3], [2003, 0.331, 60.3], [2004, 0.453, 64.3], [2005, 0.29, 105.5], [2006, 0.331, 63.7], [2007, 0.267, 51.4], [2008, 0.296, 65.7], [2009, 0.301, 93.5], [2010, 0.254, 51.4], [2011, 0.356, 81.9], [2012, 0.273, 71.8], [2013, 0.274, 58.5], [2014, 0.226, 51.2], [2015, 0.32, 54.9], [2016, 0.247, 68.1], [2017, 0.292, 54.5], [2018, 0.249, 53.8], [2019, 0.285, 42.7], [2020, 0.26, 68.9], [2021, 0.284, 68.3], [2022, 0.325, 80.7], [2023, 0.187, 57.5], [2024, 0.276, 53.1]], "TUL-EUR": [[1988, 0.206, null], [1989, 0.199, null], [1990, 0.205, null], [1991, 0.189, null], [1992, 0.192, null], [1993, 0.191, null], [1994, 0.235, null], [1995, 0.181, null], [1996, 0.179, 45.7], [1997, 0.189, 45.2], [1998, 0.211, 48.7], [1999, 0.18, 33.6], [2000, 0.212, 35.2], [2001, 0.213, 56.9], [2002, 0.188, 62.4], [2003, 0.221, 50.9], [2004, 0.182, 36.9], [2005, 0.217, 30.8], [2006, 0.183, 45.6], [2007, 0.202, 39.4], [2008, 0.234, 45.0], [2009, 0.214, 35.1], [2010, 0.225, 38.3], [2011, 0.15, 43.3], [2012, 0.191, 66.9], [2013, 0.183, 38.2], [2014, 0.196, 26.2], [2015, 0.16, 62.6], [2016, 0.211, 48.0], [2017, 0.204, 40.4], [2018, 0.176, 53.8], [2019, 0.175, 46.0], [2020, 0.183, 41.3], [2021, 0.212, 39.8], [2022, 0.232, 41.6], [2023, 0.172, 58.1], [2024, 0.167, 50.4]], "TUL-GOR": [[1988, 0.056, null], [1989, 0.056, null], [1990, 0.044, null], [1991, 0.045, 14.0], [1992, 0.037, 13.9], [1993, 0.059, 17.2], [1994, 0.05, 15.9], [1995, 0.047, 17.6], [1996, 0.066, 11.7], [1997, 0.078, 23.5], [1998, 0.045, 9.6], [1999, 0.055, 16.3], [2000, 0.054, 11.8], [2001, 0.043, 7.2], [2002, 0.039, 8.8], [2003, 0.061, 10.8], [2004, 0.044, 8.6], [2005, 0.04, 6.2], [2006, 0.06, 7.1], [2007, 0.048, 7.2], [2008, 0.048, 5.1], [2009, 0.071, 8.4], [2010, 0.046, 11.2], [2011, 0.045, 7.3], [2012, 0.044, 6.2], [2013, 0.052, 5.4], [2014, 0.043, 5.2], [2015, 0.046, 7.2], [2016, 0.045, 3.1], [2017, 0.046, 3.6], [2018, 0.043, 3.1], [2019, 0.043, 2.6], [2020, 0.05, 2.3], [2021, 0.041, 3.7], [2022, 0.04, 2.9], [2023, 0.038, 2.0]]}};

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
  function fmtV(n) { return fmt(n, n >= 100 ? 0 : (n >= 1 ? 1 : 3)) + (UNIT ? (UNIT.charAt(0) === '%' ? '' : ' ') + UNIT : ''); }
  var UNIT = '';
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
    var wrap = htmlEl('div', { className: 'rf-views', role: 'group', 'aria-label': aria || 'Choose a view' });
    Object.keys(labels).forEach(function (id) {
      var b = htmlEl('button', { type: 'button', className: 'rf-btn', 'aria-pressed': String(id === current), 'data-view': id }, labels[id]);
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
    var p = htmlEl('div', { className: 'rf-chart' });
    p.headline = htmlEl('p', { className: 'rf-chart__headline' });
    p.sub = htmlEl('p', { className: 'rf-chart__sub' });
    p.holder = htmlEl('div');
    p.legend = htmlEl('div', { className: 'rf-chart__legend' });
    p.source = htmlEl('p', { className: 'rf-chart__source' });
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
    var grid = svgEl('g', { 'class': 'rf-grid' });
    var axis = svgEl('g', { 'class': 'rf-axis' });
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
      svg.appendChild(svgEl('line', { 'class': m.cls || 'rf-ref', x1: left, x2: W - right, y1: y(m.y), y2: y(m.y) }));
      if (m.label) svg.appendChild(svgEl('text', { 'class': 'rf-label', x: W - right - 4, y: y(m.y) - 6, 'text-anchor': 'end' }, m.label));
    });
    opts.series.forEach(function (s) {
      var pts = s.data.filter(function (p) { return p[0] >= x0 && p[0] <= x1 && p[1] !== null; });
      var seg = [], segs = [];
      s.data.filter(function (p) { return p[0] >= x0 && p[0] <= x1; }).forEach(function (p) {
        if (p[1] === null) { if (seg.length) segs.push(seg); seg = []; } else seg.push(p);
      });
      if (seg.length) segs.push(seg);
      segs.forEach(function (sg) {
        svg.appendChild(svgEl('polyline', { 'class': s.cls || 'rf-line', points: sg.map(function (p) { return x(p[0]) + ',' + y(p[1]); }).join(' ') }));
      });
      if (s.dots !== false) {
        pts.forEach(function (p) {
          var c = svgEl('circle', { 'class': s.dotCls || 'rf-dot', cx: x(p[0]), cy: y(p[1]), r: pts.length > 14 ? 4.5 : 6 });
          addTitle(c, p[0] + ': ' + fmtV(p[1]) + (s.label ? ' (' + s.label + ')' : ''));
          svg.appendChild(c);
        });
      }
      if (s.endLabel && pts.length) {
        var last = pts[pts.length - 1];
        svg.appendChild(svgEl('text', { 'class': 'rf-label rf-label--strong', x: x(last[0]) - 6, y: y(last[1]) - 10, 'text-anchor': 'end' }, s.endLabel));
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
    var grid = svgEl('g', { 'class': 'rf-grid' });
    var axis = svgEl('g', { 'class': 'rf-axis' });
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
      var rect = svgEl('rect', { 'class': it.cls || 'rf-bar--better', x: cx - bw / 2, y: yTop, width: bw, height: Math.max(0, y(base) - yTop), rx: 2 });
      addTitle(rect, it.tip || (it.label + ': ' + it.value));
      svg.appendChild(rect);
      if (opts.valueLabels !== false) svg.appendChild(svgEl('text', { 'class': 'rf-label rf-label--strong', x: cx, y: yTop - 6, 'text-anchor': 'middle' }, it.text || it.value));
      if (opts.everyLabel || items.length <= 12 || i % 5 === 0 || i === items.length - 1) {
        svg.appendChild(svgEl('text', { 'class': 'rf-label', x: cx, y: H - bottom + 18, 'text-anchor': 'middle' }, it.label));
      }
    });
  }


  /* ─────────────────────────────────────────────────────────────
     1. PRESENT MODE
  ───────────────────────────────────────────────────────────── */

  function initPresent() {
    var btn = document.querySelector('.rf-present-btn');
    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-slide]'));
    if (!btn || !slides.length) return;

    var bar = htmlEl('div', { className: 'rf-present-bar', role: 'toolbar', 'aria-label': 'Slide controls' });
    bar.innerHTML =
      '<button type="button" data-act="prev" aria-label="Previous slide">&larr;</button>' +
      '<span class="rf-present-bar__count" aria-live="polite"></span>' +
      '<span class="rf-present-bar__title"></span>' +
      '<button type="button" data-act="next" aria-label="Next slide">&rarr;</button>' +
      '<button type="button" data-act="full" aria-label="Toggle full screen">Full screen</button>' +
      '<button type="button" data-act="exit">Exit</button>';
    document.body.appendChild(bar);
    var countEl = bar.querySelector('.rf-present-bar__count');
    var titleEl = bar.querySelector('.rf-present-bar__title');
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
      document.documentElement.classList.add('rf-presenting');
      document.body.classList.add('rf-presenting');
      show(start);
    }
    function exit() {
      on = false;
      document.documentElement.classList.remove('rf-presenting');
      document.body.classList.remove('rf-presenting');
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
     2. CLASS SURVEY MODEL (shared by every tally, bar chart and dot plot)
  ───────────────────────────────────────────────────────────── */

  var STORE_KEY = 'rf-reef-survey';
  var model = (function () {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (raw) { var m = JSON.parse(raw); if (m && m.tallies) { m.guesses = m.guesses || {}; return m; } }
    } catch (e) { /* storage unavailable */ }
    return { tallies: {}, guesses: {} };
  }());
  var listeners = [];
  function onChange(fn) { listeners.push(fn); }
  function changed() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(model)); } catch (e) {}
    listeners.forEach(function (fn) { fn(); });
  }
  function tallyFor(key, n) {
    var t = model.tallies[key];
    if (!t || !t.counts || t.counts.length !== n) {
      t = { slips: null, counts: [], isSample: false };
      for (var i = 0; i < n; i++) t.counts.push(null);
      model.tallies[key] = t;
    }
    return t;
  }
  function tallyComplete(t) { return t.counts.every(function (c) { return c !== null && c !== undefined; }); }
  function tallySum(t) { return t.counts.reduce(function (s, c) { return s + (c || 0); }, 0); }


  /* ─────────────────────────────────────────────────────────────
     3. GENERIC TALLY  [data-rf-tally]
     data-key, data-options="A|B|C", data-question, data-sample="5,6,11,2",
     data-sample-slips="24"
  ───────────────────────────────────────────────────────────── */

  function initTally(root) {
    var key = root.getAttribute('data-key');
    var options = root.getAttribute('data-options').split('|');
    var sample = (root.getAttribute('data-sample') || '').split(',').map(Number);
    var sampleSlips = Number(root.getAttribute('data-sample-slips') || 24);
    var question = root.getAttribute('data-question') || 'Question';
    var t = tallyFor(key, options.length);

    var controls = htmlEl('div', { className: 'rf-tally__controls' });
    var id = 'rf-slips-' + key;
    controls.appendChild(htmlEl('label', { 'for': id }, 'Slips collected'));
    var slipsIn = htmlEl('input', { className: 'rf-input', id: id, type: 'number', min: '0', max: '60', inputmode: 'numeric' });
    controls.appendChild(slipsIn);
    var sampleBtn = htmlEl('button', { type: 'button', className: 'rf-btn' }, 'Load sample data (class of ' + sampleSlips + ')');
    var clearBtn = htmlEl('button', { type: 'button', className: 'rf-btn' }, 'Clear');
    var status = htmlEl('span', { className: 'rf-verify rf-verify--none', 'aria-live': 'polite' });
    controls.appendChild(sampleBtn); controls.appendChild(clearBtn); controls.appendChild(status);
    root.appendChild(controls);

    var table = htmlEl('table');
    var thead = htmlEl('thead'); var hr = htmlEl('tr');
    hr.appendChild(htmlEl('th', { scope: 'col' }, question));
    options.forEach(function (o) { hr.appendChild(htmlEl('th', { scope: 'col' }, o)); });
    hr.appendChild(htmlEl('th', { scope: 'col' }, 'Total'));
    thead.appendChild(hr); table.appendChild(thead);
    var tr = htmlEl('tr');
    tr.appendChild(htmlEl('td', { className: 'rf-tally__topic' }, 'Hands up'));
    var inputs = options.map(function (o, i) {
      var td = htmlEl('td');
      var inp = htmlEl('input', { className: 'rf-input', type: 'number', min: '0', max: '60', inputmode: 'numeric', 'aria-label': question + ': ' + o });
      inp.addEventListener('input', function () {
        var v = inp.value.trim();
        var n = v === '' ? null : Math.max(0, Math.floor(Number(v)));
        t.counts[i] = (n === null || isNaN(n)) ? null : n;
        t.isSample = false;
        changed();
      });
      td.appendChild(inp); tr.appendChild(td);
      return inp;
    });
    var totalTd = htmlEl('td', { className: 'rf-tally__topic' }, '–');
    tr.appendChild(totalTd);
    var tbody = htmlEl('tbody'); tbody.appendChild(tr); table.appendChild(tbody);
    var wrap = htmlEl('div', { className: 'spec-table-wrap' });
    wrap.style.margin = '0';
    wrap.appendChild(table);
    root.appendChild(wrap);

    slipsIn.addEventListener('input', function () {
      var v = slipsIn.value.trim();
      var n = v === '' ? null : Math.floor(Number(v));
      t.slips = (n === null || isNaN(n) || n <= 0) ? null : n;
      t.isSample = false;
      changed();
    });
    sampleBtn.addEventListener('click', function () {
      t.slips = sampleSlips;
      t.counts = sample.slice();
      t.isSample = true;
      changed(); fill();
    });
    clearBtn.addEventListener('click', function () {
      t.slips = null;
      t.counts = options.map(function () { return null; });
      t.isSample = false;
      changed(); fill();
    });
    function fill() {
      slipsIn.value = t.slips === null ? '' : t.slips;
      inputs.forEach(function (inp, i) { inp.value = t.counts[i] === null ? '' : t.counts[i]; });
      verify();
    }
    function verify() {
      totalTd.textContent = tallyComplete(t) ? String(tallySum(t)) : '–';
      if (!tallyComplete(t) || !t.slips) {
        status.className = 'rf-verify rf-verify--none';
        status.textContent = 'Enter the number of slips, then the hands-up counts';
      } else if (tallySum(t) === t.slips) {
        status.className = 'rf-verify rf-verify--ok';
        status.textContent = '✓ Total ' + tallySum(t) + ' = ' + t.slips + ' slips' + (t.isSample ? ' (sample data)' : '');
      } else {
        status.className = 'rf-verify rf-verify--bad';
        status.textContent = '✗ Total ' + tallySum(t) + ' ≠ ' + t.slips + ' slips — recount';
      }
    }
    onChange(verify);
    fill();
  }


  /* ─────────────────────────────────────────────────────────────
     4. GENERIC BAR CHART  [data-rf-bars]  data-key, data-options, data-title,
     data-highlight (index of the answer the data supports, optional)
  ───────────────────────────────────────────────────────────── */

  function initBars(root) {
    var key = root.getAttribute('data-key');
    var options = root.getAttribute('data-options').split('|');
    var title = root.getAttribute('data-title') || '';
    var t = tallyFor(key, options.length);
    var p = panel();
    p.source.textContent = root.getAttribute('data-note') || '';
    root.appendChild(p);
    function render() {
      p.holder.innerHTML = '';
      if (!tallyComplete(t) || tallySum(t) === 0) {
        p.headline.textContent = '';
        p.sub.textContent = '';
        p.holder.appendChild(htmlEl('p', { className: 'rf-empty' }, 'No class data yet. Enter the hands-up counts (or load the sample data) to draw this chart.'));
        return;
      }
      var n = tallySum(t);
      p.headline.textContent = title;
      p.sub.textContent = 'Number of slips choosing each answer (n = ' + n + (t.isSample ? ', sample data' : '') + ').';
      var W = 720, labelW = 190, rowH = 30, gap = 10, top = 4, axisH = 28;
      var H = top + options.length * (rowH + gap) + axisH;
      var mx = Math.max.apply(null, t.counts.concat([1]));
      var step = niceStep(mx, 5), maxV = Math.ceil(mx / step) * step;
      var x = function (v) { return labelW + (v / maxV) * (W - labelW - 50); };
      var svg = svgEl('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': title + '. ' + options.map(function (o, i) { return o + ': ' + t.counts[i]; }).join(', ') });
      var grid = svgEl('g', { 'class': 'rf-grid' }), axis = svgEl('g', { 'class': 'rf-axis' });
      for (var v = 0; v <= maxV + 1e-9; v += step) {
        grid.appendChild(svgEl('line', { x1: x(v), x2: x(v), y1: top, y2: H - axisH + 4 }));
        axis.appendChild(svgEl('text', { x: x(v), y: H - 8, 'text-anchor': 'middle' }, v));
      }
      svg.appendChild(grid); svg.appendChild(axis);
      options.forEach(function (o, i) {
        var y = top + i * (rowH + gap);
        var c = t.counts[i] || 0;
        svg.appendChild(svgEl('text', { 'class': 'rf-label rf-label--strong', x: 0, y: y + rowH / 2 + 4 }, o));
        var r = svgEl('rect', { 'class': 'rf-bar--better', x: x(0), y: y, width: Math.max(0, x(c) - x(0)), height: rowH, rx: 3 });
        addTitle(r, o + ': ' + c + ' of ' + n + ' (' + Math.round(100 * c / n) + '%)');
        svg.appendChild(r);
        svg.appendChild(svgEl('text', { 'class': 'rf-label rf-label--strong', x: x(c) + 6, y: y + rowH / 2 + 4 }, c + ' (' + Math.round(100 * c / n) + '%)'));
      });
      p.holder.appendChild(svg);
    }
    onChange(render);
    render();
  }


  /* ─────────────────────────────────────────────────────────────
     5. DOT PLOT — validation, outliers, truth line  [data-rf-dotplot]
     data-key, data-min, data-max, data-sample, data-title, data-unit,
     data-truth, data-truth-label, data-bin, data-dp, data-label
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

    var id = 'rf-dp-' + Math.random().toString(36).slice(2, 7);
    var label = htmlEl('label', { 'for': id }, root.getAttribute('data-label') || 'Values, separated by commas');
    label.style.fontWeight = '700';
    label.style.fontSize = 'var(--text-sm)';
    var ta = htmlEl('textarea', { className: 'rf-textarea', id: id, spellcheck: 'false' });
    var ctr = htmlEl('div', { className: 'rf-tally__controls' });
    ctr.style.marginTop = 'var(--space-3)';
    var plotBtn = htmlEl('button', { type: 'button', className: 'rf-btn rf-btn--primary' }, 'Validate and plot');
    var sampleBtn = htmlEl('button', { type: 'button', className: 'rf-btn' }, 'Load sample data');
    var clearBtn = htmlEl('button', { type: 'button', className: 'rf-btn' }, 'Clear');
    var truthBtn = truth !== null ? htmlEl('button', { type: 'button', className: 'rf-btn', 'aria-pressed': 'false' }, 'Show the answer') : null;
    ctr.appendChild(plotBtn); ctr.appendChild(sampleBtn); ctr.appendChild(clearBtn);
    if (truthBtn) ctr.appendChild(truthBtn);
    var invalidOut = htmlEl('p', { className: 'rf-invalid-list', 'aria-live': 'polite' });
    var stats = htmlEl('div', { className: 'rf-stats' });
    var p = panel();
    p.headline.textContent = title;
    p.sub.textContent = 'One dot per valid slip. Red dots are outliers by the 1.5 × IQR rule.';
    root.appendChild(label); root.appendChild(ta); root.appendChild(ctr);
    root.appendChild(invalidOut); root.appendChild(stats); root.appendChild(p);

    var showTruth = false;
    function stat(l, v) {
      var d = htmlEl('div', { className: 'rf-stat' });
      d.appendChild(htmlEl('span', { className: 'rf-stat__label' }, l));
      d.appendChild(htmlEl('span', { className: 'rf-stat__value' }, v));
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
        p.holder.appendChild(htmlEl('p', { className: 'rf-empty' }, 'No valid values yet. Type the values read from the slips, or load the sample data.'));
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
      var axis = svgEl('g', { 'class': 'rf-axis' });
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
        var c = svgEl('circle', { 'class': 'rf-dot' + (out ? ' rf-dot--flag' : ''), cx: x(Math.round(val / bin) * bin), cy: axisY - 10 - Math.min(level, 12) * 13, r: 6.2 });
        addTitle(c, val + ' ' + unit + (out ? ' — outlier' : ''));
        svg.appendChild(c);
      });
      s.outliers.forEach(function (val, i) {
        if (s.outliers.indexOf(val) !== i) return;
        var k = String(Math.round(val / bin) * bin);
        var yTop = axisY - 10 - Math.min(stacks[k] - 1, 12) * 13;
        svg.appendChild(svgEl('text', { 'class': 'rf-flag-label', x: x(Math.round(val / bin) * bin), y: yTop - 13, 'text-anchor': 'middle' }, 'Outlier: ' + val));
      });
      svg.appendChild(svgEl('line', { x1: x(s.med), x2: x(s.med), y1: 26, y2: axisY, style: 'stroke: var(--color-text-secondary); stroke-dasharray: 4 4;' }));
      svg.appendChild(svgEl('text', { 'class': 'rf-label rf-label--strong', x: x(s.med) + 6, y: 22 }, 'class median ' + fmt(s.med, dp)));
      if (truth !== null && showTruth) {
        svg.appendChild(svgEl('line', { 'class': 'rf-truth-line', x1: x(truth), x2: x(truth), y1: 38, y2: axisY }));
        var anchor = x(truth) > W * 0.6 ? 'end' : 'start';
        svg.appendChild(svgEl('text', { 'class': 'rf-truth-label', x: x(truth) + (anchor === 'end' ? -6 : 6), y: 50, 'text-anchor': anchor }, truthLabel));
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
     6. CORAL COVER CHART  [data-rf-coral]
     Values are the headline figures from each year's AIMS annual
     summary report (see CORAL notes at the top of this file).
  ───────────────────────────────────────────────────────────── */

  function coralSeries(region) {
    return CORAL.years.map(function (y, i) { return [y, CORAL[region][i]]; });
  }
  var REGION_LABEL = { n: 'Northern', c: 'Central', s: 'Southern' };

  function drawCoral(svg, regions, opts) {
    opts = opts || {};
    UNIT = '% cover';
    var series = regions.map(function (r) {
      return { data: coralSeries(r), cls: 'rf-line--' + r, dotCls: 'rf-dot--' + r, label: REGION_LABEL[r],
        endLabel: (opts.endLabels === false || regions.length > 1) ? '' : REGION_LABEL[r] + ' ' + fmt(CORAL[r][CORAL[r].length - 1], 1) + '%' };
    });
    var markers = opts.averages ? regions.map(function (r) {
      return { y: CORAL.avg[r], cls: 'rf-avg--' + r, label: regions.length === 1 ? 'Long-term average ' + CORAL.avg[r] + '%' : '' };
    }) : [];
    lineChart(svg, { series: series, x0: opts.x0 || 2017, x1: opts.x1 || 2026, yMax: opts.yMax || 50, step: opts.step || 10, yMin: opts.yMin || 0, yLabel: 'Hard coral cover (%)', markers: markers });
  }

  function coralLegend(regions, avg) {
    return regions.map(function (r) {
      return '<span><i class="rf-swatch rf-swatch--' + r + '" aria-hidden="true"></i>' + REGION_LABEL[r] + '</span>';
    }).join('') + (avg ? '<span><i class="rf-swatch rf-swatch--line" style="background: repeating-linear-gradient(90deg, var(--color-text-muted) 0 3px, transparent 3px 7px)" aria-hidden="true"></i>Long-term average (dashed)</span>' : '');
  }

  function initCoral(root) {
    var views = { all: 'All three regions', n: 'Northern', c: 'Central', s: 'Southern' };
    var current = 'all';
    var p = panel();
    p.source.textContent = CORAL_SOURCE;
    root.appendChild(switcher(views, current, function (id) { current = id; render(); }, 'Choose a region'));
    root.appendChild(p);
    function render() {
      var regions = current === 'all' ? ['n', 'c', 's'] : [current];
      p.headline.textContent = current === 'all' ? 'Hard coral cover on the Great Barrier Reef, 2017–2026' : REGION_LABEL[current] + ' Great Barrier Reef: hard coral cover, 2017–2026';
      p.sub.textContent = 'Average percentage of the reef surface covered by live hard coral, as reported each year. Gaps = no figure published for that year.';
      p.legend.innerHTML = coralLegend(regions, true);
      p.holder.innerHTML = '';
      var svg = svgEl('svg', { viewBox: '0 0 720 320', role: 'img', 'aria-label': p.headline.textContent + '. ' + regions.map(function (r) { return REGION_LABEL[r] + ': ' + coralSeries(r).map(function (q) { return q[0] + ' ' + (q[1] === null ? 'no figure' : q[1] + '%'); }).join(', '); }).join('. ') });
      p.holder.appendChild(svg);
      drawCoral(svg, regions, { averages: true });
    }
    render();
  }


  /* ─────────────────────────────────────────────────────────────
     7. EVALUATE — one fair view, three misleading views  [data-rf-evaluate]
  ───────────────────────────────────────────────────────────── */

  function initEvaluate(root) {
    var N = CORAL.n;
    var n24 = N[CORAL.years.indexOf(2024)], n25 = N[CORAL.years.indexOf(2025)], n17 = N[CORAL.years.indexOf(2017)];
    var base = 29;
    var views = {
      fair: {
        button: 'A. All regions, all years',
        headline: 'Coral cover rose, fell and is recovering again',
        sub: 'Hard coral cover (%) by region, 2017–2026, as reported each year.',
        source: CORAL_SOURCE,
        legend: coralLegend(['n', 'c', 's'], false),
        draw: function (s) { drawCoral(s, ['n', 'c', 's'], { averages: false }); },
        problem: 'Fair. Every region and year is shown, the axis starts at zero, units and the source are given, and gaps for missing years are left as gaps instead of being joined up.'
      },
      record: {
        button: 'B. Record high!',
        headline: 'Great Barrier Reef at a RECORD HIGH!',
        sub: 'Northern reef, hard coral cover (%).',
        source: '',
        legend: '',
        draw: function (s) {
          barChart(s, [
            { label: '2017', value: n17, cls: 'rf-bar--better', tip: 'Northern 2017: ' + n17 + '%' },
            { label: '2024', value: n24, cls: 'rf-bar--better', tip: 'Northern 2024: ' + n24 + '%' }
          ], { base: 0, max: 50, step: 10 });
        },
        problem: 'Cherry-picked. It compares the lowest year with the peak year in one region, and leaves out the 2025 crash, the other two regions and the source. In 2026 the headline is out of date.'
      },
      collapse: {
        button: 'C. Reef collapses!',
        headline: 'Reef COLLAPSES in a single year!',
        sub: 'Northern reef, hard coral cover (%).',
        source: CORAL_SOURCE,
        legend: '',
        draw: function (s) {
          barChart(s, [
            { label: '2024', value: n24, cls: 'rf-bar--worse', tip: '2024: ' + n24 + '%' },
            { label: '2025', value: n25, cls: 'rf-bar--worse', tip: '2025: ' + n25 + '%' }
          ], { base: base, max: 40, step: 1 });
        },
        problem: 'Truncated axis. The bars start at ' + base + '%, so 2025 is drawn about ' + fmt((n24 - base) / (n25 - base), 0) +
          ' times shorter than 2024. The real fall was from ' + n24 + '% to ' + n25 + '%, about a quarter. That was a record drop, but not a collapse, and the chart hides the 2026 recovery.'
      },
      pie: {
        button: 'D. Share by region',
        headline: 'Where the reef’s coral is, 2026',
        sub: 'Hard coral cover by region.',
        source: CORAL_SOURCE,
        legend: coralLegend(['n', 'c', 's'], false),
        draw: function (s) {
          var vals = ['n', 'c', 's'].map(function (r) { return CORAL[r][CORAL[r].length - 1]; });
          var total = vals.reduce(function (a, b) { return a + b; }, 0);
          s.setAttribute('viewBox', '0 0 720 320');
          var cx = 360, cy = 160, rad = 130, ang = -Math.PI / 2;
          vals.forEach(function (v, i) {
            var a2 = ang + 2 * Math.PI * v / total;
            var large = (a2 - ang) > Math.PI ? 1 : 0;
            var d = 'M' + cx + ',' + cy + ' L' + (cx + rad * Math.cos(ang)) + ',' + (cy + rad * Math.sin(ang)) +
              ' A' + rad + ',' + rad + ' 0 ' + large + ' 1 ' + (cx + rad * Math.cos(a2)) + ',' + (cy + rad * Math.sin(a2)) + ' Z';
            var path = svgEl('path', { d: d, 'class': 'rf-pie-slice', style: 'fill: var(--rf-' + ['better', 'worse', 'alt'][i] + ')' });
            addTitle(path, REGION_LABEL[['n', 'c', 's'][i]] + ': ' + v + '%');
            s.appendChild(path);
            var mid = (ang + a2) / 2;
            s.appendChild(svgEl('text', { 'class': 'rf-label--in', x: cx + rad * 0.6 * Math.cos(mid), y: cy + rad * 0.6 * Math.sin(mid) + 4, 'text-anchor': 'middle' }, v + '%'));
            ang = a2;
          });
        },
        problem: 'Wrong chart type. A pie shows parts of one whole, but these are three separate percentages that add up to ' +
          fmt(CORAL.n[CORAL.n.length - 1] + CORAL.c[CORAL.c.length - 1] + CORAL.s[CORAL.s.length - 1], 1) +
          '%, which means nothing. The regions are also different sizes, so the slices can’t show “where the coral is”. Use bars.'
      }
    };
    var current = 'fair', revealed = false;
    var labels = {}; Object.keys(views).forEach(function (k) { labels[k] = views[k].button; });
    var p = panel();
    root.appendChild(switcher(labels, current, function (id) { current = id; revealed = false; render(); }, 'Choose a chart'));
    root.appendChild(p);
    var revealBtn = htmlEl('button', { type: 'button', className: 'rf-btn rf-btn--primary', 'aria-expanded': 'false' }, 'Reveal: what’s wrong with it?');
    var revealBox = htmlEl('div', { className: 'rf-reveal', 'aria-live': 'polite' });
    revealBox.hidden = true;
    revealBtn.addEventListener('click', function () { revealed = !revealed; render(); });
    root.appendChild(revealBtn); root.appendChild(revealBox);
    function render() {
      var v = views[current];
      p.headline.textContent = v.headline;
      p.sub.textContent = v.sub;
      p.source.textContent = v.source;
      p.legend.innerHTML = v.legend;
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
     8. RUNOFF EXPLORER  [data-rf-runoff]
     Annual averages of the SIMULATED samples; trend rates are REAL.
  ───────────────────────────────────────────────────────────── */

  function linFit(pts) {
    var n = pts.length, sx = 0, sy = 0, sxx = 0, sxy = 0;
    pts.forEach(function (p) { sx += p[0]; sy += p[1]; sxx += p[0] * p[0]; sxy += p[0] * p[1]; });
    var m = (n * sxy - sx * sy) / (n * sxx - sx * sx);
    return { m: m, c: (sy - m * sx) / n };
  }

  function initRunoff(root) {
    var site = root.getAttribute('data-site') || 'BUR-INK';
    var measure = 'ss';
    var sel = htmlEl('select', { className: 'rf-input', 'aria-label': 'Monitoring site' });
    sel.style.width = 'auto';
    sel.style.textAlign = 'left';
    RUNOFF.sites.forEach(function (s) {
      var o = htmlEl('option', { value: s.id }, s.name);
      if (s.id === site) o.selected = true;
      sel.appendChild(o);
    });
    var row = htmlEl('div', { className: 'rf-tally__controls' });
    row.appendChild(htmlEl('label', null, 'Site'));
    row.appendChild(sel);
    root.appendChild(row);
    root.appendChild(switcher({ ss: 'Sediment (SS)', din: 'Fertiliser nitrogen (DIN)' }, measure, function (id) { measure = id; render(); }, 'Choose a measure'));
    var stats = htmlEl('div', { className: 'rf-stats' });
    root.appendChild(stats);
    var p = panel();
    p.legend.innerHTML = '<span><i class="rf-swatch rf-swatch--line" style="background: var(--rf-better)" aria-hidden="true"></i>Yearly average</span>' +
      '<span><i class="rf-swatch rf-swatch--line" style="background: repeating-linear-gradient(90deg, var(--color-text-secondary) 0 6px, transparent 6px 10px)" aria-hidden="true"></i>Straight-line trend</span>';
    p.source.textContent = 'Site details and published trend rates: James et al. (2026), Journal of Environmental Management. Yearly values: SIMULATED for teaching, following each site’s published trend.';
    root.appendChild(p);
    sel.addEventListener('change', function () { site = sel.value; render(); });

    function stat(l, v) {
      var d = htmlEl('div', { className: 'rf-stat' });
      d.appendChild(htmlEl('span', { className: 'rf-stat__label' }, l));
      d.appendChild(htmlEl('span', { className: 'rf-stat__value' }, v));
      return d;
    }
    function render() {
      var meta = RUNOFF.sites.filter(function (s) { return s.id === site; })[0];
      var idx = measure === 'din' ? 1 : 2;
      var pts = RUNOFF.annual[site].filter(function (r) { return r[idx] !== null; }).map(function (r) { return [r[0], r[idx]]; });
      var y0 = pts[0][0], y1 = pts[pts.length - 1][0];
      var first = pts.filter(function (q) { return q[0] < y0 + 10; }), last = pts.filter(function (q) { return q[0] > y1 - 10; });
      var avg = function (a) { return a.reduce(function (s, q) { return s + q[1]; }, 0) / a.length; };
      var fa = avg(first), la = avg(last);
      var published = measure === 'din' ? meta.dinTrend : meta.ssTrend;
      stats.innerHTML = '';
      stats.appendChild(stat('Years monitored', y0 + '–' + y1));
      stats.appendChild(stat('First 10 years avg', fmt(fa, measure === 'din' ? 3 : 0)));
      stats.appendChild(stat('Last 10 years avg', fmt(la, measure === 'din' ? 3 : 0)));
      stats.appendChild(stat('Change', (la >= fa ? '+' : '') + fmt(100 * (la - fa) / fa, 0) + '%'));
      stats.appendChild(stat('Published trend', published === 0 ? 'not significant' : (published > 0 ? '+' : '') + published + '% / yr'));
      p.headline.textContent = meta.name + ': ' + (measure === 'din' ? 'dissolved inorganic nitrogen' : 'suspended sediment');
      p.sub.textContent = 'Yearly average concentration, milligrams per litre (mg/L). Land use: ' + meta.land + '.';
      p.holder.innerHTML = '';
      var fit = linFit(pts);
      var mx = Math.max.apply(null, pts.map(function (q) { return q[1]; }));
      var svg = svgEl('svg', { viewBox: '0 0 720 320', role: 'img', 'aria-label': p.headline.textContent + ', ' + y0 + ' to ' + y1 + '. First ten years average ' + fmt(fa, 3) + ', last ten years ' + fmt(la, 3) + '.' });
      p.holder.appendChild(svg);
      UNIT = 'mg/L';
      var c = lineChart(svg, { series: [{ data: pts }], x0: y0, x1: y1, yMax: mx * 1.05, yLabel: 'mg/L' });
      svg.appendChild(svgEl('line', { 'class': 'rf-trend', x1: c.x(y0), x2: c.x(y1), y1: c.y(fit.m * y0 + fit.c), y2: c.y(fit.m * y1 + fit.c) }));
    }
    render();
  }


  /* ─────────────────────────────────────────────────────────────
     9. SQL RUNNER  [data-rf-sql]  (needs vendor/sql-asm.js + reef-db.js)
     Every runner on a page shares ONE database, so an INSERT in one
     box is visible to a SELECT in the next. "Reset database" rebuilds it.
  ───────────────────────────────────────────────────────────── */

  var dbPromise = null, db = null;
  function getDb() {
    if (db) return Promise.resolve(db);
    if (dbPromise) return dbPromise;
    if (typeof window.initSqlJs !== 'function' || typeof window.REEF_SQL !== 'string') {
      return Promise.reject(new Error('The database files did not load (vendor/sql-asm.js and reef-db.js).'));
    }
    dbPromise = window.initSqlJs().then(function (SQL) {
      db = new SQL.Database();
      db.exec(window.REEF_SQL);
      return db;
    });
    return dbPromise;
  }
  function resetDb() {
    if (db) { db.close(); }
    db = null; dbPromise = null;
    return getDb();
  }

  function renderResult(out, res, limit) {
    out.innerHTML = '';
    if (!res.length) return;
    var r = res[res.length - 1];
    var table = htmlEl('table');
    var thead = htmlEl('thead'), hr = htmlEl('tr');
    r.columns.forEach(function (c) { hr.appendChild(htmlEl('th', { scope: 'col' }, c)); });
    thead.appendChild(hr); table.appendChild(thead);
    var tbody = htmlEl('tbody');
    r.values.slice(0, limit).forEach(function (row) {
      var tr = htmlEl('tr');
      row.forEach(function (v) {
        var td = htmlEl('td', v === null ? { className: 'is-null' } : null, v === null ? 'NULL' : (typeof v === 'number' && !Number.isInteger(v) ? String(Math.round(v * 1000) / 1000) : v));
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    out.appendChild(table);
  }

  function initSql(root) {
    var preset = root.getAttribute('data-query') || 'SELECT * FROM sites;';
    var limit = 200;
    var id = 'rf-sql-' + Math.random().toString(36).slice(2, 7);
    var label = htmlEl('label', { 'for': id, className: 'rf-sr' }, root.getAttribute('data-label') || 'SQL query');
    label.style.fontWeight = '700';
    label.style.fontSize = 'var(--text-sm)';
    var ed = htmlEl('textarea', { className: 'rf-sql__editor', id: id, spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off' });
    ed.value = preset;
    ed.rows = Math.max(3, preset.split('\n').length + 1);
    ed.style.minHeight = '0';
    var bar = htmlEl('div', { className: 'rf-sql__bar' });
    var run = htmlEl('button', { type: 'button', className: 'rf-btn rf-btn--primary' }, 'Run query');
    var restore = htmlEl('button', { type: 'button', className: 'rf-btn' }, 'Restore example');
    var reset = htmlEl('button', { type: 'button', className: 'rf-btn' }, 'Reset database');
    var msg = htmlEl('span', { className: 'rf-sql__msg', 'aria-live': 'polite' });
    bar.appendChild(run); bar.appendChild(restore);
    if (root.hasAttribute('data-reset')) bar.appendChild(reset);
    bar.appendChild(msg);
    var out = htmlEl('div', { className: 'rf-sql__out', tabindex: '0', 'aria-label': 'Query results' });
    root.appendChild(label); root.appendChild(ed); root.appendChild(bar); root.appendChild(out);

    function go() {
      msg.className = 'rf-sql__msg';
      msg.textContent = 'Running…';
      getDb().then(function (d) {
        try {
          var before = d.getRowsModified();
          var res = d.exec(ed.value);
          renderResult(out, res, limit);
          var changedRows = d.getRowsModified() - before;
          msg.className = 'rf-sql__msg rf-sql__msg--ok';
          if (res.length) {
            var rows = res[res.length - 1].values.length;
            msg.textContent = '✓ ' + rows + ' row' + (rows === 1 ? '' : 's') + (rows > limit ? ' (showing the first ' + limit + ')' : '');
          } else {
            msg.textContent = '✓ Done. Rows changed: ' + Math.max(0, d.getRowsModified());
          }
        } catch (e) {
          out.innerHTML = '';
          msg.className = 'rf-sql__msg rf-sql__msg--err';
          msg.textContent = '✗ ' + e.message;
        }
      }).catch(function (e) {
        msg.className = 'rf-sql__msg rf-sql__msg--err';
        msg.textContent = '✗ ' + e.message;
      });
    }
    run.addEventListener('click', go);
    ed.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); go(); }
    });
    restore.addEventListener('click', function () { ed.value = preset; out.innerHTML = ''; msg.textContent = ''; });
    reset.addEventListener('click', function () {
      resetDb().then(function () { msg.className = 'rf-sql__msg rf-sql__msg--ok'; msg.textContent = '✓ Database reset to the original data'; out.innerHTML = ''; });
    });
  }


  /* ─────────────────────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────────────────────── */

  function init() {
    initPresent();
    document.querySelectorAll('[data-rf-tally]').forEach(initTally);
    document.querySelectorAll('[data-rf-bars]').forEach(initBars);
    document.querySelectorAll('[data-rf-dotplot]').forEach(initDotPlot);
    document.querySelectorAll('[data-rf-coral]').forEach(initCoral);
    document.querySelectorAll('[data-rf-evaluate]').forEach(initEvaluate);
    document.querySelectorAll('[data-rf-runoff]').forEach(initRunoff);
    document.querySelectorAll('[data-rf-sql]').forEach(initSql);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  // Exposed for testing only
  window.ReefLesson = { CORAL: CORAL, RUNOFF: RUNOFF, summarise: summarise, parseValues: parseValues, getDb: getDb };
}());
