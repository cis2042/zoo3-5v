import { supabase } from './supabase'
import { initializeLiff, getUserProfile as getLiffProfile } from './liff'

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ 
    email, 
    password 
  })

  if (error) {
    console.error('Error signing in:', error.message)
    return { success: false, error }
  }

  return { success: true, data }
}

export async function signUp(email: string, password: string, displayName: string) {
  const { data, error } = await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      data: {
        display_name: displayName,
      }
    }
  })

  if (error) {
    console.error('Error signing up:', error.message)
    return { success: false, error }
  }

  return { success: true, data }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Error signing out:', error.message)
    return { success: false, error }
  }

  return { success: true }
}

export async function syncLineProfile(liffId: string) {
  try {
    // Initialize LIFF
    const initialized = await initializeLiff(liffId)
    
    if (!initialized || typeof window === 'undefined' || !window.liff) {
      return { success: false, error: 'LIFF initialization failed' }
    }
    
    // Check if user is logged in to LINE
    if (!window.liff.isLoggedIn()) {
      return { success: false, error: 'User not logged in to LINE' }
    }
    
    // Get LINE profile
    const lineProfile = await getLiffProfile()
    
    if (!lineProfile) {
      return { success: false, error: 'Failed to get LINE profile' }
    }
    
    // Get current user from Supabase
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { success: false, error: 'No Supabase user found' }
    }
    
    // Update profile in database
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        display_name: lineProfile.displayName,
        avatar_url: lineProfile.pictureUrl,
      })
      .eq('user_id', user.id)
    
    if (error) {
      console.error('Error updating profile:', error)
      return { success: false, error }
    }
    
    return { 
      success: true, 
      data: {
        ...data,
        lineProfile
      }
    }
  } catch (error) {
    console.error('Error syncing LINE profile:', error)
    return { success: false, error }
  }
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  
  if (error) {
    console.error('Error getting session:', error)
    return null
  }
  
  return data.session
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser()
  
  if (error) {
    console.error('Error getting current user:', error)
    return null
  }
  
  return data.user
}