/** @type {import('tailwindcss').Config} */

const { nextui } = require("@nextui-org/react");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        pri: '#5F3D8C',
        sec: '#0000000D',
        light_bg_bright: '#f3f4f6',
        light_bg_dim: '#F2F2F2',
        light_border_bright: '#d1d5db',
        light_border_dim: '#374151',
        light_txt: '#000000',
        light_txt1: '#374151',
        light_txt2: '#FFFFFF',
        scroll: '#231430',
      },
      fontFamily: {
        clicker: ['"Clicker Script"', 'cursive'],
        poppins: ['"Poppins"', 'sans-serif'],
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
