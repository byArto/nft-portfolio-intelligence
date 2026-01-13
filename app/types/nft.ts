// app/types/nft.ts

// Основной тип для одного NFT
export type NFTItem = {
    chain: string // На какой сети (eth, polygon...)
    contractAddress: string // Адрес контракта NFT
    tokenId: string // ID токена
    name: string // Название NFT
    image: string // Ссылка на картинку
    collectionName: string // Название коллекции
  
    // Цены (могут отсутствовать)
    floorPrice?: number
    lastSalePrice?: number
    lastSaleDate?: string
  
    // Редкость
    rarityRank?: number
    rarityPercent?: number
    
    // Utility описание
    utilityText?: string
  
    // Спам-фильтр
    isSpam: boolean
  
    // Прибыль/убыток
    pnl?: {
      valueEth: number // floor - lastSale
      percent: number
      isProfit: boolean
    }
  
    // Свежесть (дней назад)
    freshnessDays?: number
  
    // Ссылки на маркетплейсы
    marketplaceLinks: {
      opensea?: string
      blur?: string
      looksrare?: string
    }
  }
  
  // Тип для цепочки
  export type Chain = 
    | 'eth' 
    | 'polygon' 
    | 'base' 
    | 'arbitrum' 
    | 'optimism' 
    | 'bsc' 
    | 'avalanche'
  
  // Информация о цепочке
  export type ChainInfo = {
    value: Chain
    label: string
    icon: string // эмодзи
  }