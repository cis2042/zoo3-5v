import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { idToken, displayName, pictureUrl } = body
    
    if (!idToken) {
      return NextResponse.json(
        { success: false, error: 'ID Token is required' },
        { status: 400 }
      )
    }
    
    // Sign in with LINE ID token
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'line',
      token: idToken,
      options: {
        data: {
          display_name: displayName,
          avatar_url: pictureUrl
        }
      }
    })
    
    if (error) {
      console.error('LINE authentication error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      )
    }
    
    // Store the session in a cookie
    const { session } = data
    if (session) {
      cookies().set('supabase-auth-token', session.access_token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: session.expires_in
      })
    }
    
    return NextResponse.json({ success: true, user: data.user })
    
  } catch (error) {
    console.error('Unexpected error in LINE auth route:', error)
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    )
  }
}