/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // 靜態導出，用於 GitHub Pages
  images: {
    unoptimized: true, // 對於靜態導出，需要禁用圖片優化
  },
  basePath: process.env.NODE_ENV === 'production' ? '/zoo3-5v' : '', // GitHub Pages 的基本路徑
  assetPrefix: process.env.NODE_ENV === 'production' ? '/zoo3-5v/' : '', // 資源前綴
  trailingSlash: true, // 添加尾部斜線，有助於靜態部署
};

module.exports = nextConfig;
