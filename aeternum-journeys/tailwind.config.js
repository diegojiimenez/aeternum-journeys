/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'roman-bg': '#F7F5F0', // El fondo crema sutil
        'terracotta': '#C87B5D', // Para los pines y países visitados
        'terracotta-dark': '#A66045', 
        'bronze': '#D49A36', // Para los botones como "Add New Journey"
        'bronze-dark': '#B5822A',
        'charcoal': '#2D2D2D', // Para los textos (es más elegante que el negro puro)
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'], // Para los títulos elegantes
        sans: ['Inter', 'sans-serif'], // Para los textos normales
      }
    },
  },
  plugins: [],
}