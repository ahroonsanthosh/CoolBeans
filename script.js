const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

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

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.menu__panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const panel = document.getElementById('tab-' + tab.dataset.tab);
    if (panel) {
      panel.classList.add('active');
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

(function initParticles() {
  const container = document.getElementById('particles');
  const canvas = document.createElement('canvas');
  canvas.id = 'particleCanvas';
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;
  function resize() { W = canvas.width = container.offsetWidth; H = canvas.height = container.offsetHeight; }
  resize();
  window.addEventListener('resize', resize, { passive: true });
  const COUNT = window.innerWidth < 640 ? 28 : 55;
  function rand(a, b) { return a + Math.random() * (b - a); }
  for (let i = 0; i < COUNT; i++) {
    particles.push({ x: rand(0,1), y: rand(0,1), r: rand(0.5,2), vx: rand(-0.06,0.06), vy: rand(-0.12,-0.04), a: rand(0.1,0.45), da: rand(0.002,0.005) * (Math.random() > 0.5 ? 1 : -1) });
  }
  function tick() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx / W * 60; p.y += p.vy / H * 60; p.a += p.da;
      if (p.a <= 0.05 || p.a >= 0.5) p.da *= -1;
      if (p.y < -0.02) { p.y = 1.02; p.x = rand(0,1); }
      if (p.x < -0.02) p.x = 1.02;
      if (p.x > 1.02) p.x = -0.02;
      ctx.beginPath();
      ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 134, 10, ${p.a})`;
      ctx.fill();
    });
    animId = requestAnimationFrame(tick);
  }
  const heroSection = document.getElementById('home');
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { if (!animId) tick(); }
    else { cancelAnimationFrame(animId); animId = null; }
  });
  obs.observe(heroSection);
  tick();
})();

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

const galleryImgs = document.querySelectorAll('.gallery__img');
if (window.matchMedia('(hover: hover)').matches) {
  window.addEventListener('scroll', () => {
    galleryImgs.forEach(img => {
      const rect = img.closest('.gallery__item').getBoundingClientRect();
      const mid = rect.top + rect.height / 2 - window.innerHeight / 2;
      img.style.transform = `translateY(${mid * 0.04}px)`;
    });
  }, { passive: true });
}

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
        setTimeout(() => { path.style.strokeDashoffset = '0'; }, i * 180);
      });
      chalkObs.disconnect();
    }
  }, { threshold: 0.3 });
  const frame = document.querySelector('.about__frame');
  if (frame) chalkObs.observe(frame);
})();