// app/api/nfts/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getWalletNFTs } from '@/app/lib/moralis'
import { 
  calculatePNL, 
  calculateFreshness, 
  detectUtility, 
  generateMarketplaceLinks,
  resolveIPFS
} from '@/app/lib/nft-utils'
import { NFTItem } from '@/app/types/nft'

export async function GET(request: NextRequest) {
  try {
    // Получаем параметры из URL (?address=...&chain=...)
    const searchParams = request.nextUrl.searchParams
    const address = searchParams.get('address')
    const chain = searchParams.get('chain')

    // Валидация
    if (!address || !chain) {
      return NextResponse.json(
        { error: 'Missing address or chain parameter' },
        { status: 400 }
      )
    }

    // Получаем данные от Moralis
    const data = await getWalletNFTs(address, chain)

    // Обрабатываем каждый NFT
    const nfts: NFTItem[] = data.result.map((nft: any) => {
      // Парсим цены
      const floorPrice = nft.floor_price_usd 
        ? parseFloat(nft.floor_price_usd) / 3000 // Грубая конвертация USD → ETH
        : undefined

      const lastSalePrice = nft.last_sale?.price_formatted
        ? parseFloat(nft.last_sale.price_formatted)
        : undefined

      const lastSaleDate = nft.last_sale?.block_timestamp

      // Рассчитываем P&L
      const pnl = calculatePNL(floorPrice, lastSalePrice)

      // Рассчитываем свежесть
      const freshnessDays = calculateFreshness(lastSaleDate)

      // Проверяем utility
      const utilityText = detectUtility(nft.collection?.description)

      // Генерируем ссылки
      const marketplaceLinks = generateMarketplaceLinks(
        chain,
        nft.token_address,
        nft.token_id
      )

      // Формируем объект NFT
      const item: NFTItem = {
        chain,
        contractAddress: nft.token_address,
        tokenId: nft.token_id,
        name: nft.name || `#${nft.token_id}`,
        image: resolveIPFS(nft.normalized_metadata?.image),
        collectionName: nft.collection?.name || 'Unknown Collection',
        floorPrice,
        lastSalePrice,
        lastSaleDate,
        rarityRank: nft.rarity_rank,
        rarityPercent: nft.rarity_percentage,
        utilityText,
        isSpam: nft.possible_spam || false,
        pnl,
        freshnessDays,
        marketplaceLinks
      }

      return item
    })

    // Фильтруем спам
    const filtered = nfts.filter(nft => !nft.isSpam)

    return NextResponse.json({
      success: true,
      count: filtered.length,
      nfts: filtered
    })

  } catch (error: any) {
    console.error('API Route Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch NFTs' },
      { status: 500 }
    )
  }
}