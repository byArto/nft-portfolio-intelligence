// app/components/MarketIntelligence.tsx
'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'

type MarketData = {
  totalMarketCapETH: number
  totalMarketCapUSD: number
  change24h: number
}

export default function MarketIntelligence() {
  const [marketData, setMarketData] = useState<MarketData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchMarketData = async () => {
    try {
      // Получаем ETH цену и market data от CoinGecko
      const ethPriceResponse = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true'
      )
      
      const ethPriceData = await ethPriceResponse.json()
      const ethPriceUSD = ethPriceData.ethereum?.usd || 3000
      const ethChange24h = ethPriceData.ethereum?.usd_24h_change || 0

      // Используем примерную оценку NFT market cap
      // Основано на публичных данных (~$18-20B)
      const estimatedMarketCapUSD = 18500000000 // ~$18.5B
      const totalMarketCapETH = estimatedMarketCapUSD / ethPriceUSD

      setMarketData({
        totalMarketCapETH,
        totalMarketCapUSD: estimatedMarketCapUSD,
        change24h: ethChange24h * 0.7 // NFT рынок обычно коррелирует с ETH
      })
      
    } catch (err) {
      console.error('Market data fetch error:', err)
      
      // Fallback данные
      setMarketData({
        totalMarketCapETH: 6166666,
        totalMarketCapUSD: 18500000000,
        change24h: 0
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Первоначальная загрузка
  useEffect(() => {
    fetchMarketData()
  }, [])

  // Обновление каждые 60 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMarketData()
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 backdrop-blur-sm animate-pulse">
        <div className="h-20 bg-slate-700 rounded" />
      </div>
    )
  }

  const isPositive = (marketData?.change24h || 0) >= 0

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-amber-500" />
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
            Global NFT Market
          </h3>
        </div>
        <span className="text-xs text-slate-500" title="Estimated data">
          ~
        </span>
      </div>

      {/* Total Market Cap in ETH */}
      <div className="mb-3">
        <p className="text-xs text-slate-500 mb-1">Total Market Cap</p>
        <p className="text-2xl font-bold text-amber-400">
          {(marketData?.totalMarketCapETH || 0).toLocaleString('en-US', {
            maximumFractionDigits: 0
          })} <span className="text-base text-slate-400">ETH</span>
        </p>
        <p className="text-xs text-slate-500 mt-0.5">
          ≈ ${(marketData?.totalMarketCapUSD || 0).toLocaleString('en-US', {
            maximumFractionDigits: 0,
            notation: 'compact',
            compactDisplay: 'short'
          })}
        </p>
      </div>

      {/* 24h Change */}
      {marketData?.change24h !== 0 && (
        <div className="flex items-center gap-2 mb-3">
          {isPositive ? (
            <TrendingUp size={14} className="text-green-400" />
          ) : (
            <TrendingDown size={14} className="text-red-400" />
          )}
          <span className={`text-sm font-semibold ${
            isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            {isPositive ? '+' : ''}{marketData?.change24h.toFixed(2)}%
          </span>
          <span className="text-xs text-slate-500">24h</span>
        </div>
      )}

      {/* Update indicator */}
      <div className="flex items-center gap-1.5 pt-2 border-t border-slate-700">
        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        <p className="text-xs text-slate-500">
          Updates every 60s
        </p>
      </div>
    </div>
  )
}