// app/components/NFTPriceChart.tsx
'use client'

import { useState } from 'react'
import { NFTItem } from '../types/nft'
import { formatPrice } from '../lib/nft-utils'

type Props = {
  nft: NFTItem
}

// Mock data generator (fallback когда нет API)
function generateMockData(nft: NFTItem) {
  if (!nft.floorPrice && !nft.lastSalePrice) return null

  const basePrice = nft.floorPrice || nft.lastSalePrice || 0
  const points = 30 // 30 дней

  return Array.from({ length: points }, (_, i) => {
    const daysAgo = points - i
    const variance = (Math.random() - 0.5) * 0.3 // ±15% variance
    const price = basePrice * (1 + variance)
    
    return {
      date: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      price: Math.max(0, price)
    }
  })
}

export default function NFTPriceChart({ nft }: Props) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)
  
  const data = generateMockData(nft)

  if (!data) {
    return (
      <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-5">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
          Price History
        </h4>
        <div className="flex items-center justify-center h-32 text-slate-500 text-sm">
          No price data available
        </div>
      </div>
    )
  }

  const minPrice = Math.min(...data.map(d => d.price))
  const maxPrice = Math.max(...data.map(d => d.price))
  const priceRange = maxPrice - minPrice || 1

  // SVG dimensions
  const width = 600
  const height = 120
  const padding = 10

  // Generate SVG path
  const points = data.map((point, i) => {
    const x = (i / (data.length - 1)) * (width - padding * 2) + padding
    const y = height - padding - ((point.price - minPrice) / priceRange) * (height - padding * 2)
    return { x, y, ...point }
  })

  const pathD = points.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`
  ).join(' ')

  const areaD = `${pathD} L ${points[points.length - 1].x},${height} L ${points[0].x},${height} Z`

  // Определяем тренд
  const firstPrice = data[0].price
  const lastPrice = data[data.length - 1].price
  const isUptrend = lastPrice >= firstPrice
  const change = ((lastPrice - firstPrice) / firstPrice) * 100

  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Price History (30 Days)
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Estimated based on floor price
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-slate-100">
            {formatPrice(lastPrice)}
          </p>
          <p className={`text-xs font-semibold ${
            isUptrend ? 'text-green-400' : 'text-red-400'
          }`}>
            {isUptrend ? '+' : ''}{change.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-32"
          onMouseLeave={() => setHoveredPoint(null)}
        >
          {/* Grid lines */}
          <line
            x1={padding}
            y1={height / 2}
            x2={width - padding}
            y2={height / 2}
            stroke="currentColor"
            strokeWidth="1"
            className="text-slate-700"
            strokeDasharray="4 4"
          />

          {/* Area under line */}
          <path
            d={areaD}
            fill="url(#gradient)"
            opacity="0.2"
          />

          {/* Line */}
          <path
            d={pathD}
            fill="none"
            stroke={isUptrend ? '#4ade80' : '#f87171'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={isUptrend ? '#4ade80' : '#f87171'} />
              <stop offset="100%" stopColor={isUptrend ? '#4ade80' : '#f87171'} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Interactive points */}
          {points.map((point, i) => (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r={hoveredPoint === i ? 5 : 3}
              fill={isUptrend ? '#4ade80' : '#f87171'}
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHoveredPoint(i)}
            />
          ))}
        </svg>

        {/* Tooltip */}
        {hoveredPoint !== null && (
          <div
            className="absolute bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 shadow-xl pointer-events-none z-10"
            style={{
              left: `${(hoveredPoint / (data.length - 1)) * 100}%`,
              top: '-60px',
              transform: 'translateX(-50%)'
            }}
          >
            <p className="text-xs text-slate-400 mb-0.5">
              {data[hoveredPoint].date}
            </p>
            <p className="text-sm font-bold text-slate-100">
              {formatPrice(data[hoveredPoint].price)}
            </p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
        <span>{data[0].date}</span>
        <span className="text-amber-400">Estimated data</span>
        <span>{data[data.length - 1].date}</span>
      </div>
    </div>
  )
}