// app/lib/export-utils.ts
import { NFTItem } from '../types/nft'

/**
 * Экспорт NFT данных в JSON
 */
export function exportNFTAsJSON(nft: NFTItem) {
  const exportData = {
    name: nft.name,
    collection: nft.collectionName,
    chain: nft.chain,
    tokenId: nft.tokenId,
    contractAddress: nft.contractAddress,
    prices: {
      floor: nft.floorPrice || 0,
      lastSale: nft.lastSalePrice || 0,
      currency: 'ETH'
    },
    profitLoss: nft.pnl ? {
      valueEth: nft.pnl.valueEth,
      percent: nft.pnl.percent,
      isProfit: nft.pnl.isProfit
    } : null,
    rarity: {
      rank: nft.rarityRank,
      percentile: nft.rarityPercent
    },
    metadata: {
      image: nft.image,
      utility: nft.utilityText,
      freshnessDays: nft.freshnessDays
    },
    marketplaces: nft.marketplaceLinks,
    exportedAt: new Date().toISOString()
  }

  const jsonString = JSON.stringify(exportData, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `${nft.name.replace(/[^a-z0-9]/gi, '_')}_stats.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Экспорт NFT модалки как PNG (скриншот)
 */
export async function exportNFTAsPNG(elementId: string, nftName: string) {
  try {
    // Динамический импорт html2canvas
    const html2canvas = (await import('html2canvas')).default
    
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error('Element not found')
    }

    // Создаём canvas из элемента
    const canvas = await html2canvas(element, {
      backgroundColor: '#1e293b',
      scale: 2, // Увеличиваем качество
      logging: false,
      useCORS: false, // Отключаем CORS
      allowTaint: true, // Разрешаем "загрязнённые" изображения
      foreignObjectRendering: false, // Отключаем foreign objects
      imageTimeout: 0, // Убираем таймаут
      onclone: (clonedDoc) => {
        // Убираем прокрутку из клонированного документа
        const clonedElement = clonedDoc.getElementById(elementId)
        if (clonedElement) {
          clonedElement.style.maxHeight = 'none'
          clonedElement.style.overflow = 'visible'
        }
      }
    })

    // Конвертируем canvas в blob
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('Failed to create image blob')
      }
      
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${nftName.replace(/[^a-z0-9]/gi, '_')}_stats.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }, 'image/png')
  } catch (error) {
    console.error('Export failed:', error)
    throw new Error('Failed to export image. The NFT image may not be accessible.')
  }
}