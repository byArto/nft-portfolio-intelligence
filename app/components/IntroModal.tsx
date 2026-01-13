// app/components/IntroModal.tsx
'use client'

import { X, TrendingUp, Shield, Zap } from 'lucide-react'

type Props = {
  onClose: () => void
}

export default function IntroModal({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
      style={{
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <div
        className="
          bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800
          border-2 border-amber-500/30
          rounded-3xl
          max-w-2xl w-full
          shadow-2xl shadow-amber-500/20
          overflow-hidden
        "
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: 'scaleIn 0.3s ease-out'
        }}
      >
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 p-8 border-b border-slate-700">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <X size={24} className="text-slate-400 hover:text-amber-400" />
          </button>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 mb-4 shadow-lg">
              <Shield size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-100 mb-2">
              Welcome to NFT Portfolio Intelligence
            </h2>
            <p className="text-slate-400 text-lg">
              Your professional NFT analytics platform
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Feature 1 */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-amber-500/30 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <TrendingUp size={20} className="text-purple-400" />
                </div>
                <h3 className="font-semibold text-slate-100">Multi-Chain</h3>
              </div>
              <p className="text-sm text-slate-400">
                Track NFTs across 7 EVM chains in one place
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-amber-500/30 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Shield size={20} className="text-amber-400" />
                </div>
                <h3 className="font-semibold text-slate-100">Risk Analysis</h3>
              </div>
              <p className="text-sm text-slate-400">
                Understand portfolio health and risk factors
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-amber-500/30 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Zap size={20} className="text-blue-400" />
                </div>
                <h3 className="font-semibold text-slate-100">Smart Insights</h3>
              </div>
              <p className="text-sm text-slate-400">
                Make data-driven NFT investment decisions
              </p>
            </div>
          </div>

          {/* Main description */}
          <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/20 rounded-xl p-6">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <span className="text-slate-200">
                  Analyze your NFT portfolio across multiple chains
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <span className="text-slate-200">
                  Understand risk, rarity and current value
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <span className="text-slate-200">
                  Make smarter NFT investment decisions
                </span>
              </li>
            </ul>
          </div>

          {/* CTA Button */}
          <button
            onClick={onClose}
            className="
              w-full h-14
              bg-gradient-to-r from-amber-500 to-orange-600
              hover:from-amber-600 hover:to-orange-700
              text-white font-bold text-lg
              rounded-xl
              transition-all
              shadow-lg shadow-amber-500/30
              hover:shadow-xl hover:shadow-amber-500/40
              hover:scale-[1.02]
              flex items-center justify-center gap-2
            "
          >
            Get Started
            <span className="text-2xl">🚀</span>
          </button>

          {/* Small note */}
          <p className="text-center text-xs text-slate-500">
            This message will only appear once. You can start by entering a wallet address above.
          </p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}} />
    </div>
  )
}