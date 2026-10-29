/**
 * OPHEI ANSAH AUTO IMPORTS - CINEMATIC SPOTLIGHT & SLOW BALLET OF DUST
 * 
 * Inspired by:
 * "A still room, a single shaft of light, a slow ballet of dust."
 * 
 * - Deep, still, cinema-black room.
 * - Single elegant shaft of warm champagne volumetric light.
 * - Gentle, peaceful, glowing dust motes drifting in a serene slow ballet.
 * - Minimalist luxury brand emblem bathed in light.
 */

(function () {
  'use strict';

  class HeroCinematicSpotlight {
    constructor() {
      this.canvas = document.getElementById('heroCinematicCanvas');
      if (!this.canvas) return;

      this.heroSection = document.querySelector('.hero-section');
      this.ctx = this.canvas.getContext('2d', { alpha: true });
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);

      this.emblemWrapper = document.getElementById('heroEmblemShowcase');

      // Calibrated particle count for a clean, non-distracting slow ballet
      this.particleCount = window.innerWidth < 768 ? 220 : 450;
      this.particles = [];
      this.width = 0;
      this.height = 0;
      this.isRunning = false;
      this.animFrameId = null;

      // Spotlight shaft position (anchored to the right showcase column)
      this.shaft = {
        x: 0,
        targetX: 0,
        topRadius: 50,
        bottomRadius: 230,
        intensity: 1.0
      };

      // Subtle parallax offset
      this.parallax = { x: 0, y: 0, targetX: 0, targetY: 0 };

      this.init();
    }

    init() {
      this.handleResize();
      window.addEventListener('resize', () => this.handleResize(), { passive: true });

      this.initParticles();
      this.setupEventListeners();
      this.start();

      if ('IntersectionObserver' in window && this.heroSection) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.start();
            } else {
              this.stop();
            }
          });
        }, { threshold: 0.05 });
        observer.observe(this.heroSection);
      }
    }

    handleResize() {
      if (!this.canvas || !this.heroSection) return;
      const rect = this.heroSection.getBoundingClientRect();
      this.width = rect.width;
      this.height = Math.max(rect.height, 560);

      this.canvas.width = Math.floor(this.width * this.dpr);
      this.canvas.height = Math.floor(this.height * this.dpr);
      this.canvas.style.width = `${this.width}px`;
      this.canvas.style.height = `${this.height}px`;

      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.scale(this.dpr, this.dpr);

      // Position the shaft of light:
      // Dynamically align with the showcase column / emblem if present
      if (this.emblemWrapper && this.width >= 992) {
        const emblemRect = this.emblemWrapper.getBoundingClientRect();
        this.shaft.targetX = (emblemRect.left - rect.left) + emblemRect.width * 0.5;
        this.shaft.topRadius = 55;
        this.shaft.bottomRadius = 240;
      } else if (this.width >= 992) {
        this.shaft.targetX = this.width * 0.74;
        this.shaft.topRadius = 55;
        this.shaft.bottomRadius = 240;
      } else {
        this.shaft.targetX = this.width * 0.5;
        this.shaft.topRadius = 38;
        this.shaft.bottomRadius = 175;
      }

      if (this.shaft.x === 0) {
        this.shaft.x = this.shaft.targetX;
      }
    }

    initParticles() {
      this.particles = [];
      const count = this.particleCount;
      for (let i = 0; i < count; i++) {
        this.particles.push(this.createParticle(true));
      }
    }

    createParticle(randomY = false) {
      // 75% of particles spawn clustered inside or near the light shaft
      const isNearShaft = Math.random() < 0.75;
      const shaftX = this.shaft.targetX || (this.width * 0.74);

      let x;
      if (isNearShaft) {
        const spread = (Math.random() - 0.5) * (this.shaft.bottomRadius * 1.8);
        x = shaftX + spread;
      } else {
        x = Math.random() * this.width;
      }

      const y = randomY ? Math.random() * this.height : (this.height + 10 + Math.random() * 30);
      const z = (Math.random() * 2) - 1;

      const rand = Math.random();
      let radius;
      let isBokeh = false;

      if (rand > 0.92) {
        radius = 5.5 + Math.random() * 6.5;
        isBokeh = true;
      } else if (rand > 0.75) {
        radius = 2.2 + Math.random() * 1.6;
      } else {
        radius = 0.9 + Math.random() * 1.1;
      }

      return {
        x: x,
        y: y,
        z: z,
        radius: radius,
        isBokeh: isBokeh,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -0.12 - Math.random() * 0.22,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.015 + Math.random() * 0.03,
        baseAlpha: 0.35 + Math.random() * 0.55,
        driftOffset: Math.random() * 1000,
        inBeam: 0
      };
    }

    setupEventListeners() {
      const targetEl = this.heroSection || window;

      targetEl.addEventListener('mousemove', (e) => {
        const rect = this.heroSection.getBoundingClientRect();
        const normX = ((e.clientX - rect.left) / rect.width) - 0.5;
        const normY = ((e.clientY - rect.top) / rect.height) - 0.5;

        // Ultra-subtle luxury parallax (calm and steady)
        this.parallax.targetX = normX * 14;
        this.parallax.targetY = normY * 8;
      }, { passive: true });

      targetEl.addEventListener('mouseleave', () => {
        this.parallax.targetX = 0;
        this.parallax.targetY = 0;
      });
    }

    start() {
      if (this.isRunning) return;
      this.isRunning = true;
      let lastTime = performance.now();

      const loop = (time) => {
        if (!this.isRunning) return;
        const dt = Math.min((time - lastTime) / 1000, 0.05);
        lastTime = time;

        this.update(dt, time);
        this.render(time);

        this.animFrameId = requestAnimationFrame(loop);
      };

      this.animFrameId = requestAnimationFrame(loop);
    }

    stop() {
      this.isRunning = false;
      if (this.animFrameId) {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }
    }

    update(dt, time) {
      // Smooth subtle shaft position easing
      this.shaft.x += (this.shaft.targetX - this.shaft.x) * 0.08;
      this.parallax.x += (this.parallax.targetX - this.parallax.x) * 0.05;
      this.parallax.y += (this.parallax.targetY - this.parallax.y) * 0.05;

      const shaftTopX = this.shaft.x + this.parallax.x * 0.4;
      const shaftTopY = -20;
      const shaftBottomX = this.shaft.x + this.parallax.x;
      const shaftBottomY = this.height;

      const topR = this.shaft.topRadius;
      const botR = this.shaft.bottomRadius;

      const particles = this.particles;
      const pLen = particles.length;

      for (let i = 0; i < pLen; i++) {
        const p = particles[i];

        p.driftOffset += 0.008;
        const sway = Math.sin(p.driftOffset + p.y * 0.006) * 0.12;

        p.x += p.vx + sway;
        p.y += p.vy;

        p.pulsePhase += p.pulseSpeed;

        const progressY = Math.max(0, Math.min(1, (p.y - shaftTopY) / (shaftBottomY - shaftTopY)));
        const currentShaftX = shaftTopX + (shaftBottomX - shaftTopX) * progressY;
        const currentRadius = topR + (botR - topR) * progressY;

        const distFromCenter = Math.abs(p.x - currentShaftX);

        if (distFromCenter < currentRadius) {
          const edgeDist = (currentRadius - distFromCenter) / currentRadius;
          p.inBeam = Math.min(1, edgeDist * 2.2);
        } else if (distFromCenter < currentRadius + 50) {
          const outerDist = (currentRadius + 50 - distFromCenter) / 50;
          p.inBeam = Math.max(0, outerDist * 0.3);
        } else {
          p.inBeam = 0;
        }

        if (p.y < -20) {
          p.y = this.height + 15;
          if (Math.random() < 0.75) {
            p.x = currentShaftX + (Math.random() - 0.5) * (botR * 1.8);
          } else {
            p.x = Math.random() * this.width;
          }
        }
      }
    }

    render(time) {
      const ctx = this.ctx;
      const w = this.width;
      const h = this.height;

      ctx.clearRect(0, 0, w, h);

      // 1. Still room
      this.renderStillRoom(ctx, w, h);

      // 2. Single shaft of light
      this.renderLightShaft(ctx, w, h, time);

      // 3. Slow ballet of dust
      this.renderDustBallet(ctx, time);
    }

    renderStillRoom(ctx, w, h) {
      const bgGrad = ctx.createRadialGradient(
        w * 0.5, h * 0.4, 60,
        w * 0.5, h * 0.5, Math.max(w, h) * 0.8
      );
      bgGrad.addColorStop(0, '#060A10');
      bgGrad.addColorStop(0.65, '#030508');
      bgGrad.addColorStop(1, '#010204');

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);
    }

    renderLightShaft(ctx, w, h, time) {
      const topX = this.shaft.x + this.parallax.x * 0.4;
      const topY = -15;
      const bottomX = this.shaft.x + this.parallax.x;
      const bottomY = h + 10;

      const topR = this.shaft.topRadius;
      const botR = this.shaft.bottomRadius;

      ctx.save();

      // Soft light beam geometry
      ctx.beginPath();
      ctx.moveTo(topX - topR, topY);
      ctx.lineTo(topX + topR, topY);
      ctx.lineTo(bottomX + botR, bottomY);
      ctx.lineTo(bottomX - botR, bottomY);
      ctx.closePath();

      // Volumetric champagne-gold gradient
      const shaftGrad = ctx.createLinearGradient(topX, topY, bottomX, bottomY);
      shaftGrad.addColorStop(0, 'rgba(255, 248, 230, 0.32)');
      shaftGrad.addColorStop(0.12, 'rgba(240, 222, 190, 0.22)');
      shaftGrad.addColorStop(0.45, 'rgba(215, 195, 160, 0.12)');
      shaftGrad.addColorStop(0.85, 'rgba(180, 155, 120, 0.05)');
      shaftGrad.addColorStop(1, 'rgba(15, 20, 28, 0)');

      ctx.fillStyle = shaftGrad;
      ctx.fill();

      // Atmospheric core luminance (warm central shaft)
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      const coreGrad = ctx.createLinearGradient(topX, topY, bottomX, bottomY);
      coreGrad.addColorStop(0, 'rgba(255, 252, 242, 0.25)');
      coreGrad.addColorStop(0.35, 'rgba(235, 215, 180, 0.10)');
      coreGrad.addColorStop(0.8, 'rgba(210, 185, 140, 0.02)');
      coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.beginPath();
      ctx.moveTo(topX - topR * 0.45, topY);
      ctx.lineTo(topX + topR * 0.45, topY);
      ctx.lineTo(bottomX + botR * 0.45, bottomY);
      ctx.lineTo(bottomX - botR * 0.45, bottomY);
      ctx.closePath();
      ctx.fillStyle = coreGrad;
      ctx.fill();

      ctx.restore();

      // Ceiling emitter soft glow
      const ceilingGlow = ctx.createRadialGradient(topX, topY, 4, topX, topY, 80);
      ceilingGlow.addColorStop(0, 'rgba(255, 252, 240, 0.7)');
      ceilingGlow.addColorStop(0.3, 'rgba(240, 220, 180, 0.3)');
      ceilingGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = ceilingGlow;
      ctx.beginPath();
      ctx.arc(topX, topY, 80, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    renderDustBallet(ctx, time) {
      const particles = this.particles;
      const pLen = particles.length;

      ctx.save();

      for (let i = 0; i < pLen; i++) {
        const p = particles[i];

        const pulse = 0.65 + 0.35 * Math.sin(p.pulsePhase);
        const inBeam = p.inBeam;

        if (inBeam <= 0.02) {
          ctx.fillStyle = `rgba(140, 155, 175, ${(0.06 * pulse).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.5, p.radius * 0.7), 0, Math.PI * 2);
          ctx.fill();
          continue;
        }

        const brightness = (0.35 + 0.65 * inBeam) * pulse;

        if (p.isBokeh) {
          const bokehGrad = ctx.createRadialGradient(
            p.x, p.y, 0,
            p.x, p.y, p.radius
          );
          bokehGrad.addColorStop(0, `rgba(255, 245, 225, ${(0.32 * brightness).toFixed(3)})`);
          bokehGrad.addColorStop(0.5, `rgba(230, 205, 165, ${(0.14 * brightness).toFixed(3)})`);
          bokehGrad.addColorStop(1, 'rgba(210, 185, 145, 0)');

          ctx.fillStyle = bokehGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `rgba(245, 220, 175, ${(0.38 * brightness).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = `rgba(255, 252, 245, ${(0.92 * brightness).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new HeroCinematicSpotlight());
  } else {
    new HeroCinematicSpotlight();
  }
})();
