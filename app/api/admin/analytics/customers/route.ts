// app/api/admin/analytics/customers/route.ts
// -----------------------------------------------------------
// Admin analytics endpoint for customer statistics
// -----------------------------------------------------------

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  console.log("🚀 Admin analytics customers API route called!")
  
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
  const token = req.headers.get('authorization')?.replace('Bearer ', '')

  if (!token) {
    return NextResponse.json({ message: "Authentication required" }, { status: 401 })
  }

  try {
    // Note: Adjust the backend endpoint if it's different
    const backendResponse = await fetch(`${backendUrl}/api/admin/analytics/customers`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}))
      console.error("❌ Backend customer analytics fetch failed:", { status: backendResponse.status, error: errorData })
      return NextResponse.json({ message: "Failed to fetch customer analytics from backend" }, { status: backendResponse.status })
    }

    const analyticsData = await backendResponse.json()
    console.log(`✅ Returning customer analytics from backend:`, analyticsData)
    
    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error("💥 Error fetching customer analytics:", error)
    return NextResponse.json({ 
      message: "Failed to fetch customer analytics",
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    }, { status: 500 })
  }
} 