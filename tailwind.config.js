/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/index.html", "./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        fraunces: ["Fraunces", "serif"],
        sans: ["Poppins", "sans-serif"],
      },
      colors: {
        surface: "#fafafa",
        primary: "#3a3a3a",
        secondary: "#8fa0b4",
        base: "#8fa0b4",
        acent: "#a94b52",
        success: "#198754",
        border: "#a94b52",
        "border-input": "#3a3a3a",
        "button-primary": "#a94b52",
        "button-disabled": "#cad7e6",
        "button-hover": "#894046",
        "button-text": "#fafafa",
      },
      fontWeight: {
        light: "300",
        regular: "400",
        medium: "500",
        bold: "700",
      },
      fontSize: {
        "h1-sm": "4rem",
        "h2-sm": "2rem",
        "h3-sm": "1rem",
        "p-sm": "0.75rem",
        "form-sm": "1rem",
        "h1-md": "6rem",
        "h2-md": "3rem",
        "h3-md": "1.5rem",
        "p-md": "1.5rem",
        "form-md": "1rem",
        "h1-lg": "8rem",
        "h2-lg": "3rem",
        "h3-lg": "1.5rem",
        "p-lg": "1.2rem",
        "form-lg": "1.5rem",
        "button-sm": "0.75rem",
        "button-md": "1rem",
        "button-lg": "1.25rem",
      },
      spacing: {
        xs: "0.5rem",
        sm: "1rem",
        md: "1.5rem",
        lg: "2rem",
        xl: "3rem",
      },
      keyframes: {
        "infinite-scroll": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
      },
      animation: {
        "infinite-scroll": "infinite-scroll 25s linear infinite",
      },
    },
  },
  plugins: [],
};
