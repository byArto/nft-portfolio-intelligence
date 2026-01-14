// app/page.tsx
'use client'

import { useState, useMemo, useEffect } from 'react'
import { Chain, NFTItem } from './types/nft'
import AddressForm from './components/AddressForm'
import NFTGrid from './components/NFTGrid'
import NFTModal from './components/NFTModal'
import LoadingSkeleton from './components/LoadingSkeleton'
import NFTFilters, { FilterState } from './components/NFTFilters'
import PortfolioSummary from './components/PortfolioSummary'
import SocialLinks from './components/SocialLinks'
import MarketIntelligence from './components/MarketIntelligence'
import Top100MarketCap from './components/Top100MarketCap' 
import SettingsMenu from './components/SettingsMenu'
import IntroModal from './components/IntroModal'
import TopNFTCarousel from './components/TopNFTCarousel'
import { Language, getTranslation } from './lib/translations'
import { getTopNFTsByFloorPrice } from './lib/nft-ranking'

// Все поддерживаемые сети для мультисетевого поиска
const ALL_CHAINS: Chain[] = ['eth', 'polygon', 'base', 'arbitrum', 'optimism', 'bsc', 'avalanche']

export default function HomePage() {
  const [nfts, setNfts] = useState<NFTItem[]>([])
  const [allNFTsFromAllChains, setAllNFTsFromAllChains] = useState<NFTItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedNFT, setSelectedNFT] = useState<NFTItem | null>(null)
  const [currentAddress, setCurrentAddress] = useState('')
  const [currentChain, setCurrentChain] = useState<Chain>('eth')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [language, setLanguage] = useState<Language>('en')
  const [showIntroModal, setShowIntroModal] = useState(false)
  const [ethPriceUSD, setEthPriceUSD] = useState<number | undefined>()
  const [filters, setFilters] = useState<FilterState>({
    collections: [],
    chains: []
  })

  // Проверяем, показывали ли модалку ранее
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('hasSeenIntro')
    if (!hasSeenIntro) {
      setShowIntroModal(true)
    }
  }, [])

  // Закрытие intro modal
  const handleCloseIntro = () => {
    setShowIntroModal(false)
    localStorage.setItem('hasSeenIntro', 'true')
  }

  // Загружаем настройки из localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null
    const savedLang = localStorage.getItem('language') as Language | null
    
    if (savedTheme) setTheme(savedTheme)
    if (savedLang) setLanguage(savedLang)
  }, [])

  // Применяем тему
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  // Сохраняем язык
  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  // Загружаем ETH price для карусели
  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
      .then(res => res.json())
      .then(data => setEthPriceUSD(data.ethereum?.usd))
      .catch(() => setEthPriceUSD(undefined))
  }, [])

  // Топовые NFT для карусели (со ВСЕХ сетей)
  const topNFTs = useMemo(() => {
    return getTopNFTsByFloorPrice(allNFTsFromAllChains, 12)
  }, [allNFTsFromAllChains])

  // Проверяем, нужны ли фильтры (больше 1 коллекции или сети)
  const showFilters = useMemo(() => {
    const uniqueCollections = new Set(nfts.map(nft => nft.collectionName))
    const uniqueChains = new Set(nfts.map(nft => nft.chain))
    return uniqueCollections.size > 1 || uniqueChains.size > 1
  }, [nfts])

  // Фильтрация NFT через useMemo (только для текущей сети)
  const filteredNfts = useMemo(() => {
    return nfts.filter(nft => {
      // Фильтр по коллекциям
      if (filters.collections.length > 0 && !filters.collections.includes(nft.collectionName)) {
        return false
      }

      // Фильтр по сетям
      if (filters.chains.length > 0 && !filters.chains.includes(nft.chain)) {
        return false
      } 

      return true
    })
  }, [nfts, filters])

  // Функция для загрузки NFT с одной сети
  const fetchNFTsFromChain = async (address: string, chain: Chain): Promise<NFTItem[]> => {
    try {
      const response = await fetch(`/api/nfts?address=${address}&chain=${chain}`)
      const data = await response.json()

      if (!response.ok) {
        console.warn(`Failed to fetch from ${chain}:`, data.error)
        return []
      }

      return data.nfts || []
    } catch (err) {
      console.warn(`Error fetching from ${chain}:`, err)
      return []
    }
  }

  // Мультисетевой поиск NFT
  const handleFetchNFTs = async (address: string, chain: Chain) => {
    setIsLoading(true)
    setError(null)
    setNfts([])
    setAllNFTsFromAllChains([])
    
    // Сохраняем текущие значения
    setCurrentAddress(address)
    setCurrentChain(chain)

    try {
      // 1. Загружаем NFT с выбранной сети (для основной таблицы)
      const currentChainNFTs = await fetchNFTsFromChain(address, chain)
      setNfts(currentChainNFTs)

      // 2. Параллельно загружаем NFT со ВСЕХ сетей (для карусели)
      const allChainsPromises = ALL_CHAINS.map(c => fetchNFTsFromChain(address, c))
      const allChainsResults = await Promise.all(allChainsPromises)
      
      // Объединяем все NFT
      const combinedNFTs = allChainsResults.flat()
      setAllNFTsFromAllChains(combinedNFTs)

      // Если на выбранной сети ничего нет, но есть на других
      if (currentChainNFTs.length === 0 && combinedNFTs.length > 0) {
        setError(`No NFTs found on ${chain.toUpperCase()}, but found ${combinedNFTs.length} NFTs across all chains. Check the carousel above!`)
      }

    } catch (err: any) {
      setError(err.message || 'Failed to fetch NFTs')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen transition-colors">
      {/* Intro Modal */}
      {showIntroModal && <IntroModal onClose={handleCloseIntro} />}

      {/* Settings - адаптивная позиция */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 sm:gap-3 z-50">
        <SettingsMenu 
          theme={theme}
          language={language}
          onThemeChange={setTheme}
          onLanguageChange={setLanguage}
        />
        <SocialLinks />
      </div>

      {/* Hero Section - адаптивная сетка */}
      <div className="border-b border-slate-700 bg-slate-800/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Mobile: вертикальный стек */}
          <div className="lg:hidden space-y-6">
            {/* Title первым на mobile */}
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 leading-tight">
                {getTranslation(language, 'title')}
              </h1>
              <p className="text-base sm:text-lg text-amber-400 mt-2">
                {getTranslation(language, 'subtitle')}
              </p>
            </div>

            {/* Market widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MarketIntelligence />
              <Top100MarketCap />
            </div>
          </div>

          {/* Desktop: горизонтальная компоновка */}
          <div className="hidden lg:flex items-start lg:items-center gap-8 lg:gap-12">
            <div className="w-full lg:w-72 flex-shrink-0">
              <MarketIntelligence />
            </div>

            <div className="flex-1 text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-100">
                {getTranslation(language, 'title')}
              </h1>
              <p className="text-lg text-amber-400 max-w-2xl mx-auto mt-3">
                {getTranslation(language, 'subtitle')}
              </p>
            </div>

            <div className="w-full lg:w-72 flex-shrink-0">
              <Top100MarketCap />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Section */}
        <div className="py-6 sm:py-8 lg:py-12">
          <AddressForm 
            onSubmit={handleFetchNFTs} 
            isLoading={isLoading}
            currentAddress={currentAddress}
            currentChain={currentChain}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 sm:mb-8">
            <div className={`${
              error.includes('but found') 
                ? 'bg-amber-500/10 border-amber-500/30' 
                : 'bg-red-500/10 border-red-500/30'
            } border rounded-xl p-4`}>
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 mt-0.5 ${
                  error.includes('but found') ? 'text-amber-400' : 'text-red-400'
                }`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h3 className={`text-sm font-semibold ${
                    error.includes('but found') ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {error.includes('but found') ? 'Info' : 'Error loading NFTs'}
                  </h3>
                  <p className={`text-sm mt-1 ${
                    error.includes('but found') ? 'text-amber-300' : 'text-red-300'
                  }`}>
                    {error}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && <LoadingSkeleton />}

        {/* Top NFT Carousel */}
        {!isLoading && topNFTs.length > 0 && (
          <div className="mb-8 sm:mb-12">
            <TopNFTCarousel 
              topNFTs={topNFTs} 
              onCardClick={setSelectedNFT}
              ethPriceUSD={ethPriceUSD}
            />
          </div>
        )}

        {/* Results Section */}
        {!isLoading && nfts.length > 0 && (
          <div className="pb-12 sm:pb-16">
            <PortfolioSummary nfts={nfts} />
            
            {showFilters && (
              <NFTFilters 
                nfts={nfts} 
                filters={filters} 
                onFiltersChange={setFilters}
              />
            )}
            
            <NFTGrid 
              nfts={filteredNfts} 
              onCardClick={setSelectedNFT}
            />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && nfts.length === 0 && allNFTsFromAllChains.length === 0 && (
          <div className="py-16 sm:py-20 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-800 mb-4">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-medium text-slate-100 mb-2">
              Ready to explore
            </h3>
            <p className="text-sm sm:text-base text-slate-400">
              Enter a wallet address above to view NFT portfolio
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      <NFTModal nft={selectedNFT} onClose={() => setSelectedNFT(null)} />
    </div>
  )
}