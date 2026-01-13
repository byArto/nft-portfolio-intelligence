// app/components/PortfolioSummary.tsx
'use client'

import { NFTItem } from '../types/nft'
import { TrendingUp, TrendingDown, Package, DollarSign, Trophy, Shield } from 'lucide-react'
import { formatPrice, formatPercent } from '../lib/nft-utils'

type Props = {
  nfts: NFTItem[]
}

// Маппинг цветов для сетей
const CHAIN_COLORS: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  eth: { bg: 'bg-gray-500', text: 'text-gray-300', border: 'border-gray-500', icon: '⟠' },
  polygon: { bg: 'bg-purple-500', text: 'text-purple-300', border: 'border-purple-500', icon: '🟣' },
  base: { bg: 'bg-blue-500', text: 'text-blue-300', border: 'border-blue-500', icon: '🔵' },
  arbitrum: { bg: 'bg-cyan-500', text: 'text-cyan-300', border: 'border-cyan-500', icon: '🔷' },
  optimism: { bg: 'bg-red-500', text: 'text-red-300', border: 'border-red-500', icon: '🔴' },
  bsc: { bg: 'bg-yellow-500', text: 'text-yellow-300', border: 'border-yellow-500', icon: '🟡' },
  avalanche: { bg: 'bg-red-500', text: 'text-red-300', border: 'border-red-500', icon: '🔺' }
}

// Расчёт Portfolio Health Score (0-100)
function calculateHealthScore(nfts: NFTItem[]): number {
  if (nfts.length === 0) return 0

  // 1. % NFT с ценой (floor > 0) — вес 30%
  const withPrice = nfts.filter(nft => nft.floorPrice && nft.floorPrice > 0).length
  const priceScore = (withPrice / nfts.length) * 30

  // 2. % NFT в прибыли — вес 40%
  const withPnl = nfts.filter(nft => nft.pnl).length
  const profitable = nfts.filter(nft => nft.pnl && nft.pnl.isProfit).length
  const profitScore = withPnl > 0 ? (profitable / withPnl) * 40 : 0

  // 3. Средний P&L (нормализованный) — вес 20%
  const avgPnl = nfts.reduce((sum, nft) => sum + (nft.pnl?.percent || 0), 0) / nfts.length
  const pnlScore = Math.max(0, Math.min(20, (avgPnl + 50) / 100 * 20))

  // 4. Ликвидность (recent sales) — вес 10%
  const recentSales = nfts.filter(nft => {
    if (!nft.lastSaleDate) return false
    const daysSince = (Date.now() - new Date(nft.lastSaleDate).getTime()) / (1000 * 60 * 60 * 24)
    return daysSince < 30
  }).length
  const liquidityScore = (recentSales / nfts.length) * 10

  const total = priceScore + profitScore + pnlScore + liquidityScore
  return Math.round(Math.min(100, Math.max(0, total)))
}

// Цвет на основе score
function getHealthColor(score: number): { ring: string; text: string; bg: string; label: string } {
  if (score >= 75) return { 
    ring: 'stroke-green-500', 
    text: 'text-green-400', 
    bg: 'bg-green-500/10',
    label: 'Excellent'
  }
  if (score >= 50) return { 
    ring: 'stroke-amber-500', 
    text: 'text-amber-400', 
    bg: 'bg-amber-500/10',
    label: 'Good'
  }
  if (score >= 25) return { 
    ring: 'stroke-orange-500', 
    text: 'text-orange-400', 
    bg: 'bg-orange-500/10',
    label: 'Fair'
  }
  return { 
    ring: 'stroke-red-500', 
    text: 'text-red-400', 
    bg: 'bg-red-500/10',
    label: 'Poor'
  }
}

// Расчёт распределения по сетям
function calculateChainAllocation(nfts: NFTItem[]) {
  const chainCounts: Record<string, number> = {}
  
  nfts.forEach(nft => {
    chainCounts[nft.chain] = (chainCounts[nft.chain] || 0) + 1
  })

  const total = nfts.length
  
  return Object.entries(chainCounts)
    .map(([chain, count]) => ({
      chain,
      count,
      percentage: (count / total) * 100,
      ...CHAIN_COLORS[chain]
    }))
    .sort((a, b) => b.count - a.count)
}

export default function PortfolioSummary({ nfts }: Props) {
  const healthScore = calculateHealthScore(nfts)
  const healthColor = getHealthColor(healthScore)
  const chainAllocation = calculateChainAllocation(nfts)

  // Расчёт метрик
  const totalNFTs = nfts.length

  // Общая стоимость портфеля (сумма floor prices)
  const portfolioValue = nfts.reduce((sum, nft) => {
    return sum + (nft.floorPrice || 0)
  }, 0)

  // Общий P&L
  const totalPnL = nfts.reduce((sum, nft) => {
    return sum + (nft.pnl?.valueEth || 0)
  }, 0)

  // Процент P&L
  const totalCost = nfts.reduce((sum, nft) => {
    return sum + (nft.lastSalePrice || 0)
  }, 0)
  const pnlPercent = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0

  // Лучший performer
  const bestPerformer = nfts
    .filter(nft => nft.pnl && nft.pnl.isProfit)
    .sort((a, b) => (b.pnl?.valueEth || 0) - (a.pnl?.valueEth || 0))[0]

  const isProfitable = totalPnL >= 0

  // Расчёт для круга (circumference)
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (healthScore / 100) * circumference

  return (
    <div className="space-y-4 mb-8">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Portfolio Health Score */}
        <div className={`
          ${healthColor.bg} border border-${healthColor.ring.replace('stroke-', '')}/30
          rounded-xl p-4
          transition-all hover:scale-[1.02]
          relative overflow-hidden
          group
        `}>
          <div className="flex items-start justify-between mb-3">
            <div className={healthColor.text}>
              <Shield size={20} />
            </div>
            {/* Tooltip */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="relative">
                <div className="absolute right-0 w-48 bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-slate-300 shadow-xl z-10">
                  <p className="font-semibold mb-1">Score breakdown:</p>
                  <p>• Price data: 30%</p>
                  <p>• Profitability: 40%</p>
                  <p>• Avg P&L: 20%</p>
                  <p>• Liquidity: 10%</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Circular Progress */}
            <div className="relative w-20 h-20">
              <svg className="transform -rotate-90 w-20 h-20">
                {/* Background circle */}
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  className="text-slate-700"
                />
                {/* Progress circle */}
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  className={healthColor.ring}
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                />
              </svg>
              {/* Score text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-xl font-bold ${healthColor.text}`}>
                  {healthScore}
                </span>
              </div>
            </div>

            {/* Label */}
            <div>
              <p className="text-xs text-slate-400 mb-1">Health Score</p>
              <p className={`text-lg font-bold ${healthColor.text}`}>
                {healthColor.label}
              </p>
            </div>
          </div>
        </div>

        {/* Total NFTs */}
        <StatCard
          icon={<Package size={20} />}
          label="Total NFTs"
          value={totalNFTs.toString()}
          iconColor="text-blue-400"
          bgColor="bg-blue-500/10"
          borderColor="border-blue-500/30"
        />

        {/* Portfolio Value */}
        <StatCard
          icon={<DollarSign size={20} />}
          label="Portfolio Value"
          value={formatPrice(portfolioValue)}
          iconColor="text-amber-400"
          bgColor="bg-amber-500/10"
          borderColor="border-amber-500/30"
        />

        {/* Unrealized P&L */}
        <StatCard
          icon={isProfitable ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
          label="Unrealized P&L"
          value={
            <div className="flex flex-col">
              <span className={isProfitable ? 'text-green-400' : 'text-red-400'}>
                {isProfitable ? '+' : ''}{formatPrice(totalPnL)}
              </span>
              <span className={`text-sm ${isProfitable ? 'text-green-400/70' : 'text-red-400/70'}`}>
                {formatPercent(pnlPercent)}
              </span>
            </div>
          }
          iconColor={isProfitable ? 'text-green-400' : 'text-red-400'}
          bgColor={isProfitable ? 'bg-green-500/10' : 'bg-red-500/10'}
          borderColor={isProfitable ? 'border-green-500/30' : 'border-red-500/30'}
        />
      </div>

      {/* Chain Allocation */}
      {chainAllocation.length > 1 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <span>Chain Allocation</span>
            <span className="text-xs text-slate-500">({nfts.length} NFTs)</span>
          </h3>
          
          {/* Bar Chart */}
          <div className="space-y-3 mb-4">
            {chainAllocation.map((item) => (
              <div key={item.chain}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <span className={`font-medium uppercase ${item.text}`}>
                      {item.chain}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">
                      {item.count} NFT{item.count > 1 ? 's' : ''}
                    </span>
                    <span className="font-bold text-slate-100">
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.bg} transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 pt-3 border-t border-slate-700">
            {chainAllocation.map((item) => (
              <div key={item.chain} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-sm ${item.bg}`} />
                <span className="text-xs text-slate-400 uppercase">{item.chain}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Best Performer */}
      {bestPerformer && (
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 transition-all hover:scale-[1.01]">
          <div className="flex items-center gap-3">
            <div className="text-purple-400">
              <Trophy size={20} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-400 mb-1">Best Performer</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-100 truncate">
                  {bestPerformer.name}
                </span>
                <span className="text-green-400 font-bold">
                  +{formatPrice(bestPerformer.pnl?.valueEth)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Компонент карточки статистики
function StatCard({
  icon,
  label,
  value,
  iconColor,
  bgColor,
  borderColor
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
  iconColor: string
  bgColor: string
  borderColor: string
}) {
  return (
    <div className={`
      ${bgColor} border ${borderColor}
      rounded-xl p-4
      transition-all hover:scale-[1.02]
    `}>
      <div className="flex items-start justify-between mb-3">
        <div className={`${iconColor}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-xs text-slate-400 mb-1">{label}</p>
        <div className="text-xl font-bold text-slate-100">
          {value}
        </div>
      </div>
    </div>
  )
}   