// app/components/AddressForm.tsx
'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Chain } from '../types/nft'
import ChainSelect from './ChainSelect'

type Props = {
  onSubmit: (address: string, chain: Chain) => void
  isLoading: boolean
  currentAddress?: string
  currentChain?: Chain
}

export default function AddressForm({ onSubmit, isLoading, currentAddress, currentChain }: Props) {
  const [address, setAddress] = useState('')
  const [chain, setChain] = useState<Chain>('eth')

  // Синхронизируем локальный state с props
  useEffect(() => {
    if (currentAddress) {
      setAddress(currentAddress)
    }
    if (currentChain) {
      setChain(currentChain)
    }
  }, [currentAddress, currentChain])

  // Автоперезагрузка при смене chain
  useEffect(() => {
    // Запускаем только если адрес уже введён и валиден
    if (address && address.startsWith('0x') && address.length === 42) {
      onSubmit(address, chain)
    }
  }, [chain]) // Зависимость только от chain, не от address

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!address.startsWith('0x') || address.length !== 42) {
      alert('Invalid Ethereum address. Must start with 0x and be 42 characters long.')
      return
    }
    
    onSubmit(address.trim(), chain)
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        {/* Chain Selector */}
        <div className="w-full sm:w-48">
          <ChainSelect 
            value={chain} 
            onChange={setChain}
            disabled={isLoading}
          />
        </div>
        
        {/* Address Input */}
        <div className="flex-1">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter wallet address (0x...)"
            className="
              w-full h-12 px-4 rounded-xl
              bg-slate-800
              border border-slate-700
              text-slate-100
              placeholder-slate-500
              hover:border-amber-500/50
              focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent
              transition-all
              disabled:opacity-50 disabled:cursor-not-allowed
            "
            disabled={isLoading}
          />
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !address}
          className="
            w-full sm:w-40 h-12
            bg-gradient-to-r from-amber-500 to-orange-500
            hover:from-amber-600 hover:to-orange-600
            text-white font-semibold
            rounded-xl
            transition-all transform 
            hover:scale-[1.02] active:scale-[0.98]
            disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
            flex items-center justify-center gap-2
            shadow-lg shadow-amber-500/20
          "
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="hidden sm:inline">Loading</span>
            </>
          ) : (
            <>
              <Search size={20} />
              <span>Search</span>
            </>
          )}
        </button>
      </form>
      
      {/* Helper Text */}
      <p className="text-xs text-slate-500 mt-3 text-center sm:text-left">
        Example: 0x1234...abcd (42 characters)
      </p>
    </div>
  )
}