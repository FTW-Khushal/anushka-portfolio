/**
 * Navigation configuration for Anushka Shah Portfolio.
 * Modular JSON structure allowing sub-categories under "Work" to be dynamically
 * fetched from an API or updated easily in the future.
 */
export const navigationData = {
  logo: {
    image: '/logo.svg',
    text: 'Anushka Shah',
    href: '#hero'
  },
  menuItems: [
    {
      id: 'home',
      name: 'Home',
      href: '#hero'
    },
    {
      id: 'about',
      name: 'About',
      href: '#about'
    },
    {
      id: 'work',
      name: 'Work',
      href: '#work',
      children: [
        { id: 'photography', name: 'Photography', href: '#photography', description: 'Photography works' },
        { id: 'visual-effects', name: 'Visual effects', href: '#visual-effects', description: 'Visual effects works' },
        { id: 'art-design', name: 'Art & design', href: '#art-design', description: 'Art & design works' },
        { id: 'archive', name: 'Archive', href: '#archive', description: 'Archived works' }
      ]
    },
    {
      id: 'contact',
      name: 'Contact',
      href: '#contact'
    }
  ]
}
