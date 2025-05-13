import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { claimDailyReward } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Get session to authenticate request
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const userId = session.user.id
    
    // Claim the daily reward
    const result = await claimDailyReward(userId)
    
    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.message || 'Failed to claim daily reward'
      }, { status: 400 })
    }
    
    return NextResponse.json({ 
      success: true, 
      data: result 
    })
    
  } catch (error) {
    console.error('Error claiming daily reward:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to claim daily reward' },
      { status: 500 }
    )
  }
}