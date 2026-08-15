<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import TopBar from './components/TopBar.vue'
import HeroSection from './components/HeroSection.vue'
import AboutSection from './components/AboutSection.vue'
import WorkSection from './components/WorkSection.vue'
import AboutPage from './components/AboutPage.vue'
import FooterSection from './components/FooterSection.vue'
import GalleryPage from './components/GalleryPage.vue'
import VisualEffectsPage from './components/VisualEffectsPage.vue'

const currentPage = ref('home')

const checkRouteFromHash = () => {
  const hash = window.location.hash
  if (hash === '#about-page' || hash === '#about-me') {
    currentPage.value = 'about'
  } else if (hash === '#photography') {
    currentPage.value = 'photography'
  } else if (hash === '#art-design') {
    currentPage.value = 'art-design'
  } else if (hash === '#visual-effects') {
    currentPage.value = 'visual-effects'
  } else if (hash === '#archive') {
    currentPage.value = 'archive'
  } else {
    currentPage.value = 'home'
  }
}

const handleNavigate = (page, anchor = '') => {
  currentPage.value = page
  
  if (page === 'about') {
    if (window.location.hash !== '#about-page') {
      history.pushState(null, '', '#about-page')
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else if (page === 'photography') {
    if (window.location.hash !== '#photography') {
      history.pushState(null, '', '#photography')
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else if (page === 'art-design') {
    if (window.location.hash !== '#art-design') {
      history.pushState(null, '', '#art-design')
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else if (page === 'visual-effects') {
    if (window.location.hash !== '#visual-effects') {
      history.pushState(null, '', '#visual-effects')
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else if (page === 'archive') {
    if (window.location.hash !== '#archive') {
      history.pushState(null, '', '#archive')
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    if (anchor) {
      if (window.location.hash !== anchor) {
        history.pushState(null, '', anchor)
      }
      nextTick(() => {
        setTimeout(() => {
          const el = document.querySelector(anchor)
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' })
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }
        }, 60)
      })
    } else {
      if (window.location.hash !== '') {
        history.pushState(null, '', window.location.pathname)
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}

const handlePopState = () => {
  checkRouteFromHash()
}

onMounted(() => {
  checkRouteFromHash()
  window.addEventListener('popstate', handlePopState)
  window.addEventListener('hashchange', checkRouteFromHash)
})

onUnmounted(() => {
  window.removeEventListener('popstate', handlePopState)
  window.removeEventListener('hashchange', checkRouteFromHash)
})
</script>

<template>
  <div class="portfolio-app">
    <!-- Top Navigation Bar -->
    <TopBar :current-page="currentPage" @navigate="handleNavigate" />

    <!-- Main Content with Lightweight Smooth Transition -->
    <main>
      <Transition name="page-fade" mode="out-in">
        <!-- Home Showcase View -->
        <div v-if="currentPage === 'home'" key="home" class="page-view">
          <HeroSection />
          <AboutSection @navigate="handleNavigate" />
          <WorkSection @navigate="handleNavigate" />
        </div>

        <!-- Dedicated About Page View -->
        <div v-else-if="currentPage === 'about'" key="about" class="page-view">
          <AboutPage @navigate="handleNavigate" />
        </div>

        <!-- Dedicated Gallery Pages -->
        <div v-else-if="currentPage === 'photography'" key="photography" class="page-view">
          <GalleryPage category="photography" @navigate="handleNavigate" />
        </div>
        
        <div v-else-if="currentPage === 'art-design'" key="art-design" class="page-view">
          <GalleryPage category="art-design" @navigate="handleNavigate" />
        </div>
        
        <!-- Visual Effects Page -->
        <div v-else-if="currentPage === 'visual-effects'" key="visual-effects" class="page-view">
          <VisualEffectsPage @navigate="handleNavigate" />
        </div>
        
        <!-- Archive Page -->
        <div v-else-if="currentPage === 'archive'" key="archive" class="page-view">
          <GalleryPage category="archive" @navigate="handleNavigate" />
        </div>
      </Transition>
    </main>

    <!-- Footer -->
    <FooterSection />
  </div>
</template>

<style scoped>
.portfolio-app {
  width: 100%;
  min-height: 100vh;
  background-color: var(--bg-dark);
  color: var(--text-body);
  display: flex;
  flex-direction: column;
}

main {
  width: 100%;
  flex: 1;
}

.page-view {
  width: 100%;
}

/* Lightweight GPU-accelerated page transition */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.26s cubic-bezier(0.25, 1, 0.5, 1), transform 0.26s cubic-bezier(0.25, 1, 0.5, 1);
  will-change: opacity, transform;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
