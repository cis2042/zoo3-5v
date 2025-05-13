/**
 * WBTC Price API
 *
 * This API endpoint returns the current WBTC price in USD.
 * It uses the getWBTCPrice function from the WBTC API client.
 */

import { NextResponse } from 'next/server';
import { getWBTCPrice } from '@/lib/wbtc';

export async function GET() {
  try {
    const price = await getWBTCPrice();

    return NextResponse.json({
      success: true,
      data: {
        price,
        currency: 'USD',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error in WBTC price API:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch WBTC price',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
