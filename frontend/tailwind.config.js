/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs principales OAIB (du poster)
        primary: {
          DEFAULT: '#1AA97E',
          light: '#00C2A0',
          dark: '#00916B',
        },
        blue: {
          DEFAULT: '#003F88',
          light: '#1E5AA8',
          dark: '#002855',
        },
        accent: {
          DEFAULT: '#00C2A0',
          light: '#26D5B2',
          dark: '#00A88C',
        },
        red: {
          DEFAULT: '#E31E24',
          light: '#EF4444',
          dark: '#B91C1C',
        },
        yellow: {
          DEFAULT: '#FFB800',
          light: '#FFC933',
          dark: '#CC9300',
        },
        cyan: {
          DEFAULT: '#00C2A0',
          light: '#1AA97E',
          dark: '#008B72',
        },
        // Couleurs du drapeau du Bénin
        'benin-green': '#008751',
        'benin-yellow': '#FCD116',
        'benin-red': '#E8112D',
        // Texte et arrière-plan
        text: {
          DEFAULT: '#1E293B',
          secondary: '#64748B',
          muted: '#94A3B8',
        },
        background: {
          DEFAULT: '#F8FAFC',
          alt: '#EEF2F7',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          alt: '#F1F5F9',
        },
        border: {
          DEFAULT: '#E2E8F0',
          light: '#F1F5F9',
        },
        pattern: {
          DEFAULT: '#003F88',
          light: '#1E5AA8',
          dark: '#002855',
        },
        navy: '#0A0F1A',
        'slate-dark': '#121A2E',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        title: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
