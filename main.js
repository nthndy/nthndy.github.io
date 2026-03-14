document.addEventListener('DOMContentLoaded', () => {

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

    // fade card in as counter starts
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
  // Address is never a plain string in source — assembled at runtime
  const e = document.getElementById('contact-email');
  if (e) {
    const u = 'nathan.day';
    const d = 'crick' + '.ac.uk';
    const addr = u + '@' + d;
    const link = document.createElement('a');
    link.href = 'mailto:' + addr;
    link.textContent = addr;
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
