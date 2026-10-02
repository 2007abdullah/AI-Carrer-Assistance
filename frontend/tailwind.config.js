/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f1222",
        surface: "#151933",
        accent: "#7c5cff",
        accent2: "#22d3ee",
      },
    },
  },
  plugins: [],
}
