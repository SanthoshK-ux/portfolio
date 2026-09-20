/**
 * Milky Way Space Background
 * Dense multi-depth starfield + a soft diagonal galactic glow band (milky streak)
 * + drifting nebula color clouds. No grid, no connecting lines.
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

  // ---------- Milky Way band (soft diagonal galactic glow) ----------
  function drawMilkyBand(dark) {
    ctx.save();
    ctx.translate(width * 0.5, height * 0.42);
    ctx.rotate(-0.35); // diagonal tilt
    const bandLength = Math.max(width, height) * 1.6;
    const bandWidth = height * 0.55;

    const gradient = ctx.createLinearGradient(0, -bandWidth / 2, 0, bandWidth / 2);
    if (dark) {
      gradient.addColorStop(0, 'rgba(147, 197, 253, 0)');
      gradient.addColorStop(0.35, 'rgba(147, 197, 253, 0.05)');
      gradient.addColorStop(0.5, 'rgba(191, 219, 254, 0.09)');
      gradient.addColorStop(0.65, 'rgba(147, 197, 253, 0.05)');
      gradient.addColorStop(1, 'rgba(147, 197, 253, 0)');
    } else {
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0)');
      gradient.addColorStop(0.5, 'rgba(96, 165, 250, 0.06)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
    }

    ctx.filter = 'blur(28px)';
    ctx.fillStyle = gradient;
    ctx.fillRect(-bandLength / 2, -bandWidth / 2, bandLength, bandWidth);
    ctx.filter = 'none';
    ctx.restore();
  }

  // ---------- Nebula clouds (deep color glow) ----------
  function Nebula(opts) {
    this.baseX = opts.x;
    this.baseY = opts.y;
    this.radius = opts.radius;
    this.speedX = 0.00007 + Math.random() * 0.00005;
    this.speedY = 0.00006 + Math.random() * 0.00005;
    this.rangeX = 0.07 + Math.random() * 0.05;
    this.rangeY = 0.07 + Math.random() * 0.05;
    this.phase = Math.random() * Math.PI * 2;
    this.parallax = 0.008;
  }

  Nebula.prototype.pos = function (t, mx, my) {
    const x = (this.baseX + Math.sin(t * this.speedX + this.phase) * this.rangeX) * width
      + mx * this.parallax * width;
    const y = (this.baseY + Math.cos(t * this.speedY + this.phase) * this.rangeY) * height
      + my * this.parallax * height;
    return { x: x, y: y, r: this.radius * Math.max(width, height) };
  };

  const nebulas = [
    new Nebula({ x: 0.18, y: 0.22, radius: 0.5 }),
    new Nebula({ x: 0.82, y: 0.18, radius: 0.55 }),
    new Nebula({ x: 0.55, y: 0.82, radius: 0.48 }),
    new Nebula({ x: 0.3, y: 0.75, radius: 0.4 }),
  ];

  function getNebulaPalette() {
    const dark = isDarkTheme();
    if (dark) {
      return [
        'rgba(37, 99, 235, 0.18)',
        'rgba(129, 140, 248, 0.14)',
        'rgba(96, 165, 250, 0.16)',
        'rgba(167, 139, 250, 0.10)',
      ];
    }
    return [
      'rgba(59, 130, 246, 0.09)',
      'rgba(165, 180, 252, 0.08)',
      'rgba(147, 197, 253, 0.09)',
      'rgba(196, 181, 253, 0.06)',
    ];
  }

  // ---------- Star layers (parallax depth) ----------
  function Star(depth) {
    this.depth = depth;
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.radius = 0.35 + depth * 1.5 + Math.random() * 0.45;
    this.baseAlpha = 0.2 + depth * 0.55 + Math.random() * 0.15;
    this.twinkleSpeed = 0.008 + Math.random() * 0.022;
    this.twinklePhase = Math.random() * Math.PI * 2;
    this.driftSpeed = (0.008 + depth * 0.025) * (Math.random() > 0.5 ? 1 : -1);
  }

  function buildStars() {
    const stars = [];
    const layers = [
      { count: Math.floor((width * height) / 9000), depth: 0.12 },  // dense faint dust
      { count: Math.floor((width * height) / 24000), depth: 0.45 },
      { count: Math.floor((width * height) / 60000), depth: 0.85 },
    ];
    layers.forEach(function (layer) {
      for (let i = 0; i < layer.count; i++) {
        stars.push(new Star(layer.depth));
      }
    });
    return stars;
  }

  let stars = buildStars();

  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  window.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    mouse.targetX = ((e.clientX - rect.left) / width) * 2 - 1;
    mouse.targetY = ((e.clientY - rect.top) / height) * 2 - 1;
  });
  window.addEventListener('mouseleave', function () {
    mouse.targetX = 0;
    mouse.targetY = 0;
  });

  function render() {
    time++;
    mouse.x += (mouse.targetX - mouse.x) * 0.04;
    mouse.y += (mouse.targetY - mouse.y) * 0.04;

    ctx.clearRect(0, 0, width, height);
    const dark = isDarkTheme();

    // --- Nebula glow clouds ---
    ctx.globalCompositeOperation = 'lighter';
    ctx.filter = 'blur(85px)';
    const palette = getNebulaPalette();
    nebulas.forEach(function (n, i) {
      const p = n.pos(time, mouse.x, mouse.y);
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      gradient.addColorStop(0, palette[i % palette.length]);
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.filter = 'none';

    // --- Milky Way band ---
    drawMilkyBand(dark);
    ctx.globalCompositeOperation = 'source-over';

    // --- Star layers ---
    const starColor = dark ? '255, 255, 255' : '37, 99, 235';
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];

      s.x += s.driftSpeed * 0.05;
      if (s.x < 0) s.x = width;
      if (s.x > width) s.x = 0;

      const parallaxStrength = s.depth * 20;
      const px = s.x + mouse.x * parallaxStrength;
      const py = s.y + mouse.y * parallaxStrength;

      const twinkle = (Math.sin(time * s.twinkleSpeed + s.twinklePhase) + 1) / 2;
      const alpha = s.baseAlpha * (0.55 + twinkle * 0.45) * (dark ? 1 : 0.65);

      ctx.beginPath();
      ctx.fillStyle = `rgba(${starColor}, ${alpha})`;
      ctx.arc(px, py, s.radius, 0, Math.PI * 2);
      ctx.fill();

      if (s.depth > 0.7) {
        ctx.beginPath();
        const glow = ctx.createRadialGradient(px, py, 0, px, py, s.radius * 4);
        glow.addColorStop(0, `rgba(${starColor}, ${alpha * 0.35})`);
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glow;
        ctx.arc(px, py, s.radius * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

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
      stars = buildStars();
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
