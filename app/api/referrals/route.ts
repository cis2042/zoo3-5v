import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { processReferral } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { referralCode } = body
    
    if (!referralCode) {
      return NextResponse.json(
        { success: false, error: 'Referral code is required' },
        { status: 400 }
      )
    }
    
    // Get session to authenticate request
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const userId = session.user.id
    
    // Process the referral
    const result = await processReferral(referralCode, userId)
    
    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.message || 'Failed to process referral'
      }, { status: 400 })
    }
    
    return NextResponse.json({ 
      success: true, 
      data: result 
    })
    
  } catch (error) {
    console.error('Error processing referral:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process referral' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
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
    
    // Get user's referral data
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('referral_code')
      .eq('user_id', userId)
      .single()
    
    if (profileError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to get user profile'
      }, { status: 400 })
    }
    
    // Get referral count
    const { data: referrals, error: referralsError } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', userId)
    
    if (referralsError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to get referrals'
      }, { status: 400 })
    }
    
    return NextResponse.json({ 
      success: true, 
      data: {
        referralCode: userProfile.referral_code,
        referralCount: referrals.length,
        referrals
      }
    })
    
  } catch (error) {
    console.error('Error getting referrals:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get referrals' },
      { status: 500 }
    )
  }
}