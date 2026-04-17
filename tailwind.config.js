/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        panel: 'var(--panel)',
        card: 'var(--card)',
        accent: 'var(--accent)',
        hover: 'var(--hover)',
        text: 'var(--text)',
      }
    },
  },
  plugins: [],
}
