import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  // Get the code from the URL
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  // Redirect URL is the app's own URL without the query parameters
  const redirectUrl = `${requestUrl.origin}/auth/callback`
  
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(`${requestUrl.origin}/login?error=${encodeURIComponent(error.message)}`)
    }
    
    // Successful sign in/up
    return NextResponse.redirect(`${requestUrl.origin}`)
  }
  
  // No code in URL, redirect back to login
  return NextResponse.redirect(`${requestUrl.origin}/login`)
}