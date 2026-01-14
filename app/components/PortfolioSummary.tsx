// app/components/PortfolioSummary.tsx
'use client'

import { useMemo } from 'react'
import { NFTItem } from '../types/nft'
import { TrendingUp, TrendingDown, DollarSign, Package, Activity } from 'lucide-react'

type Props = {
  nfts: NFTItem[]
}

export default function PortfolioSummary({ nfts }: Props) {
  const stats = useMemo(() => {
    const totalFloorValue = nfts.reduce((sum, nft) => sum + (nft.floorPrice || 0), 0)
    const nftsWithPnL = nfts.filter(nft => nft.pnl)
    const totalPnL = nftsWithPnL.reduce((sum, nft) => sum + (nft.pnl?.valueEth || 0), 0)
    const profitableNFTs = nftsWithPnL.filter(nft => nft.pnl?.isProfit).length
    
    // Health Score (0-100)
    const healthScore = Math.min(100, Math.round(
      (profitableNFTs / Math.max(nftsWithPnL.length, 1)) * 100
    ))
    
    // Health label
    let healthLabel = 'Poor'
    let healthColor = 'text-red-400'
    if (healthScore >= 70) {
      healthLabel = 'Excellent'
      healthColor = 'text-green-400'
    } else if (healthScore >= 50) {
      healthLabel = 'Good'
      healthColor = 'text-blue-400'
    } else if (healthScore >= 30) {
      healthLabel = 'Fair'
      healthColor = 'text-amber-400'
    }

    return {
      totalNFTs: nfts.length,
      totalFloorValue,
      totalPnL,
      isProfitable: totalPnL >= 0,
      healthScore,
      healthLabel,
      healthColor
    }
  }, [nfts])

  return (
    <div className="mb-8 sm:mb-12">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-4 sm:mb-6">
        Portfolio Summary
      </h2>

      {/* Адаптивная сетка карточек */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Health Score */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-5 sm:p-6 hover:border-amber-500/30 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Activity size={20} className="sm:w-6 sm:h-6 text-amber-400" />
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mb-2">Health Score</p>
          <div className="flex items-baseline gap-2 mb-3">
            <p className="text-3xl sm:text-4xl font-bold text-slate-100">
              {stats.healthScore}
            </p>
            <p className={`text-base sm:text-lg font-semibold ${stats.healthColor}`}>
              {stats.healthLabel}
            </p>
          </div>
          {/* Progress bar */}
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
              style={{ width: `${stats.healthScore}%` }}
            />
          </div>
        </div>

        {/* Total NFTs */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-5 sm:p-6 hover:border-blue-500/30 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Package size={20} className="sm:w-6 sm:h-6 text-blue-400" />
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mb-2">Total NFTs</p>
          <p className="text-3xl sm:text-4xl font-bold text-slate-100">
            {stats.totalNFTs}
          </p>
        </div>

        {/* Portfolio Value */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-5 sm:p-6 hover:border-amber-500/30 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <DollarSign size={20} className="sm:w-6 sm:h-6 text-amber-400" />
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mb-2">Portfolio Value</p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-100">
            {stats.totalFloorValue.toFixed(4)} ETH
          </p>
        </div>

        {/* Unrealized P&L */}
        <div className={`
          bg-slate-800/50 backdrop-blur-sm border rounded-2xl p-5 sm:p-6 transition-all
          ${stats.isProfitable 
            ? 'border-green-500/30 hover:border-green-500/50' 
            : 'border-red-500/30 hover:border-red-500/50'
          }
        `}>
          <div className="flex items-start justify-between mb-4">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${
              stats.isProfitable ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}>
              {stats.isProfitable ? (
                <TrendingUp size={20} className="sm:w-6 sm:h-6 text-green-400" />
              ) : (
                <TrendingDown size={20} className="sm:w-6 sm:h-6 text-red-400" />
              )}
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mb-2">Unrealized P&L</p>
          <div className="flex items-baseline gap-2">
            <p className={`text-2xl sm:text-3xl font-bold ${
              stats.isProfitable ? 'text-green-400' : 'text-red-400'
            }`}>
              {stats.isProfitable ? '+' : ''}{stats.totalPnL.toFixed(4)}
            </p>
            <p className="text-base sm:text-lg text-slate-500">ETH</p>
          </div>
          <p className={`text-xs sm:text-sm mt-2 ${
            stats.isProfitable ? 'text-green-400/70' : 'text-red-400/70'
          }`}>
            {stats.isProfitable ? '+' : ''}{((stats.totalPnL / Math.max(stats.totalFloorValue - stats.totalPnL, 0.0001)) * 100).toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  )
}