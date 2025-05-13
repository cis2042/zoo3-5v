/**
 * WBTC API Client for Kaia Chain
 *
 * This module provides functions to interact with WBTC token on Kaia Chain.
 * It uses ethers.js to interact with the WBTC smart contract and CoinGecko API for price data.
 */

import { ethers } from 'ethers';
import axios from 'axios';

// WBTC token ABI (only the functions we need)
const WBTC_ABI = [
  // Query balance
  'function balanceOf(address owner) view returns (uint256)',
  // Transfer
  'function transfer(address to, uint256 amount) returns (bool)',
  // Query allowance
  'function allowance(address owner, address spender) view returns (uint256)',
  // Approve
  'function approve(address spender, uint256 amount) returns (bool)',
  // Events
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)'
];

// Create Kaia Chain provider
const provider = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_KAIA_RPC_URL
);

// Create WBTC contract instance
const wbtcContract = new ethers.Contract(
  process.env.NEXT_PUBLIC_WBTC_CONTRACT_ADDRESS || '',
  WBTC_ABI,
  provider
);

/**
 * Get current WBTC price in USD
 * @returns Promise<number> - Current WBTC price in USD
 */
export async function getWBTCPrice(): Promise<number> {
  try {
    // Using CoinGecko API to get WBTC price
    // In a real application, you might want to use a price oracle on Kaia Chain
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=wrapped-bitcoin&vs_currencies=usd'
    );
    return response.data['wrapped-bitcoin'].usd;
  } catch (error) {
    console.error('Error fetching WBTC price:', error);
    throw error;
  }
}

/**
 * Get WBTC balance for a Kaia Chain address
 * @param address - Kaia Chain address
 * @returns Promise<string> - WBTC balance (in WBTC units)
 */
export async function getWBTCBalance(address: string): Promise<string> {
  try {
    const balanceWei = await wbtcContract.balanceOf(address);
    // Convert Wei to WBTC (assuming WBTC has 8 decimals, like BTC)
    const balance = ethers.utils.formatUnits(balanceWei, 8);
    return balance;
  } catch (error) {
    console.error('Error fetching WBTC balance:', error);
    throw error;
  }
}

/**
 * Get WBTC transaction history for a Kaia Chain address
 * @param address - Kaia Chain address
 * @param limit - Maximum number of transactions to return
 * @returns Promise<Transaction[]> - Array of transactions
 */
export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  blockNumber: number;
  confirmations: number;
}

export async function getWBTCTransactions(address: string, limit = 10): Promise<Transaction[]> {
  try {
    // Query incoming and outgoing transactions
    // Note: In a real application, you might want to use a blockchain explorer API
    // or an indexing service to get the complete transaction history

    // Get the latest block number
    const latestBlock = await provider.getBlockNumber();

    // Query incoming transactions (to = address)
    const incomingFilter = wbtcContract.filters.Transfer(null, address);
    const incomingEvents = await wbtcContract.queryFilter(incomingFilter, latestBlock - 10000, latestBlock);

    // Query outgoing transactions (from = address)
    const outgoingFilter = wbtcContract.filters.Transfer(address, null);
    const outgoingEvents = await wbtcContract.queryFilter(outgoingFilter, latestBlock - 10000, latestBlock);

    // Merge and sort all transactions
    const allEvents = [...incomingEvents, ...outgoingEvents]
      .sort((a, b) => b.blockNumber - a.blockNumber) // Sort by block number (descending)
      .slice(0, limit); // Limit the number of transactions

    // Get block timestamps
    const transactions = await Promise.all(
      allEvents.map(async (event) => {
        const block = await provider.getBlock(event.blockNumber);
        const args = event.args as any;

        return {
          hash: event.transactionHash,
          from: args.from,
          to: args.to,
          value: ethers.utils.formatUnits(args.value, 8), // Convert to WBTC
          timestamp: block.timestamp,
          blockNumber: event.blockNumber,
          confirmations: latestBlock - event.blockNumber + 1
        };
      })
    );

    return transactions;
  } catch (error) {
    console.error('Error fetching WBTC transactions:', error);
    throw error;
  }
}

/**
 * Send WBTC transaction
 * @param toAddress - Recipient's Kaia Chain address
 * @param amount - Amount to send in WBTC
 * @param privateKey - Sender's private key
 * @returns Promise<TransactionResult> - Transaction result
 */
export interface TransactionResult {
  txHash: string;
  blockNumber: number | null;
  confirmations: number;
}

export async function sendWBTC(
  toAddress: string,
  amount: string,
  privateKey: string
): Promise<TransactionResult> {
  try {
    // Create wallet
    const wallet = new ethers.Wallet(privateKey, provider);

    // Connect to contract with signer
    const contractWithSigner = wbtcContract.connect(wallet);

    // Convert WBTC to Wei
    const amountWei = ethers.utils.parseUnits(amount, 8);

    // Send transaction
    const tx = await contractWithSigner.transfer(toAddress, amountWei);

    // Wait for transaction confirmation
    const receipt = await tx.wait();

    return {
      txHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
      confirmations: 1 // Just confirmed
    };
  } catch (error) {
    console.error('Error sending WBTC:', error);
    throw error;
  }
}

export default {
  getWBTCPrice,
  getWBTCBalance,
  getWBTCTransactions,
  sendWBTC
};
