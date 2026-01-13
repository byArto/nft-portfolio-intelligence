// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Разрешаем загружать изображения с любых доменов
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig