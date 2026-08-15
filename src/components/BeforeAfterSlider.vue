<script setup>
import { ref } from 'vue'

const props = defineProps({
  beforeImage: {
    type: String,
    required: true
  },
  afterImage: {
    type: String,
    required: true
  },
  beforeLabel: {
    type: String,
    default: 'Before'
  },
  afterLabel: {
    type: String,
    default: 'After'
  }
})

const position = ref(50)

const updatePosition = (e) => {
  position.value = e.target.value
}
</script>

<template>
  <div class="before-after-container" :style="{ '--pos': `${position}%` }">
    <!-- After Image (Underneath, Full Width) -->
    <div class="image-wrapper after-image">
      <img :src="afterImage" alt="After" loading="lazy" />
      <span class="label after-label">{{ afterLabel }}</span>
    </div>

    <!-- Before Image (On top, Clipped) -->
    <div class="image-wrapper before-image">
      <img :src="beforeImage" alt="Before" loading="lazy" />
      <span class="label before-label">{{ beforeLabel }}</span>
    </div>

    <!-- Slider Input -->
    <input 
      type="range" 
      min="0" 
      max="100" 
      :value="position" 
      @input="updatePosition"
      class="slider-input" 
      aria-label="Compare images"
    />

    <!-- Custom Handle -->
    <div class="slider-handle">
      <div class="slider-line"></div>
      <div class="slider-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.before-after-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  background-color: #111;
}

@media (max-width: 768px) {
  .before-after-container {
    aspect-ratio: 4 / 3;
  }
}

.image-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

.before-image {
  clip-path: polygon(0 0, var(--pos) 0, var(--pos) 100%, 0 100%);
}

.label {
  position: absolute;
  top: 1.5rem;
  padding: 0.5rem 1rem;
  border-radius: 30px;
  background-color: rgba(10, 10, 10, 0.75);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  pointer-events: none;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}

.before-label {
  left: 1.5rem;
}

.after-label {
  right: 1.5rem;
}

.slider-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: ew-resize;
  z-index: 20;
}

.slider-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  left: var(--pos);
  width: 2px;
  transform: translateX(-50%);
  pointer-events: none;
  z-index: 10;
}

.slider-line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  background-color: rgba(255, 255, 255, 0.9);
  transform: translateX(-50%);
  box-shadow: 0 0 10px rgba(0,0,0,0.5), 0 0 20px rgba(255,255,255,0.2);
}

.slider-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 56px;
  height: 56px;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.4), 0 0 15px rgba(255,255,255,0.2);
  color: #111;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), background-color 0.3s ease;
}

.slider-input:active ~ .slider-handle .slider-button,
.slider-input:hover ~ .slider-handle .slider-button {
  transform: translate(-50%, -50%) scale(1.1);
  background-color: #ffffff;
}

.slider-button svg {
  width: 22px;
  height: 22px;
}

.slider-button svg:first-child {
  margin-right: -4px;
}

.slider-button svg:last-child {
  margin-left: -4px;
}
</style>
