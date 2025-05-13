import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, displayName, referralCode } = body
    
    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }
    
    // Sign up user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName || email.split('@')[0]
        }
      }
    })
    
    if (error) {
      console.error('Sign up error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      )
    }
    
    // Process referral if provided
    if (referralCode && data.user) {
      try {
        await supabase.rpc('process_referral', {
          referrer_code: referralCode,
          referee_id: data.user.id
        })
      } catch (referralError) {
        // Just log the error, don't fail the signup
        console.error('Error processing referral:', referralError)
      }
    }
    
    return NextResponse.json({ success: true, user: data.user })
    
  } catch (error) {
    console.error('Unexpected error in signup route:', error)
    return NextResponse.json(
      { success: false, error: 'Signup failed' },
      { status: 500 }
    )
  }
}