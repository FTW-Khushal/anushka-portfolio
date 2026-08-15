/**
 * Clean, structured data configuration for Anushka Shah's About Page:
 * Minimalist "Contact Sheet" Design with Hover-Reveals
 */

export const aboutData = {
  hero: {
    fullName: 'Anushka Jatin Shah',
    role: 'Lighting & Compositing Artist',
    location: 'Vancouver, BC',
    tagline: 'Crafting cinematic mood, depth, and atmospheric storytelling through the science and art of light.',
    email: 'anushah3008@gmail.com',
    instagram: 'https://www.instagram.com/artsy_with_anushka',
    portraitImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    stats: [
      { num: 'VFX', label: 'Lighting & Comp' },
      { num: 'KPU', label: 'CEA VFX Diploma' },
      { num: 'YVR', label: 'Vancouver Based' },
      { num: '35mm', label: 'Cinematography' }
    ]
  },

  // Clean Journey Milestones
  journey: [
    {
      id: 'langara',
      year: '2020 – 2021',
      title: 'Foundation in Entertainment Arts',
      org: 'Langara College',
      location: 'Vancouver, BC',
      summary: 'Built core foundations in 3D computer graphics, traditional fine arts, and visual storytelling. Class Representative.',
      tags: ['Maya', 'Traditional Art', 'Art Fundamentals'],
      image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'kpu',
      year: '2021 – 2023',
      title: 'Diploma in Visual Effects (Virtual Production)',
      org: 'Centre for Entertainment Arts – KPU',
      location: 'Richmond / Vancouver, BC',
      summary: 'Specialization in Katana lighting, Nuke multi-pass compositing, and Maya look development. Green screen & short film setups.',
      tags: ['Katana', 'Nuke', 'Maya', 'Arnold', 'Green Screen'],
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'viff',
      year: 'Sept – Oct 2024',
      title: 'Vancouver International Film Festival',
      org: 'VIFF Operations',
      location: 'Vancouver, BC',
      summary: 'Front-of-house operations, screening logistics, theater lineups, and cinema guest services across Vancouver festival venues.',
      tags: ['Cinema Operations', 'Screening Logistics'],
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'freelance',
      year: '2024 – Present',
      title: 'Cinematography & Color Grading',
      org: 'Freelance / Event Productions',
      location: 'Vancouver, BC',
      summary: 'Shooting raw event video, managing on-set camera framing/lighting, advanced color grading, and footage stabilization.',
      tags: ['Cinematography', 'Video Editing', 'Color Correction', '35mm'],
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'
    }
  ],

  // Software & Tools (Converted for minimal list and hover-reveal)
  skills: [
    { name: 'Nuke', category: 'Compositing', image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=800&q=80' },
    { name: 'Katana', category: 'Lighting', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80' },
    { name: 'Maya', category: '3D LookDev', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80' },
    { name: 'Arnold', category: 'Rendering', image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80' },
    { name: 'Houdini', category: 'FX & Sim', image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80' },
    { name: 'Substance', category: 'Texturing', image: 'https://images.unsplash.com/photo-1618005191196-107062483863?auto=format&fit=crop&w=800&q=80' },
    { name: 'Photoshop', category: 'LookDev', image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80' },
    { name: 'Lightroom', category: 'Color Grade', image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80' }
  ],

  // Traditional Art & Theory
  foundations: [
    { name: 'Color Theory & Harmony', image: 'https://images.unsplash.com/photo-1502691876148-a84978e59af8?auto=format&fit=crop&w=800&q=80' },
    { name: 'Watercolor Painting', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80' },
    { name: 'Acrylic Painting', image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&w=800&q=80' },
    { name: 'Pen & Pencil Value Shading', image: 'https://images.unsplash.com/photo-1581404116515-b3e34b9cf4b1?auto=format&fit=crop&w=800&q=80' },
    { name: 'Henna Artistry', image: 'https://images.unsplash.com/photo-1601004128549-3db91de0a53b?auto=format&fit=crop&w=800&q=80' }
  ]
}
