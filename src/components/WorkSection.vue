<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { categoriesData, projectsData } from '../config/workData.js'

const emit = defineEmits(['navigate'])

// State for Option 2: 5-Panel Horizontal (Desktop) / Vertical Stack (Mobile) Accordion
const activeAccordionId = ref('vfx') // default active panel

const accordionCategories = computed(() => {
  return categoriesData.filter(cat => cat.id !== 'all')
})

const getCategoryProjects = (catId) => {
  return projectsData.filter(p => p.category === catId)
}

const toggleAccordionPanel = (catId) => {
  if (activeAccordionId.value === catId) {
    activeAccordionId.value = '' // allow collapsing on mobile tap
  } else {
    activeAccordionId.value = catId
  }
}

// State for Option 3: Floating Cursor Preview
const activeHoverProject = ref(null)
const mousePos = ref({ x: 0, y: 0 })
const cursorPreviewVisible = ref(false)

// Lightbox Modal state (shared)
const activeLightboxProject = ref(null)

const openLightbox = (project) => {
  activeLightboxProject.value = project
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  activeLightboxProject.value = null
  document.body.style.overflow = ''
}

// Floating Cursor Controls for Option 3
const handleMouseMove = (e) => {
  mousePos.value = { x: e.clientX, y: e.clientY }
}

const onRowMouseEnter = (project) => {
  activeHoverProject.value = project
  cursorPreviewVisible.value = true
}

const onRowMouseLeave = () => {
  cursorPreviewVisible.value = false
}

const handleKeyDown = (e) => {
  if (e.key === 'Escape' && activeLightboxProject.value) {
    closeLightbox()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  document.body.style.overflow = ''
})
</script>

<template>
  <div id="work" class="work-showcase-container">
    <!-- =========================================================================
         OPTION 2: 5-PANEL HORIZONTAL (DESKTOP) / VERTICAL (MOBILE) ACCORDION
         ========================================================================= -->
    <section class="work-section option-2-section">
      <div class="container">

        <div class="section-header">
          <span class="caption">02 // WORK CATEGORIES</span>
          <h2 class="section-title">Projects I have worked on</h2>
        </div>

        <!-- Accordion Layout -->
        <div class="accordion-container">
          <div
            v-for="cat in accordionCategories"
            :key="'acc-' + cat.id"
            class="accordion-panel"
            :class="{ 'expanded': activeAccordionId === cat.id }"
            @mouseenter="activeAccordionId = cat.id"
            @click="toggleAccordionPanel(cat.id)"
          >
            <!-- Background Preview Image for Panel -->
            <div class="panel-bg-wrap">
              <img
                :src="getCategoryProjects(cat.id)[0]?.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80'"
                :alt="cat.name"
                class="panel-bg"
              />
              <div class="panel-overlay"></div>
            </div>

            <!-- Collapsed Header Label -->
            <div class="collapsed-label">
              <div class="collapsed-header-text">
                <span class="vertical-title">{{ cat.name }}</span>
                <span class="panel-count">{{ cat.count }}</span>
              </div>
              <div class="mobile-chevron">
                <svg
                  class="chevron-svg"
                  :class="{ 'rotate': activeAccordionId === cat.id }"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>

            <!-- Expanded Panel Content -->
            <div class="expanded-content">
              <div class="panel-header">
                <span class="panel-tag">{{ cat.count }} Projects</span>
                <div class="panel-title-row">
                  <h3 class="panel-title">{{ cat.name }}</h3>
                  <button 
                    v-if="cat.id === 'photography' || cat.id === 'art-design' || cat.id === 'visual-effects' || cat.id === 'archive'"
                    class="view-gallery-btn"
                    @click.stop="emit('navigate', cat.id)"
                  >
                    View Full Gallery &rarr;
                  </button>
                </div>
              </div>

              <!-- Projects Grid inside Panel -->
              <div class="panel-projects-grid">
                <div
                  v-for="project in getCategoryProjects(cat.id)"
                  :key="'acc-proj-' + project.id"
                  class="panel-project-card"
                  @click.stop="openLightbox(project)"
                >
                  <div class="card-media-box">
                    <img :src="project.image" :alt="project.title" class="proj-img" />
                  </div>
                  <div class="proj-info">
                    <div class="proj-title">{{ project.title }}</div>
                    <div class="proj-year">{{ project.year }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- =========================================================================
         FULLSCREEN LIGHTBOX MODAL
         ========================================================================= -->
    <transition name="modal-fade">
      <div v-if="activeLightboxProject" class="lightbox-modal" @click.self="closeLightbox">
        <div class="lightbox-content">
          <button class="close-btn" @click="closeLightbox" aria-label="Close modal">&times;</button>
          
          <div class="lightbox-media-wrap">
            <video
              v-if="activeLightboxProject.video"
              class="lightbox-media"
              autoplay
              loop
              muted
              playsinline
            >
              <source :src="activeLightboxProject.video" type="video/webm" />
            </video>
            <img v-else :src="activeLightboxProject.image" :alt="activeLightboxProject.title" class="lightbox-media" />
          </div>

          <div class="lightbox-details">
            <div class="modal-tags">
              <span class="modal-tag">{{ activeLightboxProject.categoryName }}</span>
              <span class="modal-year">{{ activeLightboxProject.year }}</span>
            </div>
            <h2 class="modal-title">{{ activeLightboxProject.title }}</h2>
            <p class="modal-desc">{{ activeLightboxProject.description }}</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.work-showcase-container {
  width: 100%;
  background-color: #000000;
  color: #ffffff;
}

.work-section {
  padding: 6rem 0;
  position: relative;
}

/* Badges */
.option-badge {
  display: inline-block;
  padding: 0.4rem 0.9rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  margin-bottom: 2rem;
}

.badge-amber {
  color: #f59e0b;
  border-color: rgba(245, 158, 11, 0.3);
}

.badge-purple {
  color: #c084fc;
  border-color: rgba(192, 132, 252, 0.3);
}

.section-header {
  margin-bottom: 2.5rem;
}

.caption {
  font-size: var(--font-size-caption);
  color: #94a3b8;
  letter-spacing: 0.12em;
  font-weight: 700;
  text-transform: uppercase;
}

.section-title {
  font-size: var(--font-size-h2);
  font-weight: 700;
  margin-top: 0.4rem;
  color: #ffffff;
}

/* Section Divider */
.section-divider {
  width: 100%;
  padding: 3rem 0;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: #050507;

  span {
    font-size: 0.8rem;
    font-weight: 800;
    letter-spacing: 0.2em;
    color: #64748b;
  }
}

/* =========================================================================
   OPTION 2: RESPONSIVE ACCORDION STYLES (Vertical Mobile Stack -> Horizontal Desktop)
   ========================================================================= */
.accordion-container {
  display: flex;
  flex-direction: column;
  height: auto;
  gap: 1.25rem;

  @media (min-width: 992px) {
    flex-direction: row;
    height: 580px;
    gap: 1rem;
  }

  @media (min-width: 1400px) {
    flex-direction: row;
    height: 680px;
    gap: 1.25rem;
  }

  @media (min-width: 1800px) {
    flex-direction: row;
    height: 780px;
    gap: 1.5rem;
  }
}

.accordion-panel {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background-color: #0d0e12;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  flex: 1;

  @media (max-width: 991px) {
    min-height: 80px;

    &.expanded {
      border-color: rgba(255, 255, 255, 0.35);
    }
  }

  @media (min-width: 992px) {
    flex: 0.7;

    &.expanded {
      flex: 4;
      border-color: rgba(255, 255, 255, 0.35);
    }
  }
}

.panel-bg-wrap {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.panel-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.45);
  transition: transform 0.6s ease, filter 0.6s ease;
}

.accordion-panel.expanded .panel-bg {
  filter: brightness(0.25);
  transform: scale(1.05);
}

.panel-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.85) 100%);
}

/* Collapsed Header Label */
.collapsed-label {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;

  @media (min-width: 992px) {
    position: absolute;
    inset: 0;
    flex-direction: column;
    padding: 2rem 1rem;
    opacity: 1;
    transition: opacity 0.4s ease;
  }
}

@media (min-width: 992px) {
  .accordion-panel.expanded .collapsed-label {
    opacity: 0;
    pointer-events: none;
  }
}

.collapsed-header-text {
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (min-width: 992px) {
    flex-direction: column;
  }
}

.vertical-title {
  font-family: var(--font-family);
  font-size: 1.15rem;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
  letter-spacing: 0.05em;

  @media (min-width: 992px) {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
  }
}

.panel-count {
  font-size: 0.775rem;
  font-weight: 700;
  padding: 0.25rem 0.65rem;
  border-radius: 100%;
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  backdrop-filter: blur(8px);
}

.mobile-chevron {
  display: flex;
  align-items: center;
  color: #ffffff;

  @media (min-width: 992px) {
    display: none;
  }
}

.chevron-svg {
  transition: transform 0.3s ease;
}

.chevron-svg.rotate {
  transform: rotate(180deg);
}

/* Expanded Content */
.expanded-content {
  position: relative;
  z-index: 3;
  padding: 0 1.5rem 1.75rem;
  display: none;
  opacity: 0;
  transition: opacity 0.4s ease 0.15s;

  @media (min-width: 992px) {
    height: 100%;
    padding: 2.25rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}

.accordion-panel.expanded .expanded-content {
  display: flex;
  flex-direction: column;
  opacity: 1;
}

.panel-header {
  display: flex;
  flex-direction: column;
}

.panel-tag {
  font-size: 0.775rem;
  font-weight: 700;
  color: #f59e0b;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.panel-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.25rem;
}

.panel-title {
  font-size: 1.65rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
}

.view-gallery-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);
}

.view-gallery-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(4px);
}

.panel-projects-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  margin-top: 1.25rem;

  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1400px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
}

.panel-project-card {
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  overflow: hidden;
  backdrop-filter: blur(8px);
  transition: transform 0.3s ease, border-color 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(255, 255, 255, 0.3);
  }
}

.card-media-box {
  width: 100%;
  height: 140px;
  overflow: hidden;

  @media (min-width: 992px) {
    height: 150px;
  }

  @media (min-width: 1400px) {
    height: 170px;
  }

  @media (min-width: 1800px) {
    height: 200px;
  }
}

.proj-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.proj-info {
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.proj-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #ffffff;
}

.proj-year {
  font-size: 0.775rem;
  color: #94a3b8;
}


/* =========================================================================
   LIGHTBOX MODAL
   ========================================================================= */
.lightbox-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(16px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.lightbox-content {
  position: relative;
  width: 100%;
  max-width: 900px;
  background-color: #0d0e12;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.95);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1.25rem;
  z-index: 10;
  font-size: 2.25rem;
  color: #ffffff;
  line-height: 1;
}

.lightbox-media-wrap {
  width: 100%;
  max-height: 480px;
  overflow: hidden;
  background: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-media {
  width: 100%;
  max-height: 480px;
  object-fit: contain;
}

.lightbox-details {
  padding: 1.5rem;

  @media (min-width: 768px) {
    padding: 2rem;
  }
}

.modal-tags {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.modal-tag {
  color: #f59e0b;
  text-transform: uppercase;
}

.modal-year {
  color: #64748b;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 0.75rem;

  @media (min-width: 768px) {
    font-size: 1.75rem;
  }
}

.modal-desc {
  font-size: 0.95rem;
  color: #cbd5e1;
  line-height: 1.6;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
