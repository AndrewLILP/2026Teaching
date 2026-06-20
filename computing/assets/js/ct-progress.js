/*
 * ct-progress.js
 * Computing Technology 7–10 | Per-student local progress tracking
 *
 * Stores MCQ results and reflection text in localStorage, scoped
 * per unit. Uses the same storage mechanism already relied on by
 * the font-preference toggle in ct-core.js, so it works the same
 * way across file:// pages in the same browser.
 *
 * This file does NOT modify the MCQ engine in ct-interactive.js.
 * It attaches its own click listeners to the same .mcq-option
 * buttons and reads correctness directly from data-idx / data-correct,
 * so the two scripts run independently of each other.
 *
 * Load order: ct-shared.css/ct-lessons.css, ct-core.js,
 * ct-interactive.js, THEN ct-progress.js.
 *
 * Usage on a lesson page, after the scripts are loaded:
 *
 *   CTProgress.initLessonPage({
 *     unitId: 'mechatronics-2026',
 *     lessonId: 'lesson01',
 *     totalQuestions: 3
 *   });
 *
 * Markup hooks expected on the page:
 *   <div data-progress-recap></div>                  → recap summary renders here
 *   <textarea data-progress-reflection></textarea>   → autosaving reflection box
 *   <span data-progress-reflection-status></span>    → "Saved ✓ 3:42pm" indicator
 *
 * To read progress from another page (e.g. progress.html):
 *   CTProgress.readAll('mechatronics-2026')
 *   → { lesson01: { mcq: {...}, reflection: '...', reflectionSavedAt: '...' }, ... }
 */

window.CTProgress = (function () {
  'use strict';

  function storageKey(unitId) {
    return 'ct-progress:' + unitId;
  }

  function readAll(unitId) {
    try {
      var raw = localStorage.getItem(storageKey(unitId));
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function writeAll(unitId, data) {
    try {
      localStorage.setItem(storageKey(unitId), JSON.stringify(data));
    } catch (e) {
      /* localStorage unavailable (private browsing, quota, etc.) — fail silently */
    }
  }

  function getLesson(unitId, lessonId) {
    var all = readAll(unitId);
    return all[lessonId] || { mcq: {}, reflection: '', reflectionSavedAt: null };
  }

  function saveLesson(unitId, lessonId, lessonData) {
    var all = readAll(unitId);
    all[lessonId] = lessonData;
    writeAll(unitId, all);
  }

  function recordAnswer(unitId, lessonId, qId, isCorrect) {
    var lesson = getLesson(unitId, lessonId);
    var entry = lesson.mcq[qId] || { attempts: 0, correct: false };
    entry.attempts += 1;
    if (isCorrect) entry.correct = true;
    lesson.mcq[qId] = entry;
    saveLesson(unitId, lessonId, lesson);
    return lesson;
  }

  function saveReflection(unitId, lessonId, text) {
    var lesson = getLesson(unitId, lessonId);
    lesson.reflection = text;
    lesson.reflectionSavedAt = new Date().toISOString();
    saveLesson(unitId, lessonId, lesson);
    return lesson;
  }

  /* Summary stats for one lesson's stored data. */
  function summarise(lesson, totalQuestions) {
    lesson = lesson || { mcq: {}, reflection: '' };
    var qIds = Object.keys(lesson.mcq || {});
    var correct = qIds.filter(function (k) { return lesson.mcq[k].correct; }).length;
    var firstTry = qIds.filter(function (k) {
      return lesson.mcq[k].correct && lesson.mcq[k].attempts === 1;
    }).length;
    var reflectionDone = !!(lesson.reflection && lesson.reflection.trim().length > 0);
    var total = totalQuestions || qIds.length;
    return {
      answered: qIds.length,
      total: total,
      correct: correct,
      firstTry: firstTry,
      reflectionDone: reflectionDone,
      isComplete: qIds.length >= total && total > 0 && reflectionDone
    };
  }

  /* Wire up one lesson page. Call once after the DOM is ready. */
  function initLessonPage(opts) {
    var unitId   = opts.unitId;
    var lessonId = opts.lessonId;
    var total    = opts.totalQuestions || 0;
    var lesson   = getLesson(unitId, lessonId);

    function renderRecap() {
      var box = document.querySelector('[data-progress-recap]');
      if (!box) return;
      var s = summarise(lesson, total);
      var lines = [];
      lines.push(
        '<p class="progress-recap__line"><strong>' + s.answered + ' / ' + s.total +
        '</strong> questions answered &middot; <strong>' + s.firstTry +
        '</strong> correct on first try</p>'
      );
      lines.push(
        '<p class="progress-recap__line">' +
        (s.reflectionDone ? '✓ Reflection saved' : '— Reflection not started yet') +
        '</p>'
      );
      box.innerHTML = lines.join('');
    }

    /* MCQ tracking — independent of ct-interactive.js's own handler */
    document.querySelectorAll('.mcq-card').forEach(function (card) {
      var qId = card.dataset.q;
      var correctAns = (card.dataset.correct || '').toUpperCase();
      card.querySelectorAll('.mcq-option').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var chosen = (btn.dataset.idx || '').toUpperCase();
          var isCorrect = chosen === correctAns;
          lesson = recordAnswer(unitId, lessonId, qId, isCorrect);
          renderRecap();
        });
      });
    });

    /* Reflection autosave — debounced on input */
    var textarea = document.querySelector('[data-progress-reflection]');
    if (textarea) {
      textarea.value = lesson.reflection || '';
      var statusTag = document.querySelector('[data-progress-reflection-status]');
      var debounceTimer = null;

      textarea.addEventListener('input', function () {
        if (statusTag) statusTag.textContent = 'Saving…';
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function () {
          lesson = saveReflection(unitId, lessonId, textarea.value);
          if (statusTag) {
            var t = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            statusTag.textContent = 'Saved ✓ ' + t;
          }
          renderRecap();
        }, 600);
      });
    }

    renderRecap();
  }

  return {
    initLessonPage: initLessonPage,
    getLesson: getLesson,
    readAll: readAll,
    summarise: summarise
  };
})();
