import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006',
        },
        brand: {
          primary: '#ca8a04', // Gold
          secondary: '#f59e0b', // Amber
          accent: '#fbbf24', // Light Gold
          dark: '#1f2937', // Gray-800
          darker: '#111827', // Gray-900
        },
      },
      boxShadow: {
        'gold': '0 4px 14px 0 rgba(202, 138, 4, 0.39)',
        'gold-lg': '0 10px 40px 0 rgba(202, 138, 4, 0.5)',
      },
    },
  },
  plugins: [],
};
export default config;
