'use client';

/**
 * Bitcoin Wallet Page
 * 
 * This page demonstrates the use of the Bitcoin API.
 * It includes components for displaying Bitcoin price, wallet balance, and transaction history.
 */

import { useState, useEffect } from 'react';
import { useBitcoin } from '@/hooks/use-bitcoin';

export default function WalletPage() {
  const [address, setAddress] = useState<string>('');
  const {
    price,
    balance,
    transactions,
    loading,
    error,
    fetchPrice,
    fetchBalance,
    fetchTransactions
  } = useBitcoin();
  
  // Fetch Bitcoin price on component mount and every minute
  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 60000);
    return () => clearInterval(interval);
  }, [fetchPrice]);
  
  // Handle address input change
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };
  
  // Fetch wallet information
  const handleFetchWallet = () => {
    if (address) {
      fetchBalance(address);
      fetchTransactions(address);
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">比特幣錢包</h1>
      
      {/* Bitcoin Price */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">當前比特幣價格</h2>
        {loading && !price ? (
          <p>加載中...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <p className="text-2xl font-bold">${price?.toLocaleString()} USD</p>
        )}
      </div>
      
      {/* Wallet Address Input */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">查詢錢包</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={address}
            onChange={handleAddressChange}
            placeholder="輸入比特幣地址"
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleFetchWallet}
            disabled={!address || loading}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            {loading ? '加載中...' : '查詢'}
          </button>
        </div>
      </div>
      
      {/* Wallet Balance */}
      {balance && (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">錢包餘額</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">確認餘額</p>
              <p className="text-xl font-bold">{balance.balance.toFixed(8)} BTC</p>
              <p className="text-gray-600">≈ ${(balance.balance * (price || 0)).toFixed(2)} USD</p>
            </div>
            <div>
              <p className="text-gray-600">未確認餘額</p>
              <p className="text-xl font-bold">{balance.unconfirmedBalance.toFixed(8)} BTC</p>
            </div>
            <div>
              <p className="text-gray-600">總收到</p>
              <p className="text-xl font-bold">{balance.totalReceived.toFixed(8)} BTC</p>
            </div>
            <div>
              <p className="text-gray-600">總發送</p>
              <p className="text-xl font-bold">{balance.totalSent.toFixed(8)} BTC</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Transaction History */}
      {transactions.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">交易歷史</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">交易哈希</th>
                  <th className="py-2 px-4 border-b">時間</th>
                  <th className="py-2 px-4 border-b">金額 (BTC)</th>
                  <th className="py-2 px-4 border-b">確認數</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.hash}>
                    <td className="py-2 px-4 border-b">
                      <a
                        href={`https://www.blockchain.com/btc/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {tx.hash.substring(0, 10)}...
                      </a>
                    </td>
                    <td className="py-2 px-4 border-b">
                      {tx.time.toLocaleString()}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <span className={tx.amount >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {tx.amount >= 0 ? '+' : ''}{tx.amount.toFixed(8)}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b">
                      {tx.confirmations}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}
