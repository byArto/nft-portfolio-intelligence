// app/layout.tsx

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'NFT Portfolio Intelligence | Multi-Chain NFT Analytics',
  description: 'Track, analyze and de-risk your NFT investments across 7 EVM chains: Ethereum, Polygon, Base, Arbitrum, Optimism, BSC, and Avalanche',
  keywords: ['NFT', 'Portfolio', 'Intelligence', 'Analytics', 'Ethereum', 'Crypto', 'Web3', 'Investment'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}