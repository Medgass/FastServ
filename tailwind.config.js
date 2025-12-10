/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tunisia-blue': '#2563eb',
        'tunisia-light-blue': '#60a5fa',
        'tunisia-white': '#ffffff',
        'tunisia-cream': '#fef3c7',
      }
    },
  },
  plugins: [],
}
