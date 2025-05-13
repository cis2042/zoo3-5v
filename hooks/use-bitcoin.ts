/**
 * Bitcoin Hook
 * 
 * This hook provides functions to interact with the Bitcoin API.
 * It includes functions for fetching Bitcoin price, wallet balance, and transaction history.
 */

import { useState, useCallback } from 'react';
import { WalletBalance, Transaction, TransactionResult } from '@/lib/bitcoin';

export function useBitcoin() {
  const [price, setPrice] = useState<number | null>(null);
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Fetch Bitcoin price
   */
  const fetchPrice = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/bitcoin/price');
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }
      
      setPrice(data.data.price);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch Bitcoin price');
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Fetch wallet balance for a Bitcoin address
   * @param address - Bitcoin address
   */
  const fetchBalance = useCallback(async (address: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/bitcoin/balance?address=${address}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }
      
      setBalance(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch wallet balance');
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Fetch transaction history for a Bitcoin address
   * @param address - Bitcoin address
   * @param limit - Maximum number of transactions to return
   */
  const fetchTransactions = useCallback(async (address: string, limit = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/bitcoin/transactions?address=${address}&limit=${limit}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }
      
      setTransactions(data.data.transactions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transaction history');
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Send Bitcoin transaction
   * @param fromAddress - Sender's Bitcoin address
   * @param toAddress - Recipient's Bitcoin address
   * @param amount - Amount to send in BTC
   * @param privateKey - Sender's private key (WIF format)
   * @returns Promise<TransactionResult> - Transaction result
   */
  const sendTransaction = useCallback(async (
    fromAddress: string,
    toAddress: string,
    amount: number,
    privateKey: string
  ): Promise<TransactionResult> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/bitcoin/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromAddress,
          toAddress,
          amount,
          privateKey
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }
      
      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send transaction');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    price,
    balance,
    transactions,
    loading,
    error,
    fetchPrice,
    fetchBalance,
    fetchTransactions,
    sendTransaction
  };
}
