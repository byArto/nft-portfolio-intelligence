// tailwind.config.ts

import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class', // Включаем тёмную тему через класс 'dark'
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Можно добавить кастомные цвета, шрифты и т.д.
    },
  },
  plugins: [],
}

export default config