/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#E384FF",
          secondary: "#865DFF",
          accent: "#FFA3FD",
          neutral: "#1f2937",
          "base-100": "#191825",
          info: "#2868D7",
          success: "#28BD9B",
          warning: "#EFD76C",
          error: "#F0260F",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
