<script setup>
import { ref, computed } from 'vue'
import { categoriesData, projectsData } from '../config/workData.js'

const emit = defineEmits(['navigate'])

const activeAccordionId = ref('vfx') // default active panel

const accordionCategories = computed(() => {
  return categoriesData.filter(cat => cat.id !== 'all')
})

const getCategoryProjects = (catId) => {
  return projectsData.filter(p => p.category === catId)
}

const handleMouseEnter = (catId) => {
  if (window.innerWidth >= 992) {
    activeAccordionId.value = catId
  }
}

const handlePanelClick = (catId) => {
  const targetPage = catId === 'vfx' ? 'visual-effects' : catId
  if (window.innerWidth < 992) {
    if (activeAccordionId.value === catId) {
      // Already expanded, tap navigates to category page
      emit('navigate', targetPage)
    } else {
      // Expand on first tap on mobile
      activeAccordionId.value = catId
    }
  } else {
    // Navigate immediately on desktop click since hover expands it
    emit('navigate', targetPage)
  }
}
</script>

<template>
  <div id="work" class="work-showcase-container">
    <section class="work-section">
      <div class="container">

        <div class="section-header">
          <!-- <span class="caption">02 // WORK CATEGORIES</span> -->
          <h2 class="section-title">Projects I have worked on</h2>
        </div>

        <!-- Accordion Layout -->
        <div class="accordion-container">
          <div
            v-for="cat in accordionCategories"
            :key="'acc-' + cat.id"
            class="accordion-panel"
            :class="{ 'expanded': activeAccordionId === cat.id }"
            @mouseenter="handleMouseEnter(cat.id)"
            @click="handlePanelClick(cat.id)"
          >
            <!-- Background Cover Image for Panel -->
            <div class="panel-bg-wrap">
              <img
                :src="cat.cover || getCategoryProjects(cat.id)[0]?.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80'"
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

            <!-- Expanded Category Label (Bottom Left, Crisp/No Blur) -->
            <div class="expanded-info-panel">
              <span class="category-meta">{{ cat.count }} Projects</span>
              <div class="category-title-row">
                <h3 class="category-name">{{ cat.name }}</h3>
                <div class="arrow-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.work-showcase-container {
  width: 100%;
  background-color: #000000;
  color: #ffffff;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.work-section {
  padding: 4rem 0;
  position: relative;
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

/* =========================================================================
   ACCORDION CONTAINER & PANELS (Mobile-First Stack -> Desktop Row)
   ========================================================================= */
.accordion-container {
  display: flex;
  flex-direction: column;
  height: auto;
  gap: 1.25rem;
}

.accordion-panel {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background-color: #0d0e12;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 80px;
  height: 80px;
  flex: none;
}

.accordion-panel.expanded {
  height: 270px;
  border-color: rgba(255, 255, 255, 0.35);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
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
  filter: brightness(0.5);
  transition: transform 0.6s ease, filter 0.6s ease;
}

.accordion-panel.expanded .panel-bg {
  filter: brightness(0.7);
  transform: scale(1.04);
}

.panel-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 30%, rgba(0, 0, 0, 0.85) 100%);
}

/* Collapsed Header Label */
.collapsed-label {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  opacity: 1;
  transition: opacity 0.4s ease;
}

.accordion-panel.expanded .collapsed-label {
  opacity: 0;
  pointer-events: none;
}

.collapsed-header-text {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.vertical-title {
  font-family: var(--font-family);
  font-size: 1.15rem;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
  letter-spacing: 0.05em;
}

.panel-count {
  font-size: 0.775rem;
  font-weight: 700;
  padding: 0.25rem 0.65rem;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  backdrop-filter: blur(8px);
}

.mobile-chevron {
  display: flex;
  align-items: center;
  color: #ffffff;
}

.chevron-svg {
  transition: transform 0.3s ease;
}

.chevron-svg.rotate {
  transform: rotate(180deg);
}

/* Expanded Info Panel */
.expanded-info-panel {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  z-index: 3;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s;
  transform: translateY(10px);
}

.accordion-panel.expanded .expanded-info-panel {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}

.category-meta {
  font-size: 0.775rem;
  font-weight: 700;
  color: #f59e0b;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.category-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.4rem;
}

.category-name {
  font-size: 1.65rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
}

.arrow-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
  transition: transform 0.3s ease, background 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}

.accordion-panel.expanded:hover .arrow-icon,
.accordion-panel.expanded:active .arrow-icon {
  transform: translateX(5px);
  background: #ffffff;
  color: #000000;
  border-color: #ffffff;
}

/* =========================================================================
   DESKTOP MEDIA QUERIES (min-width: 992px)
   ========================================================================= */
@media (min-width: 992px) {
  .accordion-container {
    flex-direction: row;
    height: 580px;
    gap: 1rem;
  }

  .accordion-panel {
    min-height: initial;
    height: 100%;
    flex: 0.7;
  }

  .accordion-panel.expanded {
    height: 100%;
    flex: 4;
  }

  .collapsed-label {
    flex-direction: column;
    padding: 2rem 1rem;
  }

  .collapsed-header-text {
    flex-direction: column;
  }

  .vertical-title {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
  }

  .mobile-chevron {
    display: none;
  }

  .expanded-info-panel {
    padding: 2.25rem;
  }
}

@media (min-width: 1400px) {
  .accordion-container {
    height: 680px;
    gap: 1.25rem;
  }
}

@media (min-width: 1800px) {
  .accordion-container {
    height: 780px;
    gap: 1.5rem;
  }
}
</style>
