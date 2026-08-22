/**
 * Clean, structured data configuration for Anushka Shah's About Page:
 * Minimalist "Contact Sheet" Design with Hover-Reveals
 */

export const aboutData = {
  hero: {
    fullName: 'Anushka Jatin Shah',
    role: 'Creative Artist',
    location: 'Vancouver, Canada',
    tagline: 'I am a passionate and hardworking professional with a strong commitment to delivering high-quality work. With excellent organizational abilities, a proactive mindset, and a positive work ethic, I adapt quickly to new challenges and thrive in collaborative environments. I graduated from the Centre for Entertainment Arts at Kwantlen Polytechnic University as a Lighting and Compositing Artist and am legally eligible to work in Canada.',
    email: 'ajs197430@gmail.com',
    instagram: 'https://www.instagram.com/artsy_with_anushka',
    portraitImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    stats: [
      { num: 'VFX', label: 'Lighting & Comp' },
      { num: 'KPU', label: 'CEA VFX Diploma' },
      { num: 'YVR', label: 'Vancouver Based' },
      { num: 'ART', label: 'Creative Artist' }
    ]
  },

  // Journey timeline containing academics & work experience
  journey: [
    {
      id: 'freelance',
      year: 'Jan 2024 – Present',
      title: 'Photographer / Video Editor / Tattoo Artist / Graphic Designer / Colorist',
      org: 'Freelance Work',
      location: 'Vancouver, BC',
      bullets: [
        'Working for event management companies as video editor, photographer, graphic designer.',
        'Color corrected and stabilizing the footages.',
        'Do temporary sprays tattoo at company events or personal events.',
        'Worked on short films and created 2D invites.'
      ],
      tags: ['Cinematography', 'Video Editing', 'Color Correction', 'Graphic Design'],
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'gigib',
      year: 'June 2022 – Present',
      title: 'Supervisor',
      org: 'Gigi B at Granville Island',
      location: 'Vancouver, BC',
      bullets: [
        'Ensuring that the store maintain an orderly and pristine appearance.',
        'Communicating with the customers and helping with their necessities.',
        'Training new employees.',
        'Reviewing the stock and making sure the store is fully stocked.'
      ],
      tags: ['Store Operations', 'Customer Service', 'Team Leadership'],
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'viff',
      year: 'Sept – Oct 2024',
      title: 'Volunteer - Front of House Operations',
      org: 'Vancouver International Film Festival',
      location: 'Vancouver, BC',
      bullets: [
        'Managed ticket scanning, ushering, and guest lineups at event venues.',
        'Assisted with box office operations and customer inquiries.',
        'Assisted with coordinated logistics and supported special events.'
      ],
      tags: ['Cinema Operations', 'Screening Logistics', 'Event Support'],
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'langara',
      year: '2020 – 2021',
      title: 'Foundation in Entertainment Arts',
      org: 'Langara College',
      location: 'Vancouver, BC',
      bullets: [
        'Developed core skills in VFX using industry-standard software, laying the foundation for advanced visual effects techniques.',
        'Gained a strong understanding of the fundamentals of traditional and visual arts, building essential skills for creative disciplines.',
        'Played a key role in resolving student issues and facilitating communication between students and faculty as Class Representative.'
      ],
      tags: ['Maya', 'Traditional Art', 'Art Fundamentals'],
      image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'kpu',
      year: '2021 – 2023',
      title: 'Diploma in Visual Effects (Virtual Production)',
      org: 'Kwantlen Polytechnic University',
      location: 'Richmond / Vancouver, BC',
      bullets: [
        'Gained hands-on experience in lighting and compositing using industry-standard software.',
        'Collaborated on short film projects, contributing to lighting setups and green screen removal for seamless compositing.',
        'Applied technical and artistic skills to enhance visual storytelling, ensuring high-quality post-production results.'
      ],
      tags: ['Katana', 'Nuke', 'Maya', 'Arnold', 'Green Screen'],
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'
    },



  ],

  // Software & Tools (Converted for minimal list and hover-reveal)
  skills: [
    { name: 'Nuke', category: 'Compositing', image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=800&q=80' },
    { name: 'Katana', category: 'Lighting', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80' },
    { name: 'Maya', category: '3D LookDev', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80' },
    { name: 'Arnold', category: 'Rendering', image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80' },
    { name: 'Substance Painter', category: 'Texturing', image: 'https://images.unsplash.com/photo-1618005191196-107062483863?auto=format&fit=crop&w=800&q=80' },
    { name: 'Photoshop', category: 'Digital Art', image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80' },
    { name: 'Lightroom', category: 'Color Grade', image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80' },
    { name: 'Illustrator', category: 'Graphic Design', image: 'https://images.unsplash.com/photo-1618005198143-e528346d9a59?auto=format&fit=crop&w=800&q=80' }
  ],

  // Traditional Art & Theory
  foundations: [
    { name: 'Watercolor Painting', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80' },
    { name: 'Acrylic Painting', image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&w=800&q=80' },
    { name: 'Pen & Pencil Value Shading', image: 'https://images.unsplash.com/photo-1581404116515-b3e34b9cf4b1?auto=format&fit=crop&w=800&q=80' }
  ],

  // Languages Spoken
  languages: ['English', 'Hindi', 'French', 'Gujarati']
}
