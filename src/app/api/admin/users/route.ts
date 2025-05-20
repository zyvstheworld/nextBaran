import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/admin/users
export async function GET() {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, email, created_at')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// POST /api/admin/users
export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) throw authError

    // Create user profile in the users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user?.id,
          name,
          email,
        },
      ])
      .select()
      .single()

    if (userError) throw userError

    return NextResponse.json({
      user: userData,
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
} 