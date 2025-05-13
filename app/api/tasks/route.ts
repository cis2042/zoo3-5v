import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Get all tasks
    const { data: tasksData, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (tasksError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to get tasks'
      }, { status: 400 })
    }
    
    // Get session for checking completed tasks
    const { data: { session } } = await supabase.auth.getSession()
    let completedTasks: string[] = []
    
    if (session) {
      const { data: completed, error: completedError } = await supabase
        .from('task_completions')
        .select('task_id')
        .eq('user_id', session.user.id)
      
      if (!completedError && completed) {
        completedTasks = completed.map(task => task.task_id)
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      data: {
        tasks: tasksData,
        completedTasks
      }
    })
    
  } catch (error) {
    console.error('Error getting tasks:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get tasks' },
      { status: 500 }
    )
  }
}