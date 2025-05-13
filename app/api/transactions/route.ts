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
    
    // Get user transactions
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Failed to get transactions'
      }, { status: 400 })
    }
    
    return NextResponse.json({ 
      success: true, 
      data: transactions
    })
    
  } catch (error) {
    console.error('Error getting transactions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get transactions' },
      { status: 500 }
    )
  }
}