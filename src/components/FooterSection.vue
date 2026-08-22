<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { tapestryImages, fillerQuotes } from '../config/momentsData.js'

const activeMomentModal = ref(null)

const openMomentModal = (item) => {
  if (item.type === 'image') {
    activeMomentModal.value = item
    document.body.style.overflow = 'hidden'
  }
}

const closeMomentModal = () => {
  activeMomentModal.value = null
  document.body.style.overflow = ''
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleKeyDown = (e) => {
  if (e.key === 'Escape' && activeMomentModal.value) {
    closeMomentModal()
  }
}

// Dynamic Packing Algorithm for 100% Density (Isotope masonryHorizontal Adapted)
const packedTapestry = computed(() => {
  const gap = 14;
  const rowHeight = 260;
  const numRows = 2; // Can be dynamically calculated based on container height if needed
  
  // Track the current X coordinate for each row
  let rowXs = new Array(numRows).fill(0);
  let fillerIndex = 0;
  const packed = [];
  
  const getNextFiller = () => {
    const filler = fillerQuotes[fillerIndex % fillerQuotes.length];
    fillerIndex++;
    return filler;
  };

  tapestryImages.forEach((img, i) => {
    let imgWidth = 260;
    let itemRows = 1;
    
    if (img.aspect === 'span-wide-1') {
      imgWidth = 400;
      itemRows = 1;
    } else if (img.aspect === 'span-tall-2') {
      imgWidth = 360;
      itemRows = 2;
    }
    
    // Clamp itemRows to the maximum available rows
    itemRows = Math.max(1, Math.min(itemRows, numRows));

    // Find the optimal vertical position (row block) for this item.
    // We look for a contiguous block of `itemRows` rows that has the minimum maximum X.
    let minMaxX = Infinity;
    let bestRow = 0;

    for (let r = 0; r <= numRows - itemRows; r++) {
      let currentBlockMaxX = 0;
      for (let j = 0; j < itemRows; j++) {
        currentBlockMaxX = Math.max(currentBlockMaxX, rowXs[r + j]);
      }
      if (currentBlockMaxX < minMaxX) {
        minMaxX = currentBlockMaxX;
        bestRow = r;
      }
    }

    // Now we know this item will be placed at `minMaxX` starting at `bestRow`.
    // Before placing it, we MUST catch up any lagging rows in this block using filler items!
    for (let j = 0; j < itemRows; j++) {
      const targetRow = bestRow + j;
      if (rowXs[targetRow] < minMaxX) {
        const fillW = minMaxX - rowXs[targetRow] - gap;
        // Only inject a filler if there is actual visual space for it
        if (fillW >= 30) { 
          packed.push({
            id: `fill-${i}-${targetRow}`,
            type: 'filler',
            ...getNextFiller(),
            style: { 
              top: `${targetRow * (rowHeight + gap)}px`, 
              left: `${rowXs[targetRow]}px`, 
              width: `${fillW}px`, 
              height: `${rowHeight}px` 
            }
          });
        }
        // Advance the row X to the block's max X
        rowXs[targetRow] = minMaxX;
      }
    }
    
    // Place the actual image item
    const itemTotalHeight = (rowHeight * itemRows) + (gap * (itemRows - 1));
    packed.push({
      ...img,
      type: 'image',
      style: { 
        top: `${bestRow * (rowHeight + gap)}px`, 
        left: `${minMaxX}px`, 
        width: `${imgWidth}px`, 
        height: `${itemTotalHeight}px` 
      }
    });

    // Advance the X coordinate for all rows spanned by this item
    for (let j = 0; j < itemRows; j++) {
      rowXs[bestRow + j] = minMaxX + imgWidth + gap;
    }
  });
  
  // Sync all rows at the very end to ensure a perfect flush finish
  const finalMaxX = Math.max(...rowXs);
  for (let r = 0; r < numRows; r++) {
    if (rowXs[r] < finalMaxX) {
      const fillW = finalMaxX - rowXs[r] - gap;
      if (fillW >= 30) {
        packed.push({
          id: `fill-end-${r}`,
          type: 'filler',
          ...getNextFiller(),
          style: { 
            top: `${r * (rowHeight + gap)}px`, 
            left: `${rowXs[r]}px`, 
            width: `${fillW}px`, 
            height: `${rowHeight}px` 
          }
        });
      }
      rowXs[r] = finalMaxX;
    }
  }
  
  return { 
    items: packed, 
    totalWidth: finalMaxX - gap
  };
});

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  document.body.style.overflow = ''
})
</script>

<template>
  <footer id="contact" class="tralfamadorian-footer">
    <!-- =========================================================================
         SECTION 1: FULL-WIDTH COMIC-BOOK STYLE DENSE MOSAIC TAPESTRY
         ========================================================================= -->
    <div class="mosaic-full-bleed-header container">
      <div class="mosaic-badge">
        <span class="pulse-spark"></span>
        <span>03 // MOMENTS </span>
      </div>

      <h2 class="mosaic-header-title">
        A Tapestry of Marvelous Moments
      </h2>
    </div>

    <!-- Full Viewport Width Comic Panel Grid (Seamless Loop Marquee) -->
    <div class="full-width-tapestry-wrap">
      <div class="comic-mosaic-track">
        <div class="mosaic-marquee-inner" :style="{ '--marquee-width': `${packedTapestry.totalWidth}px` }">
          
          <!-- First Set -->
          <div class="mosaic-packed-container" :style="{ width: `${packedTapestry.totalWidth}px` }">
            <template v-for="item in packedTapestry.items" :key="item.id">
              <!-- Pure Artwork Panel (No Text Overlay) -->
              <div
                v-if="item.type === 'image'"
                class="mosaic-item-card image-card"
                :style="item.style"
                @click="openMomentModal(item)"
              >
                <img :src="item.image" :alt="item.title" class="moment-img" loading="lazy" />
              </div>

              <!-- Thematic Comic Accent Filler Block -->
              <div
                v-else
                class="mosaic-item-card filler-card"
                :style="item.style"
              >
                <div class="filler-content">
                  <span class="filler-cat">{{ item.category }}</span>
                  <div class="filler-quote">{{ item.quote }}</div>
                </div>
              </div>
            </template>
          </div>

          <!-- Second Set (Duplicate for seamless loop) -->
          <div class="mosaic-packed-container" :style="{ width: `${packedTapestry.totalWidth}px` }" aria-hidden="true">
            <template v-for="item in packedTapestry.items" :key="'clone-' + item.id">
              <!-- Pure Artwork Panel (No Text Overlay) -->
              <div
                v-if="item.type === 'image'"
                class="mosaic-item-card image-card"
                :style="item.style"
                @click="openMomentModal(item)"
              >
                <img :src="item.image" :alt="item.title" class="moment-img" loading="lazy" />
              </div>

              <!-- Thematic Comic Accent Filler Block -->
              <div
                v-else
                class="mosaic-item-card filler-card"
                :style="item.style"
              >
                <div class="filler-content">
                  <span class="filler-cat">{{ item.category }}</span>
                  <div class="filler-quote">{{ item.quote }}</div>
                </div>
              </div>
            </template>
          </div>

        </div>
      </div>
    </div>

    <!-- =========================================================================
         SECTION 2: LITERARY QUOTE & MAIN CTA
         ========================================================================= -->
    <div class="cta-quote-section container">
      <!-- Vonnegut Quote Card -->
      <div class="quote-card">
        <svg class="quote-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2H4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2h3c0 4-2 6-4 6z"></path>
          <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2h-4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2h3c0 4-2 6-4 6z"></path>
        </svg>
        <blockquote class="vonnegut-quote">
          "Each image was a brief, urgent message describing a situation or scene... seen all at once they produced an image of life that was beautiful and surprising and deep. Just the depth of many marvelous moments seen together all in the same instant."
        </blockquote>
        <div class="quote-author">
          &mdash; Kurt Vonnegut, <cite>Slaughterhouse-Five</cite>
        </div>
      </div>

      <!-- Main Contact CTA -->
      <div class="contact-cta-box">
        <span class="caption-cta">04 // GET IN TOUCH</span>
        <h2 class="cta-heading">Let's Create Marvelous Visual Moments Together.</h2>
        <p class="cta-desc">
          Interested in collaborating on Lighting, Compositing, VFX production, or Photography?
        </p>

        <div class="cta-actions">
          <a href="mailto:hello@anushkashah.dev" class="email-btn">
            <span>hello@anushkashah.dev</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>
      </div>
    </div>

    <!-- =========================================================================
         SECTION 3: PROFESSIONAL LINKS & FOOTER BOTTOM BAR
         ========================================================================= -->
    <div class="footer-links-bar container">
      <div class="links-row">
        <div class="brand-credits">
          <div class="footer-logo-text">ANUSHKA SHAH</div>
          <p class="footer-tagline">Visual Effects Artist & Lighting Specialist // Vancouver, BC</p>
        </div>

        <div class="social-nav">
          <a href="https://linkedin.com" target="_blank" rel="noopener" class="social-link">LinkedIn</a>
          <a href="https://artstation.com" target="_blank" rel="noopener" class="social-link">ArtStation</a>
          <a href="https://imdb.com" target="_blank" rel="noopener" class="social-link">IMDb</a>
          <a href="https://vimeo.com" target="_blank" rel="noopener" class="social-link">Vimeo / Reel</a>
          <a href="https://instagram.com" target="_blank" rel="noopener" class="social-link">Instagram</a>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="bottom-bar">
        <div class="copyright-text">
          &copy; {{ new Date().getFullYear() }} Anushka Shah. All rights reserved.
        </div>
        <button class="back-to-top" @click="scrollToTop" aria-label="Back to top">
          <span>Back to Top</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="19" x2="12" y2="5"></line>
            <polyline points="5 12 12 5 19 12"></polyline>
          </svg>
        </button>
      </div>
    </div>

    <!-- Moment Lightbox Modal -->
    <transition name="modal-fade">
      <div v-if="activeMomentModal" class="moment-modal" @click.self="closeMomentModal">
        <div class="modal-card">
          <button class="modal-close" @click="closeMomentModal" aria-label="Close modal">&times;</button>
          <div class="modal-media-box">
            <img :src="activeMomentModal.image" :alt="activeMomentModal.title" class="modal-img" />
          </div>
          <div class="modal-body">
            <span class="modal-cat">{{ activeMomentModal.category }}</span>
            <h3 class="modal-title">{{ activeMomentModal.title }}</h3>
            <p class="modal-caption">{{ activeMomentModal.caption }}</p>
          </div>
        </div>
      </div>
    </transition>
  </footer>
</template>

<style scoped>
.tralfamadorian-footer {
  width: 100%;
  background-color: #000000;
  color: #ffffff;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  padding-top: 6rem;
}

/* Header Badge */
.mosaic-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.4rem 0.9rem;
  border-radius: 9999px;
  background-color: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  font-size: 0.725rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #cbd5e1;
  margin-bottom: 1.25rem;
}

.pulse-spark {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ffffff;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.6);
  animation: pulse-glow 2s infinite;
}

@keyframes pulse-glow {
  0% { transform: scale(0.9); opacity: 0.7; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(0.9); opacity: 0.7; }
}

.mosaic-header-title {
  font-size: var(--font-size-h2);
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 2.5rem;
}

/* =========================================================================
   FULL-WIDTH COMIC BOOK MOSAIC REEL (ZERO GAPS, NO IMAGE TEXT)
   ========================================================================= */
.full-width-tapestry-wrap {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  padding: 0 1.5rem;
  margin-bottom: 6rem;
}

.comic-mosaic-track {
  width: 100%;
  height: 560px; /* Accommodates 534px content + some padding */
  overflow: hidden;
  position: relative;
}

.mosaic-marquee-inner {
  display: flex;
  gap: 14px; /* The exact gap used in grid layout */
  width: max-content;
  animation: marquee-scroll 40s linear infinite;
}

.mosaic-marquee-inner:hover {
  animation-play-state: paused;
}

.mosaic-packed-container {
  position: relative;
  height: 534px;
  flex-shrink: 0;
}

@keyframes marquee-scroll {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    /* Translate by exactly one full width of the container plus the gap */
    transform: translate3d(calc(-1 * (var(--marquee-width) + 14px)), 0, 0);
  }
}

/* Card Base Sizing & Packing */
.mosaic-item-card {
  position: absolute;
  box-sizing: border-box; /* CRITICAL: Prevents padding/border from expanding width */
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background-color: #0c0d11;
  transition: transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
}

/* Pure Image Cards */
.image-card {
  cursor: pointer;

  &:hover {
    transform: scale(1.02);
    border-color: rgba(56, 189, 248, 0.6);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.95);
    z-index: 10;
  }
}

.moment-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.image-card:hover .moment-img {
  transform: scale(1.08);
}

/* Comic Book Theme Filler Cards */
.filler-card {
  box-sizing: border-box;
  background: linear-gradient(135deg, #0f1016 0%, #161722 100%);
  border-color: rgba(56, 189, 248, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  text-align: center;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 1px;
    border: 1px dashed rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    pointer-events: none;
  }
}

.filler-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  overflow: hidden; /* Important for tiny dynamic widths */
}

.filler-cat {
  font-size: 0.725rem;
  font-weight: 800;
  color: #94a3b8;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  white-space: nowrap;
}

.filler-quote {
  font-family: var(--font-family);
  font-size: 1.25rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.02em;
  line-height: 1.25;
  text-transform: uppercase;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 100%;
}

/* =========================================================================
   SECTION 2: QUOTE & MAIN CTA
   ========================================================================= */
.cta-quote-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3.5rem;
  padding-bottom: 6rem;

  @media (min-width: 992px) {
    grid-template-columns: 1fr 1.2fr;
    gap: 4.5rem;
    align-items: center;
  }
}

.quote-card {
  background: #0a0a0c;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 2.5rem;
  position: relative;
  backdrop-filter: blur(12px);
}

.quote-icon {
  color: #94a3b8;
  margin-bottom: 1.25rem;
  opacity: 0.8;
}

.vonnegut-quote {
  font-family: var(--font-family);
  font-size: 1.05rem;
  font-style: italic;
  color: #e2e8f0;
  line-height: 1.7;
  margin: 0 0 1.25rem;
}

.quote-author {
  font-size: 0.875rem;
  font-weight: 600;
  color: #94a3b8;
}

.contact-cta-box {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.caption-cta {
  font-size: var(--font-size-caption);
  color: #94a3b8;
  letter-spacing: 0.12em;
  font-weight: 700;
  text-transform: uppercase;
}

.cta-heading {
  font-size: var(--font-size-h2);
  font-weight: 800;
  color: #ffffff;
  margin: 0.5rem 0 1rem;
  line-height: 1.15;
}

.cta-desc {
  font-size: var(--font-size-lead);
  color: #cbd5e1;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.email-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  border-radius: 50px;
  background-color: #ffffff;
  color: #000000;
  font-size: 1rem;
  font-weight: 700;
  transition: transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
}

.email-btn:hover {
  transform: translateY(-3px);
  background-color: #f1f5f9;
  box-shadow: 0 10px 30px rgba(255, 255, 255, 0.3);
}

/* =========================================================================
   SECTION 3: FOOTER BOTTOM BAR
   ========================================================================= */
.footer-links-bar {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 3.5rem 0 2.5rem;
}

.links-row {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 3rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.footer-logo-text {
  font-family: var(--font-family);
  font-size: 1.35rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.02em;
}

.footer-tagline {
  font-size: 0.875rem;
  color: #94a3b8;
  margin-top: 0.25rem;
}

.social-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.social-link {
  font-size: 0.925rem;
  font-weight: 600;
  color: #cbd5e1;
  transition: color 0.25s ease;
}

.social-link:hover {
  color: #ffffff;
}

.bottom-bar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);

  @media (min-width: 768px) {
    flex-direction: row;
  }
}

.copyright-text {
  font-size: 0.85rem;
  color: #64748b;
}

.back-to-top {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: #94a3b8;
  transition: color 0.25s ease, transform 0.25s ease;
}

.back-to-top:hover {
  color: #ffffff;
  transform: translateY(-2px);
}

/* Lightbox Modal */
.moment-modal {
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

.modal-card {
  position: relative;
  width: 100%;
  max-width: 650px;
  background-color: #0d0e12;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.95);
}

.modal-close {
  position: absolute;
  top: 0.75rem;
  right: 1.25rem;
  z-index: 10;
  font-size: 2.25rem;
  color: #ffffff;
  line-height: 1;
}

.modal-media-box {
  width: 100%;
  max-height: 420px;
  overflow: hidden;
  background: #000000;
}

.modal-img {
  width: 100%;
  max-height: 420px;
  object-fit: contain;
}

.modal-body {
  padding: 1.5rem 2rem 2rem;
}

.modal-cat {
  font-size: 0.775rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
}

.modal-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0.25rem 0 0.5rem;
}

.modal-caption {
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
