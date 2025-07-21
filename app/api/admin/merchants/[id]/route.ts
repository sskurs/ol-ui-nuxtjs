// app/api/admin/merchants/[id]/route.ts
// -----------------------------------------------------------
// Individual merchant API endpoint for update and delete operations
// -----------------------------------------------------------

import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const token = request.headers.get('authorization')
    const response = await fetch(`${API_BASE_URL}/api/admin/merchants/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: token }),
      },
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
    console.error('Error fetching merchant:', error)
    return NextResponse.json(
      { error: 'Failed to fetch merchant' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json()
    const token = request.headers.get('authorization')
    const response = await fetch(`${API_BASE_URL}/api/admin/merchants/${id}`, {
      method: 'PUT',
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
    console.error('Error updating merchant:', error)
    return NextResponse.json(
      { error: 'Failed to update merchant' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const token = request.headers.get('authorization')
    const response = await fetch(`${API_BASE_URL}/api/admin/merchants/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: token }),
      },
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
    console.error('Error deleting merchant:', error)
    return NextResponse.json(
      { error: 'Failed to delete merchant' },
      { status: 500 }
    )
  }
} 