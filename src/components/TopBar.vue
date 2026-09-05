<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { navigationData } from '../config/navigation.js'

const props = defineProps({
  currentPage: {
    type: String,
    default: 'home'
  }
})

const emit = defineEmits(['navigate'])

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const isWorkDropdownOpen = ref(false)
const isMobileWorkExpanded = ref(false)

const checkScroll = () => {
  // Smoothly blend topbar background to solid black when scrolled > 40px
  if (window.scrollY > 40) {
    isScrolled.value = true
  } else {
    isScrolled.value = false
  }
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  document.body.style.overflow = ''
}

const toggleMobileWork = () => {
  isMobileWorkExpanded.value = !isMobileWorkExpanded.value
}

const handleLogoClick = (e) => {
  e.preventDefault()
  closeMobileMenu()
  emit('navigate', 'home', '#hero')
}

const handleNavClick = (item, e) => {
  if (item.children) return
  e.preventDefault()
  closeMobileMenu()
  
  if (item.id === 'about') {
    emit('navigate', 'about')
  } else if (item.id === 'home') {
    emit('navigate', 'home', '#hero')
  } else if (item.id === 'work') {
    emit('navigate', 'home', '#work')
  } else if (item.id === 'contact') {
    emit('navigate', props.currentPage === 'about' ? 'about' : 'home', '#contact')
  } else {
    emit('navigate', 'home', item.href)
  }
}

const handleSubItemClick = (subItem, e) => {
  e.preventDefault()
  isWorkDropdownOpen.value = false
  closeMobileMenu()
  
  if (subItem.id === 'photography' || subItem.id === 'art-design' || subItem.id === 'visual-effects' || subItem.id === 'archive') {
    emit('navigate', subItem.id)
  } else {
    emit('navigate', 'home', subItem.href)
  }
}

const handleKeyDown = (e) => {
  if (e.key === 'Escape') {
    closeMobileMenu()
    isWorkDropdownOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', checkScroll, { passive: true })
  window.addEventListener('keydown', handleKeyDown)
  checkScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
  window.removeEventListener('keydown', handleKeyDown)
  document.body.style.overflow = ''
})
</script>

<template>
  <header
    class="top-bar"
    :class="{ 'scrolled': isScrolled, 'menu-open': isMobileMenuOpen }"
  >
    <div class="top-bar-container container">
      <!-- Logo -->
      <a :href="navigationData.logo.href" class="brand-logo" @click="handleLogoClick">
        <img
          :src="navigationData.logo.image"
          alt="Anushka Shah Logo"
          class="logo-img"
        />
      </a>

      <!-- Desktop Navigation Menu -->
      <nav class="desktop-nav" aria-label="Main Navigation">
        <ul class="nav-list">
          <li
            v-for="item in navigationData.menuItems"
            :key="item.id"
            class="nav-item"
            :class="{ 
              'has-dropdown': item.children,
              'active': (item.id === 'about' && currentPage === 'about') || (item.id === 'home' && currentPage === 'home')
            }"
            @mouseenter="item.children ? isWorkDropdownOpen = true : null"
            @mouseleave="item.children ? isWorkDropdownOpen = false : null"
          >
            <!-- Direct link for normal items -->
            <a
              v-if="!item.children"
              :href="item.href"
              class="nav-link"
              :class="{ 'is-active': (item.id === 'about' && currentPage === 'about') }"
              @click="handleNavClick(item, $event)"
            >
              {{ item.name }}
            </a>

            <!-- Dropdown trigger for Work -->
            <div v-else class="dropdown-wrapper">
              <a
                :href="item.href"
                class="nav-link dropdown-trigger"
                :aria-expanded="isWorkDropdownOpen"
                @click.prevent="isWorkDropdownOpen = !isWorkDropdownOpen"
              >
                <span>{{ item.name }}</span>
                <svg
                  class="chevron-icon"
                  :class="{ 'rotate': isWorkDropdownOpen }"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </a>

              <!-- Work Sub-Menu Dropdown -->
              <transition name="dropdown-fade">
                <div v-if="isWorkDropdownOpen" class="sub-menu-dropdown">
                  <div class="dropdown-inner">
                    <a
                      v-for="subItem in item.children"
                      :key="subItem.id"
                      :href="subItem.href"
                      class="sub-menu-item"
                      @click="handleSubItemClick(subItem, $event)"
                    >
                      <div class="sub-item-name">{{ subItem.name }}</div>
                      <div v-if="subItem.description" class="sub-item-desc">{{ subItem.description }}</div>
                    </a>
                  </div>
                </div>
              </transition>
            </div>
          </li>
        </ul>
      </nav>

      <!-- Mobile Hamburger Button -->
      <button
        class="mobile-toggle"
        :class="{ 'active': isMobileMenuOpen }"
        @click="toggleMobileMenu"
        :aria-expanded="isMobileMenuOpen"
        aria-label="Toggle Navigation Menu"
      >
        <span class="bar bar-1"></span>
        <span class="bar bar-2"></span>
        <span class="bar bar-3"></span>
      </button>
    </div>

    <!-- Mobile Drawer Menu Overlay -->
    <transition name="mobile-drawer-fade">
      <div v-if="isMobileMenuOpen" class="mobile-drawer">
        <div class="mobile-drawer-inner container">
          <ul class="mobile-nav-list">
            <li
              v-for="item in navigationData.menuItems"
              :key="'mobile-' + item.id"
              class="mobile-nav-item"
            >
              <a
                v-if="!item.children"
                :href="item.href"
                class="mobile-nav-link"
                :class="{ 'is-active': (item.id === 'about' && currentPage === 'about') }"
                @click="handleNavClick(item, $event)"
              >
                {{ item.name }}
              </a>

              <div v-else class="mobile-work-accordion">
                <button
                  class="mobile-nav-link accordion-trigger"
                  @click="toggleMobileWork"
                >
                  <span>{{ item.name }}</span>
                  <svg
                    class="chevron-icon"
                    :class="{ 'rotate': isMobileWorkExpanded }"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                <transition name="accordion-expand">
                  <ul v-if="isMobileWorkExpanded" class="mobile-sub-menu">
                    <li v-for="subItem in item.children" :key="'mob-sub-' + subItem.id">
                      <a
                        :href="subItem.href"
                        class="mobile-sub-link"
                        @click="handleSubItemClick(subItem, $event)"
                      >
                        {{ subItem.name }}
                      </a>
                    </li>
                  </ul>
                </transition>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </header>
</template>

<style scoped>
/* Top Bar Layout & Base Overlay */
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  z-index: 1000;
  background-color: transparent;
  border-bottom: 1px solid transparent;
  transition: background-color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease, height 0.3s ease;
  display: flex;
  align-items: center;
}

/* Scrolled State: Blends completely into solid black with subtle bottom border */
.top-bar.scrolled {
  background-color: #000000;
  border-bottom-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.9);
}

.top-bar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

/* Logo & Brand Formatting */
.brand-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 1001;
  user-select: none;
}

.logo-img {
  height: 80px;
  width: auto;
  object-fit: contain;
  border-radius: 6px;
  transition: transform 0.3s ease;
}

.brand-logo:hover .logo-img {
  transform: scale(1.05);
}

.brand-text {
  font-family: var(--font-family);
  font-weight: 700;
  font-size: 1.25rem;
  color: #ffffff;
  letter-spacing: -0.02em;
  white-space: nowrap;
}

/* Desktop Navigation */
.desktop-nav {
  display: none;
}

@media (min-width: 768px) {
  .desktop-nav {
    display: block;
  }
}

.nav-list {
  display: flex;
  align-items: center;
  gap: 2.25rem;
  list-style: none;
}

.nav-item {
  position: relative;
}

.nav-link {
  font-family: var(--font-family);
  font-size: 0.975rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  padding: 0.5rem 0;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  transition: color 0.25s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0%;
  height: 2px;
  background-color: var(--accent-blue);
  transition: width 0.25s ease;
  border-radius: 2px;
}

.nav-link:hover,
.nav-link.is-active {
  color: var(--accent-blue);
}

.nav-link:hover::after,
.nav-link.is-active::after {
  width: 100%;
}

.mobile-nav-link.is-active {
  color: var(--accent-blue);
}

.dropdown-trigger {
  cursor: pointer;
}

.chevron-icon {
  transition: transform 0.3s ease;
}

.chevron-icon.rotate {
  transform: rotate(180deg);
}

/* Sub-Menu Dropdown Styling */
.sub-menu-dropdown {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding-top: 0.75rem;
  width: 260px;
  z-index: 1050;
}

.dropdown-inner {
  background-color: #0d0e12;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 0.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(12px);
}

.sub-menu-item {
  display: block;
  padding: 0.65rem 0.85rem;
  border-radius: 8px;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.sub-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.08);
  transform: translateX(4px);
}

.sub-item-name {
  font-size: 0.925rem;
  font-weight: 600;
  color: #ffffff;
}

.sub-item-desc {
  font-size: 0.775rem;
  color: #94a3b8;
  margin-top: 0.15rem;
}

/* Dropdown Animation */
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px);
}

/* Mobile Toggle Hamburger */
.mobile-toggle {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 28px;
  height: 20px;
  z-index: 1001;
}

@media (min-width: 768px) {
  .mobile-toggle {
    display: none;
  }
}

.mobile-toggle .bar {
  width: 100%;
  height: 2px;
  background-color: #ffffff;
  border-radius: 2px;
  transition: transform 0.3s ease, opacity 0.3s ease;
  transform-origin: center;
}

.mobile-toggle.active .bar-1 {
  transform: translateY(9px) rotate(45deg);
}

.mobile-toggle.active .bar-2 {
  opacity: 0;
}

.mobile-toggle.active .bar-3 {
  transform: translateY(-9px) rotate(-45deg);
}

/* Mobile Drawer Overlay */
.mobile-drawer {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.97);
  backdrop-filter: blur(16px);
  z-index: 1000;
  padding-top: calc(var(--header-height) + 1rem);
  display: flex;
  flex-direction: column;
}

.mobile-nav-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.mobile-nav-link {
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.mobile-sub-menu {
  list-style: none;
  padding-left: 1rem;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  border-left: 2px solid rgba(255, 255, 255, 0.15);
}

.mobile-sub-link {
  font-size: 1.1rem;
  color: #94a3b8;
}

.mobile-sub-link:hover {
  color: var(--accent-blue);
}

/* Mobile Animations */
.mobile-drawer-fade-enter-active,
.mobile-drawer-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.mobile-drawer-fade-enter-from,
.mobile-drawer-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
