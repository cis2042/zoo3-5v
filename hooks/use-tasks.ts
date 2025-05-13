"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/auth-context'
import { supabase } from '@/lib/supabase'
import { toast } from '@/components/ui/use-toast'

interface Task {
  id: string
  title: string
  description: string
  reward_amount: number
  reward_token: string
  task_type: string
  redirect_url: string | null
  created_at: string
}

export function useTasks() {
  const { user, refreshProfile } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [completedTasks, setCompletedTasks] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Load tasks
  const loadTasks = async () => {
    setIsLoading(true)
    
    try {
      // Get all tasks with proper error handling
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
      
      if (tasksError) {
        console.error('Error loading tasks:', tasksError)
        setTasks([])
      } else {
        setTasks(tasksData || [])
      }
      
      // Get completed tasks if user is logged in
      if (user) {
        try {
          const { data: completionsData, error: completionsError } = await supabase
            .from('task_completions')
            .select('task_id')
            .eq('user_id', user.id)
          
          if (completionsError) {
            console.error('Error loading task completions:', completionsError)
          } else {
            setCompletedTasks((completionsData || []).map(item => item.task_id))
          }
        } catch (error) {
          console.error('Exception loading task completions:', error)
          setCompletedTasks([])
        }
      }
    } catch (error) {
      console.error('Exception loading tasks:', error)
      toast({
        title: "載入失敗",
        description: "無法載入任務列表，請稍後再試",
        variant: "destructive"
      })
      setTasks([])
    } finally {
      setIsLoading(false)
    }
  }
  
  // Complete a task
  const completeTask = async (taskId: string) => {
    if (!user) {
      toast({
        title: "請先登入",
        description: "您需要先登入才能完成任務",
        variant: "destructive"
      })
      return { success: false, error: 'User not authenticated' }
    }
    
    if (completedTasks.includes(taskId)) {
      toast({
        title: "任務已完成",
        description: "您已經完成了這個任務",
      })
      return { success: false, error: 'Task already completed' }
    }
    
    try {
      const { data, error } = await supabase.rpc('complete_task', {
        user_id: user.id,
        task_id: taskId
      })
      
      if (error) throw error
      
      // Update local state
      setCompletedTasks(prev => [...prev, taskId])
      
      // Refresh profile to update token balances
      await refreshProfile()
      
      // Show success message
      toast({
        title: "任務完成!",
        description: `您獲得了 +${data.reward_amount} $${data.reward_token}`,
      })
      
      return { success: true, data }
    } catch (error) {
      console.error('Error completing task:', error)
      
      toast({
        title: "任務失敗",
        description: "無法完成任務，請稍後再試",
        variant: "destructive"
      })
      
      return { success: false, error }
    }
  }
  
  // Initialize data on component mount
  useEffect(() => {
    loadTasks()
  }, [user])
  
  return {
    tasks,
    completedTasks,
    isLoading,
    completeTask,
    refreshTasks: loadTasks
  }
}