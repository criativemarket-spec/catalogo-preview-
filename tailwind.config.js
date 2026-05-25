/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream:  { DEFAULT: '#F8F4EF', dark: '#EFE8DF' },
        brown: {
          900: '#2C1810', 800: '#3D2314', 700: '#5C3317',
          600: '#7A4425', 500: '#9B5E35', 400: '#B8845A',
          300: '#D4A87A', 200: '#E8CEAD', 100: '#F2E4D4', 50: '#FAF3EC',
        },
        rose: {
          DEFAULT: '#C4717A', light: '#E8A0A8', pale: '#F5DDE0',
          dark: '#A0555E', deeper: '#7A3A42',
        },
        gold: { DEFAULT: '#A0855A', light: '#C4A87A', pale: '#E8D4B0' },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body:    ['Jost', 'Helvetica Neue', 'sans-serif'],
        accent:  ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft':    '0 2px 16px rgba(44,24,16,0.06)',
        'medium':  '0 4px 24px rgba(44,24,16,0.10)',
        'strong':  '0 8px 40px rgba(44,24,16,0.16)',
        'rose':    '0 4px 24px rgba(196,113,122,0.25)',
        'card':    '0 2px 16px rgba(44,24,16,0.06)',
        'card-hover': '0 12px 40px rgba(44,24,16,0.14)',
        'drawer':  '-4px 0 40px rgba(44,24,16,0.12)',
        'button':  '0 4px 16px rgba(44,24,16,0.20)',
      },
      borderRadius: {
        '2xl': '1rem',   '3xl': '1.5rem',
        '4xl': '2rem',   'pill': '9999px',
      },
      animation: {
        'fade-in':    'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'scale-in':   'scaleIn 0.3s ease-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'shimmer':    'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        fadeInUp:  { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn:   { from: { opacity: '0', transform: 'scale(0.96)' }, to: { opacity: '1', transform: 'scale(1)' } },
        slideUp:   { from: { transform: 'translateY(20px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        shimmer:   { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      transitionDuration: { '400': '400ms' },
    },
  },
  plugins: [],
}
