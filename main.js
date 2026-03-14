document.addEventListener('DOMContentLoaded', () => {

  // ── DARK MODE ──────────────────────────────────────────────
  const toggle = document.getElementById('dark-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (prefersDark) document.body.classList.add('dark');

  toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
  });

  // ── HERO VIDEO: play on first scroll, pause when idle ──────
  const heroVideo = document.getElementById('hero-video');
  let scrollTimer = null;
  let videoStarted = false;

  window.addEventListener('scroll', () => {
    if (!videoStarted) {
      videoStarted = true;
      heroVideo.play();
    }
    // keep playing while scrolling
    if (heroVideo.paused) heroVideo.play();
    clearTimeout(scrollTimer);
    // pause 800ms after scroll stops
    scrollTimer = setTimeout(() => {
      heroVideo.pause();
    }, 800);
  }, { passive: true });

  // ── BLANK OUT NUMBER VALUES until counter fires ────────────
  document.querySelectorAll('.number-value[data-target]').forEach(el => {
    el.textContent = '';
    el.closest('.number-card').style.opacity = '0';
  });

  // ── SCROLL REVEAL ──────────────────────────────────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal, .experience-entry, .pub-entry, .talk-entry')
    .forEach(el => revealObserver.observe(el));

  // ── NUMBER COUNTERS ────────────────────────────────────────
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.number-value[data-target]').forEach((el, i) => {
        setTimeout(() => animateCounter(el), i * 120);
      });
      counterObserver.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  const numbersSection = document.getElementById('numbers');
  if (numbersSection) counterObserver.observe(numbersSection);

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();
    const card = el.closest('.number-card');
    card.style.transition = 'opacity 0.4s ease';
    card.style.opacity = '1';

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      if (suffix === 'K') {
        el.textContent = current >= 1000
          ? (current / 1000).toFixed(1) + 'K'
          : current.toLocaleString();
      } else if (suffix === 'dec') {
        el.textContent = (current / 10).toFixed(1);
      } else {
        el.textContent = current.toLocaleString();
      }
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ── EMAIL PROTECTION ──────────────────────────────────────
  const e = document.getElementById('contact-email');
  if (e) {
    const u = 'nathan.day';
    const d = 'crick' + '.ac.uk';
    const link = document.createElement('a');
    link.href = 'mailto:' + u + '@' + d;
    link.textContent = u + '@' + d;
    e.appendChild(link);
  }

  // ── FOOTER DATE ────────────────────────────────────────────
  const footerDate = document.getElementById('footer-date');
  if (footerDate) {
    footerDate.textContent = 'Last updated: ' + new Date().toLocaleDateString('en-GB', {
      year: 'numeric', month: 'long'
    });
  }

  // ── STAGGERED CARD DELAYS ──────────────────────────────────
  document.querySelectorAll('.software-card, .cover-card').forEach((el, i) => {
    el.style.transitionDelay = (i * 40) + 'ms';
  });

});
