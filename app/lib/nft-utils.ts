// app/lib/nft-utils.ts

// Ключевые слова для определения utility
const UTILITY_KEYWORDS = [
    'access',
    'reward',
    'staking',
    'dao',
    'airdrop',
    'utility',
    'whitelist',
    'wl',
    'benefit',
    'exclusive'
  ]
  
  // Проверяет, есть ли utility в описании
  export function detectUtility(description?: string): string | undefined {
    if (!description) return undefined
    
    const lowerDesc = description.toLowerCase()
    const foundKeywords = UTILITY_KEYWORDS.filter(keyword => 
      lowerDesc.includes(keyword)
    )
    
    if (foundKeywords.length === 0) return undefined
    
    return `Detected: ${foundKeywords.slice(0, 3).join(', ')}`
  }
  
  // Рассчитывает P&L (прибыль/убыток)
  export function calculatePNL(
    floorPrice?: number,
    lastSalePrice?: number
  ): { valueEth: number; percent: number; isProfit: boolean } | undefined {
    if (!floorPrice || !lastSalePrice) return undefined
    
    const valueEth = floorPrice - lastSalePrice
    const percent = ((valueEth / lastSalePrice) * 100)
    const isProfit = valueEth >= 0
    
    return { valueEth, percent, isProfit }
  }
  
  // Рассчитывает "свежесть" NFT (сколько дней назад куплен)
  export function calculateFreshness(lastSaleDate?: string): number | undefined {
    if (!lastSaleDate) return undefined
    
    const saleDate = new Date(lastSaleDate)
    const now = new Date()
    const diffMs = now.getTime() - saleDate.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    return diffDays
  }
  
  // Генерирует ссылки на маркетплейсы
  export function generateMarketplaceLinks(
    chain: string,
    contractAddress: string,
    tokenId: string
  ) {
    const links: { opensea?: string; blur?: string; looksrare?: string } = {}
    
    // OpenSea работает на всех сетях
    const osChainName = chain === 'eth' ? 'ethereum' : chain
    links.opensea = `https://opensea.io/assets/${osChainName}/${contractAddress}/${tokenId}`
    
    // Blur только на Ethereum
    if (chain === 'eth') {
      links.blur = `https://blur.io/asset/${contractAddress}/${tokenId}`
    }
    
    // LooksRare только на Ethereum
    if (chain === 'eth') {
      links.looksrare = `https://looksrare.org/collections/${contractAddress}/${tokenId}`
    }
    
    return links
  }
  
  // Форматирует цену в ETH
  export function formatPrice(price?: number): string {
    if (!price) return 'N/A'
    return `${price.toFixed(4)} ETH`
  }
  
  // Форматирует процент
  export function formatPercent(percent?: number): string {
    if (percent === undefined) return 'N/A'
    const sign = percent >= 0 ? '+' : ''
    return `${sign}${percent.toFixed(2)}%`
  }
  
  // Получает IPFS изображение через публичный gateway
  export function resolveIPFS(url?: string): string {
    if (!url) return '/placeholder-nft.png' // Placeholder если нет картинки
    
    if (url.startsWith('ipfs://')) {
      return url.replace('ipfs://', 'https://ipfs.io/ipfs/')
    }
    
    return url
  }
  // Price Confidence на основе freshness
export function getPriceConfidence(freshnessDays?: number): {
    level: 'high' | 'medium' | 'low'
    label: string
    color: string
    bgColor: string
    borderColor: string
  } {
    if (freshnessDays === undefined) {
      return {
        level: 'low',
        label: 'Low',
        color: 'text-red-400',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/30'
      }
    }
  
    // 🟢 High — свежие продажи (< 7 дней)
    if (freshnessDays < 7) {
      return {
        level: 'high',
        label: 'High',
        color: 'text-green-400',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/30'
      }
    }
  
    // 🟡 Medium — недавние продажи (7-30 дней)
    if (freshnessDays < 30) {
      return {
        level: 'medium',
        label: 'Medium',
        color: 'text-amber-400',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/30'
      }
    }
  
    // 🔴 Low — давно не торговалось (> 30 дней)
    return {
      level: 'low',
      label: 'Low',
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30'
    }
  }
  // Парсинг holder perks из описания коллекции
export function parseHolderPerks(description?: string): string[] {
    if (!description) return []
    
    const lowerDesc = description.toLowerCase()
    const perks: string[] = []
    
    // Ключевые слова для perks
    const perkKeywords = [
      { keyword: 'airdrop', label: 'Exclusive Airdrops' },
      { keyword: 'access', label: 'Special Access' },
      { keyword: 'event', label: 'Exclusive Events' },
      { keyword: 'merchandise', label: 'Merchandise' },
      { keyword: 'whitelist', label: 'Whitelist Priority' },
      { keyword: 'discount', label: 'Discounts' },
      { keyword: 'reward', label: 'Holder Rewards' },
      { keyword: 'staking', label: 'Staking Benefits' },
      { keyword: 'dao', label: 'DAO Membership' },
      { keyword: 'utility', label: 'Utility Access' },
      { keyword: 'membership', label: 'Exclusive Membership' },
      { keyword: 'benefit', label: 'Holder Benefits' },
      { keyword: 'perk', label: 'Special Perks' }
    ]
    
    // Находим упоминания perks
    perkKeywords.forEach(({ keyword, label }) => {
      if (lowerDesc.includes(keyword) && !perks.includes(label)) {
        perks.push(label)
      }
    })
    
    return perks
  }