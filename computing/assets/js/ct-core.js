/**
 * ct-core.js
 * Computing Technology 7–10 | Core UI behaviours
 * NSW Computing Technology Syllabus (2022)
 * Maintained by: Andrew Leary
 *
 * Responsibilities:
 *   1. Font preference toggle (Nunito / System / OpenDyslexic)
 *   2. Expand / collapse cards (accordion)
 *   3. Sidebar TOC — IntersectionObserver active-link highlight
 *   4. CPD grade strip — click to highlight
 *   5. Smooth scroll to anchor (respects prefers-reduced-motion)
 *   6. Keyboard nav — Enter / Space trigger click on all custom elements
 *
 * Dependencies: none
 * Load order: last <script> before </body>
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────────
     1. FONT PREFERENCE TOGGLE
     Reads / writes localStorage key 'ct-font-preference'.
     Applies .font-nunito / .font-system / .font-dyslexia to <body>.
     Keeps .font-btn aria-pressed and .is-active in sync.
  ───────────────────────────────────────────────────────────── */

  var FONT_KEY = 'ct-font-preference';

  function applyFont(pref) {
    // Remove all font classes, add the chosen one
    document.body.classList.remove('font-nunito', 'font-system', 'font-dyslexia');
    document.body.classList.add('font-' + pref);

    // Sync all toggle buttons on the page
    document.querySelectorAll('.font-btn').forEach(function (btn) {
      var isActive = btn.dataset.font === pref;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });
  }

  function initFontToggle() {
    // Read saved preference; default to Nunito
    var saved = 'nunito';
    try {
      saved = localStorage.getItem(FONT_KEY) || 'nunito';
    } catch (e) {
      // localStorage blocked (private browsing, sandboxed) — silently use default
    }
    applyFont(saved);

    // Wire up buttons
    document.querySelectorAll('.font-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var pref = btn.dataset.font;
        try { localStorage.setItem(FONT_KEY, pref); } catch (e) {}
        applyFont(pref);
      });
    });
  }


  /* ─────────────────────────────────────────────────────────────
     2. EXPAND / COLLAPSE CARDS
     .expand-card > .expand-card__header (button) + .expand-card__body
     Toggles .is-open on the card, aria-expanded on the button.
     CSS handles visibility — display:none / display:block.
  ───────────────────────────────────────────────────────────── */

  function initExpandCards() {
    document.querySelectorAll('.expand-card__header').forEach(function (header) {
      header.addEventListener('click', function () {
        var card = header.closest('.expand-card');
        var isOpen = card.classList.toggle('is-open');
        header.setAttribute('aria-expanded', String(isOpen));
      });

      // Keyboard: Enter and Space both trigger click
      header.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          header.click();
        }
      });
    });
  }


  /* ─────────────────────────────────────────────────────────────
     3. SIDEBAR TOC — IntersectionObserver
     Watches all <section id="..."> elements that have a matching
     link in .sidebar-toc. Adds .is-active to the link for the
     section currently in view (nearest the top of the viewport).
  ───────────────────────────────────────────────────────────── */

  function initSidebarTOC() {
    var toc = document.getElementById('sidebar-toc');
    if (!toc) return;

    var tocLinks = toc.querySelectorAll('a[href^="#"]');
    if (!tocLinks.length) return;

    // Build a map: section element → toc link
    var sectionMap = [];
    tocLinks.forEach(function (link) {
      var id = link.getAttribute('href').slice(1);
      var el = document.getElementById(id);
      if (el) sectionMap.push({ el: el, link: link });
    });

    if (!sectionMap.length) return;

    // rootMargin pushes the trigger line down past the sticky nav
    // and pulls the bottom up so only the top portion counts
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Remove active from all, add to the intersecting section's link
          tocLinks.forEach(function (l) { l.classList.remove('is-active'); });
          sectionMap.forEach(function (s) {
            if (s.el === entry.target) s.link.classList.add('is-active');
          });
        }
      });
    }, {
      rootMargin: '-60px 0px -55% 0px',
      threshold: 0
    });

    sectionMap.forEach(function (s) { observer.observe(s.el); });
  }


  /* ─────────────────────────────────────────────────────────────
     4. CPD GRADE STRIP — click to highlight
     .cpd-grade elements get .is-active on click.
     Clicking an already-active grade deactivates it.
     Only one grade active at a time.
  ───────────────────────────────────────────────────────────── */

  function initCPDStrip() {
    var grades = document.querySelectorAll('.cpd-grade');
    if (!grades.length) return;

    grades.forEach(function (grade) {
      function toggle() {
        var wasActive = grade.classList.contains('is-active');
        // Clear all
        grades.forEach(function (g) { g.classList.remove('is-active'); });
        // Toggle the clicked one
        if (!wasActive) grade.classList.add('is-active');
      }

      grade.addEventListener('click', toggle);
      grade.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      });
    });
  }


  /* ─────────────────────────────────────────────────────────────
     5. SMOOTH SCROLL TO ANCHOR
     Overrides default anchor jump to use smooth scroll.
     Falls back to instant scroll if prefers-reduced-motion is set.
     Moves focus to the target after scrolling.
  ───────────────────────────────────────────────────────────── */

  function initSmoothScroll() {
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var hash  = link.getAttribute('href');
        var target = document.querySelector(hash);
        if (!target) return;

        e.preventDefault();

        target.scrollIntoView({
          behavior: prefersReduced ? 'auto' : 'smooth',
          block: 'start'
        });

        // Move focus for keyboard / screen reader users
        // tabindex="-1" on target allows focus without tab stop
        if (!target.hasAttribute('tabindex')) {
          target.setAttribute('tabindex', '-1');
        }
        target.focus({ preventScroll: true });

        // Update URL hash without jumping
        if (history.pushState) {
          history.pushState(null, null, hash);
        }
      });
    });
  }


  /* ─────────────────────────────────────────────────────────────
     INIT — run all initialisers after DOM is ready
  ───────────────────────────────────────────────────────────── */

  function init() {
    initFontToggle();
    initExpandCards();
    initSidebarTOC();
    initCPDStrip();
    initSmoothScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM already ready (script loaded with defer or at end of body)
    init();
  }

}());
