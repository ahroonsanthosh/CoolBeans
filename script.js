/* ── 3D SCROLL GALLERY ───────────────────────────── */
(function initScrollGallery() {
  const track    = document.getElementById('sgTrack');
  const sticky   = document.getElementById('sgSticky');
  const slides   = Array.from(document.querySelectorAll('.sg-slide'));
  const dots     = Array.from(document.querySelectorAll('.sg-dot'));
  const hint     = document.getElementById('sgHint');
  const ctaGroup = document.getElementById('sgCta');
  const continueEl = document.getElementById('sgContinue');

  if (!track) return;

  const TOTAL    = slides.length;           // 5
  const PER_SLIDE = 1 / TOTAL;             // fraction of track per slide
  let current    = 0;
  let transitioning = false;

  function setSlide(idx, direction) {
    if (idx === current && !direction) return;
    const prev = current;
    current = Math.max(0, Math.min(TOTAL - 1, idx));

    slides[prev].classList.remove('active');
    slides[prev].classList.add('exit');
    setTimeout(() => slides[prev].classList.remove('exit'), 900);

    slides[current].classList.add('active');

    dots.forEach((d, i) => d.classList.toggle('active', i === current));

    // Show CTA on last slide
    ctaGroup.classList.toggle('visible', current === TOTAL - 1);

    // Show continue arrow on last slide
    continueEl.classList.toggle('visible', current === TOTAL - 1);

    // Hide scroll hint after first advance
    if (current > 0) hint.classList.add('hidden');
  }

  function onScroll() {
    const rect     = track.getBoundingClientRect();
    const trackH   = track.offsetHeight - window.innerHeight;
    const scrolled = -rect.top;                    // how far into the track
    const progress = Math.max(0, Math.min(1, scrolled / trackH));
    const rawIdx   = Math.floor(progress * TOTAL);
    const clampIdx = Math.min(rawIdx, TOTAL - 1);

    if (clampIdx !== current) setSlide(clampIdx);
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Dot click: scroll to that slide's position
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      const trackH  = track.offsetHeight - window.innerHeight;
      const target  = track.offsetTop + (trackH * (i / TOTAL)) + 10;
      window.scrollTo({ top: target, behavior: 'smooth' });
    });
  });

  // Continue arrow: jump past the track
  continueEl.addEventListener('click', () => {
    const target = track.offsetTop + track.offsetHeight;
    window.scrollTo({ top: target, behavior: 'smooth' });
  });

  // Init first slide visible
  slides[0].classList.add('active');
})();

/* ── NAV SCROLL EFFECT ───────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── MOBILE BURGER ───────────────────────────────── */
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ── SCROLL REVEAL ───────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

/* ── MENU TABS ───────────────────────────────────── */
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.menu__panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const panel = document.getElementById('tab-' + tab.dataset.tab);
    if (panel) {
      panel.classList.add('active');
      // Re-trigger reveal for newly shown items
      panel.querySelectorAll('.menu-item').forEach((item, i) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(12px)';
        setTimeout(() => {
          item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, i * 18);
      });
    }
  });
});


/* ── SMOOTH ANCHOR OFFSET ────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = nav.offsetHeight + 8;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── GALLERY PARALLAX (subtle) ───────────────────── */
const galleryImgs = document.querySelectorAll('.gallery__img');
if (window.matchMedia('(hover: hover)').matches) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    galleryImgs.forEach(img => {
      const rect = img.closest('.gallery__item').getBoundingClientRect();
      const mid = rect.top + rect.height / 2 - window.innerHeight / 2;
      img.style.transform = `translateY(${mid * 0.04}px)`;
    });
  }, { passive: true });
}

/* ── CHALKBOARD DRAW ANIMATION ───────────────────── */
(function animateChalkSVG() {
  const paths = document.querySelectorAll('.chalk-art svg path, .chalk-art svg ellipse, .chalk-art svg circle');
  paths.forEach(path => {
    if (path.getTotalLength) {
      try {
        const len = path.getTotalLength();
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = len;
        path.style.transition = 'stroke-dashoffset 2.5s cubic-bezier(0.4,0,0.2,1)';
      } catch(e) {}
    }
  });

  const chalkObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      paths.forEach((path, i) => {
        setTimeout(() => {
          path.style.strokeDashoffset = '0';
        }, i * 180);
      });
      chalkObs.disconnect();
    }
  }, { threshold: 0.3 });

  const frame = document.querySelector('.about__frame');
  if (frame) chalkObs.observe(frame);
})();
