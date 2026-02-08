/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette principale
        'primary': '#0F172A',
        'primary-light': '#1E293B',
        'primary-dark': '#020617',
        'accent': '#00D4FF',
        'accent-dark': '#0EA5E9',
        'blue': '#3B82F6',

        // Couleurs du drapeau du Bénin
        'benin-green': '#00843D',
        'benin-yellow': '#FCD116',
        'benin-red': '#E8112D',

        // Texte et arrière-plan
        'text': '#1F2937',
        'text-secondary': '#6B7280',
        'text-muted': '#9CA3AF',
        'background': '#F9FAFB',
        'background-alt': '#F3F4F6',
        'slate-dark': '#0F172A',
        'border': '#E5E7EB',
        'pattern': '#CBD5E1',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
