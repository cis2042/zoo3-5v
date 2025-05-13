import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

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
    
    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (profileError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to get user profile'
      }, { status: 400 })
    }
    
    // Get login streak
    const { data: streak, error: streakError } = await supabase
      .from('login_streaks')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    // Get achievements
    const { data: achievements, error: achievementsError } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)
    
    return NextResponse.json({ 
      success: true, 
      data: {
        profile,
        streak: streak || { streak_days: 0, current_day: 0, days_completed: [] },
        achievements: achievements || []
      }
    })
    
  } catch (error) {
    console.error('Error getting user profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get user profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { displayName, avatarUrl } = body
    
    // Get session to authenticate request
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const userId = session.user.id
    
    // Update profile
    const updates: any = {}
    
    if (displayName !== undefined) {
      updates.display_name = displayName
    }
    
    if (avatarUrl !== undefined) {
      updates.avatar_url = avatarUrl
    }
    
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', userId)
    
    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Failed to update profile'
      }, { status: 400 })
    }
    
    return NextResponse.json({ 
      success: true, 
      data
    })
    
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}