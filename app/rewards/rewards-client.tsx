"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BottomNavigation } from "@/components/bottom-navigation"
import { LionLogo } from "@/components/lion-logo"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from "@/context/auth-context"
import { useWallet } from "@/hooks/use-wallet"
import { format } from "date-fns"

interface Transaction {
  id: string
  amount: number
  token: string
  transaction_type: string
  created_at: string
  description: string | null
}

export default function RewardsPage() {
  const { user } = useAuth()
  const { balances } = useWallet()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(transactions.length / itemsPerPage)

  // Fetch transactions
  useEffect(() => {
    const loadTransactions = async () => {
      if (!user) return
      
      setIsLoading(true)
      
      try {
        const response = await fetch('/api/transactions')
        const result = await response.json()
        
        if (result.success) {
          setTransactions(result.data || [])
        }
      } catch (error) {
        console.error('Error loading transactions:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    if (user) {
      loadTransactions()
    } else {
      setIsLoading(false)
    }
  }, [user])

  // Get current page items
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return transactions.slice(startIndex, endIndex)
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

  // Format transaction data for display
  const formatTransactionType = (type: string): string => {
    switch (type) {
      case 'daily_reward': return '每日簽到'
      case 'task_completion': return '完成任務'
      case 'referral_reward': return '推薦獎勵'
      case 'referral_bonus': return '推薦獎金'
      default: return type
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
              <p className="text-xl font-bold text-lion-orange">x {balances.kaia}</p>
            </div>

            <div className="bg-lion-face p-3 rounded-lg text-center border border-lion-face-dark">
              <div className="flex items-center justify-center mb-1">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image src="/images/zoo-token.png" alt="ZOO Token" width={32} height={32} />
                </div>
                <p className="text-sm font-medium text-gray-600 ml-1">ZOO</p>
              </div>
              <p className="text-xl font-bold text-lion-teal">x {balances.zoo}</p>
            </div>

            <div className="bg-lion-face p-3 rounded-lg text-center border border-lion-face-dark">
              <div className="flex items-center justify-center mb-1">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image src="/images/wbtc-token.png" alt="WBTC Token" width={32} height={32} />
                </div>
                <p className="text-sm font-medium text-gray-600 ml-1">WBTC</p>
              </div>
              <p className="text-xl font-bold text-orange-500">x {balances.wbtc}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 rounded-xl bg-white border-2 border-lion-teal/20 shadow-lion-teal">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-lion-accent">獎勵歷史</h2>
            <span className="text-xs text-gray-500">共 {transactions.length} 筆記錄</span>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-8">
              <p className="text-gray-500">載入中...</p>
            </div>
          ) : transactions.length > 0 ? (
            <div className="space-y-2">
              {getCurrentPageItems().map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex justify-between items-center p-2 bg-lion-face-light rounded-lg border border-lion-face hover:bg-lion-face transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                      <Image
                        src={getTokenIcon(transaction.token)}
                        alt={`${transaction.token} Token`}
                        width={32}
                        height={32}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {transaction.description || formatTransactionType(transaction.transaction_type)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(transaction.created_at), "yyyy-MM-dd HH:mm")}
                      </p>
                    </div>
                  </div>
                  <span className={`font-medium ${getTokenColor(transaction.token)}`}>
                    + {transaction.amount} ${transaction.token}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">暫無獎勵記錄</p>
              <p className="text-sm text-gray-400 mt-2">完成任務或每日簽到以獲取獎勵</p>
            </div>
          )}

          {/* Pagination Controls */}
          {transactions.length > 0 && (
            <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPage === 1 || isLoading}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                上一頁
              </Button>

              <div className="text-sm text-gray-600">
                {currentPage} / {totalPages || 1}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages || isLoading || totalPages === 0}
                className="flex items-center gap-1"
              >
                下一頁
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </Card>
      </main>

      <BottomNavigation activeTab="rewards" />
    </div>
  )
}