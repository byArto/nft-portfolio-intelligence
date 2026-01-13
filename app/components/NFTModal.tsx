// app/components/NFTModal.tsx
'use client'

import { NFTItem } from '../types/nft'
import { formatPrice, formatPercent, parseHolderPerks } from '../lib/nft-utils'
import { X, ExternalLink, Calendar, Sparkles, Zap, TrendingUp, TrendingDown } from 'lucide-react'
import NFTPriceChart from './NFTPriceChart'

// Цвета редкости
function getRarityColor(percent?: number): { bg: string; text: string; border: string; label: string } {
  if (!percent) return { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/30', label: 'Unknown' }
  
  if (percent <= 1) return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', label: 'Legendary' }
  if (percent <= 5) return { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30', label: 'Epic' }
  if (percent <= 15) return { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', label: 'Rare' }
  if (percent <= 40) return { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', label: 'Uncommon' }
  return { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30', label: 'Common' }
}

type Props = {
  nft: NFTItem | null
  onClose: () => void
}

export default function NFTModal({ nft, onClose }: Props) {
  if (!nft) return null

  const rarityColor = getRarityColor(nft.rarityPercent)
  
  // Парсим holder perks (в реальности нужен collection.description)
  // Пока используем collectionName как fallback
  const holderPerks = parseHolderPerks(nft.collectionName)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="
          bg-slate-800 border border-slate-700
          rounded-2xl
          max-w-6xl w-full max-h-[90vh] overflow-y-auto
          shadow-2xl
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-100">
              {nft.name}
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              {nft.collectionName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Image */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-slate-700">
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/800/1e293b/f59e0b?text=NFT'
                  }}
                />
              </div>

              {/* Contract Info */}
              <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 space-y-2">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Contract Details
                </h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Chain</span>
                    <span className="text-slate-300 font-mono uppercase">{nft.chain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Token ID</span>
                    <span className="text-slate-300 font-mono">{nft.tokenId}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-slate-500">Contract</span>
                    <span className="text-slate-300 font-mono text-right break-all max-w-[60%]">
                      {nft.contractAddress.slice(0, 6)}...{nft.contractAddress.slice(-4)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Info */}
            <div className="space-y-6">
              {/* Price Section */}
              <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-5">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">
                  Pricing
                </h4>

                {/* Buy vs Floor Comparison */}
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-4">
                  <h5 className="text-xs text-slate-400 mb-3">Price Movement</h5>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-center flex-1">
                      <p className="text-xs text-slate-500 mb-1">Purchase Price</p>
                      <p className="text-xl font-bold text-slate-100">
                        {formatPrice(nft.lastSalePrice)}
                      </p>
                      {nft.lastSaleDate && (
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(nft.lastSaleDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    {/* Arrow with Delta */}
                    <div className="flex flex-col items-center px-4">
                      {nft.pnl && (
                        <>
                          <div className={`flex items-center gap-1 mb-1 ${
                            nft.pnl.isProfit ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {nft.pnl.isProfit ? (
                              <TrendingUp size={16} />
                            ) : (
                              <TrendingDown size={16} />
                            )}
                            <span className="text-sm font-bold">
                              {formatPercent(nft.pnl.percent)}
                            </span>
                          </div>
                          <div className={`text-xs font-semibold ${
                            nft.pnl.isProfit ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {nft.pnl.isProfit ? '+' : ''}{formatPrice(nft.pnl.valueEth)}
                          </div>
                        </>
                      )}
                    </div>

                    <div className="text-center flex-1">
                      <p className="text-xs text-slate-500 mb-1">Current Floor</p>
                      <p className="text-xl font-bold text-slate-100">
                        {formatPrice(nft.floorPrice)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Floor Price</p>
                    <p className="text-2xl font-bold text-slate-100">
                      {formatPrice(nft.floorPrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Last Sale</p>
                    <p className="text-2xl font-bold text-slate-100">
                      {formatPrice(nft.lastSalePrice)}
                    </p>
                  </div>
                </div>

                {/* P&L */}
                {nft.pnl && (
                  <div className={`
                    mt-4 p-4 rounded-lg
                    ${nft.pnl.isProfit 
                      ? 'bg-green-500/10 border border-green-500/30' 
                      : 'bg-red-500/10 border border-red-500/30'
                    }
                  `}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {nft.pnl.isProfit ? (
                          <TrendingUp size={20} className="text-green-400" />
                        ) : (
                          <TrendingDown size={20} className="text-red-400" />
                        )}
                        <div>
                          <p className="text-xs text-slate-400 mb-0.5">Profit/Loss</p>
                          <p className={`text-xl font-bold ${
                            nft.pnl.isProfit ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {nft.pnl.isProfit ? '+' : ''}{formatPrice(nft.pnl.valueEth)}
                          </p>
                        </div>
                      </div>
                      <div className={`text-2xl font-bold ${
                        nft.pnl.isProfit ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {formatPercent(nft.pnl.percent)}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Holder Perks */}
              {holderPerks.length > 0 && (
                <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-5">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <span>🎁</span>
                    <span>Holder Perks</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {holderPerks.map((perk, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-lg"
                      >
                        <div className="w-2 h-2 rounded-full bg-amber-400" />
                        <span className="text-sm font-medium text-amber-400">
                          {perk}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-3">
                    Benefits detected from collection metadata
                  </p>
                </div>
              )}

              {/* Attributes */}
              {(nft.rarityRank || nft.utilityText || nft.freshnessDays !== undefined) && (
                <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-5">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">
                    Attributes
                  </h4>
                  <div className="space-y-3">
                    {/* Rarity - Enhanced */}
                    {nft.rarityRank && (
                      <div className={`flex items-center gap-3 p-4 ${rarityColor.bg} border ${rarityColor.border} rounded-lg`}>
                        <div className={`flex-shrink-0 w-12 h-12 ${rarityColor.bg} rounded-lg flex items-center justify-center border ${rarityColor.border}`}>
                          <Sparkles size={24} className={rarityColor.text} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-slate-400">Rarity</p>
                            <span className={`text-xs font-bold ${rarityColor.text}`}>
                              {rarityColor.label}
                            </span>
                          </div>
                          <p className={`text-lg font-bold ${rarityColor.text} mb-2`}>
                            Rank #{nft.rarityRank}
                            {nft.rarityPercent && (
                              <span className="text-sm ml-2 opacity-75">
                                (Top {nft.rarityPercent.toFixed(2)}%)
                              </span>
                            )}
                          </p>
                          {nft.rarityPercent !== undefined && (
                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${rarityColor.text.replace('text-', 'bg-')} transition-all duration-500`}
                                style={{ width: `${100 - nft.rarityPercent}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Utility */}
                    {nft.utilityText && (
                      <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <Zap size={20} className="text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-slate-400">Utility</p>
                          <p className="text-sm font-semibold text-blue-400">
                            {nft.utilityText}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Freshness */}
                    {nft.freshnessDays !== undefined && (
                      <div className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                        <div className="flex-shrink-0 w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                          <Calendar size={20} className="text-amber-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-slate-400">Held For</p>
                          <p className="text-sm font-bold text-amber-400">
                            {nft.freshnessDays} days
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Price History Chart */}
              <NFTPriceChart nft={nft} />

              {/* Marketplace Links */}
              <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-5">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">
                  View on Marketplaces
                </h4>
                <div className="flex flex-wrap gap-2">
                  {nft.marketplaceLinks.opensea && (
                    <a
                      href={nft.marketplaceLinks.opensea}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        flex-1 min-w-[140px]
                        flex items-center justify-center gap-2
                        px-4 py-3
                        bg-blue-500 hover:bg-blue-600
                        text-white text-sm font-semibold
                        rounded-lg
                        transition-all
                        hover:scale-[1.02]
                      "
                    >
                      OpenSea <ExternalLink size={16} />
                    </a>
                  )}
                  {nft.marketplaceLinks.blur && (
                    <a
                      href={nft.marketplaceLinks.blur}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        flex-1 min-w-[140px]
                        flex items-center justify-center gap-2
                        px-4 py-3
                        bg-orange-500 hover:bg-orange-600
                        text-white text-sm font-semibold
                        rounded-lg
                        transition-all
                        hover:scale-[1.02]
                      "
                    >
                      Blur <ExternalLink size={16} />
                    </a>
                  )}
                  {nft.marketplaceLinks.looksrare && (
                    <a
                      href={nft.marketplaceLinks.looksrare}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        flex-1 min-w-[140px]
                        flex items-center justify-center gap-2
                        px-4 py-3
                        bg-green-500 hover:bg-green-600
                        text-white text-sm font-semibold
                        rounded-lg
                        transition-all
                        hover:scale-[1.02]
                      "
                    >
                      LooksRare <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}