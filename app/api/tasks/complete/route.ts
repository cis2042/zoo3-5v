import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { completeTask } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { taskId } = body
    
    if (!taskId) {
      return NextResponse.json(
        { success: false, error: 'Task ID is required' },
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
    
    // Complete the task
    const result = await completeTask(userId, taskId)
    
    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.message || 'Failed to complete task'
      }, { status: 400 })
    }
    
    return NextResponse.json({ 
      success: true, 
      data: result
    })
    
  } catch (error) {
    console.error('Error completing task:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to complete task' },
      { status: 500 }
    )
  }
}