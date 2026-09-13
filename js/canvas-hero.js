/**
 * Subtle Abstract Data Network Background Canvas
 * Concept: Data points -> Connections -> Analytics -> Machine Learning
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

  // Check user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const particles = [];
  const maxParticles = Math.min(Math.floor(window.innerWidth / 25), 48);
  const connectionDistance = 140;

  function isDarkTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  // Particle constructor
  function Particle() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.45;
    this.vy = (Math.random() - 0.5) * 0.45;
    this.radius = Math.random() * 2 + 1.5;
    this.isHub = Math.random() > 0.8;
  }

  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0) this.x = width;
    else if (this.x > width) this.x = 0;

    if (this.y < 0) this.y = height;
    else if (this.y > height) this.y = 0;
  };

  Particle.prototype.draw = function () {
    const dark = isDarkTheme();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.isHub ? this.radius + 1.5 : this.radius, 0, Math.PI * 2);
    if (this.isHub) {
      ctx.fillStyle = dark ? 'rgba(96, 165, 250, 0.85)' : 'rgba(37, 99, 235, 0.65)';
    } else {
      ctx.fillStyle = dark ? 'rgba(147, 197, 253, 0.45)' : 'rgba(147, 197, 253, 0.55)';
    }
    ctx.fill();
  };

  // Initialize particles
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }

  // Mouse interaction
  let mouse = { x: null, y: null, radius: 120 };
  window.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener('mouseleave', function () {
    mouse.x = null;
    mouse.y = null;
  });

  function render() {
    ctx.clearRect(0, 0, width, height);
    const dark = isDarkTheme();

    // Draw connecting edges
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const alpha = (1 - dist / connectionDistance) * (dark ? 0.28 : 0.22);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = dark
            ? `rgba(96, 165, 250, ${alpha})`
            : `rgba(37, 99, 235, ${alpha})`;
          ctx.lineWidth = particles[i].isHub || particles[j].isHub ? 1.2 : 0.8;
          ctx.stroke();
        }
      }

      // Connect to mouse gently
      if (mouse.x !== null && mouse.y !== null) {
        const mdx = particles[i].x - mouse.x;
        const mdy = particles[i].y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < mouse.radius) {
          const mAlpha = (1 - mdist / mouse.radius) * 0.4;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = dark
            ? `rgba(147, 197, 253, ${mAlpha})`
            : `rgba(29, 78, 216, ${mAlpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      particles[i].update();
      particles[i].draw();
    }

    animationFrameId = requestAnimationFrame(render);
  }

  // Handle window resizing smoothly
  let resizeTimeout;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, 200);
  });

  // Pause canvas when out of view
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
})();
