import { NextResponse } from 'next/server'

export async function GET() {
  // You can adjust these roles as needed
  const roles = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Seller' },
    { id: 3, name: 'Consumer' },
  ]
  return NextResponse.json(roles)
} 