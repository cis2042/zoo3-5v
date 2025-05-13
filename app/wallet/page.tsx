'use client';

/**
 * WBTC Wallet Page for Kaia Chain
 *
 * This page demonstrates the use of the WBTC API on Kaia Chain.
 * It includes components for displaying WBTC price, balance, and transaction history.
 */

import { useState, useEffect } from 'react';
import { useWBTC } from '@/hooks/use-wbtc';

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
  } = useWBTC();

  // Fetch WBTC price on component mount and every minute
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
      <h1 className="text-2xl font-bold mb-4">WBTC 錢包 (Kaia Chain)</h1>

      {/* WBTC Price */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">當前 WBTC 價格</h2>
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
            placeholder="輸入 Kaia Chain 地址"
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

      {/* WBTC Balance */}
      {balance && (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">WBTC 餘額</h2>
          <div>
            <p className="text-xl font-bold">{balance} WBTC</p>
            <p className="text-gray-600">≈ ${(parseFloat(balance) * (price || 0)).toFixed(2)} USD</p>
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
                  <th className="py-2 px-4 border-b">發送方</th>
                  <th className="py-2 px-4 border-b">接收方</th>
                  <th className="py-2 px-4 border-b">金額 (WBTC)</th>
                  <th className="py-2 px-4 border-b">時間</th>
                  <th className="py-2 px-4 border-b">確認數</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => {
                  const isIncoming = tx.to.toLowerCase() === address.toLowerCase();
                  const date = new Date(tx.timestamp * 1000);

                  return (
                    <tr key={tx.hash}>
                      <td className="py-2 px-4 border-b">
                        <a
                          href={`https://explorer.kaiachain.io/tx/${tx.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {tx.hash.substring(0, 10)}...
                        </a>
                      </td>
                      <td className="py-2 px-4 border-b">
                        <span className={isIncoming ? '' : 'font-bold'}>
                          {tx.from.substring(0, 6)}...{tx.from.substring(tx.from.length - 4)}
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b">
                        <span className={isIncoming ? 'font-bold' : ''}>
                          {tx.to.substring(0, 6)}...{tx.to.substring(tx.to.length - 4)}
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b">
                        <span className={isIncoming ? 'text-green-500' : 'text-red-500'}>
                          {isIncoming ? '+' : '-'}{tx.value}
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b">
                        {date.toLocaleString()}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {tx.confirmations}
                      </td>
                    </tr>
                  );
                })}
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
