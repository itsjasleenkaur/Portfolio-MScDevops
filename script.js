/* ============================================================
   Jasleen Kaur — portfolio
   Vanilla JavaScript only. No frameworks, no build step.
   ============================================================ */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Mobile navigation ---------- */
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');

  function closeMenu() {
    if (!menu) return;
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        closeMenu();
        toggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 1000) closeMenu();
    });
  }

  /* ---------- 2. Navbar background once scrolled ---------- */
  var navWrap = document.querySelector('.nav-wrap');
  var toTop = document.getElementById('toTop');

  function onScroll() {
    var y = window.scrollY;
    if (navWrap) navWrap.classList.toggle('is-stuck', y > 24);
    if (toTop) toTop.classList.toggle('is-visible', y > 620);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 3. Active navigation link while scrolling ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var sections = links
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  function setActive() {
    var marker = window.scrollY + (window.innerHeight * 0.32);
    var currentId = sections.length ? sections[0].id : null;

    sections.forEach(function (section) {
      if (section.offsetTop <= marker) currentId = section.id;
    });

    // At the very bottom, highlight the last section.
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4 && sections.length) {
      currentId = sections[sections.length - 1].id;
    }

    links.forEach(function (link) {
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + currentId);
    });
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      setActive();
      ticking = false;
    });
  }, { passive: true });
  setActive();

  /* ---------- 4. Smooth scrolling with a fixed-nav offset ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id = anchor.getAttribute('href');
      if (!id || id === '#') return;

      var target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      var navHeight = navWrap ? navWrap.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;

      window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
      history.replaceState(null, '', id);
    });
  });

  /* ---------- 5. Section reveal on first view ---------- */
  var revealables = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealables.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- 6. Back to top ---------- */
  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- 7. Contact form (demo only — nothing is sent) ---------- */
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');

  if (form && note) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      note.textContent =
        'Nothing was sent — this portfolio is a static site with no backend, so the ' +
        'form is a demo. Email jasleenk2k5@gmail.com or message me on LinkedIn instead.';
      note.classList.add('is-flagged');
    });
  }

  /* ---------- 8. Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();