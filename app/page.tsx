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
import { Language, getTranslation } from './lib/translations'

export default function HomePage() {
  const [nfts, setNfts] = useState<NFTItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedNFT, setSelectedNFT] = useState<NFTItem | null>(null)
  const [currentAddress, setCurrentAddress] = useState('')
  const [currentChain, setCurrentChain] = useState<Chain>('eth')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [language, setLanguage] = useState<Language>('en')
  const [showIntroModal, setShowIntroModal] = useState(false)
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

  // Фильтрация NFT через useMemo
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

  const handleFetchNFTs = async (address: string, chain: Chain) => {
    setIsLoading(true)
    setError(null)
    setNfts([])
    
    // Сохраняем текущие значения
    setCurrentAddress(address)
    setCurrentChain(chain)

    try {
      const response = await fetch(`/api/nfts?address=${address}&chain=${chain}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch NFTs')
      }

      setNfts(data.nfts)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen transition-colors">
      {/* Intro Modal */}
      {showIntroModal && <IntroModal onClose={handleCloseIntro} />}

      <div className="fixed top-6 right-6 flex items-center gap-3 z-50">
        <SettingsMenu 
          theme={theme}
          language={language}
          onThemeChange={setTheme}
          onLanguageChange={setLanguage}
        />
        <SocialLinks />
      </div>

      {/* Hero Section */}
      <div className="border-b border-slate-700 bg-slate-800/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12">
            {/* Global Market Intelligence - слева */}
            <div className="w-full lg:w-72 flex-shrink-0">
              <MarketIntelligence />
            </div>

            {/* Title - по центру */}
            <div className="flex-1 text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-100">
                {getTranslation(language, 'title')}
              </h1>
              <p className="text-lg text-amber-400 max-w-2xl mx-auto mt-3">
                {getTranslation(language, 'subtitle')}
              </p>
            </div>

            {/* Top 100 Market Cap - справа */}
            <div className="w-full lg:w-72 flex-shrink-0">
              <Top100MarketCap />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Section */}
        <div className="py-8 sm:py-12">
          <AddressForm 
            onSubmit={handleFetchNFTs} 
            isLoading={isLoading}
            currentAddress={currentAddress}
            currentChain={currentChain}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8">
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 text-red-400 mt-0.5">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-red-400">
                    Error loading NFTs
                  </h3>
                  <p className="text-sm text-red-300 mt-1">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && <LoadingSkeleton />}

        {/* Results Section */}
        {!isLoading && nfts.length > 0 && (
          <div className="pb-16">
            <PortfolioSummary nfts={nfts} />
            <NFTFilters 
              nfts={nfts} 
              filters={filters} 
              onFiltersChange={setFilters}
            />
            <NFTGrid 
              nfts={filteredNfts} 
              onCardClick={setSelectedNFT}
            />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && nfts.length === 0 && (
          <div className="py-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4">
              <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-100 mb-2">
              Ready to explore
            </h3>
            <p className="text-slate-400">
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