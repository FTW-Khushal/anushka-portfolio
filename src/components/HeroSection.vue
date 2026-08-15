<script setup>
import { ref } from 'vue'

const isVideoLoaded = ref(false)

const onVideoPlay = () => {
  isVideoLoaded.value = true
}
</script>

<template>
  <section id="hero" class="hero-section">
    <!-- Looping Background Video -->
    <div class="video-container">
      <video
        class="bg-video"
        :class="{ 'loaded': isVideoLoaded }"
        autoplay
        loop
        muted
        playsinline
        @playing="onVideoPlay"
      >
        <source src="/file_example_WEBM_1920_3_7MB.webm" type="video/webm" />
        Your browser does not support HTML5 video playback.
      </video>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  position: relative;
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #000000;
}

/* Background Video Setup */
.video-container {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
}

.bg-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 1s ease;
}

.bg-video.loaded {
  opacity: 1;
}
</style>
