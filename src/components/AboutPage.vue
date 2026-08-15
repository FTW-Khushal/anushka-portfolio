<script setup>
import { ref } from 'vue'
import { aboutData } from '../config/aboutData.js'

const emit = defineEmits(['navigate'])

const goToHome = (anchor = '') => {
  emit('navigate', 'home', anchor)
}

// Hover state for the massive right-side canvas
const activeImage = ref(aboutData.hero.portraitImage)
const isHovering = ref(false)

const handleHover = (image) => {
  if (image) {
    activeImage.value = image
    isHovering.value = true
  }
}

const handleHoverLeave = () => {
  isHovering.value = false
  // Revert back to hero portrait when cursor leaves the interactive areas
  activeImage.value = aboutData.hero.portraitImage
}
</script>

<template>
  <div class="about-page">
    <div class="split-layout">
      
      <!-- LEFT COLUMN: Naturally flowing content that scrolls with main document -->
      <div class="left-content" @mouseleave="handleHoverLeave">
        
        <!-- 1. Hero Section -->
        <section class="hero-section">
          <div class="hero-header">
            <div class="status-minimal">
              <span class="pulse-dot"></span>
              <span>{{ aboutData.hero.location }} — {{ aboutData.hero.role.toUpperCase() }}</span>
            </div>
            <h1 class="hero-title">{{ aboutData.hero.fullName }}</h1>
            <p class="hero-lead">{{ aboutData.hero.tagline }}</p>
          </div>

          <!-- Mobile-only portrait image -->
          <div class="mobile-portrait-card">
            <img :src="aboutData.hero.portraitImage" :alt="aboutData.hero.fullName" class="mobile-portrait-img" />
          </div>

          <div class="hero-stats">
            <div v-for="(st, idx) in aboutData.hero.stats" :key="idx" class="stat-item">
              <span class="stat-num">{{ st.num }}</span>
              <span class="stat-label">{{ st.label }}</span>
            </div>
          </div>

          <div class="hero-actions">
            <a :href="'mailto:' + aboutData.hero.email" class="btn-clean">
              Get in Touch
            </a>
            <a :href="aboutData.hero.instagram" target="_blank" rel="noopener noreferrer" class="btn-clean">
              Instagram
            </a>
            <button class="btn-clean" @click="goToHome('#work')">
              Portfolio
            </button>
          </div>
        </section>

        <hr class="minimal-divider" />

        <!-- 2. The Journey (Contact Sheet Style) -->
        <section class="timeline-section">
          <h2 class="section-title">Timeline</h2>
          <div class="timeline-list">
            <div 
              v-for="item in aboutData.journey" 
              :key="item.id" 
              class="timeline-row"
              :class="{ 'is-active': isHovering && activeImage === item.image }"
              @mouseenter="handleHover(item.image)"
            >
              <div class="row-year">{{ item.year }}</div>
              <div class="row-details">
                <h3 class="row-title">{{ item.title }}</h3>
                <span class="row-org">{{ item.org }}</span>
                <p class="row-summary">{{ item.summary }}</p>
              </div>
            </div>
          </div>
        </section>

        <hr class="minimal-divider" />

        <!-- 3. Skills & Foundations (Typographic Lists) -->
        <section class="skills-section">
          <h2 class="section-title">Software & Tools</h2>
          <ul class="clean-list">
            <li 
              v-for="(skill, idx) in aboutData.skills" 
              :key="idx"
              class="list-item"
              :class="{ 'is-active': isHovering && activeImage === skill.image }"
              @mouseenter="handleHover(skill.image)"
            >
              <span class="item-name">{{ skill.name }}</span>
              <span class="item-meta">{{ skill.category }}</span>
            </li>
          </ul>
        </section>

        <section class="foundations-section">
          <h2 class="section-title">Traditional Foundations</h2>
          <ul class="clean-list">
            <li 
              v-for="(foundation, idx) in aboutData.foundations" 
              :key="idx"
              class="list-item"
              :class="{ 'is-active': isHovering && activeImage === foundation.image }"
              @mouseenter="handleHover(foundation.image)"
            >
              <span class="item-name">{{ foundation.name }}</span>
            </li>
          </ul>
        </section>

        <div class="bottom-spacer"></div>
      </div>

      <!-- RIGHT COLUMN: Sticky Canvas pinned to viewport during window scroll -->
      <div class="right-canvas">
        <div class="canvas-wrapper">
          <transition name="crossfade">
            <img 
              :key="activeImage" 
              :src="activeImage" 
              alt="Visual Canvas" 
              class="canvas-image" 
              :class="{ 'is-hovering': isHovering }"
            />
          </transition>
          <!-- Subtle overlay for cinematic feel -->
          <div class="canvas-overlay"></div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.about-page {
  width: 100%;
  min-height: 100vh;
  background-color: #000000;
  color: #e2e8f0;
  position: relative;
}

/* Layout: unified window scroll with sticky right pane */
.split-layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  position: relative;
}

@media (min-width: 992px) {
  .split-layout {
    flex-direction: row;
    align-items: flex-start;
  }
}

/* Left Column: flows with the main document scroll */
.left-content {
  flex: 1;
  padding: calc(var(--header-height) + 2rem) 2rem 4rem;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

@media (min-width: 992px) {
  .left-content {
    flex: 0 0 50%;
    max-width: 50%;
    padding: calc(var(--header-height) + 3rem) 4rem 6rem 5vw;
    margin: 0;
  }
}

/* Mobile-only portrait card */
.mobile-portrait-card {
  display: block;
  width: 100%;
  max-width: 420px;
  aspect-ratio: 4 / 3;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: #090a0d;
}

.mobile-portrait-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (min-width: 992px) {
  .mobile-portrait-card {
    display: none;
  }
}

/* Right Canvas: Sticky pinned to viewport */
.right-canvas {
  display: none;
}

@media (min-width: 992px) {
  .right-canvas {
    display: block;
    flex: 0 0 50%;
    width: 50%;
    height: 100vh;
    position: sticky;
    top: 0;
    background-color: #050505;
    overflow: hidden;
    z-index: 10;
  }
}

.canvas-wrapper {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.canvas-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: opacity 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), transform 1.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  transform: scale(1.02);
}

.canvas-image.is-hovering {
  transform: scale(1.05); /* Subtle Ken Burns zoom on hover */
}

.canvas-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 25%, transparent 100%),
              linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 20%);
  pointer-events: none;
}

/* Typography & Elements */
.section-title {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: #64748b;
  text-transform: uppercase;
  margin-bottom: 2rem;
}

.minimal-divider {
  border: none;
  border-top: 1px solid rgba(255,255,255,0.08);
  margin: 3.5rem 0;
}

/* Hero Section */
.hero-section {
  margin-bottom: 1.5rem;
}

.status-minimal {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.72rem;
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: 0.1em;
  margin-bottom: 1.5rem;
}

.pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #ffffff;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
}

.hero-title {
  font-size: clamp(2.5rem, 4.2vw, 4rem);
  font-weight: 800;
  line-height: 1.08;
  color: #ffffff;
  letter-spacing: -0.025em;
  margin-bottom: 1.25rem;
}

.hero-lead {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #94a3b8;
  max-width: 92%;
  margin-bottom: 2.25rem;
}

.hero-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 2.5rem;
  margin-bottom: 2.5rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-num {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
}

.stat-label {
  font-size: 0.7rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-top: 0.25rem;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1.75rem;
}

.btn-clean {
  background: none;
  border: none;
  padding: 0;
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  position: relative;
  transition: color 0.3s ease;
  text-decoration: none;
}

.btn-clean::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: rgba(255,255,255,0.3);
  transition: background-color 0.3s ease, width 0.3s ease;
}

.btn-clean:hover {
  color: #ffffff;
}

.btn-clean:hover::after {
  background-color: #ffffff;
}

/* Timeline (Contact Sheet Style) */
.timeline-list {
  display: flex;
  flex-direction: column;
}

.timeline-row {
  display: grid;
  grid-template-columns: 110px 1fr;
  padding: 1.5rem 0.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  cursor: crosshair;
  transition: all 0.25s ease;
  border-left: 2px solid transparent;
}

.timeline-row:hover,
.timeline-row.is-active {
  background-color: rgba(255, 255, 255, 0.03);
  border-left-color: #ffffff;
  padding-left: 0.85rem;
}

.row-year {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
  padding-top: 0.2rem;
}

.row-details {
  display: flex;
  flex-direction: column;
}

.row-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: #f1f5f9;
  margin-bottom: 0.25rem;
  transition: color 0.2s ease;
}

.timeline-row:hover .row-title,
.timeline-row.is-active .row-title {
  color: #ffffff;
}

.row-org {
  font-size: 0.85rem;
  color: #cbd5e1;
  font-weight: 500;
  margin-bottom: 0.4rem;
}

.row-summary {
  font-size: 0.825rem;
  color: #94a3b8;
  line-height: 1.5;
}

/* Lists */
.clean-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 1.1rem 0.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  cursor: crosshair;
  transition: all 0.25s ease;
  border-left: 2px solid transparent;
}

.list-item:hover,
.list-item.is-active {
  background-color: rgba(255, 255, 255, 0.03);
  padding-left: 0.85rem;
  padding-right: 0.85rem;
  border-left-color: #ffffff;
}

.item-name {
  font-size: 1.1rem;
  font-weight: 500;
  color: #f1f5f9;
  transition: color 0.2s ease;
}

.list-item:hover .item-name,
.list-item.is-active .item-name {
  color: #ffffff;
}

.item-meta {
  font-size: 0.75rem;
  color: #64748b;
  letter-spacing: 0.05em;
}

.foundations-section {
  margin-top: 3.5rem;
}

.bottom-spacer {
  height: 6rem;
}

/* Transitions: Overlapping smooth crossfade */
.crossfade-enter-active,
.crossfade-leave-active {
  transition: opacity 0.45s ease;
}

.crossfade-enter-from,
.crossfade-leave-to {
  opacity: 0;
}
</style>
