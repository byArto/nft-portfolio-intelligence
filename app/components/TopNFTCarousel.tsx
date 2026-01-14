// app/components/TopNFTCarousel.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { NFTItem } from '../types/nft'
import { formatPrice } from '../lib/nft-utils'
import { ChainIcon } from '../lib/chain-icons'
import { TrendingUp, Flame } from 'lucide-react'

type Props = {
  topNFTs: NFTItem[]
  onCardClick: (nft: NFTItem) => void
  ethPriceUSD?: number
}

export default function TopNFTCarousel({ topNFTs, onCardClick, ethPriceUSD }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Дублируем NFT для бесконечного loop
  const loopedNFTs = [...topNFTs, ...topNFTs, ...topNFTs]

  // Бесконечная auto-scroll анимация (только на desktop)
  useEffect(() => {
    if (isPaused || !scrollRef.current || isMobile) return

    const scrollContainer = scrollRef.current
    const scrollStep = 0.5
    const scrollInterval = 20

    const interval = setInterval(() => {
      if (!scrollContainer) return

      scrollContainer.scrollLeft += scrollStep

      // Бесконечный loop
      const cardWidth = window.innerWidth < 768 ? 272 : 288 // mobile vs desktop
      const firstCopyEnd = cardWidth * topNFTs.length
      
      if (scrollContainer.scrollLeft >= firstCopyEnd * 2) {
        scrollContainer.scrollLeft = firstCopyEnd
      }
    }, scrollInterval)

    return () => clearInterval(interval)
  }, [isPaused, topNFTs.length, isMobile])

  // Обновление состояния кнопок прокрутки
  const updateScrollButtons = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  // Скролл влево/вправо
  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const scrollAmount = 300
    const targetScroll = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
    scrollRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' })
  }

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    scrollContainer.addEventListener('scroll', updateScrollButtons)
    updateScrollButtons()

    return () => scrollContainer.removeEventListener('scroll', updateScrollButtons)
  }, [])

  if (topNFTs.length === 0) return null

  return (
    <div>
      {/* Header - адаптивный */}
      <div className="flex items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center flex-shrink-0">
            <Flame size={20} className="sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-slate-100">
              Top NFTs by Floor Price
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {isMobile ? `${topNFTs.length} items` : `Your most valuable assets across all chains • ${topNFTs.length} items`}
            </p>
          </div>
        </div>

        {/* Scroll Buttons - только на desktop */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 hover:border-amber-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 hover:border-amber-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Carousel - оптимизирован для touch */}
      <div
        ref={scrollRef}
        onMouseEnter={() => !isMobile && setIsPaused(true)}
        onMouseLeave={() => !isMobile && setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        className="
          flex gap-3 sm:gap-4 overflow-x-auto
          pb-4
          scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900
          -mx-4 px-4 sm:mx-0 sm:px-0
        "
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#475569 #1e293b',
          scrollBehavior: 'auto',
          WebkitOverflowScrolling: 'touch' // Smooth scrolling на iOS
        }}
      >
        {loopedNFTs.map((nft, index) => (
          <div
            key={`${nft.contractAddress}-${nft.tokenId}-${index}`}
            onClick={() => onCardClick(nft)}
            className="
              flex-shrink-0
              w-64 sm:w-64 md:w-72
              group
              cursor-pointer
            "
          >
            <div className="
              bg-slate-800/50 backdrop-blur-sm
              border border-slate-700
              rounded-2xl
              overflow-hidden
              transition-all duration-300
              active:scale-[0.97] sm:hover:scale-[1.03]
              hover:shadow-2xl hover:shadow-amber-500/20
              hover:border-amber-500/50
            ">
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-slate-900">
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400/1e293b/f59e0b?text=NFT'
                  }}
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
                
                {/* Chain badge */}
                <div className="absolute bottom-3 left-3">
                  <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-sm border border-slate-700 px-2 py-1 rounded-lg">
                    <ChainIcon chain={nft.chain} className="w-3.5 h-3.5" />
                    <span className="text-xs font-semibold uppercase text-slate-300">
                      {nft.chain}
                    </span>
                  </div>
                </div>

                {/* Rank badge */}
                {nft.rarityRank && (
                  <div className="absolute top-3 left-3">
                    <div className="flex items-center gap-1.5 bg-purple-500/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1.5 rounded-lg">
                      <TrendingUp size={12} />
                      <span>#{nft.rarityRank}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3 sm:p-4">
                <p className="text-xs font-medium text-slate-400 truncate mb-1">
                  {nft.collectionName}
                </p>
                <h3 className="text-sm sm:text-base font-bold text-slate-100 truncate mb-3">
                  {nft.name}
                </h3>

                {/* Price */}
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Floor Price</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-xl sm:text-2xl font-bold text-amber-400">
                      {formatPrice(nft.floorPrice)}
                    </p>
                    {ethPriceUSD && nft.floorPrice && (
                      <p className="text-xs sm:text-sm text-slate-500">
                        ${(nft.floorPrice * ethPriceUSD).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile scroll hint */}
      <div className="md:hidden text-center mt-3">
        <p className="text-xs text-slate-500">
          ← Swipe to explore →
        </p>
      </div>
    </div>
  )
}