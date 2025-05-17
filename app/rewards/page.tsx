"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BottomNavigation } from "@/components/bottom-navigation"
import { LionLogo } from "@/components/lion-logo"
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function RewardsPage() {
  // Sample reward history data
  const rewardHistory = [
    { id: 1, type: "每日簽到", token: "KAIA", amount: 1, timestamp: "2025-05-11 13:45" },
    { id: 2, type: "加入社區", token: "ZOO", amount: 3, timestamp: "2025-05-10 18:22" },
    { id: 3, type: "每日簽到", token: "KAIA", amount: 1, timestamp: "2025-05-10 09:15" },
    { id: 4, type: "推薦朋友", token: "ZOO", amount: 10, timestamp: "2025-05-09 14:37" },
    { id: 5, type: "加密貨幣測驗", token: "WBTC", amount: 0.0001, timestamp: "2025-05-08 20:11" },
    { id: 6, type: "每日簽到", token: "KAIA", amount: 1, timestamp: "2025-05-08 10:05" },
    { id: 7, type: "社交媒體分享", token: "ZOO", amount: 5, timestamp: "2025-05-07 16:48" },
    { id: 8, type: "每日簽到", token: "KAIA", amount: 1, timestamp: "2025-05-07 08:30" },
    { id: 9, type: "每日簽到", token: "KAIA", amount: 1, timestamp: "2025-05-06 09:12" },
    { id: 10, type: "加入社區", token: "ZOO", amount: 3, timestamp: "2025-05-05 14:22" },
    { id: 11, type: "每日簽到", token: "KAIA", amount: 1, timestamp: "2025-05-05 08:45" },
    { id: 12, type: "推薦朋友", token: "ZOO", amount: 10, timestamp: "2025-05-04 16:37" },
    { id: 13, type: "加密貨幣測驗", token: "WBTC", amount: 0.0001, timestamp: "2025-05-03 11:11" },
    { id: 14, type: "每日簽到", token: "KAIA", amount: 1, timestamp: "2025-05-03 09:05" },
    { id: 15, type: "社交媒體分享", token: "ZOO", amount: 5, timestamp: "2025-05-02 15:48" },
    { id: 16, type: "每日簽到", token: "KAIA", amount: 1, timestamp: "2025-05-02 08:30" },
    { id: 17, type: "每日簽到", token: "KAIA", amount: 1, timestamp: "2025-05-01 09:22" },
    { id: 18, type: "加入社區", token: "ZOO", amount: 3, timestamp: "2025-04-30 17:22" },
    { id: 19, type: "每日簽到", token: "KAIA", amount: 1, timestamp: "2025-04-30 08:15" },
    { id: 20, type: "推薦朋友", token: "ZOO", amount: 10, timestamp: "2025-04-29 13:37" },
    { id: 21, type: "加密貨幣測驗", token: "WBTC", amount: 0.0001, timestamp: "2025-04-28 19:11" },
    { id: 22, type: "每日簽到", token: "KAIA", amount: 1, timestamp: "2025-04-28 09:05" },
  ]

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(rewardHistory.length / itemsPerPage)

  // Get current page items
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return rewardHistory.slice(startIndex, endIndex)
  }

  // Navigation functions
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  // Function to get the token icon based on token name
  const getTokenIcon = (token: string) => {
    switch (token) {
      case "KAIA":
        return "/images/kaia-token.png"
      case "ZOO":
        return "/images/zoo-token.png"
      case "WBTC":
        return "/images/wbtc-token.png"
      default:
        return "/images/kaia-token.png"
    }
  }

  // Function to get token color
  const getTokenColor = (token: string) => {
    switch (token) {
      case "KAIA":
        return "text-lion-orange"
      case "ZOO":
        return "text-lion-teal"
      case "WBTC":
        return "text-orange-500"
      default:
        return "text-lion-orange"
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-lion-face-light pb-16">
      <header className="bg-gradient-to-r from-lion-orange to-lion-red text-white p-4 text-center shadow-md">
        <div className="flex items-center justify-center gap-2">
          <LionLogo size="sm" />
          <h1 className="text-2xl font-bold">獎勵中心</h1>
        </div>
      </header>

      <main className="flex-1 container max-w-md mx-auto p-4 space-y-4">
        <Card className="p-4 rounded-xl bg-white border-2 border-lion-orange/20 shadow-lion">
          <h2 className="text-lg font-bold mb-3 text-lion-accent">您的代幣</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-lion-face p-3 rounded-lg text-center border border-lion-face-dark">
              <div className="flex items-center justify-center mb-1">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image src="/images/kaia-token.png" alt="KAIA Token" width={32} height={32} />
                </div>
                <p className="text-sm font-medium text-gray-600 ml-1">KAIA</p>
              </div>
              <p className="text-xl font-bold text-lion-orange">x 12</p>
            </div>

            <div className="bg-lion-face p-3 rounded-lg text-center border border-lion-face-dark">
              <div className="flex items-center justify-center mb-1">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image src="/images/zoo-token.png" alt="ZOO Token" width={32} height={32} />
                </div>
                <p className="text-sm font-medium text-gray-600 ml-1">ZOO</p>
              </div>
              <p className="text-xl font-bold text-lion-teal">x 35</p>
            </div>

            <div className="bg-lion-face p-3 rounded-lg text-center border border-lion-face-dark">
              <div className="flex items-center justify-center mb-1">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image src="/images/wbtc-token.png" alt="WBTC Token" width={32} height={32} />
                </div>
                <p className="text-sm font-medium text-gray-600 ml-1">WBTC</p>
              </div>
              <p className="text-xl font-bold text-orange-500">x 0.0001</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 rounded-xl bg-white border-2 border-lion-teal/20 shadow-lion-teal">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-lion-accent">獎勵歷史</h2>
            <span className="text-xs text-gray-500">共 {rewardHistory.length} 筆記錄</span>
          </div>

          <div className="space-y-2">
            {getCurrentPageItems().map((reward) => (
              <div
                key={reward.id}
                className="flex justify-between items-center p-2 bg-lion-face-light rounded-lg border border-lion-face hover:bg-lion-face transition-colors"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                    <Image
                      src={getTokenIcon(reward.token) || "/placeholder.svg"}
                      alt={`${reward.token} Token`}
                      width={32}
                      height={32}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{reward.type}</p>
                    <p className="text-xs text-gray-500">{reward.timestamp}</p>
                  </div>
                </div>
                <span className={`font-medium ${getTokenColor(reward.token)}`}>
                  + {reward.amount} ${reward.token}
                </span>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-100">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              上一頁
            </Button>

            <div className="text-sm text-gray-600">
              {currentPage} / {totalPages}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1"
            >
              下一頁
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </main>

      <BottomNavigation activeTab="rewards" />
    </div>
  )
}
