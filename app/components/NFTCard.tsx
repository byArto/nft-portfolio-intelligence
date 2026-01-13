// app/components/NFTCard.tsx
'use client'

import { NFTItem } from '../types/nft'
import { formatPrice, formatPercent, getPriceConfidence } from '../lib/nft-utils'
import { TrendingUp, TrendingDown, Sparkles, Zap, ArrowRight } from 'lucide-react'
import { ChainIcon } from '../lib/chain-icons'

// Маппинг цветов для сетей (без иконок-эмодзи)
const CHAIN_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
  eth: { color: 'text-gray-300', bg: 'bg-gray-500/20', border: 'border-gray-500/30' },
  polygon: { color: 'text-purple-300', bg: 'bg-purple-500/20', border: 'border-purple-500/30' },
  base: { color: 'text-blue-300', bg: 'bg-blue-500/20', border: 'border-blue-500/30' },
  arbitrum: { color: 'text-cyan-300', bg: 'bg-cyan-500/20', border: 'border-cyan-500/30' },
  optimism: { color: 'text-red-300', bg: 'bg-red-500/20', border: 'border-red-500/30' },
  bsc: { color: 'text-yellow-300', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' },
  avalanche: { color: 'text-red-300', bg: 'bg-red-500/20', border: 'border-red-500/30' }
}

function ChainBadge({ chain }: { chain: string }) {
  const config = CHAIN_CONFIG[chain] || CHAIN_CONFIG.eth
  
  return (
    <div className={`
      flex items-center gap-1.5
      ${config.bg} ${config.border} backdrop-blur-sm
      border px-2 py-1 rounded-lg
      text-xs font-semibold uppercase
      ${config.color}
      shadow-lg
    `}>
      <ChainIcon chain={chain} className="w-4 h-4" />
      <span>{chain}</span>
    </div>
  )
}

// Цвета редкости на основе percentile
function getRarityColor(percent?: number): { bg: string; text: string; label: string } {
  if (!percent) return { bg: 'bg-slate-500', text: 'text-slate-400', label: 'Unknown' }
  
  if (percent <= 1) return { bg: 'bg-yellow-500', text: 'text-yellow-400', label: 'Legendary' }
  if (percent <= 5) return { bg: 'bg-purple-500', text: 'text-purple-400', label: 'Epic' }
  if (percent <= 15) return { bg: 'bg-blue-500', text: 'text-blue-400', label: 'Rare' }
  if (percent <= 40) return { bg: 'bg-green-500', text: 'text-green-400', label: 'Uncommon' }
  return { bg: 'bg-gray-500', text: 'text-gray-400', label: 'Common' }
}

type Props = {
  nft: NFTItem
  onClick: () => void
  isFavorite: boolean
  onToggleFavorite: (nft: NFTItem) => void
}

export default function NFTCard({ nft, onClick, isFavorite, onToggleFavorite }: Props) {
  const rarityColor = getRarityColor(nft.rarityPercent)
  const priceConfidence = getPriceConfidence(nft.freshnessDays)

  return (
    <div
      onClick={onClick}
      className="
        group
        bg-slate-800/50 backdrop-blur-sm
        border border-slate-700
        rounded-2xl
        overflow-hidden
        cursor-pointer
        transition-all duration-300
        hover:scale-[1.02]
        hover:shadow-2xl hover:shadow-amber-500/10
        hover:border-amber-500/50
      "
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-900">
        <img
          src={nft.image}
          alt={nft.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/400/1e293b/f59e0b?text=NFT'
          }}
        />
        
        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Chain Badge */}
        <div className="absolute bottom-3 left-3">
          <ChainBadge chain={nft.chain} />
        </div>
        
        {/* Rarity Badge (top-left) */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {nft.rarityRank && (
            <div className="flex items-center gap-1.5 bg-purple-500/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-lg">
              <Sparkles size={12} />
              <span>#{nft.rarityRank}</span>
            </div>
          )}
        </div>
        
        {/* Utility Badge (top-right) */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {nft.utilityText && (
            <div className="flex items-center gap-1.5 bg-blue-500/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-lg">
              <Zap size={12} />
            </div>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite(nft)
          }}
          className="absolute bottom-3 right-3 p-2 rounded-lg bg-slate-900/80 backdrop-blur-sm border border-slate-700 hover:border-yellow-500 transition-all hover:scale-110"
        >
          <span className={`text-lg ${isFavorite ? 'text-yellow-400' : 'text-slate-500'}`}>
            {isFavorite ? '⭐' : '☆'}
          </span>
        </button>
      </div>
      
      {/* Info Section */}
      <div className="p-4 space-y-3">
        {/* Collection Name */}
        <p className="text-xs font-medium text-slate-400 truncate">
          {nft.collectionName}
        </p>
        
        {/* NFT Name */}
        <h3 className="text-base font-bold text-slate-100 truncate leading-tight">
          {nft.name}
        </h3>

        {/* Rarity Progress Bar */}
        {nft.rarityPercent !== undefined && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className={`font-semibold ${rarityColor.text}`}>
                {rarityColor.label}
              </span>
              <span className="text-slate-500">
                Top {nft.rarityPercent?.toFixed(1) || '0'}%
              </span>
            </div>
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full ${rarityColor.bg} transition-all duration-500`}
                style={{ width: `${100 - (nft.rarityPercent || 0)}%` }}
              />
            </div>
          </div>
        )}
        
        {/* Buy vs Floor Comparison */}
        {nft.lastSalePrice && nft.floorPrice && (
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-400">Bought</span>
              <ArrowRight size={12} className="text-slate-600" />
              <span className="text-slate-400">Floor</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-300">
                {formatPrice(nft.lastSalePrice)}
              </span>
              <div className="flex items-center gap-1.5">
                {nft.pnl && (
                  <>
                    {nft.pnl.isProfit ? (
                      <TrendingUp size={14} className="text-green-400" />
                    ) : (
                      <TrendingDown size={14} className="text-red-400" />
                    )}
                    <span className={`text-xs font-bold ${
                      nft.pnl.isProfit ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {nft.pnl.isProfit ? '+' : ''}{formatPercent(nft.pnl.percent)}
                    </span>
                  </>
                )}
              </div>
              <span className="text-sm font-bold text-slate-100">
                {formatPrice(nft.floorPrice)}
              </span>
            </div>
          </div>
        )}

        {/* Price Info with Confidence */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-700">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <p className="text-xs text-slate-500">Floor Price</p>
              {/* Price Confidence Indicator */}
              <div 
                className={`w-1.5 h-1.5 rounded-full ${
                  priceConfidence.level === 'high' ? 'bg-green-400' :
                  priceConfidence.level === 'medium' ? 'bg-amber-400' :
                  'bg-red-400'
                }`}
                title={`Price confidence: ${priceConfidence.label}`}
              />
            </div>
            <p className="text-sm font-bold text-slate-100">
              {formatPrice(nft.floorPrice)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 mb-0.5">Last Sale</p>
            <p className="text-sm font-bold text-slate-100">
              {formatPrice(nft.lastSalePrice)}
            </p>
          </div>
        </div>
        
        {/* P&L Section */}
        {nft.pnl && (
          <div className={`
            flex items-center justify-between
            px-3 py-2 rounded-lg
            ${nft.pnl.isProfit 
              ? 'bg-green-500/10 border border-green-500/20' 
              : 'bg-red-500/10 border border-red-500/20'
            }
          `}>
            <div className="flex items-center gap-1.5">
              {nft.pnl.isProfit ? (
                <TrendingUp size={14} className="text-green-400" />
              ) : (
                <TrendingDown size={14} className="text-red-400" />
              )}
              <span className={`text-sm font-bold ${
                nft.pnl.isProfit ? 'text-green-400' : 'text-red-400'
              }`}>
                {formatPrice(Math.abs(nft.pnl.valueEth))}
              </span>
            </div>
            <span className={`text-sm font-bold ${
              nft.pnl.isProfit ? 'text-green-400' : 'text-red-400'
            }`}>
              {formatPercent(nft.pnl.percent)}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}