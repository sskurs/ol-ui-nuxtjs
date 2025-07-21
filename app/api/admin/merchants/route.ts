// app/api/admin/merchants/route.ts
// -----------------------------------------------------------
// Admin merchants API endpoint for merchant management
// -----------------------------------------------------------

import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '10'
    const search = searchParams.get('search') || ''
    const token = request.headers.get('authorization')
    const response = await fetch(
      `${API_BASE_URL}/api/admin/merchants?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: token }),
        },
      }
    )
    if (response.status === 401) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching merchants:', error)
    return NextResponse.json(
      { error: 'Failed to fetch merchants' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const token = request.headers.get('authorization')
    const response = await fetch(`${API_BASE_URL}/api/admin/merchants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: token }),
      },
      body: JSON.stringify(body),
    })
    if (response.status === 401) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating merchant:', error)
    return NextResponse.json(
      { error: 'Failed to create merchant' },
      { status: 500 }
    )
  }
} 