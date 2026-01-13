// app/components/SocialLinks.tsx
'use client'

export default function SocialLinks() {
  return (
    <div className="fixed top-6 right-20 flex items-center gap-3 z-50">
      {/* Twitter/X */}
      <a
        href="https://x.com/byArtoCrypto"
        target="_blank"
        rel="noopener noreferrer"
        className="
          p-3 rounded-xl
          bg-slate-800/80 backdrop-blur-sm
          border border-slate-700
          hover:border-blue-500/50
          shadow-lg shadow-black/20
          transition-all
          hover:scale-110
          group
        "
        title="Follow on X (Twitter)"
      >
        <svg 
          className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </a>

      {/* Telegram */}
      <a
        href="https://t.me/byarto1"
        target="_blank"
        rel="noopener noreferrer"
        className="
          p-3 rounded-xl
          bg-slate-800/80 backdrop-blur-sm
          border border-slate-700
          hover:border-blue-400/50
          shadow-lg shadow-black/20
          transition-all
          hover:scale-110
          group
        "
        title="Contact on Telegram"
      >
        <svg 
          className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
        </svg>
      </a>
    </div>
  )
}