/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        primary: {
          50: "#E6F7EC",
          100: "#CCF0D9",
          200: "#99E1B3",
          300: "#66D18D",
          400: "#33C267",
          500: "#006423",
          600: "#00501C",
          700: "#003C15",
          800: "#00280E",
          900: "#001407",
        },
        secondary: {
          50: "#FDF4ED",
          100: "#FCE9DB",
          200: "#F8D3B7",
          300: "#F5BD93",
          400: "#F1A76F",
          500: "#D76303",
          600: "#AC4F02",
          700: "#813B02",
          800: "#562701",
          900: "#2B1401",
        },
        accent: {
          50: "#F5F5F5",
          100: "#E0E0E0",
          200: "#C2C2C2",
          300: "#A3A3A3",
          400: "#858585",
          500: "#666666",
          600: "#474747",
          700: "#2E2E2E",
          800: "#1A1A1A",
          900: "#000000",
        },
      },
    },
  },
  plugins: [],
};
