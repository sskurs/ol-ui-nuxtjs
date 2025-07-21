// app/api/admin/members/[id]/route.ts
// -----------------------------------------------------------
// Individual member operations (GET, PUT, DELETE)
// -----------------------------------------------------------

import { NextRequest, NextResponse } from 'next/server'
import { memberStorage } from '@/lib/member-storage'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const token = request.headers.get('authorization')
    const response = await fetch(`${API_BASE_URL}/api/admin/members/${id}`, {
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
    console.error('Error fetching member:', error)
    return NextResponse.json(
      { error: 'Failed to fetch member' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json()
    const token = request.headers.get('authorization')
    const response = await fetch(`${API_BASE_URL}/api/auth/members/${id}`, {
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
    console.error('Error updating member:', error)
    return NextResponse.json(
      { error: 'Failed to update member' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const token = request.headers.get('authorization')
    const response = await fetch(`${API_BASE_URL}/api/admin/members/${id}`, {
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
    console.error('Error deleting member:', error)
    return NextResponse.json(
      { error: 'Failed to delete member' },
      { status: 500 }
    )
  }
} 