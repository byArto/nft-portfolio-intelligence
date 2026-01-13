// app/components/SettingsMenu.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { Settings, Sun, Moon, Globe } from 'lucide-react'
import { Language } from '../lib/translations'

type Props = {
  theme: 'dark' | 'light'
  language: Language
  onThemeChange: (theme: 'dark' | 'light') => void
  onLanguageChange: (lang: Language) => void
}

export default function SettingsMenu({ theme, language, onThemeChange, onLanguageChange }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Закрытие при клике вне меню
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={menuRef}>
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          p-3 rounded-xl
          bg-slate-800/80 backdrop-blur-sm
          border border-slate-700
          hover:border-amber-500/50
          shadow-lg shadow-black/20
          transition-all
          hover:scale-110
        "
        title="Settings"
      >
        <Settings size={20} className="text-slate-400" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
          {/* Theme Section */}
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center gap-2 mb-3">
              <Sun size={16} className="text-amber-500" />
              <h3 className="text-sm font-semibold text-slate-100">Theme</h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onThemeChange('dark')
                  setIsOpen(false)
                }}
                className={`
                  flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${theme === 'dark'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }
                `}
              >
                <Moon size={14} />
                Dark
              </button>
              <button
                onClick={() => {
                  onThemeChange('light')
                  setIsOpen(false)
                }}
                className={`
                  flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${theme === 'light'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }
                `}
              >
                <Sun size={14} />
                Light
              </button>
            </div>
          </div>

          {/* Language Section */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Globe size={16} className="text-amber-500" />
              <h3 className="text-sm font-semibold text-slate-100">Language</h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onLanguageChange('en')
                  setIsOpen(false)
                }}
                className={`
                  flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${language === 'en'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }
                `}
              >
                🇬🇧 EN
              </button>
              <button
                onClick={() => {
                  onLanguageChange('ru')
                  setIsOpen(false)
                }}
                className={`
                  flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${language === 'ru'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }
                `}
              >
                🇷🇺 RU
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}