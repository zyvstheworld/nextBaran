import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/admin/faqs
export async function GET() {
  try {
    const { data: faqs, error } = await supabase
      .from('faqs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(faqs)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch FAQs' },
      { status: 500 }
    )
  }
}

// POST /api/admin/faqs
export async function POST(request: Request) {
  try {
    const data = await request.json()

    const { data: faq, error } = await supabase
      .from('faqs')
      .insert([data])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(faq)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to create FAQ' },
      { status: 500 }
    )
  }
} 