/* ── 3D SCROLL GALLERY ─────────────────────────────────── */
(function initScrollGallery() {
  const track    = document.getElementById('sgTrack');
  const slides   = Array.from(document.querySelectorAll('.sg-slide'));
  const dots     = Array.from(document.querySelectorAll('.sg-dot'));
  const hint     = document.getElementById('sgHint');
  const ctaGroup = document.getElementById('sgCta');
  const continueEl = document.getElementById('sgContinue');
  if (!track) return;
  const TOTAL = slides.length;
  let current = 0;

  function setSlide(idx) {
    if (idx === current) return;
    const prev = current;
    current = Math.max(0, Math.min(TOTAL - 1, idx));
    slides[prev].classList.remove('active');
    slides[prev].classList.add('exit');
    setTimeout(() => slides[prev].classList.remove('exit'), 900);
    slides[current].classList.add('active');
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    ctaGroup.classList.toggle('visible', current === TOTAL - 1);
    continueEl.classList.toggle('visible', current === TOTAL - 1);
    if (current > 0) hint.classList.add('hidden');
  }

  function onScroll() {
    const rect    = track.getBoundingClientRect();
    const trackH  = track.offsetHeight - window.innerHeight;
    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / trackH));
    const idx = Math.min(Math.floor(progress * TOTAL), TOTAL - 1);
    if (idx !== current) setSlide(idx);
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      const trackH = track.offsetHeight - window.innerHeight;
      window.scrollTo({ top: track.offsetTop + (trackH * (i / TOTAL)) + 10, behavior: 'smooth' });
    });
  });

  continueEl.addEventListener('click', () => {
    window.scrollTo({ top: track.offsetTop + track.offsetHeight, behavior: 'smooth' });
  });

  slides[0].classList.add('active');
})();

/* ── NAV ────────────────────────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => { burger.classList.toggle('open'); navLinks.classList.toggle('open'); });
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { burger.classList.remove('open'); navLinks.classList.remove('open'); }));

/* ── SCROLL REVEAL ───────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); } });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

/* ── MENU TABS ────────────────────────────────────────────── */
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.menu__panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const panel = document.getElementById('tab-' + tab.dataset.tab);
    if (panel) {
      panel.classList.add('active');
      panel.querySelectorAll('.menu-item').forEach((item, i) => {
        item.style.opacity = '0'; item.style.transform = 'translateY(12px)';
        setTimeout(() => { item.style.transition = 'opacity 0.4s ease, transform 0.4s ease'; item.style.opacity = '1'; item.style.transform = 'translateY(0)'; }, i * 18);
      });
    }
  });
});

/* ── SMOOTH ANCHORS ───────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - nav.offsetHeight - 8, behavior: 'smooth' });
  });
});

/* ── GALLERY PARALLAX ────────────────────────────────────── */
const galleryImgs = document.querySelectorAll('.gallery__img');
if (window.matchMedia('(hover: hover)').matches) {
  window.addEventListener('scroll', () => {
    galleryImgs.forEach(img => {
      const rect = img.closest('.gallery__item').getBoundingClientRect();
      img.style.transform = `translateY(${(rect.top + rect.height / 2 - window.innerHeight / 2) * 0.04}px)`;
    });
  }, { passive: true });
}

/* ── CHALK SVG DRAW ────────────────────────────────────────── */
(function() {
  const paths = document.querySelectorAll('.chalk-art svg path, .chalk-art svg ellipse, .chalk-art svg circle');
  paths.forEach(p => { try { const l = p.getTotalLength(); p.style.strokeDasharray = l; p.style.strokeDashoffset = l; p.style.transition = 'stroke-dashoffset 2.5s cubic-bezier(0.4,0,0.2,1)'; } catch(e) {} });
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { paths.forEach((p, i) => setTimeout(() => p.style.strokeDashoffset = '0', i * 180)); obs.disconnect(); }
  }, { threshold: 0.3 });
  const frame = document.querySelector('.about__frame');
  if (frame) obs.observe(frame);
})();