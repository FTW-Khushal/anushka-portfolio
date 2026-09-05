<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { projectsData, categoriesData } from '../config/workData.js'

const props = defineProps({
  category: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['navigate'])

// Lightbox state
const activeLightboxProject = ref(null)

// Masonry State
const columns = ref([])
const columnCount = ref(3) // Default to 3 for desktop

// Sub-category state
const activeSubCategory = ref('all')

// Filter projects for the specific category
const categoryProjects = computed(() => {
  return projectsData.filter(p => p.category === props.category)
})

// Extract unique sub-categories from the projects
const availableSubCategories = computed(() => {
  const subs = new Set()
  categoryProjects.value.forEach(p => {
    if (p.subCategory) {
      subs.add(p.subCategory)
    }
  })
  return ['all', ...Array.from(subs)]
})

// Filter by both main category and active sub-category
const filteredProjects = computed(() => {
  if (activeSubCategory.value === 'all') {
    return categoryProjects.value
  }
  return categoryProjects.value.filter(p => p.subCategory === activeSubCategory.value)
})

// Get Category Info
const categoryInfo = computed(() => {
  return categoriesData.find(c => c.id === props.category) || { name: 'Gallery' }
})

// Calculate columns based on window width
const calculateColumns = () => {
  const width = window.innerWidth
  if (width < 640) {
    columnCount.value = 1
  } else if (width < 1024) {
    columnCount.value = 2
  } else if (width < 1600) {
    columnCount.value = 3
  } else {
    columnCount.value = 4 // Show 4 columns on very large screens since it's full width
  }
  distributeItems()
}

// Distribute items into columns to maintain a left-to-right reading order
const distributeItems = () => {
  const cols = Array.from({ length: columnCount.value }, () => [])
  
  filteredProjects.value.forEach((project, index) => {
    const colIndex = index % columnCount.value
    cols[colIndex].push(project)
  })
  
  columns.value = cols
}

// Watch for category or sub-category changes to redistibute items
watch([() => props.category, activeSubCategory], () => {
  distributeItems()
})

const openLightbox = (project) => {
  activeLightboxProject.value = project
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  activeLightboxProject.value = null
  document.body.style.overflow = ''
}

const handleKeyDown = (e) => {
  if (e.key === 'Escape' && activeLightboxProject.value) {
    closeLightbox()
  }
}

onMounted(() => {
  calculateColumns()
  window.addEventListener('resize', calculateColumns)
  window.addEventListener('keydown', handleKeyDown)
  // Ensure we start at the top of the page when navigating here
  window.scrollTo(0, 0)
})

onUnmounted(() => {
  window.removeEventListener('resize', calculateColumns)
  window.removeEventListener('keydown', handleKeyDown)
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="gallery-page">
    <div class="gallery-container">
      
      <!-- Header -->
      <header class="gallery-header">
        <button class="back-btn" @click="emit('navigate', 'home', '#work')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Work
        </button>
        <h1 class="gallery-title">{{ categoryInfo.name }}</h1>
        <p class="gallery-subtitle">A curated collection of {{ categoryProjects.length }} pieces.</p>
        
        <!-- Sub-Category Filter -->
        <div v-if="availableSubCategories.length > 1" class="sub-category-filter">
          <button 
            v-for="sub in availableSubCategories" 
            :key="sub"
            class="filter-btn"
            :class="{ 'active': activeSubCategory === sub }"
            @click="activeSubCategory = sub"
          >
            {{ sub === 'all' ? 'All' : sub }}
          </button>
        </div>
      </header>

      <!-- Masonry Grid -->
      <div class="masonry-grid" :style="{ '--col-count': columnCount }">
        <!-- Loop through each column -->
        <div v-for="(col, colIndex) in columns" :key="'col-' + colIndex" class="masonry-column">
          
          <!-- Loop through items in the column -->
          <div 
            v-for="project in col" 
            :key="project.id" 
            class="masonry-item"
            @click="openLightbox(project)"
          >
            <!-- Image Wrapper with intrinsic ratio placeholder -->
            <div 
              class="image-wrapper" 
              :style="{ 'aspect-ratio': project.width && project.height ? `${project.width} / ${project.height}` : 'auto' }"
            >
              <img 
                :src="project.image" 
                :alt="project.title" 
                class="gallery-img"
                loading="lazy"
                decoding="async"
              />
            </div>
            
            <div class="item-details">
              <h3 class="item-title">{{ project.title }}</h3>
              <p class="item-year">{{ project.year }}</p>
            </div>
          </div>
          
        </div>
      </div>
      
    </div>

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
              <span class="modal-tag">{{ activeLightboxProject.subCategory || activeLightboxProject.categoryName }}</span>
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
.gallery-page {
  padding: 120px 0 6rem; /* Top padding to account for fixed TopBar */
  min-height: 100vh;
  background-color: var(--bg-dark, #000000);
  color: #ffffff;
}

/* Replaces .container to allow for a full-width experience with some padding */
.gallery-container {
  width: 100%;
  max-width: 2400px;
  margin: 0 auto;
  padding: 0 1.5rem;
  
  @media (min-width: 768px) {
    padding: 0 2.5rem;
  }
}

.gallery-header {
  margin-bottom: 4rem;
  text-align: center;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 1.5rem;
  transition: color 0.2s;
  padding: 0;
}

.back-btn:hover {
  color: var(--accent-blue);
}

.gallery-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  margin: 0 0 0.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #a1a1aa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.gallery-subtitle {
  color: #64748b;
  font-size: 1.1rem;
}

/* Sub-category Filter Styles */
.sub-category-filter {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 2rem;
}

.filter-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #94a3b8;
  padding: 0.5rem 1.25rem;
  border-radius: 30px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  text-transform: capitalize;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  border-color: var(--accent-blue);
  color: var(--accent-blue);
}

.filter-btn.active {
  background: var(--accent-blue);
  color: #000000;
  border-color: var(--accent-blue);
}

/* JS Masonry Layout */
.masonry-grid {
  display: flex;
  gap: 1.5rem;
  width: 100%;
}

.masonry-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  /* Prevent columns from shrinking below their intrinsic width */
  min-width: 0; 
}

.masonry-item {
  position: relative;
  border-radius: 8px; /* Slightly sharper corners for edge-to-edge feel */
  overflow: hidden;
  cursor: pointer;
  background: #0d0e12;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.masonry-item:hover {
  transform: translateY(-4px);
  border-color: var(--accent-blue);
}

.image-wrapper {
  width: 100%;
  position: relative;
  background: #1a1a24; /* Skeleton loader color */
  overflow: hidden;
}

.gallery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s ease;
}

.masonry-item:hover .gallery-img {
  transform: scale(1.02); /* More subtle zoom since overlay is gone */
}

.item-details {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
}

.item-year {
  color: #94a3b8;
  font-size: 0.8rem;
  margin: 0;
}


/* =========================================================================
   LIGHTBOX MODAL (Reused styles)
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
  background: none;
  border: none;
  cursor: pointer;
}

.lightbox-media-wrap {
  width: 100%;
  max-height: 60vh;
  overflow: hidden;
  background: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-media {
  width: 100%;
  max-height: 60vh;
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
  color: var(--accent-blue);
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
