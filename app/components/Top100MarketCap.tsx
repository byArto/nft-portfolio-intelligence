// app/components/Top100MarketCap.tsx
'use client'

import { useState, useEffect } from 'react'
import { Crown } from 'lucide-react'

type Top100Data = {
  totalMarketCapETH: number
  totalMarketCapUSD: number
  topCollections: number
}

export default function Top100MarketCap() {
  const [marketData, setMarketData] = useState<Top100Data | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchTop100Data = async () => {
    try {
      // Получаем ETH цену
      const ethPriceResponse = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
      )
      
      const ethPriceData = await ethPriceResponse.json()
      const ethPriceUSD = ethPriceData.ethereum?.usd || 3000

      // Используем примерные данные для Top 100 коллекций
      // Основано на публичных данных OpenSea/Blur
      const estimatedMarketCapUSD = 13500000000 // ~$13.5B (примерная оценка)
      const totalMarketCapETH = estimatedMarketCapUSD / ethPriceUSD

      setMarketData({
        totalMarketCapETH,
        totalMarketCapUSD: estimatedMarketCapUSD,
        topCollections: 100
      })
      
    } catch (err) {
      console.error('Top 100 data fetch error:', err)
      
      // Fallback данные
      setMarketData({
        totalMarketCapETH: 4500000,
        totalMarketCapUSD: 13500000000,
        topCollections: 100
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Первоначальная загрузка
  useEffect(() => {
    fetchTop100Data()
  }, [])

  // Обновление каждые 60 секунд (только ETH цена)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTop100Data()
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

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Crown size={16} className="text-purple-500" />
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
            Top 100 Collections
          </h3>
        </div>
        <span className="text-xs text-slate-500" title="Estimated based on public data">
          ~
        </span>
      </div>

      {/* Total Market Cap in ETH */}
      <div className="mb-3">
        <p className="text-xs text-slate-500 mb-1">Combined Market Cap</p>
        <p className="text-2xl font-bold text-purple-400">
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

      {/* Collections count */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-purple-400" />
          <span className="text-sm text-slate-300">
            {marketData?.topCollections || 100} collections
          </span>
        </div>
      </div>

      {/* Update indicator */}
      <div className="flex items-center gap-1.5 pt-2 border-t border-slate-700">
        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        <p className="text-xs text-slate-500">
          Estimated data
        </p>
      </div>
    </div>
  )
}