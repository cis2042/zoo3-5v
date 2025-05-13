'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LionLogo } from '@/components/lion-logo'

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-lion-face-light">
      {/* Header */}
      <header className="bg-gradient-to-r from-lion-orange to-lion-red text-white p-4 text-center shadow-md">
        <div className="flex items-center justify-center gap-2">
          <LionLogo size="sm" />
          <h1 className="text-2xl font-bold">ZOO3</h1>
        </div>
        <p className="mt-1 text-sm">完成任務獲取獎勵</p>
      </header>

      <main className="flex-1 container max-w-md mx-auto p-4 flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-lion-orange">404</h2>
          <h3 className="text-xl font-semibold">頁面未找到</h3>
          <p className="text-gray-600">
            抱歉，您請求的頁面不存在。
          </p>
          <Button asChild variant="orange" className="mt-4">
            <Link href="/demo">
              前往演示頁面
            </Link>
          </Button>
        </div>
      </main>
      
      <footer className="bg-gray-100 p-4 text-center text-sm text-gray-600">
        <p>ZOO3 平台 - GitHub Pages 演示版本</p>
        <p className="mt-1">
          <a 
            href="https://github.com/cis2042/zoo3-5v" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-lion-orange hover:underline"
          >
            查看 GitHub 倉庫
          </a>
        </p>
      </footer>
    </div>
  )
}
