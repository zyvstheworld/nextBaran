import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/admin/services
export async function GET() {
  try {
    const { data: services, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(services)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

// POST /api/admin/services
export async function POST(request: Request) {
  try {
    const data = await request.json()

    const { data: service, error } = await supabase
      .from('services')
      .insert([data])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(service)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    )
  }
} 