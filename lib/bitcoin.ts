/**
 * Bitcoin API Client
 * 
 * This module provides functions to interact with Bitcoin blockchain APIs.
 * It uses BlockCypher API for blockchain data and CoinDesk API for price data.
 */

import axios from 'axios';

const API_BASE_URL = 'https://api.blockcypher.com/v1/btc';
const NETWORK = process.env.NEXT_PUBLIC_BTC_NETWORK || 'main';
const API_KEY = process.env.BLOCKCYPHER_API_KEY;

// Create API client
const bitcoinClient = axios.create({
  baseURL: `${API_BASE_URL}/${NETWORK}`,
  params: {
    token: API_KEY
  }
});

/**
 * Get current Bitcoin price in USD
 * @returns Promise<number> - Current Bitcoin price in USD
 */
export async function getBitcoinPrice(): Promise<number> {
  try {
    const response = await axios.get('https://api.coindesk.com/v1/bpi/currentprice.json');
    return response.data.bpi.USD.rate_float;
  } catch (error) {
    console.error('Error fetching Bitcoin price:', error);
    throw error;
  }
}

/**
 * Get wallet balance for a Bitcoin address
 * @param address - Bitcoin address
 * @returns Promise<WalletBalance> - Wallet balance information
 */
export interface WalletBalance {
  balance: number;
  unconfirmedBalance: number;
  totalReceived: number;
  totalSent: number;
}

export async function getWalletBalance(address: string): Promise<WalletBalance> {
  try {
    const response = await bitcoinClient.get(`/addrs/${address}/balance`);
    return {
      balance: response.data.balance / 100000000, // Convert Satoshi to BTC
      unconfirmedBalance: response.data.unconfirmed_balance / 100000000,
      totalReceived: response.data.total_received / 100000000,
      totalSent: response.data.total_sent / 100000000
    };
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    throw error;
  }
}

/**
 * Get transaction history for a Bitcoin address
 * @param address - Bitcoin address
 * @param limit - Maximum number of transactions to return
 * @returns Promise<Transaction[]> - Array of transactions
 */
export interface Transaction {
  hash: string;
  confirmations: number;
  time: Date;
  amount: number;
  fee: number;
}

export async function getTransactionHistory(address: string, limit = 10): Promise<Transaction[]> {
  try {
    const response = await bitcoinClient.get(`/addrs/${address}/full`, {
      params: { limit }
    });
    return response.data.txs.map((tx: any) => ({
      hash: tx.hash,
      confirmations: tx.confirmations,
      time: new Date(tx.received),
      amount: calculateTransactionAmount(tx, address),
      fee: tx.fees / 100000000
    }));
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    throw error;
  }
}

/**
 * Calculate transaction amount for a specific address
 * @param tx - Transaction object from BlockCypher API
 * @param address - Bitcoin address
 * @returns number - Transaction amount (positive for incoming, negative for outgoing)
 */
function calculateTransactionAmount(tx: any, address: string): number {
  let amount = 0;
  
  // Calculate input amount
  tx.inputs.forEach((input: any) => {
    if (input.addresses && input.addresses.includes(address)) {
      amount -= input.output_value / 100000000;
    }
  });
  
  // Calculate output amount
  tx.outputs.forEach((output: any) => {
    if (output.addresses && output.addresses.includes(address)) {
      amount += output.value / 100000000;
    }
  });
  
  return amount;
}

/**
 * Create and send a Bitcoin transaction
 * @param fromAddress - Sender's Bitcoin address
 * @param toAddress - Recipient's Bitcoin address
 * @param amount - Amount to send in BTC
 * @param privateKey - Sender's private key (WIF format)
 * @returns Promise<TransactionResult> - Transaction result
 */
export interface TransactionResult {
  txHash: string;
  blockHeight: number | null;
  confirmations: number;
}

export async function createTransaction(
  fromAddress: string, 
  toAddress: string, 
  amount: number, 
  privateKey: string
): Promise<TransactionResult> {
  try {
    // 1. Create new transaction
    const newTx = await bitcoinClient.post('/txs/new', {
      inputs: [{ addresses: [fromAddress] }],
      outputs: [{ addresses: [toAddress], value: Math.floor(amount * 100000000) }]
    });
    
    // 2. Sign transaction with private key
    const signedTx = await signTransaction(newTx.data, privateKey);
    
    // 3. Send transaction
    const sentTx = await bitcoinClient.post('/txs/send', signedTx);
    
    return {
      txHash: sentTx.data.tx.hash,
      blockHeight: sentTx.data.tx.block_height,
      confirmations: sentTx.data.tx.confirmations
    };
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
}

/**
 * Sign a transaction with a private key
 * Note: This is a simplified implementation. In a real application,
 * you would use a Bitcoin library like bitcoinjs-lib to sign transactions.
 */
async function signTransaction(txData: any, privateKey: string): Promise<any> {
  // Note: This is a simplified implementation
  // In a real application, you would use bitcoinjs-lib to sign transactions
  
  // Simulate signing process
  txData.pubkeys = [];
  txData.signatures = [];
  
  // In a real implementation, you would use the private key to sign the transaction
  // const bitcoin = require('bitcoinjs-lib');
  // const keyPair = bitcoin.ECPair.fromWIF(privateKey);
  // const tx = bitcoin.Transaction.fromHex(txData.tx.hex);
  // ...signing logic...
  
  return txData;
}

export default {
  getBitcoinPrice,
  getWalletBalance,
  getTransactionHistory,
  createTransaction
};
