/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  "./src/**/*.{js,jsx,ts,tsx}",
  "!./src/routes/Home.js",
  "!./src/routes/SkillCategoryPage.js",
  ],
  corePlugins: {
  preflight: false,
  },
  theme: {
  extend: {},
  },
  plugins: [],
  }