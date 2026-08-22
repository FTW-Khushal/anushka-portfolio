/**
 * Centralized data configuration for Anushka Shah Portfolio Work Showcase.
 * Categories: VFX Artist, Photography, Visual Effects, Art & Design, Archive
 */
export const categoriesData = [
  { id: 'all', name: 'All Works', count: 8 },
  { 
    id: 'vfx', 
    name: 'VFX Artist', 
    count: 2,
    cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80'
  },
  { 
    id: 'photography', 
    name: 'Photography', 
    count: 2,
    cover: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80'
  },
  { 
    id: 'visual-effects', 
    name: 'Visual Effects', 
    count: 2,
    cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80'
  },
  { 
    id: 'art-design', 
    name: 'Art & Design', 
    count: 1,
    cover: 'https://images.unsplash.com/photo-1776244798324-3375e443d534?q=80&w=2064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  { 
    id: 'archive', 
    name: 'Archive', 
    count: 1,
    cover: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80'
  }
]

export const projectsData = [
  {
    id: 1,
    title: 'Cybernetic Horizon',
    category: 'vfx',
    categoryName: 'VFX Artist',
    year: '2026',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    video: '/file_example_WEBM_1920_3_7MB.webm',
    aspect: 'aspect-wide', // 16:9
    width: 1920,
    height: 1080,
    description: 'Generative particle FX and futuristic environment compositing for sci-fi feature film.'
  },
  {
    id: 2,
    title: 'Monochrome Portraits',
    category: 'photography',
    subCategory: 'Portraits',
    categoryName: 'Photography',
    year: '2025',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
    aspect: 'aspect-tall', // 4:5 portrait
    width: 1000,
    height: 1500,
    description: 'High-contrast studio editorial photography exploring texture and light.'
  },
  {
    id: 3,
    title: 'Liquid Gold Simulation',
    category: 'visual-effects',
    categoryName: 'Visual Effects',
    year: '2026',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
    video: '/file_example_WEBM_1920_3_7MB.webm',
    aspect: 'aspect-square', // 1:1
    width: 1000,
    height: 1000,
    description: 'Houdini dynamic fluid simulation & photorealistic shader rendering.'
  },
  {
    id: 4,
    title: 'Minimalist Poster System',
    category: 'art-design',
    subCategory: 'Typography',
    categoryName: 'Art & Design',
    year: '2025',
    image: 'https://images.unsplash.com/photo-1776244798324-3375e443d534?q=80&w=2064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    aspect: 'aspect-tall',
    width: 2064,
    height: 2752,
    description: 'Experimental grid typography design system created for international art biennial.'
  },
  {
    id: 5,
    title: 'Quantum Portal Destruction',
    category: 'vfx',
    categoryName: 'VFX Artist',
    year: '2026',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    video: '/file_example_WEBM_1920_3_7MB.webm',
    aspect: 'aspect-wide',
    width: 1920,
    height: 1080,
    description: 'Rigid body dynamics demolition and volumetric smoke simulation.'
  },
  {
    id: 6,
    title: 'Urban Shadows & Architecture',
    category: 'photography',
    subCategory: 'Architecture',
    categoryName: 'Photography',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
    aspect: 'aspect-tall',
    width: 1000,
    height: 1500,
    description: 'Long-exposure architectural photography in Tokyo and Seoul.'
  },
  {
    id: 7,
    title: 'Holographic Interface FX',
    category: 'visual-effects',
    categoryName: 'Visual Effects',
    year: '2025',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    aspect: 'aspect-wide',
    width: 1920,
    height: 1080,
    description: 'Futuristic HUD graphics and UI motion tracking.'
  },
  {
    id: 8,
    title: 'Early Motion Tests (2022-2023)',
    category: 'archive',
    subCategory: 'Early Work',
    categoryName: 'Archive',
    year: '2023',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
    aspect: 'aspect-square',
    width: 1000,
    height: 1000,
    description: 'Curated archive of early visual experimentation and shader R&D.'
  },
  // Added Mock Data for Masonry Testing
  {
    id: 9,
    title: 'Neon Nights in Kyoto',
    category: 'photography',
    subCategory: 'Street',
    categoryName: 'Photography',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1570451631627-2c13038ceaa1?auto=format&fit=crop&w=1000&q=80',
    aspect: 'aspect-wide',
    width: 1600,
    height: 1067,
    description: 'Cinematic street photography focusing on neon reflections and cyberpunk aesthetics.'
  },
  {
    id: 10,
    title: 'Ethereal Landscapes',
    category: 'photography',
    subCategory: 'Landscapes',
    categoryName: 'Photography',
    year: '2023',
    image: 'https://images.unsplash.com/photo-1506744031586-b1086111a469?auto=format&fit=crop&w=1000&q=80',
    aspect: 'aspect-wide',
    width: 1500,
    height: 1000,
    description: 'Drone photography over the highlands of Scotland.'
  },
  {
    id: 11,
    title: 'Editorial Fashion Shoot',
    category: 'photography',
    subCategory: 'Portraits',
    categoryName: 'Photography',
    year: '2025',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
    aspect: 'aspect-tall',
    width: 1000,
    height: 1500,
    description: 'Avant-garde fashion editorial shot on medium format.'
  },
  {
    id: 12,
    title: 'Brutalism Typography Vol.1',
    category: 'art-design',
    subCategory: 'Typography',
    categoryName: 'Art & Design',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80', // Using abstract placeholder
    aspect: 'aspect-square',
    width: 1200,
    height: 1200,
    description: 'Exploration of Swiss brutalist design principles in modern web posters.'
  },
  {
    id: 13,
    title: 'Abstract Fluid Dynamics',
    category: 'art-design',
    subCategory: 'Digital Painting',
    categoryName: 'Art & Design',
    year: '2026',
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1000&q=80',
    aspect: 'aspect-wide',
    width: 1920,
    height: 1080,
    description: 'Digital painting mixed with generative algorithms.'
  },
  {
    id: 14,
    title: 'Surreal Collages',
    category: 'art-design',
    subCategory: 'Digital Painting',
    categoryName: 'Art & Design',
    year: '2025',
    image: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?auto=format&fit=crop&w=1000&q=80',
    aspect: 'aspect-tall',
    width: 1000,
    height: 1400,
    description: 'Vintage magazine cuts blended with digital overlays.'
  }
]
