// app/components/NFTGrid.tsx
'use client'

import { NFTItem } from '../types/nft'
import NFTCard from './NFTCard'

type Props = {
  nfts: NFTItem[]
  onCardClick: (nft: NFTItem) => void
  isFavorite: (nft: NFTItem) => boolean
  onToggleFavorite: (nft: NFTItem) => void
}

export default function NFTGrid({ nfts, onCardClick, isFavorite, onToggleFavorite }: Props) {
  // Пустое состояние
  if (nfts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          {/* Icon Background Glow */}
          <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full" />
          
          {/* Icon */}
          <div className="relative bg-slate-800 border border-slate-700 rounded-2xl p-8 mb-6">
            <svg 
              className="w-16 h-16 text-amber-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" 
              />
            </svg>
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-slate-100 mb-2">
          No NFTs Found
        </h3>
        <p className="text-slate-400 max-w-md text-center">
          This wallet doesn't have any NFTs on the selected chain, or all items were filtered as spam.
        </p>
      </div>
    )
  }

  // Сетка с NFT
  return (
    <div className="space-y-8">
      {/* Header с счётчиком */}
      <div className="flex items-center justify-between border-b border-slate-700 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">
            Portfolio Items
          </h2>
          <p className="text-slate-400 mt-1">
            <span className="text-amber-500 font-semibold">{nfts.length}</span> NFTs found
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {nfts.map((nft) => (
          <NFTCard
            key={`${nft.contractAddress}-${nft.tokenId}`}
            nft={nft}
            onClick={() => onCardClick(nft)}
            isFavorite={isFavorite(nft)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  )
}