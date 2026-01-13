// app/components/ThemeToggle.tsx
'use client'

import { Moon } from 'lucide-react'

export default function ThemeToggle() {
  // Тема фиксирована (тёмная), кнопка декоративная
  // В будущем можно добавить функционал переключения
  
  return (
    <div
      className="
        fixed top-6 right-6 
        p-3 rounded-xl
        bg-slate-800/80 backdrop-blur-sm
        border border-slate-700
        shadow-lg shadow-black/20
        z-50
        cursor-default
      "
      title="Dark theme"
    >
      <Moon size={20} className="text-amber-400" />
    </div>
  )
}