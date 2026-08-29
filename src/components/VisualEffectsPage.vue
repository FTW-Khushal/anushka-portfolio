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

// Hero Parallax & Touch Drag Controls
const currentPanX = ref(0) // Desktop X parallax (-3.5% to 3.5%)
const currentPanY = ref(0) // Desktop Y parallax (-3.5% to 3.5%)
const currentBgPanX = ref(0) // Mobile touch pan (-50 to 50 for background-position)
const isHoveredOrTouched = ref(false)
const hasSwiped = ref(false) // Hide swipe hint once user interacts

let targetPanX = 0
let targetPanY = 0
let targetBgPanX = 0
let animFrameId = null
let autoPanAngle = 0
let lastInteractionTime = Date.now()

// Touch Drag tracking
let touchStartX = 0
let initialBgPanX = 0

// Smooth Animation Loop (LERP physics)
const animate = () => {
  const now = Date.now()
  const isIdle = !isHoveredOrTouched.value && (now - lastInteractionTime > 2500)

  if (isIdle) {
    // Gentle floating auto-pan when untouched
    autoPanAngle += 0.004
    targetPanX = Math.sin(autoPanAngle) * 2
    targetPanY = Math.cos(autoPanAngle * 0.7) * 1.5
  }

  // Smooth LERP physics (dampening)
  currentPanX.value += (targetPanX - currentPanX.value) * 0.08
  currentPanY.value += (targetPanY - currentPanY.value) * 0.08
  currentBgPanX.value += (targetBgPanX - currentBgPanX.value) * 0.12

  animFrameId = requestAnimationFrame(animate)
}

// Mouse Move Parallax (Desktop)
const handleMouseMove = (e) => {
  isHoveredOrTouched.value = true
  lastInteractionTime = Date.now()

  const { innerWidth, innerHeight } = window
  const normX = (e.clientX / innerWidth) - 0.5 // -0.5 to 0.5
  const normY = (e.clientY / innerHeight) - 0.5

  targetPanX = normX * -7 // Max +-3.5%
  targetPanY = normY * -7 // Max +-3.5%
}

const handleMouseLeave = () => {
  isHoveredOrTouched.value = false
  lastInteractionTime = Date.now()
}

// Touch Drag Handlers (Mobile Swipe/Drag)
const handleTouchStart = (e) => {
  if (e.touches.length === 1) {
    isHoveredOrTouched.value = true
    hasSwiped.value = true
    lastInteractionTime = Date.now()
    touchStartX = e.touches[0].clientX
    initialBgPanX = targetBgPanX
  }
}

const handleTouchMove = (e) => {
  if (e.touches.length === 1 && isHoveredOrTouched.value) {
    lastInteractionTime = Date.now()
    const deltaX = e.touches[0].clientX - touchStartX
    
    // Scale delta to percentage pan of the background position
    // deltaX is in pixels. Dragging left (negative deltaX) should pan right (increase bg position)
    const deltaPercent = (deltaX / window.innerWidth) * -100
    
    // Clamp to [-50, 50] to keep background position between 0% and 100%
    targetBgPanX = Math.max(-50, Math.min(50, initialBgPanX + deltaPercent))
  }
}

const handleTouchEnd = () => {
  isHoveredOrTouched.value = false
  lastInteractionTime = Date.now()
}

onMounted(() => {
  animFrameId = requestAnimationFrame(animate)
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  if (animFrameId) cancelAnimationFrame(animFrameId)
  if (typeof window !== 'undefined') {
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
            transform: `translate3d(${currentPanX}%, ${currentPanY}%, 0)`,
            backgroundPosition: `${50 + currentBgPanX}% 50%`
          }"
        ></div>
        <div class="hero-bg-overlay"></div>
      </div>

      <!-- Mobile Touch Swipe Hint Badge (Mobile Only) -->
      <div class="mobile-swipe-hint" :class="{ 'fade-out': hasSwiped }">
        <div class="hint-pill">
          <svg class="swipe-arrow left" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          <span>Drag left or right to explore</span>
          <svg class="swipe-arrow right" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
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
  top: -4%;
  left: -4%;
  width: 108%;
  height: 108%;
  background-image: url('https://cdn.prod.website-files.com/680aa9a18fba68b1fec52c0d/680ab8a0a657e2b0ad0bf586_Screenshot2025-04-1322424.jpeg');
  background-size: cover;
  background-position: center;
  will-change: transform, background-position;
}

.hero-bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(5,5,5,1) 0%, rgba(5,5,5,0.4) 50%, rgba(5,5,5,0.7) 100%);
}

/* Mobile Touch Swipe Hint Badge */
.mobile-swipe-hint {
  display: none; /* Hidden on desktop */
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  pointer-events: none;
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.mobile-swipe-hint.fade-out {
  opacity: 0;
  transform: translate(-50%, 10px);
}

.hint-pill {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 0.55rem 1.2rem;
  border-radius: 30px;
  color: #e2e8f0;
  font-size: 0.82rem;
  font-family: var(--font-family);
  font-weight: 500;
  letter-spacing: 0.02em;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  white-space: nowrap;
}

.swipe-arrow {
  color: #38bdf8;
}

.swipe-arrow.left {
  animation: bounceLeft 1.6s infinite ease-in-out;
}

.swipe-arrow.right {
  animation: bounceRight 1.6s infinite ease-in-out;
}

@keyframes bounceLeft {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-4px); }
}

@keyframes bounceRight {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(4px); }
}

@media (max-width: 768px) {
  .mobile-swipe-hint {
    display: flex;
  }
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
