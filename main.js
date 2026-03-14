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
        entry.target.querySelectorAll('.number-value[data-target]').forEach(el => {
          animateCounter(el);
        });
        counterObserver.unobserve(entry.target);
      });
    }, { threshold: 0.3 });

    const numbersSection = document.getElementById('numbers');
    if (numbersSection) counterObserver.observe(numbersSection);

    function animateCounter(el) {
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();

      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);

        if (suffix === 'M') {
          el.textContent = (current / 1000000).toFixed(1) + 'M';
        } else if (suffix === 'K') {
          el.textContent = current >= 1000
            ? (current / 1000).toFixed(1) + 'K'
            : current.toLocaleString();
        } else if (suffix === 'dec') {
          // stored as integer × 10, display as X.X
          el.textContent = (current / 10).toFixed(1);
        } else {
          el.textContent = current.toLocaleString();
        }

        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    // ── FOOTER DATE ────────────────────────────────────────────
    document.getElementById('footer-date').textContent =
      'Last updated: ' + new Date().toLocaleDateString('en-GB', {
        year: 'numeric', month: 'long'
      });

    // ── SCROLL VIDEO ───────────────────────────────────────────
    const scrollVideo = document.getElementById('scroll-video');
    const scrollSection = document.getElementById('scroll-video-section');

    if (scrollVideo && scrollSection) {
      scrollVideo.addEventListener('loadedmetadata', () => {
        window.addEventListener('scroll', () => {
          const rect = scrollSection.getBoundingClientRect();
          const sectionHeight = scrollSection.offsetHeight - window.innerHeight;
          const scrolled = -rect.top;
          const progress = Math.max(0, Math.min(1, scrolled / sectionHeight));
          scrollVideo.currentTime = progress * scrollVideo.duration;
        }, { passive: true });
      });
    }

    // ── STAGGERED ENTRY DELAYS ─────────────────────────────────
    document.querySelectorAll('.software-card, .cover-card, .number-card').forEach((el, i) => {
      el.style.transitionDelay = (i * 40) + 'ms';
    });

