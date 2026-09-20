/**
 * Ultimate 3D Milky Way Space Background
 * - Multi-depth parallax starfield (mouse + slow auto drift, feels like flying through space)
 * - Soft diagonal galactic band
 * - Glowing galaxy core
 * - Occasional shooting stars for wow-factor
 * No grid, no connecting lines.
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

  // ---------- Galaxy core glow ----------
  function drawGalaxyCore(dark, driftX, driftY) {
    const cx = width * 0.78 + driftX * 14;
    const cy = height * 0.32 + driftY * 14;
    const r = Math.max(width, height) * 0.32;

    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    if (dark) {
      gradient.addColorStop(0, 'rgba(219, 234, 254, 0.16)');
      gradient.addColorStop(0.3, 'rgba(147, 197, 253, 0.10)');
      gradient.addColorStop(0.6, 'rgba(96, 165, 250, 0.05)');
      gradient.addColorStop(1, 'rgba(96, 165, 250, 0)');
    } else {
      gradient.addColorStop(0, 'rgba(219, 234, 254, 0.22)');
      gradient.addColorStop(0.4, 'rgba(147, 197, 253, 0.10)');
      gradient.addColorStop(1, 'rgba(147, 197, 253, 0)');
    }
    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // ---------- Milky Way diagonal band ----------
  function drawMilkyBand(dark, driftX, driftY) {
    ctx.save();
    ctx.translate(width * 0.5 + driftX * 6, height * 0.42 + driftY * 6);
    ctx.rotate(-0.35);
    const bandLength = Math.max(width, height) * 1.7;
    const bandWidth = height * 0.58;

    const gradient = ctx.createLinearGradient(0, -bandWidth / 2, 0, bandWidth / 2);
    if (dark) {
      gradient.addColorStop(0, 'rgba(147, 197, 253, 0)');
      gradient.addColorStop(0.35, 'rgba(147, 197, 253, 0.05)');
      gradient.addColorStop(0.5, 'rgba(199, 210, 254, 0.10)');
      gradient.addColorStop(0.65, 'rgba(147, 197, 253, 0.05)');
      gradient.addColorStop(1, 'rgba(147, 197, 253, 0)');
    } else {
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0)');
      gradient.addColorStop(0.5, 'rgba(96, 165, 250, 0.07)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
    }

    ctx.filter = 'blur(30px)';
    ctx.fillStyle = gradient;
    ctx.fillRect(-bandLength / 2, -bandWidth / 2, bandLength, bandWidth);
    ctx.filter = 'none';
    ctx.restore();
  }

  // ---------- Nebula clouds ----------
  function Nebula(opts) {
    this.baseX = opts.x;
    this.baseY = opts.y;
    this.radius = opts.radius;
    this.speedX = 0.00007 + Math.random() * 0.00005;
    this.speedY = 0.00006 + Math.random() * 0.00005;
    this.rangeX = 0.07 + Math.random() * 0.05;
    this.rangeY = 0.07 + Math.random() * 0.05;
    this.phase = Math.random() * Math.PI * 2;
    this.parallax = 0.009;
  }

  Nebula.prototype.pos = function (t, mx, my) {
    const x = (this.baseX + Math.sin(t * this.speedX + this.phase) * this.rangeX) * width
      + mx * this.parallax * width;
    const y = (this.baseY + Math.cos(t * this.speedY + this.phase) * this.rangeY) * height
      + my * this.parallax * height;
    return { x: x, y: y, r: this.radius * Math.max(width, height) };
  };

  const nebulas = [
    new Nebula({ x: 0.16, y: 0.24, radius: 0.5 }),
    new Nebula({ x: 0.85, y: 0.16, radius: 0.5 }),
    new Nebula({ x: 0.55, y: 0.85, radius: 0.48 }),
    new Nebula({ x: 0.28, y: 0.78, radius: 0.4 }),
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

  // ---------- Star layers (parallax depth, "flying through space" drift) ----------
  function Star(depth) {
    this.depth = depth; // 0 far -> 1 near
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.radius = 0.35 + depth * 1.6 + Math.random() * 0.5;
    this.baseAlpha = 0.2 + depth * 0.55 + Math.random() * 0.15;
    this.twinkleSpeed = 0.008 + Math.random() * 0.022;
    this.twinklePhase = Math.random() * Math.PI * 2;
  }

  function buildStars() {
    const stars = [];
    const layers = [
      { count: Math.floor((width * height) / 9000), depth: 0.12 },
      { count: Math.floor((width * height) / 24000), depth: 0.45 },
      { count: Math.floor((width * height) / 60000), depth: 0.85 },
    ];
    layers.forEach(function (layer) {
      for (let i = 0; i < layer.count; i++) {
        stars.push(new Star(layer.depth));
      }
    });

    // Dense dust cluster concentrated along the diagonal milky band for authentic look
    const bandDustCount = Math.floor((width * height) / 6000);
    for (let i = 0; i < bandDustCount; i++) {
      const s = new Star(0.08 + Math.random() * 0.15);
      // Bias position toward the diagonal band (y = 0.42h line, tilted)
      const t = Math.random();
      const alongX = t * width;
      const bandCenterY = height * 0.42 - (alongX - width * 0.5) * Math.tan(0.35);
      const spread = (Math.random() - 0.5) * height * 0.32;
      s.x = alongX;
      s.y = bandCenterY + spread;
      s.radius *= 0.7;
      stars.push(s);
    }

    return stars;
  }

  let stars = buildStars();

  // ---------- Shooting stars ----------
  const shootingStars = [];
  function spawnShootingStar() {
    const startX = Math.random() * width * 0.9 + width * 0.05;
    const startY = Math.random() * height * 0.4;
    const angle = (Math.PI / 4) + (Math.random() * 0.5 - 0.25); // varied diagonal
    const speed = 8 + Math.random() * 9;
    const size = 0.9 + Math.random() * 1.2;
    shootingStars.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0,
      maxLife: 35 + Math.random() * 25,
      length: 80 + Math.random() * 90,
      size: size,
    });
  }

  let nextShootIn = 40 + Math.random() * 60;

  // ---------- Mouse parallax + slow auto drift ----------
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

    // Slow autonomous drift, like a ship gliding through space, layered on top of mouse parallax
    const autoDriftX = Math.sin(time * 0.0006) * 1;
    const autoDriftY = Math.cos(time * 0.0004) * 1;
    const driftX = mouse.x + autoDriftX;
    const driftY = mouse.y + autoDriftY;

    ctx.clearRect(0, 0, width, height);
    const dark = isDarkTheme();

    // --- Nebula clouds ---
    ctx.globalCompositeOperation = 'lighter';
    ctx.filter = 'blur(85px)';
    const palette = getNebulaPalette();
    nebulas.forEach(function (n, i) {
      const p = n.pos(time, driftX, driftY);
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      gradient.addColorStop(0, palette[i % palette.length]);
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.filter = 'none';

    // --- Galaxy core + Milky band ---
    drawGalaxyCore(dark, driftX, driftY);
    drawMilkyBand(dark, driftX, driftY);
    ctx.globalCompositeOperation = 'source-over';

    // --- Star layers with parallax depth ---
    const starColor = dark ? '255, 255, 255' : '37, 99, 235';
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];

      const parallaxStrength = s.depth * 26;
      const px = s.x + driftX * parallaxStrength;
      const py = s.y + driftY * parallaxStrength;

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

    // --- Shooting stars ---
    nextShootIn--;
    if (nextShootIn <= 0) {
      spawnShootingStar();
      if (Math.random() > 0.6) spawnShootingStar(); // occasional double
      nextShootIn = 45 + Math.random() * 70;
    }

    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const sh = shootingStars[i];
      sh.x += sh.vx;
      sh.y += sh.vy;
      sh.life++;

      const progress = sh.life / sh.maxLife;
      const fade = progress < 0.15 ? progress / 0.15 : 1 - (progress - 0.15) / 0.85;
      const tailX = sh.x - sh.vx * (sh.length / (Math.hypot(sh.vx, sh.vy) || 1));
      const tailY = sh.y - sh.vy * (sh.length / (Math.hypot(sh.vx, sh.vy) || 1));

      const grad = ctx.createLinearGradient(sh.x, sh.y, tailX, tailY);
      grad.addColorStop(0, `rgba(${starColor}, ${0.9 * fade})`);
      grad.addColorStop(1, `rgba(${starColor}, 0)`);

      ctx.beginPath();
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.4 * sh.size;
      ctx.moveTo(sh.x, sh.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();

      // Bright head with soft glow
      ctx.beginPath();
      const headGlow = ctx.createRadialGradient(sh.x, sh.y, 0, sh.x, sh.y, 6 * sh.size);
      headGlow.addColorStop(0, `rgba(${starColor}, ${fade})`);
      headGlow.addColorStop(1, `rgba(${starColor}, 0)`);
      ctx.fillStyle = headGlow;
      ctx.arc(sh.x, sh.y, 6 * sh.size, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = `rgba(${starColor}, ${fade})`;
      ctx.arc(sh.x, sh.y, 1.6 * sh.size, 0, Math.PI * 2);
      ctx.fill();

      if (sh.life >= sh.maxLife || sh.x > width + 100 || sh.y > height + 100) {
        shootingStars.splice(i, 1);
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
