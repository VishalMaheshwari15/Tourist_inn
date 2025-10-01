// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      maxWidth: {
        container: "1180px",
      },
      colors: {
        surface: "#f8fafc",
        ink: "#0f172a",
        line: "#e2e8f0",
        mute: "#475569",
        accent: {
          50: "#fdf2ff",
          100: "#f8e7ff",
          200: "#efccff",
          300: "#e6b3ff",
          400: "#cc8fff",
          500: "#b366ff",
          600: "#8c3cff",
          700: "#6A00FF", // brand violet
          800: "#5200cc",
          900: "#3d0099",
        },
      },
    },
  },
  plugins: [],
};
