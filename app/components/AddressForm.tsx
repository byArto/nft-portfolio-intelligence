// app/components/AddressForm.tsx
'use client'

import { useState, FormEvent } from 'react'
import { Chain } from '../types/nft'
import ChainSelect from './ChainSelect'
import { Search, Loader2 } from 'lucide-react'

type Props = {
  onSubmit: (address: string, chain: Chain) => void
  isLoading: boolean
  currentAddress: string
  currentChain: Chain
}

export default function AddressForm({ onSubmit, isLoading, currentAddress, currentChain }: Props) {
  const [address, setAddress] = useState(currentAddress)
  const [chain, setChain] = useState<Chain>(currentChain)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (address.trim()) {
      onSubmit(address.trim(), chain)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
      {/* Desktop/Tablet: горизонтальная компоновка */}
      <div className="hidden sm:flex items-center gap-3">
        <div className="w-48">
          <ChainSelect 
            value={chain} 
            onChange={setChain} 
            disabled={isLoading}
          />
        </div>
        
        <div className="flex-1">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter wallet address (0x1234...abcd)"
            disabled={isLoading}
            className="
              w-full h-12 px-4 rounded-xl
              bg-slate-800 
              border border-slate-700
              text-slate-100
              placeholder:text-slate-500
              hover:border-amber-500/50
              focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent
              transition-all
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !address.trim()}
          className="
            h-12 px-8
            bg-gradient-to-r from-amber-500 to-orange-600
            hover:from-amber-600 hover:to-orange-700
            disabled:from-slate-700 disabled:to-slate-700
            text-white font-semibold
            rounded-xl
            transition-all
            disabled:cursor-not-allowed
            hover:scale-[1.02]
            shadow-lg shadow-amber-500/30
            hover:shadow-xl hover:shadow-amber-500/40
            flex items-center gap-2
            min-w-[140px]
          "
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Searching...</span>
            </>
          ) : (
            <>
              <Search size={20} />
              <span>Search</span>
            </>
          )}
        </button>
      </div>

      {/* Mobile: вертикальная компоновка */}
      <div className="sm:hidden space-y-3">
        <ChainSelect 
          value={chain} 
          onChange={setChain} 
          disabled={isLoading}
        />
        
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Wallet address (0x1234...)"
          disabled={isLoading}
          className="
            w-full h-14 px-4 rounded-xl
            bg-slate-800 
            border border-slate-700
            text-slate-100 text-base
            placeholder:text-slate-500
            hover:border-amber-500/50
            focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent
            transition-all
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        />

        <button
          type="submit"
          disabled={isLoading || !address.trim()}
          className="
            w-full h-14
            bg-gradient-to-r from-amber-500 to-orange-600
            hover:from-amber-600 hover:to-orange-700
            active:scale-[0.98]
            disabled:from-slate-700 disabled:to-slate-700
            text-white font-bold text-lg
            rounded-xl
            transition-all
            disabled:cursor-not-allowed
            shadow-lg shadow-amber-500/30
            flex items-center justify-center gap-2
          "
        >
          {isLoading ? (
            <>
              <Loader2 size={24} className="animate-spin" />
              <span>Searching...</span>
            </>
          ) : (
            <>
              <Search size={24} />
              <span>Search Portfolio</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}