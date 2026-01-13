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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {nfts.map((nft) => (
        <NFTCard
          key={`${nft.contractAddress}-${nft.tokenId}`}
          nft={nft}
          onClick={() => onCardClick(nft)}
        />
      ))}
    </div>
  )
}