import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'print': { 'raw': 'print' },
        'screen': { 'raw': 'screen' },
      },
      colors: {
        background: "rgb(114, 186, 169)",
        foreground: "rgb(213, 231, 181)",
        primary: "rgb(71, 78, 147)",
        secondary: "rgb(126, 92, 173)",
      },
    },
  },
  plugins: [],
} satisfies Config;
