/**
 * OPHEI ANSAH AUTO IMPORTS - CINEMATIC HERO SPOTLIGHT & DUST MOTES ENGINE
 * 
 * Concept:
 * - Dim cinematic showroom / vault with deep vignette and subtle perspective floor.
 * - Crisp, hard-edged volumetric spotlight cone beaming down from ceiling rig.
 * - Thousands of atmospheric dust motes drifting in 3D through the dim room.
 * - Outside the beam: faint, shadowy, near-invisible particles.
 * - Crossing the hard edge: motes ignite into brilliant twinkling specs of gold,
 *   crystal, and diamond light with 4-point diffraction flares and bokeh depth.
 * - Centerpiece: The Ophei Ansah luxury brand automotive crest bathed in light,
 *   with 3D perspective tilt, polished showroom turntable plinth, and dynamic specular chrome gleams.
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

      // DOM Elements for synchronized 3D emblem
      this.emblemWrapper = document.getElementById('emblemBadgeWrapper');
      this.emblemImg = document.getElementById('emblemLogoImg');
      this.btnSpotlightTrack = document.getElementById('btnSpotlightTrack');
      this.btnGleamTrigger = document.getElementById('btnGleamTrigger');

      // Configuration
      this.particleCount = window.innerWidth < 768 ? 1400 : 2800; // Thousands of motes!
      this.particles = [];
      this.width = 0;
      this.height = 0;
      this.isRunning = false;
      this.animFrameId = null;

      // Mouse & Interactive State
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
        sourceY: -60,
        targetX: 0,
        targetY: 0,
        currentSourceX: 0,
        currentTargetX: 0,
        currentTargetY: 0,
        apexRadius: 32,
        halfAngle: 0.36, // Cone expansion angle
        intensity: 1.0,
        targetIntensity: 1.0,
        colorCore: 'rgba(255, 252, 240, ',
        colorWarm: 'rgba(255, 230, 160, ',
        colorGold: 'rgba(212, 175, 55, ',
        colorDark: 'rgba(5, 11, 22, '
      };

      // Specular Gleam Animation on Emblem
      this.gleamState = {
        active: true,
        progress: 0,
        speed: 0.007,
        nextBurstTime: 0
      };

      // Volumetric God-ray Striations
      this.godRays = [];
      for (let i = 0; i < 7; i++) {
        this.godRays.push({
          angleOffset: (i - 3) * 0.045,
          width: 0.03 + Math.random() * 0.02,
          alpha: 0.04 + Math.random() * 0.07,
          phase: Math.random() * Math.PI * 2,
          speed: 0.008 + Math.random() * 0.012
        });
      }

      this.init();
    }

    init() {
      this.handleResize();
      window.addEventListener('resize', () => this.handleResize(), { passive: true });

      // Build the dust motes field
      this.initParticles();

      // Setup event listeners
      this.setupEventListeners();

      // Start the render loop
      this.start();

      // Intersection Observer to save power when hero is not visible
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
      this.height = Math.max(rect.height, 580);

      this.canvas.width = Math.floor(this.width * this.dpr);
      this.canvas.height = Math.floor(this.height * this.dpr);
      this.canvas.style.width = `${this.width}px`;
      this.canvas.style.height = `${this.height}px`;

      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.scale(this.dpr, this.dpr);

      // Default spotlight positions
      const centerX = this.width * 0.5;
      const focalY = this.height * 0.42;

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
      const z = (Math.random() * 2) - 1; // -1 (far back) to +1 (foreground bokeh)
      const baseSize = 0.6 + Math.random() * 1.8;
      // Z-depth affects visual size: foreground particles are larger
      const depthScale = 1 + z * 0.6;

      return {
        x: Math.random() * (this.width || 1200),
        y: randomY ? Math.random() * (this.height || 700) : (this.height + 10 + Math.random() * 40),
        z: z,
        size: Math.max(0.4, baseSize * depthScale),
        baseSize: baseSize,
        vx: (Math.random() - 0.5) * 0.35,
        // Thermal upward draft: warm spotlight beam induces gentle rising current
        vy: -0.15 - Math.random() * 0.45,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.02 + Math.random() * 0.05,
        twinkleAmp: 0.4 + Math.random() * 0.6,
        sparkleTimer: Math.random() * 300,
        sparkleDuration: 0,
        sparkleMaxDuration: 25 + Math.random() * 35,
        sparkleScale: 1.0,
        // Micro turbulence sine offsets
        driftSeed: Math.random() * 1000,
        inBeam: 0, // 0 = outside, 1 = inside the hard-edged spotlight cone
        prevInBeam: 0
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

        // Calculate pointer velocity for particle fluid wake
        const dx = relX - this.mouse.lastX;
        const dy = relY - this.mouse.lastY;
        this.mouse.vx = dx * 0.5;
        this.mouse.vy = dy * 0.5;
        this.mouse.lastX = relX;
        this.mouse.lastY = relY;

        // Apply gentle air turbulence to dust motes near pointer
        this.stirAirAt(relX, relY, this.mouse.vx, this.mouse.vy);
      };

      targetEl.addEventListener('mousemove', (e) => {
        onPointerMove(e.clientX, e.clientY);
      }, { passive: true });

      targetEl.addEventListener('mouseleave', () => {
        this.mouse.isHovered = false;
        this.mouse.targetX = this.width * 0.5;
        this.mouse.targetY = this.height * 0.42;
      });

      targetEl.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) {
          onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });

      // Click to trigger a burst of sparkling diamond dust!
      targetEl.addEventListener('click', (e) => {
        const rect = this.heroSection.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        this.triggerSparkleBurst(clickX, clickY);
        this.triggerGleam();
      });

      // Interactive Controls
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
          this.triggerSparkleBurst(this.width * 0.5, this.height * 0.42);
        });
      }
    }

    stirAirAt(x, y, vx, vy) {
      const radius = 140;
      const radiusSq = radius * radius;
      const speed = Math.hypot(vx, vy);
      if (speed < 0.2) return;

      for (let i = 0; i < this.particles.length; i += 2) {
        const p = this.particles[i];
        const dx = p.x - x;
        const dy = p.y - y;
        const distSq = dx * dx + dy * dy;

        if (distSq < radiusSq) {
          const force = (1 - Math.sqrt(distSq) / radius) * 0.35;
          // Air displacement + vortex curl
          p.vx += vx * force * 0.15 - (dy / 70) * force * 0.4;
          p.vy += vy * force * 0.15 + (dx / 70) * force * 0.4;
          // Twinkle excitement
          p.twinkleSpeed = Math.min(p.twinkleSpeed * 1.5, 0.18);
        }
      }
    }

    triggerSparkleBurst(cx, cy) {
      // Spotlight brief intensity flare
      this.spotlight.intensity = 1.35;

      // Ignite 60 nearby motes into diamond cross-star sparkles
      let ignited = 0;
      for (let i = 0; i < this.particles.length && ignited < 60; i++) {
        const p = this.particles[i];
        const dx = p.x - cx;
        const dy = p.y - cy;
        if (Math.hypot(dx, dy) < 220) {
          p.sparkleDuration = p.sparkleMaxDuration;
          p.sparkleScale = 1.6 + Math.random() * 1.4;
          p.vx += (dx / 100) * (0.8 + Math.random());
          p.vy -= 0.8 + Math.random() * 1.2;
          ignited++;
        }
      }
    }

    triggerGleam() {
      this.gleamState.active = true;
      this.gleamState.progress = 0;
      if (this.emblemWrapper) {
        this.emblemWrapper.classList.remove('animate-gleam');
        void this.emblemWrapper.offsetWidth; // Trigger reflow
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
      const centerY = this.height * 0.42;

      // Smooth mouse tracking with spring damping
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

      // Spotlight steering
      if (this.mouse.trackingEnabled && this.mouse.isHovered) {
        // Spotlight luminaire source tilts slightly
        this.spotlight.sourceX = centerX + (this.mouse.x - centerX) * 0.18;
        // Spotlight beam focal target tracks pointer with smooth luxury damping
        this.spotlight.targetX = centerX + (this.mouse.x - centerX) * 0.45;
        this.spotlight.targetY = centerY + (this.mouse.y - centerY) * 0.28;
      } else {
        // Subtle ambient breathing sway
        const sway = Math.sin(time * 0.0008) * 40;
        this.spotlight.sourceX = centerX + sway * 0.3;
        this.spotlight.targetX = centerX + sway;
        this.spotlight.targetY = centerY + Math.cos(time * 0.001) * 15;
      }

      this.spotlight.currentSourceX += (this.spotlight.sourceX - this.spotlight.currentSourceX) * 0.06;
      this.spotlight.currentTargetX += (this.spotlight.targetX - this.spotlight.currentTargetX) * 0.06;
      this.spotlight.currentTargetY += (this.spotlight.targetY - this.spotlight.currentTargetY) * 0.06;

      // Spotlight intensity relaxation
      this.spotlight.intensity += (this.spotlight.targetIntensity - this.spotlight.intensity) * 0.05;

      // Specular Gleam on Emblem timing
      if (time > this.gleamState.nextBurstTime) {
        this.triggerGleam();
        this.gleamState.nextBurstTime = time + 4200 + Math.random() * 2500;
      }

      // Update 3D Synchronized HTML Emblem Tilt if element exists
      if (this.emblemWrapper) {
        const tiltX = ((this.mouse.y - centerY) / centerY) * -14;
        const tiltY = ((this.mouse.x - centerX) / centerX) * 18;
        this.emblemWrapper.style.transform = 
          `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateZ(12px)`;
      }

      // Beam Geometry Vectors for Math Check
      const sx = this.spotlight.currentSourceX;
      const sy = this.spotlight.sourceY;
      const tx = this.spotlight.currentTargetX;
      const ty = this.height * 0.88; // Floor intersection

      const beamVecX = tx - sx;
      const beamVecY = ty - sy;
      const beamLen = Math.hypot(beamVecX, beamVecY) || 1;
      const beamNormX = beamVecX / beamLen; // Unit direction down the beam
      const beamNormY = beamVecY / beamLen;
      // Perpendicular normal to the beam axis
      const perpX = -beamNormY;
      const perpY = beamNormX;

      const apexR = this.spotlight.apexRadius;
      const halfAngle = this.spotlight.halfAngle;

      // Update Particles
      const particles = this.particles;
      const pLen = particles.length;

      for (let i = 0; i < pLen; i++) {
        const p = particles[i];

        // Atmospheric turbulence & organic micro-drift
        p.driftSeed += 0.01;
        const turbulentWind = Math.sin(p.driftSeed + p.y * 0.008) * 0.12;

        p.x += p.vx + turbulentWind;
        p.y += p.vy;

        // Natural friction/air drag
        p.vx *= 0.985;
        p.vy += ((-0.25 - (p.z * 0.08)) - p.vy) * 0.02;

        // Twinkle Scintillation
        p.twinklePhase += p.twinkleSpeed;

        // Sparkle Glint timer
        if (p.sparkleDuration > 0) {
          p.sparkleDuration--;
        } else {
          p.sparkleTimer -= dt * 60;
          // Random chance for mote to catch peak crystal facet glint
          if (p.sparkleTimer <= 0 && p.inBeam > 0.6) {
            p.sparkleDuration = p.sparkleMaxDuration;
            p.sparkleTimer = 180 + Math.random() * 400;
          }
        }

        // --- HARD-EDGED SPOTLIGHT CONE CROSS DETECTION ---
        // 1. Vector from spotlight apex to particle
        const toParticleX = p.x - sx;
        const toParticleY = p.y - sy;

        // 2. Distance along the central beam axis
        const distAlongBeam = toParticleX * beamNormX + toParticleY * beamNormY;

        if (distAlongBeam > 0 && distAlongBeam < beamLen + 150) {
          // 3. Perpendicular distance from central beam axis
          const perpDist = Math.abs(toParticleX * perpX + toParticleY * perpY);

          // 4. Cone radius at this exact depth along the beam
          const coneRadiusAtDepth = apexR + distAlongBeam * halfAngle;

          // 5. Hard Edge Calculation:
          // A very narrow transition margin (10-14px) creates that razor-sharp,
          // crisp spotlight edge requested by the user.
          const edgeDiff = coneRadiusAtDepth - perpDist;
          const edgeSoftness = 12;

          if (edgeDiff > edgeSoftness) {
            // Completely inside the beam
            p.inBeam = 1.0;
          } else if (edgeDiff < -edgeSoftness) {
            // Completely outside the beam in the dim room
            p.inBeam = 0.0;
          } else {
            // Right on the hard boundary - fast sigmoid transition
            const t = (edgeDiff + edgeSoftness) / (edgeSoftness * 2);
            p.inBeam = t * t * (3 - 2 * t);
          }
        } else {
          p.inBeam = 0.0;
        }

        // Boundary respawn
        if (p.y < -30) {
          p.y = this.height + 20;
          p.x = Math.random() * this.width;
          p.vx = (Math.random() - 0.5) * 0.35;
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

      // 1. DIM CINEMATIC ROOM ENVIRONMENT
      this.renderCinematicRoom(ctx, w, h);

      // 2. HARD-EDGED SPOTLIGHT CONE & GOD RAYS
      this.renderSpotlightBeam(ctx, w, h, time);

      // 3. SHOWROOM FLOOR ILLUMINATED POOL & STAGE PLINTH
      this.renderFloorStagePool(ctx, w, h, time);

      // 4. BACKGROUND DUST MOTES (Particles behind the logo focal plane: z < 0.1)
      this.renderDustMotes(ctx, -1.0, 0.1, time);

      // 5. LUXURY BRAND LOGO BADGE SHOWCASE (In Canvas + Ambient Pedestal Glow)
      this.renderLuxuryBrandShowcase(ctx, w, h, time);

      // 6. FOREGROUND DUST MOTES & BOKEH CRYSTALS (Particles in front of logo: z >= 0.1)
      this.renderDustMotes(ctx, 0.1, 1.0, time);
    }

    renderCinematicRoom(ctx, w, h) {
      // Deep luxury vault vignette: Rich obsidian (#03070E) fading into floor perspective
      const roomGrad = ctx.createRadialGradient(
        w * 0.5, h * 0.38, 40,
        w * 0.5, h * 0.45, Math.max(w, h) * 0.85
      );
      roomGrad.addColorStop(0, 'rgba(10, 20, 36, 0.85)');
      roomGrad.addColorStop(0.45, 'rgba(5, 12, 22, 0.94)');
      roomGrad.addColorStop(1, 'rgba(2, 5, 10, 0.99)');

      ctx.fillStyle = roomGrad;
      ctx.fillRect(0, 0, w, h);

      // Subtle floor perspective horizon line
      const floorY = h * 0.72;
      ctx.save();
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, floorY);
      ctx.lineTo(w, floorY);
      ctx.stroke();

      // Subtle radial floor ambient reflection
      const floorReflect = ctx.createRadialGradient(
        w * 0.5, floorY + 40, 10,
        w * 0.5, floorY + 40, w * 0.4
      );
      floorReflect.addColorStop(0, 'rgba(212, 175, 55, 0.05)');
      floorReflect.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = floorReflect;
      ctx.fillRect(0, floorY, w, h - floorY);
      ctx.restore();
    }

    renderSpotlightBeam(ctx, w, h, time) {
      const sx = this.spotlight.currentSourceX;
      const sy = this.spotlight.sourceY;
      const tx = this.spotlight.currentTargetX;
      const ty = h * 0.88; // Floor strike plane

      const beamVecX = tx - sx;
      const beamVecY = ty - sy;
      const beamLen = Math.hypot(beamVecX, beamVecY) || 1;
      const beamNormX = beamVecX / beamLen;
      const beamNormY = beamVecY / beamLen;
      const perpX = -beamNormY;
      const perpY = beamNormX;

      const apexR = this.spotlight.apexRadius;
      const floorR = apexR + beamLen * this.spotlight.halfAngle;

      // 4 corners of the hard-edged volumetric trapezoid
      const apexLeftX = sx - perpX * apexR;
      const apexLeftY = sy - perpY * apexR;
      const apexRightX = sx + perpX * apexR;
      const apexRightY = sy + perpY * apexR;

      const baseLeftX = tx - perpX * floorR;
      const baseLeftY = ty - perpY * floorR;
      const baseRightX = tx + perpX * floorR;
      const baseRightY = ty + perpY * floorR;

      ctx.save();

      // HARD-EDGED CONE PATH CLIP
      ctx.beginPath();
      ctx.moveTo(apexLeftX, apexLeftY);
      ctx.lineTo(apexRightX, apexRightY);
      ctx.lineTo(baseRightX, baseRightY);
      // Floor base curve
      ctx.bezierCurveTo(
        tx + perpX * (floorR * 0.5), ty + 25,
        tx - perpX * (floorR * 0.5), ty + 25,
        baseLeftX, baseLeftY
      );
      ctx.closePath();

      // Hard Boundary Glow: razor crisp edge
      ctx.strokeStyle = `rgba(255, 235, 180, ${0.12 * this.spotlight.intensity})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Volumetric Beam Gradient
      const beamGrad = ctx.createLinearGradient(sx, sy, tx, ty);
      const intensity = this.spotlight.intensity;
      beamGrad.addColorStop(0, `rgba(255, 252, 240, ${0.48 * intensity})`); // Incandescent source
      beamGrad.addColorStop(0.18, `rgba(255, 238, 190, ${0.26 * intensity})`);
      beamGrad.addColorStop(0.55, `rgba(212, 175, 55, ${0.14 * intensity})`); // Gold warmth
      beamGrad.addColorStop(0.92, `rgba(180, 140, 45, ${0.07 * intensity})`);
      beamGrad.addColorStop(1, 'rgba(10, 20, 36, 0.01)');

      ctx.fillStyle = beamGrad;
      ctx.fill();

      // Inside-beam God-ray Striations (soft shafts of light drifting in the beam)
      ctx.save();
      ctx.clip(); // Restrict God-rays strictly inside the hard-edged cone

      for (let i = 0; i < this.godRays.length; i++) {
        const ray = this.godRays[i];
        const rayAngle = ray.angleOffset + Math.sin(time * 0.001 * ray.speed + ray.phase) * 0.035;
        const rayBaseX = tx + (rayAngle / this.spotlight.halfAngle) * floorR;

        const rayGrad = ctx.createLinearGradient(sx, sy, rayBaseX, ty);
        const rayAlpha = ray.alpha * (0.8 + Math.sin(time * 0.002 + ray.phase) * 0.3) * intensity;
        rayGrad.addColorStop(0.05, `rgba(255, 250, 230, ${rayAlpha * 1.5})`);
        rayGrad.addColorStop(0.4, `rgba(255, 230, 160, ${rayAlpha})`);
        rayGrad.addColorStop(0.9, 'rgba(212, 175, 55, 0)');

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(rayBaseX - 35, ty);
        ctx.lineTo(rayBaseX + 35, ty);
        ctx.closePath();
        ctx.fillStyle = rayGrad;
        ctx.fill();
      }

      ctx.restore(); // Exit clip

      // Overhead Spotlight Luminaire Fixture & Lens Flare
      const lampGrad = ctx.createRadialGradient(sx, sy, 4, sx, sy, 55);
      lampGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      lampGrad.addColorStop(0.2, 'rgba(255, 240, 200, 0.7)');
      lampGrad.addColorStop(0.6, 'rgba(212, 175, 55, 0.25)');
      lampGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = lampGrad;
      ctx.beginPath();
      ctx.arc(sx, sy, 55, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    renderFloorStagePool(ctx, w, h, time) {
      const tx = this.spotlight.currentTargetX;
      const ty = h * 0.86;
      const rx = 360; // Horizontal radius of floor ellipse
      const ry = 80;  // Perspective vertical radius

      ctx.save();

      // 1. Outer Floor Light Bloom
      const poolBloom = ctx.createRadialGradient(tx, ty, 20, tx, ty, rx);
      poolBloom.addColorStop(0, `rgba(255, 245, 210, ${0.28 * this.spotlight.intensity})`);
      poolBloom.addColorStop(0.35, `rgba(212, 175, 55, ${0.16 * this.spotlight.intensity})`);
      poolBloom.addColorStop(0.75, 'rgba(180, 130, 30, 0.05)');
      poolBloom.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.beginPath();
      ctx.ellipse(tx, ty, rx, ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = poolBloom;
      ctx.fill();

      // 2. Luxury Showroom Stage Pedestal Ring (Gold Turntable)
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
      ctx.beginPath();
      ctx.ellipse(tx, ty, rx * 0.65, ry * 0.65, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Concentric inner precision ring with dashed ticks
      ctx.save();
      ctx.setLineDash([4, 8]);
      ctx.strokeStyle = 'rgba(255, 235, 180, 0.25)';
      ctx.beginPath();
      ctx.ellipse(tx, ty, rx * 0.48, ry * 0.48, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 3. Ground Spotlight Hotspot Core
      const coreGrad = ctx.createRadialGradient(tx, ty, 0, tx, ty, rx * 0.28);
      coreGrad.addColorStop(0, 'rgba(255, 255, 245, 0.45)');
      coreGrad.addColorStop(0.4, 'rgba(255, 230, 160, 0.25)');
      coreGrad.addColorStop(1, 'rgba(212, 175, 55, 0)');

      ctx.beginPath();
      ctx.ellipse(tx, ty, rx * 0.28, ry * 0.28, 0, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      ctx.restore();
    }

    renderLuxuryBrandShowcase(ctx, w, h, time) {
      // The logo badge focal anchor is placed at the prime spotlight sweet spot
      const cx = this.spotlight.currentTargetX;
      const cy = h * 0.38;

      ctx.save();

      // 1. Ambient Golden Halo / Pedestal Glow behind emblem
      const haloGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 180);
      haloGrad.addColorStop(0, 'rgba(255, 240, 200, 0.28)');
      haloGrad.addColorStop(0.4, 'rgba(212, 175, 55, 0.16)');
      haloGrad.addColorStop(0.85, 'rgba(180, 140, 40, 0.04)');
      haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 180, 0, Math.PI * 2);
      ctx.fill();

      // 2. Contact Drop Shadow beneath floating badge
      const shadowY = cy + 110;
      ctx.beginPath();
      ctx.ellipse(cx, shadowY, 95, 22, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.fill();

      // 3. Floating Levitation Ring with Beveled Gold Accents
      const levitateOffset = Math.sin(time * 0.0018) * 5;
      const badgeCenterY = cy + levitateOffset;

      // Outer Luxury Emblem Halo Ring
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
      ctx.beginPath();
      ctx.arc(cx, badgeCenterY, 82, 0, Math.PI * 2);
      ctx.stroke();

      // Specular Star Glint on Emblem Edge (sweeping diamond flash)
      const gleamProgress = (time * 0.0006) % 1.0;
      const gleamAngle = gleamProgress * Math.PI * 2;
      const glintX = cx + Math.cos(gleamAngle) * 82;
      const glintY = badgeCenterY + Math.sin(gleamAngle) * 82;

      this.drawDiamondGlint(ctx, glintX, glintY, 14, 0.85, 'rgba(255, 255, 255, 0.95)');

      ctx.restore();
    }

    renderDustMotes(ctx, minZ, maxZ, time) {
      const particles = this.particles;
      const pLen = particles.length;

      ctx.save();

      for (let i = 0; i < pLen; i++) {
        const p = particles[i];
        if (p.z < minZ || p.z >= maxZ) continue;

        const inBeam = p.inBeam;
        const twinkle = 0.5 + 0.5 * Math.sin(p.twinklePhase) * Math.cos(p.twinklePhase * 0.7);

        // --- OPTICAL ILLUMINATION ACCORDING TO USER SPEC ---
        // Outside the beam: faint, dark, shadowy motes (nearly invisible in the dim room)
        // Crossing the beam: ignites into brilliant gold & diamond scintillation!
        if (inBeam < 0.02) {
          // DIM ROOM SHADOW PARTICLES
          const darkAlpha = 0.035 + (p.z + 1) * 0.02;
          ctx.fillStyle = `rgba(140, 160, 195, ${darkAlpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.4, p.size * 0.65), 0, Math.PI * 2);
          ctx.fill();
        } else {
          // INSIDE THE HARD-EDGED LIGHT BEAM: TWINKLING GOLDEN / DIAMOND MOTES!
          const beamIntensity = Math.pow(inBeam, 1.4);
          const sparkleBoost = (p.sparkleDuration > 0) ? (p.sparkleDuration / p.sparkleMaxDuration) * 1.5 : 0;
          const totalBrightness = Math.min(1.0, (0.35 + 0.65 * twinkle + sparkleBoost) * beamIntensity);
          const currentSize = p.size * (1.0 + inBeam * 0.45 + (p.sparkleDuration > 0 ? 0.8 : 0));

          // FOREGROUND BOKEH ORBS (Particles very close to camera)
          if (p.z > 0.65) {
            const bokehGrad = ctx.createRadialGradient(
              p.x, p.y, 0,
              p.x, p.y, currentSize * 3.5
            );
            bokehGrad.addColorStop(0, `rgba(255, 250, 230, ${(0.45 * totalBrightness).toFixed(3)})`);
            bokehGrad.addColorStop(0.4, `rgba(212, 175, 55, ${(0.22 * totalBrightness).toFixed(3)})`);
            bokehGrad.addColorStop(1, 'rgba(212, 175, 55, 0)');

            ctx.fillStyle = bokehGrad;
            ctx.beginPath();
            ctx.arc(p.x, p.y, currentSize * 3.5, 0, Math.PI * 2);
            ctx.fill();
          } 
          // IN-FOCUS & MIDGROUND TWINKLING MOTES
          else {
            // Core bright white/gold speck
            const coreAlpha = (0.55 + 0.45 * twinkle) * beamIntensity;
            ctx.fillStyle = `rgba(255, 252, 235, ${coreAlpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
            ctx.fill();

            // Warm gold corona aura
            if (inBeam > 0.3) {
              ctx.fillStyle = `rgba(212, 175, 55, ${(0.25 * totalBrightness).toFixed(3)})`;
              ctx.beginPath();
              ctx.arc(p.x, p.y, currentSize * 2.2, 0, Math.PI * 2);
              ctx.fill();
            }

            // 4-POINT DIAMOND DIFFRACTION FLARE (Sparkling Motes)
            if (p.sparkleDuration > 0 && inBeam > 0.4) {
              const flareLen = (6 + currentSize * 4) * p.sparkleScale;
              const flareAlpha = (p.sparkleDuration / p.sparkleMaxDuration) * inBeam;
              this.drawDiamondGlint(ctx, p.x, p.y, flareLen, flareAlpha, 'rgba(255, 255, 255, 0.9)');
            }
          }
        }
      }

      ctx.restore();
    }

    drawDiamondGlint(ctx, x, y, size, alpha, color) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.globalAlpha = alpha;

      // Vertical spike
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.lineTo(x, y + size);
      ctx.stroke();

      // Horizontal spike
      ctx.beginPath();
      ctx.moveTo(x - size, y);
      ctx.lineTo(x + size, y);
      ctx.stroke();

      // Diagonal shorter cross
      const diag = size * 0.45;
      ctx.beginPath();
      ctx.moveTo(x - diag, y - diag);
      ctx.lineTo(x + diag, y + diag);
      ctx.moveTo(x + diag, y - diag);
      ctx.lineTo(x - diag, y + diag);
      ctx.stroke();

      // Central diamond flare core
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(x, y, 1.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new HeroCinematicSpotlight());
  } else {
    new HeroCinematicSpotlight();
  }
})();

