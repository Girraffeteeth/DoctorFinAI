/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        neon: "#00f5ff",
        cyber: "#7c3aed",
        darkbg: "#050816"
      }
    }
  },
  plugins: []
}
