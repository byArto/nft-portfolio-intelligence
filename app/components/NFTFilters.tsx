// app/components/NFTFilters.tsx
'use client'

import { X, Filter } from 'lucide-react'
import { NFTItem } from '../types/nft'
import { ChainIcon } from '../lib/chain-icons'

export type FilterState = {
  collections: string[]
  chains: string[]
}

type Props = {
  nfts: NFTItem[]
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export default function NFTFilters({ 
  nfts, 
  filters, 
  onFiltersChange
}: Props) {
  // Получаем уникальные коллекции
  const uniqueCollections = Array.from(
    new Set(nfts.map(nft => nft.collectionName))
  ).sort()

  // Получаем уникальные сети
  const uniqueChains = Array.from(
    new Set(nfts.map(nft => nft.chain))
  ).sort()

  // Toggle функции
  const toggleCollection = (collection: string) => {
    const newCollections = filters.collections.includes(collection)
      ? filters.collections.filter(c => c !== collection)
      : [...filters.collections, collection]
    onFiltersChange({ ...filters, collections: newCollections })
  }

  const toggleChain = (chain: string) => {
    const newChains = filters.chains.includes(chain)
      ? filters.chains.filter(c => c !== chain)
      : [...filters.chains, chain]
    onFiltersChange({ ...filters, chains: newChains })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      collections: [],
      chains: []
    })
  }

  const hasActiveFilters = 
    filters.collections.length > 0 ||
    filters.chains.length > 0

  return (
    <div className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur-md border-b border-slate-700 mb-8">
      <div className="py-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-amber-500" />
            <h3 className="text-sm font-semibold text-slate-100">Filters</h3>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-slate-400 hover:text-amber-500 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Collections Dropdown */}
        {uniqueCollections.length > 1 && (
          <div>
            <label className="text-xs text-slate-400 mb-2 block">Collections</label>
            <div className="flex flex-wrap gap-2">
              {uniqueCollections.map(collection => (
                <button
                  key={collection}
                  onClick={() => toggleCollection(collection)}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                    ${filters.collections.includes(collection)
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-purple-500/30'
                    }
                  `}
                >
                  {collection}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chains Filter */}
        {uniqueChains.length > 1 && (
          <div>
            <label className="text-xs text-slate-400 mb-2 block">Chains</label>
            <div className="flex flex-wrap gap-2">
              {uniqueChains.map(chain => (
                <button
                  key={chain}
                  onClick={() => toggleChain(chain)}
                  className={`
                    flex items-center gap-1.5
                    px-3 py-1.5 rounded-lg text-xs font-medium uppercase transition-all
                    ${filters.chains.includes(chain)
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-blue-500/30'
                    }
                  `}
                >
                  <ChainIcon chain={chain} className="w-3.5 h-3.5" />
                  <span>{chain}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active Filters Pills */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-700">
            {filters.collections.map(collection => (
              <Chip
                key={collection}
                label={collection}
                onRemove={() => toggleCollection(collection)}
              />
            ))}
            {filters.chains.map(chain => (
              <Chip
                key={chain}
                label={chain.toUpperCase()}
                onRemove={() => toggleChain(chain)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Chip компонент для активных фильтров
function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-1.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-lg text-xs font-medium">
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="hover:bg-amber-500/30 rounded-full p-0.5 transition-colors"
      >
        <X size={12} />
      </button>
    </div>
  )
}