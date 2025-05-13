/**
 * Bitcoin Price API
 * 
 * This API endpoint returns the current Bitcoin price in USD.
 * It uses the getBitcoinPrice function from the Bitcoin API client.
 */

import { NextResponse } from 'next/server';
import { getBitcoinPrice } from '@/lib/bitcoin';

export async function GET() {
  try {
    const price = await getBitcoinPrice();
    
    return NextResponse.json({
      success: true,
      data: { 
        price,
        currency: 'USD',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error in BTC price API:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch Bitcoin price',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
