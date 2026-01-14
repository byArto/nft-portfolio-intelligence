// app/components/NFTGrid.tsx
'use client'

import { NFTItem } from '../types/nft'
import NFTCard from './NFTCard'

type Props = {
  nfts: NFTItem[]
  onCardClick: (nft: NFTItem) => void
}

export default function NFTGrid({ nfts, onCardClick }: Props) {
  if (nfts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 text-sm">
          No NFTs match your filters
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Portfolio Items Header */}
      <div className="mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-slate-100">
          Portfolio Items
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          {nfts.length} NFT{nfts.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Adaptive Grid:
          Mobile (< 640px): 1 column
          Tablet (640-1024px): 2 columns
          Desktop (> 1024px): 3-4 columns
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {nfts.map((nft) => (
          <NFTCard
            key={`${nft.contractAddress}-${nft.tokenId}`}
            nft={nft}
            onClick={() => onCardClick(nft)}
          />
        ))}
      </div>
    </>
  )
}