/**
 * OPHEI ANSAH AUTO IMPORTS - CINEMATIC SPOTLIGHT & SHINING DUST ENGINE
 * 
 * Features:
 * - Dim cinematic gallery room with deep vignette.
 * - Crisp, hard-edged spotlight cone projecting downward with intense core luminance.
 * - Thousands of SHINING DUST motes:
 *   - Outside beam: dim, shadowy micro-specks.
 *   - Inside beam: instantly bursts into brilliant golden stardust using additive lighting,
 *     radiant golden coronas, needle-sharp diamond star glints (+), and cinematic bokeh discs.
 * - Showcases the Logo with high-visibility luxury pedestal lighting, dynamic specular
 *   chrome gleams, and interactive 3D perspective tilt.
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

      // DOM Elements
      this.emblemWrapper = document.getElementById('emblemBadgeWrapper');
      this.btnSpotlightTrack = document.getElementById('btnSpotlightTrack');
      this.btnGleamTrigger = document.getElementById('btnGleamTrigger');

      // Particle Configuration for "Shining Dust"
      this.particleCount = window.innerWidth < 768 ? 1600 : 3200;
      this.particles = [];
      this.width = 0;
      this.height = 0;
      this.isRunning = false;
      this.animFrameId = null;

      // Mouse & Pointer State
      this.mouse = {
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0,
        vx: 0,
        vy: 0,
        lastX: 0,
        lastY: 0,
        isHovered: false,
        trackingEnabled: true
      };

      // Spotlight Parameters
      this.spotlight = {
        sourceX: 0,
        sourceY: -70,
        targetX: 0,
        targetY: 0,
        currentSourceX: 0,
        currentTargetX: 0,
        currentTargetY: 0,
        apexRadius: 36,
        halfAngle: 0.38,
        intensity: 1.0,
        targetIntensity: 1.0
      };

      // Specular Gleam State
      this.gleamState = {
        active: true,
        progress: 0,
        nextBurstTime: 0
      };

      // Volumetric God Rays
      this.godRays = [];
      for (let i = 0; i < 9; i++) {
        this.godRays.push({
          angleOffset: (i - 4) * 0.042,
          width: 0.025 + Math.random() * 0.025,
          alpha: 0.06 + Math.random() * 0.09,
          phase: Math.random() * Math.PI * 2,
          speed: 0.01 + Math.random() * 0.015
        });
      }

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
      this.height = Math.max(rect.height, 600);

      this.canvas.width = Math.floor(this.width * this.dpr);
      this.canvas.height = Math.floor(this.height * this.dpr);
      this.canvas.style.width = `${this.width}px`;
      this.canvas.style.height = `${this.height}px`;

      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.scale(this.dpr, this.dpr);

      const centerX = this.width * 0.5;
      let focalY = this.height * 0.32;

      // Find exact vertical position of the emblem badge
      if (this.emblemWrapper) {
        const emblemRect = this.emblemWrapper.getBoundingClientRect();
        focalY = (emblemRect.top - rect.top) + emblemRect.height * 0.5;
      }

      this.spotlight.sourceX = centerX;
      this.spotlight.currentSourceX = centerX;
      this.spotlight.targetX = centerX;
      this.spotlight.targetY = focalY;
      this.spotlight.currentTargetX = centerX;
      this.spotlight.currentTargetY = focalY;

      if (!this.mouse.isHovered) {
        this.mouse.x = centerX;
        this.mouse.y = focalY;
        this.mouse.targetX = centerX;
        this.mouse.targetY = focalY;
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
      const z = (Math.random() * 2) - 1; // -1 to +1
      // Multi-tier sizes: mostly fine glittering dust, plus special diamond flakes & bokeh orbs
      const rand = Math.random();
      let baseSize = 0.6 + Math.random() * 1.4;
      let isDiamondFlake = false;

      if (rand > 0.88) {
        isDiamondFlake = true; // High-sparkle diamond crystal flake
        baseSize = 1.6 + Math.random() * 1.5;
      }

      const depthScale = 1 + z * 0.55;

      return {
        x: Math.random() * (this.width || 1200),
        y: randomY ? Math.random() * (this.height || 700) : (this.height + 10 + Math.random() * 40),
        z: z,
        size: Math.max(0.5, baseSize * depthScale),
        baseSize: baseSize,
        isDiamondFlake: isDiamondFlake,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.2 - Math.random() * 0.55, // Convection drift upwards through light beam
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.03 + Math.random() * 0.08, // Rapid scintillation
        sparkleTimer: Math.random() * 120, // Frequent starburst glints!
        sparkleDuration: 0,
        sparkleMaxDuration: 20 + Math.random() * 30,
        sparkleScale: 1.0 + Math.random() * 1.2,
        driftSeed: Math.random() * 1000,
        inBeam: 0
      };
    }

    setupEventListeners() {
      const targetEl = this.heroSection || window;

      const onPointerMove = (clientX, clientY) => {
        const rect = this.heroSection.getBoundingClientRect();
        const relX = clientX - rect.left;
        const relY = clientY - rect.top;

        this.mouse.targetX = relX;
        this.mouse.targetY = relY;
        this.mouse.isHovered = true;

        const dx = relX - this.mouse.lastX;
        const dy = relY - this.mouse.lastY;
        this.mouse.vx = dx * 0.5;
        this.mouse.vy = dy * 0.5;
        this.mouse.lastX = relX;
        this.mouse.lastY = relY;

        this.stirAirAt(relX, relY, this.mouse.vx, this.mouse.vy);
      };

      targetEl.addEventListener('mousemove', (e) => {
        onPointerMove(e.clientX, e.clientY);
      }, { passive: true });

      targetEl.addEventListener('mouseleave', () => {
        this.mouse.isHovered = false;
        this.mouse.targetX = this.width * 0.5;
        this.mouse.targetY = this.height * 0.32;
      });

      targetEl.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) {
          onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });

      targetEl.addEventListener('click', (e) => {
        const rect = this.heroSection.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        this.triggerSparkleBurst(clickX, clickY);
        this.triggerGleam();
      });

      if (this.btnSpotlightTrack) {
        this.btnSpotlightTrack.addEventListener('click', (e) => {
          e.stopPropagation();
          this.mouse.trackingEnabled = !this.mouse.trackingEnabled;
          this.btnSpotlightTrack.classList.toggle('active', this.mouse.trackingEnabled);
          const textSpan = this.btnSpotlightTrack.querySelector('.ctrl-text');
          if (textSpan) {
            textSpan.textContent = this.mouse.trackingEnabled ? 'Spotlight: Tracking' : 'Spotlight: Centered';
          }
        });
      }

      if (this.btnGleamTrigger) {
        this.btnGleamTrigger.addEventListener('click', (e) => {
          e.stopPropagation();
          this.triggerGleam();
          this.triggerSparkleBurst(this.width * 0.5, this.height * 0.32);
        });
      }
    }

    stirAirAt(x, y, vx, vy) {
      const radius = 160;
      const radiusSq = radius * radius;
      const speed = Math.hypot(vx, vy);
      if (speed < 0.2) return;

      for (let i = 0; i < this.particles.length; i += 2) {
        const p = this.particles[i];
        const dx = p.x - x;
        const dy = p.y - y;
        const distSq = dx * dx + dy * dy;

        if (distSq < radiusSq) {
          const force = (1 - Math.sqrt(distSq) / radius) * 0.45;
          p.vx += vx * force * 0.2 - (dy / 60) * force * 0.45;
          p.vy += vy * force * 0.2 + (dx / 60) * force * 0.45;
          p.sparkleTimer = 0; // Trigger glittering sparkle when stirred!
        }
      }
    }

    triggerSparkleBurst(cx, cy) {
      this.spotlight.intensity = 1.45;

      let count = 0;
      for (let i = 0; i < this.particles.length && count < 90; i++) {
        const p = this.particles[i];
        const dx = p.x - cx;
        const dy = p.y - cy;
        if (Math.hypot(dx, dy) < 250) {
          p.sparkleDuration = p.sparkleMaxDuration * 1.2;
          p.sparkleScale = 2.0 + Math.random() * 1.5;
          p.vx += (dx / 80) * (0.9 + Math.random());
          p.vy -= 1.0 + Math.random() * 1.4;
          count++;
        }
      }
    }

    triggerGleam() {
      this.gleamState.active = true;
      if (this.emblemWrapper) {
        this.emblemWrapper.classList.remove('animate-gleam');
        void this.emblemWrapper.offsetWidth;
        this.emblemWrapper.classList.add('animate-gleam');
      }
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
      const centerX = this.width * 0.5;
      let centerY = this.height * 0.32;

      if (this.emblemWrapper && this.heroSection) {
        const emblemRect = this.emblemWrapper.getBoundingClientRect();
        const heroRect = this.heroSection.getBoundingClientRect();
        centerY = (emblemRect.top - heroRect.top) + emblemRect.height * 0.5;
      }

      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

      if (this.mouse.trackingEnabled && this.mouse.isHovered) {
        this.spotlight.sourceX = centerX + (this.mouse.x - centerX) * 0.2;
        this.spotlight.targetX = centerX + (this.mouse.x - centerX) * 0.42;
        this.spotlight.targetY = centerY + (this.mouse.y - centerY) * 0.22;
      } else {
        const sway = Math.sin(time * 0.0009) * 35;
        this.spotlight.sourceX = centerX + sway * 0.25;
        this.spotlight.targetX = centerX + sway;
        this.spotlight.targetY = centerY + Math.cos(time * 0.0011) * 12;
      }

      this.spotlight.currentSourceX += (this.spotlight.sourceX - this.spotlight.currentSourceX) * 0.07;
      this.spotlight.currentTargetX += (this.spotlight.targetX - this.spotlight.currentTargetX) * 0.07;
      this.spotlight.currentTargetY += (this.spotlight.targetY - this.spotlight.currentTargetY) * 0.07;

      this.spotlight.intensity += (this.spotlight.targetIntensity - this.spotlight.intensity) * 0.05;

      if (time > this.gleamState.nextBurstTime) {
        this.triggerGleam();
        this.gleamState.nextBurstTime = time + 3800 + Math.random() * 2000;
      }

      // Synchronize 3D Emblem Tilt
      if (this.emblemWrapper) {
        const tiltX = ((this.mouse.y - centerY) / (centerY || 1)) * -12;
        const tiltY = ((this.mouse.x - centerX) / (centerX || 1)) * 16;
        this.emblemWrapper.style.transform = 
          `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateZ(10px)`;
      }

      // Spotlight Vectors
      const sx = this.spotlight.currentSourceX;
      const sy = this.spotlight.sourceY;
      const tx = this.spotlight.currentTargetX;
      const ty = this.height * 0.92;

      const beamVecX = tx - sx;
      const beamVecY = ty - sy;
      const beamLen = Math.hypot(beamVecX, beamVecY) || 1;
      const beamNormX = beamVecX / beamLen;
      const beamNormY = beamVecY / beamLen;
      const perpX = -beamNormY;
      const perpY = beamNormX;

      const apexR = this.spotlight.apexRadius;
      const halfAngle = this.spotlight.halfAngle;

      const particles = this.particles;
      const pLen = particles.length;

      for (let i = 0; i < pLen; i++) {
        const p = particles[i];

        p.driftSeed += 0.012;
        const turbulentWind = Math.sin(p.driftSeed + p.y * 0.007) * 0.16;

        p.x += p.vx + turbulentWind;
        p.y += p.vy;

        p.vx *= 0.985;
        p.vy += ((-0.28 - (p.z * 0.09)) - p.vy) * 0.02;

        p.twinklePhase += p.twinkleSpeed;

        // Sparkle / Glint updates: frequent diamond star bursts!
        if (p.sparkleDuration > 0) {
          p.sparkleDuration--;
        } else {
          p.sparkleTimer -= dt * 60;
          if (p.sparkleTimer <= 0 && p.inBeam > 0.4) {
            p.sparkleDuration = p.sparkleMaxDuration;
            // Short interval for constant glittering diamond dust!
            p.sparkleTimer = 40 + Math.random() * 140;
          }
        }

        // --- HARD-EDGED CONE BOUNDARY DETECTION ---
        const toParticleX = p.x - sx;
        const toParticleY = p.y - sy;
        const distAlongBeam = toParticleX * beamNormX + toParticleY * beamNormY;

        if (distAlongBeam > 0 && distAlongBeam < beamLen + 150) {
          const perpDist = Math.abs(toParticleX * perpX + toParticleY * perpY);
          const coneRadiusAtDepth = apexR + distAlongBeam * halfAngle;

          // Razor sharp edge margin: 8px
          const edgeDiff = coneRadiusAtDepth - perpDist;
          const edgeSoftness = 8;

          if (edgeDiff > edgeSoftness) {
            p.inBeam = 1.0;
          } else if (edgeDiff < -edgeSoftness) {
            p.inBeam = 0.0;
          } else {
            const t = (edgeDiff + edgeSoftness) / (edgeSoftness * 2);
            p.inBeam = t * t * (3 - 2 * t);
          }
        } else {
          p.inBeam = 0.0;
        }

        if (p.y < -30) {
          p.y = this.height + 25;
          p.x = Math.random() * this.width;
          p.vx = (Math.random() - 0.5) * 0.4;
        } else if (p.x < -40) {
          p.x = this.width + 30;
        } else if (p.x > this.width + 40) {
          p.x = -30;
        }
      }
    }

    render(time) {
      const ctx = this.ctx;
      const w = this.width;
      const h = this.height;

      ctx.clearRect(0, 0, w, h);

      // 1. Dim Cinematic Room
      this.renderCinematicRoom(ctx, w, h);

      // 2. Hard-Edged Volumetric Spotlight Cone & God Rays
      this.renderSpotlightBeam(ctx, w, h, time);

      // 3. Showroom Floor Stage Light Pool
      this.renderFloorStagePool(ctx, w, h, time);

      // 4. Background Shining Dust Motes (z < 0.1)
      this.renderDustMotes(ctx, -1.0, 0.1, time);

      // 5. Luxury Brand Spotlight Illumination Hotspot on Logo
      this.renderLuxuryBrandShowcase(ctx, w, h, time);

      // 6. Foreground Shining Dust Motes & Bokeh (z >= 0.1)
      this.renderDustMotes(ctx, 0.1, 1.0, time);
    }

    renderCinematicRoom(ctx, w, h) {
      const roomGrad = ctx.createRadialGradient(
        w * 0.5, h * 0.35, 30,
        w * 0.5, h * 0.45, Math.max(w, h) * 0.85
      );
      roomGrad.addColorStop(0, 'rgba(8, 16, 30, 0.9)');
      roomGrad.addColorStop(0.5, 'rgba(4, 9, 18, 0.96)');
      roomGrad.addColorStop(1, 'rgba(2, 4, 8, 0.99)');

      ctx.fillStyle = roomGrad;
      ctx.fillRect(0, 0, w, h);
    }

    renderSpotlightBeam(ctx, w, h, time) {
      const sx = this.spotlight.currentSourceX;
      const sy = this.spotlight.sourceY;
      const tx = this.spotlight.currentTargetX;
      const ty = h * 0.92;

      const beamVecX = tx - sx;
      const beamVecY = ty - sy;
      const beamLen = Math.hypot(beamVecX, beamVecY) || 1;
      const perpX = -(beamVecY / beamLen);
      const perpY = beamVecX / beamLen;

      const apexR = this.spotlight.apexRadius;
      const floorR = apexR + beamLen * this.spotlight.halfAngle;

      const apexLeftX = sx - perpX * apexR;
      const apexLeftY = sy - perpY * apexR;
      const apexRightX = sx + perpX * apexR;
      const apexRightY = sy + perpY * apexR;

      const baseLeftX = tx - perpX * floorR;
      const baseLeftY = ty - perpY * floorR;
      const baseRightX = tx + perpX * floorR;
      const baseRightY = ty + perpY * floorR;

      ctx.save();

      // HARD-EDGED CONE SHAPE
      ctx.beginPath();
      ctx.moveTo(apexLeftX, apexLeftY);
      ctx.lineTo(apexRightX, apexRightY);
      ctx.lineTo(baseRightX, baseRightY);
      ctx.bezierCurveTo(
        tx + perpX * (floorR * 0.5), ty + 30,
        tx - perpX * (floorR * 0.5), ty + 30,
        baseLeftX, baseLeftY
      );
      ctx.closePath();

      // CRISP HARD BOUNDARY STROKE
      ctx.strokeStyle = `rgba(255, 245, 210, ${0.28 * this.spotlight.intensity})`;
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Luminous Volumetric Beam Gradient
      const beamGrad = ctx.createLinearGradient(sx, sy, tx, ty);
      const intensity = this.spotlight.intensity;
      beamGrad.addColorStop(0, `rgba(255, 255, 250, ${0.62 * intensity})`);
      beamGrad.addColorStop(0.18, `rgba(255, 242, 205, ${0.35 * intensity})`);
      beamGrad.addColorStop(0.55, `rgba(225, 185, 75, ${0.18 * intensity})`);
      beamGrad.addColorStop(0.9, `rgba(180, 140, 45, ${0.08 * intensity})`);
      beamGrad.addColorStop(1, 'rgba(5, 12, 24, 0.01)');

      ctx.fillStyle = beamGrad;
      ctx.fill();

      // God-ray Striations
      ctx.save();
      ctx.clip();

      for (let i = 0; i < this.godRays.length; i++) {
        const ray = this.godRays[i];
        const rayAngle = ray.angleOffset + Math.sin(time * 0.001 * ray.speed + ray.phase) * 0.038;
        const rayBaseX = tx + (rayAngle / this.spotlight.halfAngle) * floorR;

        const rayGrad = ctx.createLinearGradient(sx, sy, rayBaseX, ty);
        const rayAlpha = ray.alpha * (0.85 + Math.sin(time * 0.002 + ray.phase) * 0.35) * intensity;
        rayGrad.addColorStop(0.05, `rgba(255, 255, 240, ${rayAlpha * 1.8})`);
        rayGrad.addColorStop(0.4, `rgba(255, 235, 175, ${rayAlpha * 1.2})`);
        rayGrad.addColorStop(0.9, 'rgba(212, 175, 55, 0)');

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(rayBaseX - 40, ty);
        ctx.lineTo(rayBaseX + 40, ty);
        ctx.closePath();
        ctx.fillStyle = rayGrad;
        ctx.fill();
      }

      ctx.restore();

      // Ceiling Spotlight Luminaire Source
      const lampGrad = ctx.createRadialGradient(sx, sy, 5, sx, sy, 70);
      lampGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      lampGrad.addColorStop(0.25, 'rgba(255, 245, 210, 0.85)');
      lampGrad.addColorStop(0.65, 'rgba(212, 175, 55, 0.35)');
      lampGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = lampGrad;
      ctx.beginPath();
      ctx.arc(sx, sy, 70, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    renderFloorStagePool(ctx, w, h, time) {
      const tx = this.spotlight.currentTargetX;
      const ty = h * 0.88;
      const rx = 380;
      const ry = 85;

      ctx.save();

      const poolBloom = ctx.createRadialGradient(tx, ty, 25, tx, ty, rx);
      poolBloom.addColorStop(0, `rgba(255, 248, 220, ${0.35 * this.spotlight.intensity})`);
      poolBloom.addColorStop(0.35, `rgba(212, 175, 55, ${0.2 * this.spotlight.intensity})`);
      poolBloom.addColorStop(0.75, 'rgba(180, 130, 30, 0.06)');
      poolBloom.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.beginPath();
      ctx.ellipse(tx, ty, rx, ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = poolBloom;
      ctx.fill();

      // Polished Stage Turntable Ring
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
      ctx.beginPath();
      ctx.ellipse(tx, ty, rx * 0.65, ry * 0.65, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    }

    renderLuxuryBrandShowcase(ctx, w, h, time) {
      const cx = this.spotlight.currentTargetX;
      let cy = h * 0.32;

      if (this.emblemWrapper && this.heroSection) {
        const emblemRect = this.emblemWrapper.getBoundingClientRect();
        const heroRect = this.heroSection.getBoundingClientRect();
        cy = (emblemRect.top - heroRect.top) + emblemRect.height * 0.5;
      }

      ctx.save();
      // Use ADDITIVE BLENDING for the spotlight hotspot so the logo is intensely illuminated!
      ctx.globalCompositeOperation = 'lighter';

      // Brilliant Spotlight Hotspot Core directly onto the logo
      const spotHotspot = ctx.createRadialGradient(cx, cy, 20, cx, cy, 220);
      spotHotspot.addColorStop(0, `rgba(255, 255, 250, ${0.55 * this.spotlight.intensity})`);
      spotHotspot.addColorStop(0.35, `rgba(255, 238, 185, ${0.32 * this.spotlight.intensity})`);
      spotHotspot.addColorStop(0.7, `rgba(212, 175, 55, ${0.15 * this.spotlight.intensity})`);
      spotHotspot.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = spotHotspot;
      ctx.beginPath();
      ctx.arc(cx, cy, 220, 0, Math.PI * 2);
      ctx.fill();

      // Specular diamond flash on emblem edge
      const gleamProgress = (time * 0.0008) % 1.0;
      const gleamAngle = gleamProgress * Math.PI * 2;
      const glintX = cx + Math.cos(gleamAngle) * 110;
      const glintY = cy + Math.sin(gleamAngle) * 55;

      this.drawDiamondGlint(ctx, glintX, glintY, 18, 0.95, '#FFFFFF');

      ctx.restore();
    }

    renderDustMotes(ctx, minZ, maxZ, time) {
      const particles = this.particles;
      const pLen = particles.length;

      ctx.save();
      // ADDITIVE BLENDING: Makes particles shine and accumulate light into brilliant stardust!
      ctx.globalCompositeOperation = 'lighter';

      for (let i = 0; i < pLen; i++) {
        const p = particles[i];
        if (p.z < minZ || p.z >= maxZ) continue;

        const inBeam = p.inBeam;

        // OUTSIDE BEAM: Very faint shadow dust in the dim room
        if (inBeam < 0.02) {
          ctx.save();
          ctx.globalCompositeOperation = 'source-over'; // Non-additive for dark room
          const darkAlpha = 0.03 + (p.z + 1) * 0.015;
          ctx.fillStyle = `rgba(130, 150, 180, ${darkAlpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.4, p.size * 0.6), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          continue;
        }

        // INSIDE THE LIGHT BEAM: BRILLIANT SHINING DUST!
        const beamIntensity = Math.pow(inBeam, 1.2);
        // Fast, needle-sharp diamond scintillation
        const scint = Math.pow(0.5 + 0.5 * Math.sin(p.twinklePhase), 3);
        const sparkleBoost = (p.sparkleDuration > 0) ? (p.sparkleDuration / p.sparkleMaxDuration) * 2.2 : 0;
        const brightness = Math.min(1.0, (0.4 + 0.6 * scint + sparkleBoost) * beamIntensity);

        const currentSize = p.size * (1.0 + inBeam * 0.5 + (p.sparkleDuration > 0 ? 0.9 : 0));

        // 1. FOREGROUND LUMINOUS BOKEH ORBS
        if (p.z > 0.68) {
          const bokehGrad = ctx.createRadialGradient(
            p.x, p.y, 0,
            p.x, p.y, currentSize * 4
          );
          bokehGrad.addColorStop(0, `rgba(255, 255, 245, ${(0.6 * brightness).toFixed(3)})`);
          bokehGrad.addColorStop(0.35, `rgba(255, 220, 120, ${(0.35 * brightness).toFixed(3)})`);
          bokehGrad.addColorStop(0.75, `rgba(212, 175, 55, ${(0.12 * brightness).toFixed(3)})`);
          bokehGrad.addColorStop(1, 'rgba(212, 175, 55, 0)');

          ctx.fillStyle = bokehGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentSize * 4, 0, Math.PI * 2);
          ctx.fill();
        } 
        // 2. MIDGROUND & IN-FOCUS SHINING DUST FLAKES
        else {
          // Luminous Golden Corona Aura
          ctx.fillStyle = `rgba(255, 215, 80, ${(0.45 * brightness).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentSize * 2.4, 0, Math.PI * 2);
          ctx.fill();

          // Intense Incandescent Core Spark (Pure White/Gold)
          ctx.fillStyle = `rgba(255, 255, 255, ${(0.85 * brightness).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
          ctx.fill();

          // 3. DIAMOND STAR DIFFRACTION FLARES (+)
          // Constantly sparkles when hitting peak scintillation or diamond flake status
          if ((p.sparkleDuration > 0 || (p.isDiamondFlake && scint > 0.75)) && inBeam > 0.35) {
            const flareLen = (7 + currentSize * 5) * p.sparkleScale;
            const flareAlpha = Math.min(1.0, (p.sparkleDuration > 0 ? (p.sparkleDuration / p.sparkleMaxDuration) : scint) * inBeam);
            this.drawDiamondGlint(ctx, p.x, p.y, flareLen, flareAlpha, '#FFFFFF');
          }
        }
      }

      ctx.restore();
    }

    drawDiamondGlint(ctx, x, y, size, alpha, color) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = Math.min(1.0, alpha);

      // Primary Vertical Spike
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.lineTo(x, y + size);
      ctx.stroke();

      // Primary Horizontal Spike
      ctx.beginPath();
      ctx.moveTo(x - size, y);
      ctx.lineTo(x + size, y);
      ctx.stroke();

      // Diagonal Glint Wings
      const diag = size * 0.45;
      ctx.beginPath();
      ctx.moveTo(x - diag, y - diag);
      ctx.lineTo(x + diag, y + diag);
      ctx.moveTo(x + diag, y - diag);
      ctx.lineTo(x - diag, y + diag);
      ctx.stroke();

      // Central Diamond Flare
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(x, y, 1.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new HeroCinematicSpotlight());
  } else {
    new HeroCinematicSpotlight();
  }
})();
