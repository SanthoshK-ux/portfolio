/**
 * Premium Abstract Data Network Background Canvas
 * Soft glow, pulsing hub nodes, gradient connections, elegant slow motion.
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
  if (prefersReducedMotion) return;

  const particles = [];
  const maxParticles = Math.min(Math.floor(window.innerWidth / 28), 42);
  const connectionDistance = 150;

  function isDarkTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  // Particle constructor
  function Particle() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.22;
    this.vy = (Math.random() - 0.5) * 0.22;
    this.radius = Math.random() * 1.8 + 1.3;
    this.isHub = Math.random() > 0.82;
    this.pulseOffset = Math.random() * Math.PI * 2;
    this.pulseSpeed = 0.015 + Math.random() * 0.01;
  }

  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < -20) this.x = width + 20;
    else if (this.x > width + 20) this.x = -20;

    if (this.y < -20) this.y = height + 20;
    else if (this.y > height + 20) this.y = -20;
  };

  Particle.prototype.draw = function () {
    const dark = isDarkTheme();
    const pulse = this.isHub ? (Math.sin(time * this.pulseSpeed + this.pulseOffset) + 1) / 2 : 0;
    const baseRadius = this.isHub ? this.radius + 2 + pulse * 1.8 : this.radius;

    if (this.isHub) {
      // Soft outer glow for hub nodes
      const glowRadius = baseRadius * 5;
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowRadius);
      const glowAlpha = dark ? 0.22 + pulse * 0.14 : 0.16 + pulse * 0.1;
      if (dark) {
        gradient.addColorStop(0, `rgba(96, 165, 250, ${glowAlpha})`);
        gradient.addColorStop(1, 'rgba(96, 165, 250, 0)');
      } else {
        gradient.addColorStop(0, `rgba(37, 99, 235, ${glowAlpha})`);
        gradient.addColorStop(1, 'rgba(37, 99, 235, 0)');
      }
      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.arc(this.x, this.y, glowRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(this.x, this.y, baseRadius, 0, Math.PI * 2);
    if (this.isHub) {
      ctx.fillStyle = dark ? 'rgba(147, 197, 253, 0.95)' : 'rgba(37, 99, 235, 0.85)';
    } else {
      ctx.fillStyle = dark ? 'rgba(147, 197, 253, 0.42)' : 'rgba(147, 197, 253, 0.55)';
    }
    ctx.fill();
  };

  // Initialize particles
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }

  // Mouse interaction
  let mouse = { x: null, y: null, radius: 130 };
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
    time++;
    ctx.clearRect(0, 0, width, height);
    const dark = isDarkTheme();

    // Draw connecting edges with soft gradient strokes
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const proximity = 1 - dist / connectionDistance;
          const baseAlpha = proximity * (dark ? 0.32 : 0.24);
          const lineGradient = ctx.createLinearGradient(
            particles[i].x, particles[i].y,
            particles[j].x, particles[j].y
          );
          const c1 = dark ? `rgba(96, 165, 250, ${baseAlpha})` : `rgba(37, 99, 235, ${baseAlpha})`;
          const c2 = dark ? `rgba(147, 197, 253, ${baseAlpha * 0.5})` : `rgba(96, 165, 250, ${baseAlpha * 0.5})`;
          lineGradient.addColorStop(0, c1);
          lineGradient.addColorStop(1, c2);

          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = lineGradient;
          ctx.lineWidth = particles[i].isHub || particles[j].isHub ? 1.3 : 0.7;
          ctx.stroke();
        }
      }

      // Connect to mouse gently, with a soft glow
      if (mouse.x !== null && mouse.y !== null) {
        const mdx = particles[i].x - mouse.x;
        const mdy = particles[i].y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < mouse.radius) {
          const mAlpha = (1 - mdist / mouse.radius) * 0.45;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = dark
            ? `rgba(147, 197, 253, ${mAlpha})`
            : `rgba(29, 78, 216, ${mAlpha})`;
          ctx.lineWidth = 1.1;
          ctx.stroke();
        }
      }

      particles[i].update();
      particles[i].draw();
    }

    // Subtle glow ring around cursor
    if (mouse.x !== null && mouse.y !== null) {
      const cursorGradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 90);
      cursorGradient.addColorStop(0, dark ? 'rgba(96, 165, 250, 0.10)' : 'rgba(37, 99, 235, 0.08)');
      cursorGradient.addColorStop(1, 'rgba(96, 165, 250, 0)');
      ctx.beginPath();
      ctx.fillStyle = cursorGradient;
      ctx.arc(mouse.x, mouse.y, 90, 0, Math.PI * 2);
      ctx.fill();
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
