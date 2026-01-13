// app/components/ChainSelect.tsx
'use client'

import { Chain, ChainInfo } from '../types/nft'
import { ChainIcon } from '../lib/chain-icons'

const CHAINS: ChainInfo[] = [
  { value: 'eth', label: 'Ethereum', icon: '' },
  { value: 'polygon', label: 'Polygon', icon: '' },
  { value: 'base', label: 'Base', icon: '' },
  { value: 'arbitrum', label: 'Arbitrum', icon: '' },
  { value: 'optimism', label: 'Optimism', icon: '' },
  { value: 'bsc', label: 'BNB Chain', icon: '' },
  { value: 'avalanche', label: 'Avalanche', icon: '' }
]

type Props = {
  value: Chain
  onChange: (chain: Chain) => void
  disabled?: boolean
}

export default function ChainSelect({ value, onChange, disabled }: Props) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Chain)}
        disabled={disabled}
        className="
          h-12 w-full pl-12 pr-10 rounded-xl
          bg-slate-800 
          border border-slate-700
          text-slate-100
          hover:border-amber-500/50
          focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent
          transition-all cursor-pointer
          disabled:opacity-50 disabled:cursor-not-allowed
          appearance-none
        "
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23f59e0b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.5em 1.5em'
        }}
      >
        {CHAINS.map((chain) => (
          <option key={chain.value} value={chain.value}>
            {chain.label}
          </option>
        ))}
      </select>
      
      {/* Chain Icon Overlay */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <ChainIcon chain={value} className="w-5 h-5" />
      </div>
    </div>
  )
}