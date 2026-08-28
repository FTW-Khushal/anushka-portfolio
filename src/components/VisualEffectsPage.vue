<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import BeforeAfterSlider from './BeforeAfterSlider.vue'
import { projectsData } from '../config/workData.js'

const emit = defineEmits(['navigate'])

// Filter visual effects projects (using both vfx and visual-effects categories)
const vfxProjects = computed(() => {
  return projectsData.filter(p => p.category === 'visual-effects' || p.category === 'vfx')
})

const goBack = () => {
  emit('navigate', 'home')
}

// Camera Viewfinder & Gyroscope Controls
const currentPanX = ref(0) // Smoothed pan percentage (-38% to 38%)
const currentPanY = ref(0) // Smoothed pitch percentage (-14% to 14%)
const rollAngle = ref(0)   // Sensor roll angle for horizon level indicator
const isGyroActive = ref(false)
const needsGyroPermission = ref(false)
const timecode = ref('00:00:00:00')
const isHoveredOrTouched = ref(false)

let targetPanX = 0
let targetPanY = 0
let targetRoll = 0
let animFrameId = null
let timecodeInterval = null
let autoPanAngle = 0
let lastInteractionTime = Date.now()
let initialAlpha = null

// Touch Drag tracking
let touchStartX = 0
let touchStartY = 0
let initialPanX = 0
let initialPanY = 0

// Format Timecode
let startTime = Date.now()
const updateTimecode = () => {
  const elapsed = Date.now() - startTime
  const ms = Math.floor((elapsed % 1000) / 40)
  const sec = Math.floor((elapsed / 1000) % 60)
  const min = Math.floor((elapsed / (1000 * 60)) % 60)
  const hrs = Math.floor((elapsed / (1000 * 60 * 60)) % 24)
  
  timecode.value = `${String(hrs).padStart(2, '0')}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}:${String(ms).padStart(2, '0')}`
}

// Recenter Gyro Zero Point
const recenterGyro = () => {
  initialAlpha = null
}

// Smooth Animation Loop (LERP)
const animate = () => {
  const now = Date.now()
  const isIdle = !isGyroActive.value && !isHoveredOrTouched.value && (now - lastInteractionTime > 2000)

  if (isIdle) {
    // Gentle floating auto-pan when untouched
    autoPanAngle += 0.004
    targetPanX = Math.sin(autoPanAngle) * 16
    targetPanY = Math.cos(autoPanAngle * 0.7) * 6
    targetRoll = Math.sin(autoPanAngle * 0.5) * 2
  }

  // Smooth LERP physics (dampening)
  currentPanX.value += (targetPanX - currentPanX.value) * 0.07
  currentPanY.value += (targetPanY - currentPanY.value) * 0.07
  rollAngle.value += (targetRoll - rollAngle.value) * 0.09

  animFrameId = requestAnimationFrame(animate)
}

// Handle Device Orientation Event (Gyroscope)
const handleOrientation = (e) => {
  if (e.beta === null && e.gamma === null) return
  isGyroActive.value = true
  lastInteractionTime = Date.now()

  const alpha = e.alpha || 0
  const beta = e.beta || 0
  const gamma = e.gamma || 0

  if (initialAlpha === null) {
    initialAlpha = alpha
  }

  // Calculate shortest angle delta for alpha (yaw / swivel left-right)
  let diffAlpha = alpha - initialAlpha
  if (diffAlpha > 180) diffAlpha -= 360
  if (diffAlpha < -180) diffAlpha += 360

  // Combine swivel (diffAlpha) and tilt (gamma) so both ways of turning phone work!
  const combinedX = (diffAlpha * 0.9) + (gamma * 0.8)

  // Clamp combined X to [-45, 45]
  const clampedX = Math.max(-45, Math.min(45, combinedX))

  // Pitch (up/down): natural holding pitch is around 45 deg
  const clampedY = Math.max(-25, Math.min(25, beta - 45))

  // Map to background pan range (-38% to 38% for dramatic left/right panning)
  targetPanX = (clampedX / 45) * -38 // Reverse so turning right pans camera view right
  targetPanY = (clampedY / 25) * -14
  targetRoll = Math.max(-15, Math.min(15, gamma * 0.4))
}

// Request Permission for iOS 13+
const requestGyroPermission = async () => {
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      const permission = await DeviceOrientationEvent.requestPermission()
      if (permission === 'granted') {
        needsGyroPermission.value = false
        initialAlpha = null
        window.addEventListener('deviceorientation', handleOrientation)
      } else {
        alert('Permission denied. Touch or drag to pan the camera view.')
      }
    } catch (err) {
      console.error('Gyro permission error:', err)
    }
  }
}

// Check if iOS permission is required or register gyro event listener
const checkGyroSupport = () => {
  if (typeof window !== 'undefined' && typeof DeviceOrientationEvent !== 'undefined') {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      needsGyroPermission.value = true
    } else {
      window.addEventListener('deviceorientation', handleOrientation)
    }
  }
}

// Mouse Move Parallax (Desktop)
const handleMouseMove = (e) => {
  if (isGyroActive.value) return
  isHoveredOrTouched.value = true
  lastInteractionTime = Date.now()

  const { innerWidth, innerHeight } = window
  const normX = (e.clientX / innerWidth) - 0.5 // -0.5 to 0.5
  const normY = (e.clientY / innerHeight) - 0.5

  targetPanX = normX * -35 // Pan up to 17.5%
  targetPanY = normY * -14
  targetRoll = normX * -5
}

const handleMouseLeave = () => {
  isHoveredOrTouched.value = false
  lastInteractionTime = Date.now()
}

// Touch Drag Handlers (Mobile Fallback / Touch Pan)
const handleTouchStart = (e) => {
  if (e.touches.length === 1) {
    isHoveredOrTouched.value = true
    lastInteractionTime = Date.now()
    touchStartX = e.touches[0].clientX
    touchStartY = e.touches[0].clientY
    initialPanX = targetPanX
    initialPanY = targetPanY
  }
}

const handleTouchMove = (e) => {
  if (e.touches.length === 1 && isHoveredOrTouched.value) {
    lastInteractionTime = Date.now()
    const deltaX = e.touches[0].clientX - touchStartX
    const deltaY = e.touches[0].clientY - touchStartY
    
    // Scale delta to percentage pan
    targetPanX = Math.max(-38, Math.min(38, initialPanX + (deltaX / window.innerWidth) * 60))
    targetPanY = Math.max(-14, Math.min(14, initialPanY + (deltaY / window.innerHeight) * 25))
  }
}

const handleTouchEnd = () => {
  isHoveredOrTouched.value = false
  lastInteractionTime = Date.now()
}

onMounted(() => {
  checkGyroSupport()
  animFrameId = requestAnimationFrame(animate)
  timecodeInterval = setInterval(updateTimecode, 40)
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  if (animFrameId) cancelAnimationFrame(animFrameId)
  if (timecodeInterval) clearInterval(timecodeInterval)
  if (typeof window !== 'undefined') {
    window.removeEventListener('deviceorientation', handleOrientation)
    window.removeEventListener('mousemove', handleMouseMove)
  }
})
</script>

<template>
  <div class="vfx-page">
    <!-- Cinematic Film Grain -->
    <div class="film-grain"></div>

    <!-- Full-Width Hero Section -->
    <section 
      class="hero-section"
      @mouseleave="handleMouseLeave"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <div class="hero-bg-container">
        <div 
          class="hero-bg-image"
          :style="{
            transform: `scale(1.25) translate3d(${currentPanX}%, ${currentPanY}%, 0)`
          }"
        ></div>
        <div class="hero-bg-overlay"></div>
      </div>

      <!-- Camera Viewfinder HUD Overlay -->
      <div class="viewfinder-hud">
        <!-- Corner Frame Brackets -->
        <div class="corner-reticle top-left"></div>
        <div class="corner-reticle top-right"></div>
        <div class="corner-reticle bottom-left"></div>
        <div class="corner-reticle bottom-right"></div>

        <!-- Top Status Bar -->
        <div class="hud-top-bar">
          <div class="rec-badge">
            <span class="rec-dot"></span>
            <span class="rec-text">REC</span>
            <span class="timecode">{{ timecode }}</span>
          </div>
          <div class="format-badge">
            <span class="spec-tag">4K DCI</span>
            <span class="spec-tag">RAW 60FPS</span>
          </div>
        </div>

        <!-- Center Aim Crosshair / Focus Frame -->
        <div class="hud-center-target">
          <div class="target-box">
            <div class="target-cross"></div>
          </div>
        </div>

        <!-- Bottom Spec & Gyro Controls Bar -->
        <div class="hud-bottom-bar">
          <div class="camera-specs">
            <span>ISO 800</span>
            <span>1/48s</span>
            <span>f/2.8</span>
            <span>PRORES 4444</span>
          </div>

          <!-- Electronic Horizon Level Indicator -->
          <div class="horizon-level-wrapper" title="Electronic Horizon Level">
            <div class="horizon-line" :style="{ transform: `rotate(${rollAngle}deg)` }">
              <span class="level-center-dot"></span>
            </div>
          </div>

          <!-- Gyro Sensor Control / Mode Status -->
          <div class="gyro-status-badge">
            <button 
              v-if="needsGyroPermission && !isGyroActive" 
              class="gyro-enable-btn"
              @click="requestGyroPermission"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
              ENABLE LENS GYRO
            </button>
            <div v-else-if="isGyroActive" class="gyro-active-indicator">
              <span class="pulse-icon"></span>
              GYRO PAN ACTIVE
            </div>
            <div v-else class="gyro-hint-indicator">
              <span class="drag-icon">↔</span>
              TILT OR SWIPE TO PAN
            </div>
          </div>
        </div>
      </div>

      <!-- Hero Content Container -->
      <div class="hero-content container">
        <div class="hero-title-wrapper">
          <h1 class="hero-title">VISUAL EFFECTS</h1>
          <p class="hero-description">
            A showcase of dynamic simulations, particle effects, and high-end compositing work for film and digital media.
          </p>
        </div>
      </div>
    </section>

    <!-- Main Content Container -->
    <div class="container content-container">

      <!-- Showreels Section -->
      <section class="section showreels-section">
        <div class="section-header">
          <h2 class="section-title">Showreels</h2>
          <div class="section-line"></div>
        </div>
        
        <div class="reels-stack">
          <div class="video-wrapper">
            <div class="video-container cinematic-frame">
              <iframe 
                src="https://player.vimeo.com/video/858806190?title=0&byline=0&portrait=0&color=ffffff" 
                style="position:absolute;top:0;left:0;width:100%;height:100%;border-radius:6px;" 
                frameborder="0" 
                allow="autoplay; fullscreen; picture-in-picture" 
                allowfullscreen>
              </iframe>
            </div>
          </div>
          <div class="video-wrapper">
            <div class="video-container cinematic-frame">
              <iframe 
                src="https://player.vimeo.com/video/1073455743?title=0&byline=0&portrait=0&color=ffffff" 
                style="position:absolute;top:0;left:0;width:100%;height:100%;border-radius:6px;" 
                frameborder="0" 
                allow="autoplay; fullscreen; picture-in-picture" 
                allowfullscreen>
              </iframe>
            </div>
          </div>
        </div>
      </section>

      <!-- Before & After Section -->
      <section class="section before-after-section">
        <div class="section-header">
          <h2 class="section-title">Breakdowns</h2>
          <div class="section-line"></div>
        </div>
        <p class="section-subtitle">Slide to reveal the compositing process from raw plate to final render.</p>
        
        <div class="slider-wrapper">
          <BeforeAfterSlider 
            beforeImage="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80"
            afterImage="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80"
            beforeLabel="Raw Plate"
            afterLabel="Final Comp"
          />
        </div>
      </section>

      <!-- Other Projects Section -->
      <section class="section projects-section">
        <div class="section-header">
          <h2 class="section-title">Selected Works</h2>
          <div class="section-line"></div>
        </div>
        
        <div class="masonry-grid">
          <div 
            v-for="project in vfxProjects" 
            :key="project.id" 
            class="masonry-item"
            :class="project.aspect"
          >
            <div class="project-card">
              <img :src="project.image" :alt="project.title" loading="lazy" />
              <div class="project-overlay">
                <div class="overlay-content">
                  <h3>{{ project.title }}</h3>
                  <p>{{ project.description }}</p>
                  <span class="year">{{ project.year }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.vfx-page {
  padding-bottom: 6rem;
  min-height: 100vh;
  background-color: #050505; /* Deep cinematic black */
  position: relative;
}

.content-container {
  padding-top: 6rem;
  position: relative;
  z-index: 10;
}

/* Film Grain Overlay */
.film-grain {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}

/* Full-Width Hero Section */
.hero-section {
  position: relative;
  height: 100vh;
  min-height: 600px;
  width: 100%;
  display: flex;
  align-items: flex-end;
  padding-bottom: 5rem;
  overflow: hidden;
}

.hero-bg-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.hero-bg-image {
  position: absolute;
  top: -20%;
  left: -40%;
  width: 180%;
  height: 140%;
  background-image: url('https://cdn.prod.website-files.com/680aa9a18fba68b1fec52c0d/680ab8a0a657e2b0ad0bf586_Screenshot2025-04-1322424.jpeg');
  background-size: cover;
  background-position: center;
  will-change: transform;
  transition: transform 0.05s ease-out;
}

.hero-bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(5,5,5,1) 0%, rgba(5,5,5,0.4) 50%, rgba(5,5,5,0.7) 100%);
}

/* Camera Viewfinder HUD Overlay */
.viewfinder-hud {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 3;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Corner Frame Brackets */
.corner-reticle {
  position: absolute;
  width: 24px;
  height: 24px;
  border-color: rgba(255, 255, 255, 0.4);
  border-style: solid;
  pointer-events: none;
}

.top-left {
  top: 1.5rem;
  left: 1.5rem;
  border-width: 2px 0 0 2px;
}

.top-right {
  top: 1.5rem;
  right: 1.5rem;
  border-width: 2px 2px 0 0;
}

.bottom-left {
  bottom: 1.5rem;
  left: 1.5rem;
  border-width: 0 0 2px 2px;
}

.bottom-right {
  bottom: 1.5rem;
  right: 1.5rem;
  border-width: 0 2px 2px 0;
}

/* Top Status Bar */
.hud-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-top: 0.5rem;
}

.rec-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(12px);
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  font-family: monospace, monospace;
  font-size: 0.85rem;
  color: #ffffff;
}

.rec-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ef4444;
  box-shadow: 0 0 8px #ef4444;
  animation: recBlink 1.2s infinite;
}

@keyframes recBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}

.rec-text {
  font-weight: 700;
  color: #ef4444;
  letter-spacing: 0.05em;
}

.timecode {
  color: #e2e8f0;
  margin-left: 0.4rem;
  font-weight: 600;
}

.format-badge {
  display: flex;
  gap: 0.4rem;
}

.spec-tag {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(12px);
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-family: monospace;
  font-size: 0.75rem;
  color: #94a3b8;
  letter-spacing: 0.05em;
}

/* Center Reticle Target */
.hud-center-target {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.4;
  pointer-events: none;
}

.target-box {
  width: 50px;
  height: 50px;
  border: 1px dashed rgba(255, 255, 255, 0.6);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.target-cross {
  width: 10px;
  height: 10px;
  position: relative;
}

.target-cross::before, .target-cross::after {
  content: '';
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
}

.target-cross::before {
  top: 4px;
  left: 0;
  width: 10px;
  height: 2px;
}

.target-cross::after {
  top: 0;
  left: 4px;
  width: 2px;
  height: 10px;
}

/* Bottom Bar Specs & Horizon Level */
.hud-bottom-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-bottom: 0.5rem;
  gap: 1rem;
}

.camera-specs {
  display: flex;
  gap: 0.8rem;
  font-family: monospace;
  font-size: 0.75rem;
  color: #cbd5e1;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* Electronic Horizon Level */
.horizon-level-wrapper {
  width: 90px;
  height: 16px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.horizon-line {
  width: 60px;
  height: 2px;
  background: #38bdf8;
  box-shadow: 0 0 6px rgba(56, 189, 248, 0.6);
  position: relative;
  transition: transform 0.1s linear;
}

.level-center-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 4px;
  height: 4px;
  background: #ffffff;
  border-radius: 50%;
}

/* Gyro Button & Status Indicators */
.gyro-status-badge {
  pointer-events: auto;
}

.gyro-enable-btn {
  background: rgba(56, 189, 248, 0.2);
  border: 1px solid rgba(56, 189, 248, 0.5);
  color: #38bdf8;
  font-family: monospace;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  cursor: pointer;
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.3s ease;
}

.gyro-enable-btn:hover {
  background: rgba(56, 189, 248, 0.35);
  transform: scale(1.05);
}

.gyro-active-indicator, .gyro-hint-indicator {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-family: monospace;
  font-size: 0.75rem;
  color: #94a3b8;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.pulse-icon {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #38bdf8;
  box-shadow: 0 0 6px #38bdf8;
  animation: recBlink 1.5s infinite;
}

.drag-icon {
  color: #38bdf8;
}

@media (max-width: 768px) {
  .camera-specs {
    display: none; /* Hide dense specs on small screens to keep UI clean */
  }
  
  .spec-tag:not(:first-child) {
    display: none;
  }
  
  .viewfinder-hud {
    padding: 1rem;
  }
  
  .top-left { top: 1rem; left: 1rem; }
  .top-right { top: 1rem; right: 1rem; }
  .bottom-left { bottom: 1rem; left: 1rem; }
  .bottom-right { bottom: 1rem; right: 1rem; }
}

.hero-bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(5,5,5,1) 0%, rgba(5,5,5,0.4) 50%, rgba(5,5,5,0.7) 100%);
}

.hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
}

.hero-back {
  position: absolute;
  top: calc(-100vh + var(--header-height) + 6rem);
  left: 1.5rem;
  z-index: 10;
}

.hero-title-wrapper {
  max-width: 1000px;
  animation: fadeInUp 1s cubic-bezier(0.25, 1, 0.5, 1) forwards;
  animation-delay: 0.2s;
  opacity: 0;
}

.hero-title {
  font-family: var(--font-family);
  font-size: clamp(3.5rem, 8vw, 7rem);
  font-weight: 900;
  letter-spacing: -0.04em;
  margin-bottom: 1.5rem;
  color: #ffffff;
  text-shadow: 0 10px 30px rgba(0,0,0,0.8);
  /* Optional: adds a slight glassy texture to text */
  background: linear-gradient(180deg, #ffffff 0%, #a0a0a0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-description {
  font-size: clamp(1.1rem, 2vw, 1.4rem);
  color: #cbd5e1;
  line-height: 1.6;
  max-width: 600px;
  text-shadow: 0 4px 10px rgba(0,0,0,0.5);
  font-weight: 300;
}

/* Back Button Updates */
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.1);
  color: #ffffff;
  font-family: var(--font-family);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.6rem 1.2rem;
  border-radius: 30px;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(255,255,255,0.1);
  transform: translateX(-4px);
}

@keyframes cameraPan {
  0% { transform: scale(1.1) translateX(2%); }
  100% { transform: scale(1.1) translateX(-2%); }
}

/* Sections Base */
.section {
  margin-bottom: 8rem;
  opacity: 0;
  animation: fadeInUp 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}

.section:nth-child(2) { animation-delay: 0.2s; }
.section:nth-child(3) { animation-delay: 0.4s; }
.section:nth-child(4) { animation-delay: 0.6s; }

.section-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
}

.section-line {
  height: 1px;
  flex-grow: 1;
  background: linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
}

.section-subtitle {
  color: #94a3b8;
  margin-bottom: 2.5rem;
  margin-top: -1rem;
  font-size: 1.1rem;
}

/* Cinematic Stacked Showreels */
.reels-stack {
  display: flex;
  flex-direction: column;
  gap: 8rem; /* Increased gap to allow glow to breathe */
  max-width: 1400px;
  margin: 0 auto;
}

.video-wrapper {
  position: relative;
  width: 100%;
}

.cinematic-frame {
  position: relative;
  z-index: 2;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
  background-color: #000;
  border-radius: 8px;
  /* Multi-layered box-shadow: drop shadow + subtle border + massive ambient glow */
  box-shadow: 
    0 30px 60px rgba(0, 0, 0, 0.8), 
    0 0 0 1px rgba(255, 255, 255, 0.05),
    0 0 100px 20px rgba(120, 180, 255, 0.15); /* Ambient blue glow */
  overflow: hidden;
  transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.5s ease;
}

.cinematic-frame:hover {
  transform: translateY(-8px) scale(1.01);
  box-shadow: 
    0 40px 80px rgba(0, 0, 0, 0.9), 
    0 0 0 1px rgba(255, 255, 255, 0.15),
    0 0 180px 40px rgba(120, 180, 255, 0.25); /* Intensified glow on hover */
}

/* Before & After Section */
.slider-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

/* Masonry Grid for Projects */
.masonry-grid {
  column-count: 1;
  column-gap: 1.5rem;
}

@media (min-width: 640px) {
  .masonry-grid { column-count: 2; }
}

@media (min-width: 1024px) {
  .masonry-grid { column-count: 2; }
}

.masonry-item {
  break-inside: avoid;
  margin-bottom: 1.5rem;
  width: 100%;
}

.project-card {
  position: relative;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background-color: #111;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.project-card img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
}

.project-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%);
  display: flex;
  align-items: flex-end;
  padding: 2rem;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.project-card:hover img {
  transform: scale(1.05);
}

.project-card:hover .project-overlay {
  opacity: 1;
}

.overlay-content h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.5rem;
  transform: translateY(20px);
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.overlay-content p {
  font-size: 0.95rem;
  color: #cbd5e1;
  margin-bottom: 1rem;
  transform: translateY(20px);
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  transition-delay: 0.05s;
}

.overlay-content .year {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  font-size: 0.8rem;
  color: #fff;
  backdrop-filter: blur(4px);
  transform: translateY(20px);
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  transition-delay: 0.1s;
}

.project-card:hover .overlay-content h3,
.project-card:hover .overlay-content p,
.project-card:hover .overlay-content .year {
  transform: translateY(0);
}

/* Aspect Ratio Modifiers */
.aspect-square .project-card img { aspect-ratio: 1 / 1; }
.aspect-wide .project-card img { aspect-ratio: 16 / 9; }
.aspect-tall .project-card img { aspect-ratio: 4 / 5; }

/* Animations */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
