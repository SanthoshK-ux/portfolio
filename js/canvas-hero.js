/**
 * Premium Glowing Gradient Mesh Background
 * Smooth, slow-moving glowing color orbs blended into a soft mesh — no particles, no lines, no grid.
 * Adapts dynamically between Executive Light & Slate Dark themes!
 */

(function () {
  'use strict';

  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);
  let time = 0;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function isDarkTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  // Each "orb" is a soft glowing light source that drifts slowly and blends into a mesh
  function Orb(opts) {
    this.baseX = opts.x;
    this.baseY = opts.y;
    this.speedX = 0.00016 + Math.random() * 0.0001;
    this.speedY = 0.00013 + Math.random() * 0.0001;
    this.rangeX = 0.22 + Math.random() * 0.12;
    this.rangeY = 0.22 + Math.random() * 0.12;
    this.radius = opts.radius;
    this.phase = Math.random() * Math.PI * 2;
    this.pulseSpeed = 0.006 + Math.random() * 0.004;
  }

  Orb.prototype.pos = function (t) {
    const x = (this.baseX + Math.sin(t * this.speedX + this.phase) * this.rangeX) * width;
    const y = (this.baseY + Math.cos(t * this.speedY + this.phase) * this.rangeY) * height;
    const pulse = (Math.sin(t * this.pulseSpeed + this.phase) + 1) / 2; // 0..1
    const r = this.radius * Math.max(width, height) * (0.9 + pulse * 0.18);
    return { x: x, y: y, r: r };
  };

  const orbs = [
    new Orb({ x: 0.18, y: 0.28, radius: 0.42 }),
    new Orb({ x: 0.82, y: 0.22, radius: 0.5 }),
    new Orb({ x: 0.65, y: 0.75, radius: 0.4 }),
    new Orb({ x: 0.28, y: 0.8, radius: 0.36 }),
    new Orb({ x: 0.5, y: 0.5, radius: 0.32 }),
  ];

  function getPalette() {
    const dark = isDarkTheme();
    if (dark) {
      return [
        'rgba(37, 99, 235, 0.38)',
        'rgba(96, 165, 250, 0.30)',
        'rgba(129, 140, 248, 0.26)',
        'rgba(59, 130, 246, 0.30)',
        'rgba(30, 64, 175, 0.34)',
      ];
    }
    return [
      'rgba(59, 130, 246, 0.18)',
      'rgba(147, 197, 253, 0.20)',
      'rgba(165, 180, 252, 0.16)',
      'rgba(96, 165, 250, 0.16)',
      'rgba(37, 99, 235, 0.12)',
    ];
  }

  function render() {
    time++;
    ctx.clearRect(0, 0, width, height);
    const palette = getPalette();

    // Heavy blur so orbs blend into a smooth, glowing mesh
    ctx.filter = 'blur(70px)';
    ctx.globalCompositeOperation = 'lighter';

    orbs.forEach(function (orb, i) {
      const p = orb.pos(time);
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      gradient.addColorStop(0, palette[i % palette.length]);
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.filter = 'none';
    ctx.globalCompositeOperation = 'source-over';

    if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(render);
    }
  }

  let resizeTimeout;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      if (prefersReducedMotion) render();
    }, 200);
  });

  if (!prefersReducedMotion) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            if (!animationFrameId) render();
          } else {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);
  } else {
    render();
  }
})();
