/* ============================================================
   Anand V Portfolio — Interactive JavaScript
   Particle animation, typed text, scroll animations, counters
   ============================================================ */

(function () {
  'use strict';

  // ─── PARTICLE BACKGROUND ───────────────────────────────────
  const canvas = document.getElementById('heroParticles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;
    let w, h;

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }

    function createParticles() {
      particles = [];
      const count = Math.min(Math.floor((w * h) / 12000), 100);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 1.5 + 0.5,
          alpha: Math.random() * 0.4 + 0.1,
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, w, h);

      // Draw particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124, 58, 237, ${p.alpha})`;
        ctx.fill();
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(124, 58, 237, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(drawParticles);
    }

    resize();
    createParticles();
    drawParticles();

    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });

    // Pause when hero is not visible for performance
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!animId) drawParticles();
        } else {
          cancelAnimationFrame(animId);
          animId = null;
        }
      },
      { threshold: 0.1 }
    );
    heroObserver.observe(document.getElementById('hero'));
  }

  // ─── TYPED TEXT ANIMATION ──────────────────────────────────
  const typedEl = document.getElementById('typedText');
  if (typedEl) {
    const phrases = [
      'scalable web architectures.',
      'beautiful user interfaces.',
      'micro front-end systems.',
      'CI/CD pipelines.',
      'AI-powered solutions.',
      'geospatial dashboards.',
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let timeout;

    function typeStep() {
      const current = phrases[phraseIdx];

      if (!isDeleting) {
        typedEl.textContent = current.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx === current.length) {
          isDeleting = true;
          timeout = setTimeout(typeStep, 2000); // pause before deleting
          return;
        }
        timeout = setTimeout(typeStep, 60 + Math.random() * 40);
      } else {
        typedEl.textContent = current.substring(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
          isDeleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          timeout = setTimeout(typeStep, 400);
          return;
        }
        timeout = setTimeout(typeStep, 30);
      }
    }

    setTimeout(typeStep, 800);
  }

  // ─── SCROLL ANIMATIONS (Intersection Observer) ────────────
  const animElements = document.querySelectorAll('.anim-fade-up');

  if (animElements.length > 0) {
    const scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            scrollObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    animElements.forEach((el) => scrollObserver.observe(el));
  }

  // ─── COUNTER ANIMATION ────────────────────────────────────
  const counters = document.querySelectorAll('[data-count]');

  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.count, 10);
            const duration = 1500;
            const start = performance.now();

            function updateCounter(now) {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              // Ease out cubic
              const eased = 1 - Math.pow(1 - progress, 3);
              el.textContent = Math.round(eased * target);

              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              }
            }

            requestAnimationFrame(updateCounter);
            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((el) => counterObserver.observe(el));
  }

  // ─── NAVIGATION ───────────────────────────────────────────
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  // Scroll detection for nav background
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
    lastScroll = scrollY;
  });

  // Mobile toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('is-open');
      navToggle.classList.toggle('is-active');
    });

    // Close nav on link click
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.classList.remove('is-active');
      });
    });
  }

  // ─── ACTIVE NAV LINK HIGHLIGHTING ────────────────────────
  const sections = document.querySelectorAll('.section, .hero');
  const navLinkElements = document.querySelectorAll('.nav__links a:not(.nav__cta)');

  if (sections.length > 0 && navLinkElements.length > 0) {
    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinkElements.forEach((link) => {
              link.classList.toggle(
                'is-active',
                link.getAttribute('href') === `#${id}`
              );
            });
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72}px 0px 0px 0px`,
      }
    );

    sections.forEach((section) => activeObserver.observe(section));
  }

  // ─── SMOOTH SCROLL FOR ANCHOR LINKS ───────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();
