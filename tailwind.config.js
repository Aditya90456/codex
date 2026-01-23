/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      'xxxs': '240px', // Extra ultra small screens (240px)
      'xxs': '250px',  // Ultra small screens
      'xs': '320px',   // Small phones
      'sm': '640px',   // Tablets
      'md': '768px',   // Small laptops
      'lg': '1024px',  // Desktops
      'xl': '1280px',  // Large desktops
      '2xl': '1536px', // Extra large
    },
  },
  plugins: [],
}