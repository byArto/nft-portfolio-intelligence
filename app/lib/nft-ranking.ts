// app/lib/nft-ranking.ts
import { NFTItem } from '../types/nft'

/**
 * Получить топовые NFT по floor price
 * @param nfts - массив всех NFT
 * @param limit - количество NFT для отображения (по умолчанию 10)
 * @returns отсортированный массив топовых NFT
 */
export function getTopNFTsByFloorPrice(nfts: NFTItem[], limit: number = 10): NFTItem[] {
  return nfts
    .filter(nft => {
      // Фильтруем: есть floor price и не спам
      return nft.floorPrice && nft.floorPrice > 0 && !nft.isSpam
    })
    .sort((a, b) => {
      // Сортируем по убыванию floor price
      return (b.floorPrice || 0) - (a.floorPrice || 0)
    })
    .slice(0, limit) // Берём топ N
}

/**
 * Вычислить общую стоимость топовых NFT
 */
export function calculateTopNFTsValue(topNFTs: NFTItem[]): number {
  return topNFTs.reduce((sum, nft) => sum + (nft.floorPrice || 0), 0)
}