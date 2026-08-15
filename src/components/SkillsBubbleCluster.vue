<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import Matter from 'matter-js'
import { aboutData } from '../config/aboutData.js'

const clusterContainer = ref(null)
const bubbleElements = ref([])

let engine = null
let runner = null
let bodies = []
let mouseConstraint = null
let animationFrameId = null

const activeFilter = ref('all')

const filterBubbles = (tag) => {
  activeFilter.value = tag
  // Apply a gentle pulse impulse to all bodies
  bodies.forEach((b) => {
    Matter.Body.applyForce(b, b.position, {
      x: (Math.random() - 0.5) * 0.05,
      y: (Math.random() - 0.5) * 0.05
    })
  })
}

// Icon helper components / SVG templates
const getIconSvg = (iconName) => {
  switch (iconName) {
    case 'nuke':
      return `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`
    case 'katana':
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/></svg>`
    case 'maya':
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`
    case 'arnold':
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
    case 'houdini':
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/></svg>`
    case 'substance':
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6v6H9z"/></svg>`
    case 'photoshop':
      return `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M4 4h16v16H4V4zm5 4v8h2.5c1.4 0 2.5-1.1 2.5-2.5S12.9 11 11.5 11H9V8zm2 2h.5c.3 0 .5.2.5.5s-.2.5-.5.5H11v-1z"/></svg>`
    case 'lightroom':
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg>`
    case 'color':
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><circle cx="12" cy="12" r="10"/><path d="M12 2a7 7 0 0 0 7 7c0 2-2 3-2 3a4 4 0 0 1-4 4c-3 0-5-2-5-5a7 7 0 0 1 4-9z"/></svg>`
    case 'brush':
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z"/><path d="M9 8c-2 3-4 3.5-7 4l8 8c.5-3 1-5 4-7"/></svg>`
    case 'palette':
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`
    case 'camera':
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`
    case 'pen':
    case 'feather':
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>`
    default:
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><circle cx="12" cy="12" r="10"/></svg>`
  }
}

const initPhysics = () => {
  if (!clusterContainer.value) return

  const width = clusterContainer.value.clientWidth
  const height = clusterContainer.value.clientHeight || 520

  const Engine = Matter.Engine
  const World = Matter.World
  const Bodies = Matter.Bodies
  const Runner = Matter.Runner
  const Mouse = Matter.Mouse
  const MouseConstraint = Matter.MouseConstraint

  engine = Engine.create({
    gravity: { x: 0, y: 0.02, scale: 0.0005 }
  })

  // Walls & Boundaries (Thick boundaries to prevent escape)
  const wallThickness = 100
  const ground = Bodies.rectangle(width / 2, height + wallThickness / 2, width * 2, wallThickness, { isStatic: true })
  const ceiling = Bodies.rectangle(width / 2, -wallThickness / 2, width * 2, wallThickness, { isStatic: true })
  const leftWall = Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height * 2, { isStatic: true })
  const rightWall = Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height * 2, { isStatic: true })

  World.add(engine.world, [ground, ceiling, leftWall, rightWall])

  // Spawn circular bodies for each bubble
  const items = aboutData.skillsBubbles
  bodies = items.map((item, idx) => {
    // Stagger spawn positions around center
    const x = width / 2 + (Math.random() - 0.5) * (width * 0.7)
    const y = height / 2 + (Math.random() - 0.5) * (height * 0.6)
    const r = Math.max(38, Math.min(item.radius, width < 600 ? item.radius * 0.75 : item.radius))

    const body = Bodies.circle(x, y, r, {
      restitution: 0.85,
      frictionAir: 0.02,
      friction: 0.1,
      density: 0.002
    })

    body.itemData = item
    body.bubbleRadius = r
    body.domIdx = idx
    return body
  })

  World.add(engine.world, bodies)

  // Mouse drag & interaction
  const mouse = Mouse.create(clusterContainer.value)
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: { visible: false }
    }
  })

  // Allow touch gestures without scrolling conflict while dragging
  mouseConstraint.mouse.element.removeEventListener('mousewheel', mouseConstraint.mouse.mousewheel)
  mouseConstraint.mouse.element.removeEventListener('DOMMouseScroll', mouseConstraint.mouse.mousewheel)

  World.add(engine.world, mouseConstraint)

  runner = Runner.create()
  Runner.run(runner, engine)

  // Update DOM bubble elements transform at 60 FPS
  let time = 0
  const updateLoop = () => {
    time += 0.02
    
    // Add gentle buoyancy drift towards center
    const centerX = width / 2
    const centerY = height / 2

    bodies.forEach((body) => {
      // Soft gentle pull to center
      const dx = centerX - body.position.x
      const dy = centerY - body.position.y
      Matter.Body.applyForce(body, body.position, {
        x: dx * 0.000008 + Math.sin(time + body.id) * 0.00005,
        y: dy * 0.000008 + Math.cos(time + body.id) * 0.00005
      })

      // Sync DOM node
      const el = bubbleElements.value[body.domIdx]
      if (el) {
        const r = body.bubbleRadius
        const x = body.position.x - r
        const y = body.position.y - r
        el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${body.angle * 0.4}rad)`
      }
    })

    animationFrameId = requestAnimationFrame(updateLoop)
  }

  updateLoop()
}

const scatterBubbles = () => {
  bodies.forEach((b) => {
    Matter.Body.applyForce(b, b.position, {
      x: (Math.random() - 0.5) * 0.1,
      y: (Math.random() - 0.5) * 0.1 - 0.03
    })
  })
}

const handleResize = () => {
  if (engine && runner) {
    Runner.stop(runner)
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
    World.clear(engine.world, false)
    Engine.clear(engine)
  }
  nextTick(() => {
    initPhysics()
  })
}

onMounted(() => {
  nextTick(() => {
    initPhysics()
    window.addEventListener('resize', handleResize)
  })
})

onUnmounted(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  if (runner) Runner.stop(runner)
  if (engine) {
    World.clear(engine.world, false)
    Engine.clear(engine)
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="bubble-cluster-wrapper">
    <!-- Controls Header -->
    <div class="cluster-controls">
      <div class="filter-pills">
        <button
          class="pill-btn"
          :class="{ 'active': activeFilter === 'all' }"
          @click="filterBubbles('all')"
        >
          All Skills ({{ aboutData.skillsBubbles.length }})
        </button>
        <button
          class="pill-btn"
          :class="{ 'active': activeFilter === 'VFX' }"
          @click="filterBubbles('VFX')"
        >
          VFX & Lighting
        </button>
        <button
          class="pill-btn"
          :class="{ 'active': activeFilter === 'Art' }"
          @click="filterBubbles('Art')"
        >
          Traditional Arts
        </button>
        <button
          class="pill-btn"
          :class="{ 'active': activeFilter === 'Photo' }"
          @click="filterBubbles('Photo')"
        >
          Cinematography
        </button>
      </div>

      <button class="agitate-btn" @click="scatterBubbles" title="Shake & float bubbles">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
        </svg>
        <span>Stir Physics</span>
      </button>
    </div>

    <!-- Physics Arena Viewport -->
    <div ref="clusterContainer" class="cluster-arena">
      <div class="arena-background-glow"></div>
      <div class="interaction-hint">
        <span>✨ Drag, push, and play with skill bubbles</span>
      </div>

      <!-- Renderable DOM Bubble Nodes -->
      <div
        v-for="(item, idx) in aboutData.skillsBubbles"
        :key="item.id"
        :ref="(el) => (bubbleElements[idx] = el)"
        class="skill-bubble"
        :class="{ 
          'is-dimmed': activeFilter !== 'all' && item.tag !== activeFilter,
          'is-highlighted': activeFilter !== 'all' && item.tag === activeFilter
        }"
        :style="{
          width: `${item.radius * 2}px`,
          height: `${item.radius * 2}px`,
          borderColor: item.accent,
          '--bubble-accent': item.accent
        }"
      >
        <div class="bubble-inner">
          <div class="bubble-icon" v-html="getIconSvg(item.icon)"></div>
          <span class="bubble-title">{{ item.name }}</span>
          <span class="bubble-cat">{{ item.category }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bubble-cluster-wrapper {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
}

/* Controls Bar */
.cluster-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.filter-pills {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.pill-btn {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.45rem 0.9rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  transition: all 0.25s ease;
}

.pill-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.25);
}

.pill-btn.active {
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
  border-color: #38bdf8;
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.25);
}

.agitate-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.775rem;
  font-weight: 600;
  color: #cbd5e1;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.45rem 0.85rem;
  border-radius: 20px;
  transition: all 0.2s ease;
}

.agitate-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

/* Physics Arena */
.cluster-arena {
  position: relative;
  width: 100%;
  height: 520px;
  background: radial-gradient(circle at center, #0f121a 0%, #06070a 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.95), inset 0 0 60px rgba(0, 0, 0, 0.6);
  cursor: grab;
  user-select: none;
  touch-action: none;
}

.cluster-arena:active {
  cursor: grabbing;
}

.arena-background-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 65%;
  height: 65%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.09) 0%, transparent 70%);
  pointer-events: none;
}

.interaction-hint {
  position: absolute;
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.725rem;
  color: #64748b;
  letter-spacing: 0.05em;
  pointer-events: none;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

/* Floating Skill Bubble DOM Element */
.skill-bubble {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 50%;
  border: 1.5px solid;
  background: radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.12) 0%, rgba(13, 16, 23, 0.85) 60%, rgba(5, 7, 10, 0.95) 100%);
  backdrop-filter: blur(8px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.8), inset 0 0 15px rgba(255, 255, 255, 0.06), 0 0 12px var(--bubble-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform;
  pointer-events: auto;
  transition: opacity 0.3s ease, filter 0.3s ease, border-color 0.3s ease;
}

.skill-bubble:hover {
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.95), 0 0 22px var(--bubble-accent);
  border-width: 2px;
}

.skill-bubble.is-dimmed {
  opacity: 0.25;
  filter: grayscale(0.8);
}

.skill-bubble.is-highlighted {
  opacity: 1;
  box-shadow: 0 0 25px var(--bubble-accent);
}

.bubble-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0.4rem;
  pointer-events: none;
}

.bubble-icon {
  color: var(--bubble-accent);
  margin-bottom: 0.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 0 6px var(--bubble-accent));
}

.bubble-title {
  font-size: 0.825rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.01em;
  line-height: 1.1;
  white-space: nowrap;
}

.bubble-cat {
  font-size: 0.625rem;
  color: #94a3b8;
  font-weight: 600;
  margin-top: 0.15rem;
  white-space: nowrap;
}

@media (max-width: 600px) {
  .cluster-arena {
    height: 440px;
  }

  .bubble-title {
    font-size: 0.725rem;
  }

  .bubble-cat {
    font-size: 0.55rem;
  }
}
</style>
