<script setup>
defineEmits(['navigate'])

// Stock Demo Portrait Images
const portraitImages = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
    title: 'Creative Direction',
    subtitle: 'Designing intuitive digital products'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80',
    title: 'Technical Execution',
    subtitle: 'Frontend & interactive motion'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80',
    title: 'Brand Identity',
    subtitle: 'Crafting memorable visual experiences'
  }
]
</script>

<template>
  <section id="about" class="about-section">
    <div class="container">
      <div class="two-column-grid">
        <!-- Left Column: Sticky Info -->
        <div class="info-column-sticky">
          <!-- <span class="caption">01 // ABOUT ME</span> -->
          <h2 class="section-title">Hi,I'm Anushka Shah — a Visual Effects Artist based in Vancouver with a focus on Lighting and Compositing.</h2>
          <p class="bio-text">
            I blend technical precision with artistic insight to craft cinematic visuals that support storytelling through light, color, and composition.
          </p>
          <p class="bio-subtext">
            With a background in Traditional Art, Design, and Photography, I bring a strong visual foundation and a deep understanding of mood and atmosphere to every project. My experience behind the camera informs my eye for framing, depth, and lighting — both in real and digital environments.
          </p>

          <p class="bio-subtext">
            I earned my diploma in Advanced Visual Effects from Kwantlen Polytechnic University and am proficient in industry-standard tools like Nuke, Katana, Maya, and Photoshop. Two years of Color Theory study further sharpened my sense of tone and detail, helping me create emotionally rich, visually compelling scenes. </p>

          <button class="cta-button" @click="$emit('navigate', 'about')">
            <span>More About Me</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>

        <!-- Right Column: Stacking Portrait Cards -->
        <div class="images-column">
          <div
            v-for="(img, idx) in portraitImages"
            :key="img.id"
            class="portrait-card"
            :style="{ zIndex: idx + 1 }"
          >
            <img :src="img.url" :alt="img.title" class="portrait-img" loading="lazy" />
            <div class="portrait-info-overlay">
              <span class="img-number">0{{ idx + 1 }}</span>
              <div class="img-title">{{ img.title }}</div>
              <div class="img-subtitle">{{ img.subtitle }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/*
  Stacking approach:
  - Each card is position:sticky with top matching the header area (~100px).
  - Each card's height fills from that sticky top to the viewport bottom:
    height: calc(100vh - var(--sticky-top)).
  - Cards are in normal flow (flex column), so the total column height =
    N × card-height, creating the scroll runway.
  - z-index increments so the next card covers the previous one.
  - object-fit:cover keeps portrait images looking great at any aspect ratio.

  Potential issues addressed:
  - No peeking: card fills viewport edge-to-edge vertically.
  - Scroll runway: normal flow stacking creates enough height for all cards.
  - Left column: remains sticky and shorter, so it stays visible throughout.
  - Content below: once the section scrolls out, sticky releases naturally.
  - Mobile: falls back to normal flow with aspect-ratio to avoid tall cards.
  - Short viewports: min-height prevents cards from getting too small.
*/

.about-section {
  padding: 8rem 0;
  position: relative;
  background-color: #000000;
  color: #ffffff;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

/* Two-Column Responsive Grid */
.two-column-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3.5rem;
  align-items: start;
}

@media (min-width: 992px) {
  .two-column-grid {
    grid-template-columns: 1.15fr 1.35fr;
    gap: 4.5rem;
  }
}

@media (min-width: 1400px) {
  .two-column-grid {
    grid-template-columns: 1.2fr 1.8fr;
    gap: 5rem;
  }
}

@media (min-width: 1800px) {
  .two-column-grid {
    grid-template-columns: 1.25fr 2.2fr;
    gap: 5.5rem;
  }
}



/* Sticky Left Info Column */
.info-column-sticky {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

@media (min-width: 992px) {
  .info-column-sticky {
    position: sticky;
    top: calc(var(--header-height) + 2rem);
  }
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
  margin: 0.5rem 0 1.25rem;
  line-height: 1.15;
  color: #ffffff;
}

.bio-text {
  font-size: var(--font-size-lead);
  color: #cbd5e1;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.bio-subtext {
  font-size: 0.925rem;
  color: #94a3b8;
  line-height: 1.6;
  margin-bottom: 2rem;
}

/* CTA Button */
.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.9rem 1.75rem;
  border-radius: 40px;
  background-color: #ffffff;
  color: #000000;
  font-size: 0.95rem;
  font-weight: 700;
  transition: transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
}

.cta-button:hover {
  transform: translateY(-3px);
  background-color: #f1f5f9;
  box-shadow: 0 10px 25px rgba(255, 255, 255, 0.25);
}

/* ── Stacking Images Column ── */
.images-column {
  display: flex;
  flex-direction: column;
}

.portrait-card {
  --sticky-top: 100px;

  position: sticky;
  top: var(--sticky-top);
  width: 100%;
  /* Fill viewport from sticky offset to bottom — one card per screen */
  height: calc(100vh - var(--sticky-top));
  min-height: 350px;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background-color: #0d0e12;
  /* Top shadow sells the "sliding over" depth */
  box-shadow:
    0 -6px 24px rgba(0, 0, 0, 0.6),
    0 16px 48px rgba(0, 0, 0, 0.7);
}

.portrait-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.portrait-info-overlay {
  position: absolute;
  bottom: 0;
  inset-inline: 0;
  padding: 2.5rem 1.75rem 2rem;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.85) 0%, transparent 100%);
  display: flex;
  flex-direction: column;
}

.img-number {
  font-size: 0.75rem;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.1em;
}

.img-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  margin-top: 0.25rem;
}

.img-subtitle {
  font-size: 0.85rem;
  color: #94a3b8;
  margin-top: 0.15rem;
}

/* ── Mobile: normal flow, no sticky ── */
@media (max-width: 991px) {
  .about-section {
    padding: 4rem 0;
  }

  .portrait-card {
    position: relative;
    top: 0;
    height: auto;
    min-height: unset;
    aspect-ratio: 3 / 4;
    margin-bottom: 2rem;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.7);
  }
}
</style>
