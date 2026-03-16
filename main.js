document.addEventListener('DOMContentLoaded', () => {
  
  window.addEventListener('message', (e) => {
    if (e.data?.type !== 'plotReady') return;
    try {
      const iframeWindow = modalIframe.contentWindow;
      iframeWindow.Plotly.Plots.resize(
        iframeWindow.document.getElementById('plot-1H')
      );
    } catch(err) {}
  });
  // ── DARK MODE ──────────────────────────────────────────────
  const toggle = document.getElementById('dark-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (prefersDark) document.body.classList.add('dark');

  toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
  });

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

  // ── FIGURE MODAL ───────────────────────────────────────────
  // Build modal DOM once and reuse it
  const backdrop = document.createElement('div');
  backdrop.className = 'fig-modal-backdrop';
  backdrop.innerHTML = `
    <div class="fig-modal" role="dialog" aria-modal="true">
      <div class="fig-modal-header">
        <span class="fig-modal-label">Interactive Figure · macrohet_worldwide</span>
        <button class="fig-modal-close" aria-label="Close figure">✕</button>
      </div>
      <div class="fig-modal-iframe-wrap">
        <div class="fig-modal-loading">loading figure…</div>
        <iframe id="fig-modal-iframe" title="Interactive figure"></iframe>
      </div>
      <div class="fig-modal-caption"></div>
    </div>`;
  document.body.appendChild(backdrop);

  const modalIframe   = backdrop.querySelector('#fig-modal-iframe');
  const modalCaption  = backdrop.querySelector('.fig-modal-caption');
  const modalLoading  = backdrop.querySelector('.fig-modal-loading');
  const modalClose    = backdrop.querySelector('.fig-modal-close');

  function openModal(url, caption) {
    // Show loading state
    modalLoading.classList.remove('hidden');
    modalIframe.src = '';

    // Populate caption
    modalCaption.innerHTML = `
      <strong>Fig. 1H · macrohet</strong>
      ${caption}
      <a href="https://nthndy.github.io/macrohet_worldwide/#F1H" target="_blank">
        Open full interactive manuscript →
      </a>`;

    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Load iframe — use hash to hint scroll position
    modalIframe.src = url;

    modalIframe.onload = () => {
      // Same-origin: reach into the manuscript and strip noise
      try {
        const doc = modalIframe.contentDocument;

        // Dismiss mobile warning if present
        const warn = doc.getElementById('mobile-warning');
        if (warn) warn.style.display = 'none';

        // Hide everything in <article> except the target figure container
        const article = doc.querySelector('article.scientific-paper');
        if (article) {
          // Hide all direct section children except the one containing F1H
          article.querySelectorAll('section, header, figure').forEach(el => {
            if (!el.contains(doc.getElementById('F1H'))) {
              el.style.display = 'none';
            }
          });
        }

        // Hide sidebar TOC
        const sidebar = doc.getElementById('sidebar-toc');
        if (sidebar) sidebar.style.display = 'none';

        // Scroll the figure into view inside the iframe
        const target = doc.getElementById('F1H');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      } catch (e) {
        // Cross-origin fallback — just show the page as-is
        console.warn('Figure modal: same-origin access failed', e);
      }

      modalLoading.classList.add('hidden');
    };
  }

  function closeModal() {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
    // Delay src clear until after transition
    setTimeout(() => { modalIframe.src = ''; }, 280);
  }

  // Close on button or backdrop click
  modalClose.addEventListener('click', closeModal);
  backdrop.addEventListener('click', e => {
    if (e.target === backdrop) closeModal();
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && backdrop.classList.contains('open')) closeModal();
  });

  // Wire up clickable cards
  document.querySelectorAll('.number-card[data-plot-url]').forEach(card => {
    card.addEventListener('click', () => {
      openModal(card.dataset.plotUrl, card.dataset.plotCaption || '');
    });
  });

});
