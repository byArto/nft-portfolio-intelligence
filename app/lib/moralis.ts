// app/lib/moralis.ts

import Moralis from 'moralis'

// Проверяем, инициализирован ли Moralis
let isInitialized = false

// Инициализация Moralis (вызывается один раз)
export async function initMoralis() {
  if (isInitialized) return
  
  await Moralis.start({
    apiKey: process.env.MORALIS_API_KEY
  })
  
  isInitialized = true
}

// Маппинг названий сетей для Moralis
export const CHAIN_MAP: Record<string, string> = {
  eth: '0x1',
  polygon: '0x89',
  base: '0x2105',
  arbitrum: '0xa4b1',
  optimism: '0xa',
  bsc: '0x38',
  avalanche: '0xa86a'
}

// Получаем NFT для адреса и цепочки
export async function getWalletNFTs(address: string, chain: string) {
  await initMoralis()
  
  const chainHex = CHAIN_MAP[chain]
  if (!chainHex) {
    throw new Error(`Unsupported chain: ${chain}`)
  }

  try {
    const response = await Moralis.EvmApi.nft.getWalletNFTs({
      chain: chainHex,
      address: address,
      normalizeMetadata: true, // Приводит metadata к единому формату
      mediaItems: true // Добавляет ссылки на изображения
    })

    return response.raw
  } catch (error: any) {
    console.error('Moralis API error:', error)
    throw new Error(error.message || 'Failed to fetch NFTs')
  }
}