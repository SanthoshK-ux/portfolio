/**
 * Animated Gradient Mesh Background
 * Smooth, slow-moving color waves (mesh gradient style) — no particles, no grid lines.
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

  // Check user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function isDarkTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  // Each "blob" is a soft moving light source that blends into a mesh gradient
  function Blob() {
    this.baseX = Math.random();
    this.baseY = Math.random();
    this.speedX = 0.00018 + Math.random() * 0.00012;
    this.speedY = 0.00015 + Math.random() * 0.00012;
    this.rangeX = 0.28 + Math.random() * 0.14;
    this.rangeY = 0.28 + Math.random() * 0.14;
    this.radius = 0.42 + Math.random() * 0.22;
    this.phase = Math.random() * Math.PI * 2;
  }

  Blob.prototype.pos = function (t) {
    const x = (this.baseX + Math.sin(t * this.speedX + this.phase) * this.rangeX) * width;
    const y = (this.baseY + Math.cos(t * this.speedY + this.phase) * this.rangeY) * height;
    return { x: x, y: y, r: this.radius * Math.max(width, height) };
  };

  const blobs = [new Blob(), new Blob(), new Blob(), new Blob()];

  // Color palettes per blob, tuned per theme
  function getPalette() {
    const dark = isDarkTheme();
    if (dark) {
      return [
        'rgba(37, 99, 235, 0.32)',   // blue
        'rgba(96, 165, 250, 0.26)',  // light blue
        'rgba(30, 64, 175, 0.28)',   // deep blue
        'rgba(129, 140, 248, 0.20)', // indigo
      ];
    }
    return [
      'rgba(59, 130, 246, 0.16)',
      'rgba(147, 197, 253, 0.18)',
      'rgba(37, 99, 235, 0.12)',
      'rgba(165, 180, 252, 0.14)',
    ];
  }

  function render() {
    time++;
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'source-over';
    const palette = getPalette();

    // Soft blur for smooth mesh-like blending across the canvas
    ctx.filter = 'blur(60px)';

    blobs.forEach(function (blob, i) {
      const p = blob.pos(time);
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      gradient.addColorStop(0, palette[i % palette.length]);
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.filter = 'none';

    if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(render);
    }
  }

  // Handle window resizing smoothly
  let resizeTimeout;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      if (prefersReducedMotion) render();
    }, 200);
  });

  // Pause canvas when out of view (skip if reduced motion, since it's already static)
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
