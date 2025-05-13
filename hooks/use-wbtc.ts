/**
 * WBTC Hook for Kaia Chain
 *
 * This hook provides functions to interact with the WBTC token on Kaia Chain.
 * It includes functions for fetching WBTC price, balance, and transaction history.
 */

import { useState, useCallback } from 'react';
import { Transaction, TransactionResult } from '@/lib/wbtc';

export function useWBTC() {
  const [price, setPrice] = useState<number | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch WBTC price
   */
  const fetchPrice = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/wbtc/price');
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      setPrice(data.data.price);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch WBTC price');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch WBTC balance for a Kaia Chain address
   * @param address - Kaia Chain address
   */
  const fetchBalance = useCallback(async (address: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/wbtc/balance?address=${address}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      setBalance(data.data.balance);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch WBTC balance');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch WBTC transaction history for a Kaia Chain address
   * @param address - Kaia Chain address
   * @param limit - Maximum number of transactions to return
   */
  const fetchTransactions = useCallback(async (address: string, limit = 10) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/wbtc/transactions?address=${address}&limit=${limit}`);
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
   * Send WBTC transaction
   * @param toAddress - Recipient's Kaia Chain address
   * @param amount - Amount to send in WBTC
   * @param privateKey - Sender's private key
   * @returns Promise<TransactionResult> - Transaction result
   */
  const sendTransaction = useCallback(async (
    toAddress: string,
    amount: string,
    privateKey: string
  ): Promise<TransactionResult> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/wbtc/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
      setError(err instanceof Error ? err.message : 'Failed to send WBTC');
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
