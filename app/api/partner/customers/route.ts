// app/api/partner/customers/route.ts
// -----------------------------------------------------------
// Partner customer data endpoint that integrates with Symfony backend
// -----------------------------------------------------------

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return NextResponse.json({ message: "Authentication required" }, { status: 401 })
  }

  try {
    console.log("🔍 Fetching partner customer data...")
    
    // Get URL parameters
    const { searchParams } = new URL(req.url)
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '10'
    const search = searchParams.get('search') || ''
    
    // Get customers from backend (using admin endpoint for now since seller endpoints might be limited)
    const customersResponse = await fetch(`${backendUrl}/api/customer?page=${page}&perPage=${limit}&query=${search}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!customersResponse.ok) {
      console.error("❌ Failed to fetch customers:", customersResponse.status)
      return NextResponse.json({ 
        message: "Failed to fetch customers" 
      }, { status: customersResponse.status })
    }

    const customersData = await customersResponse.json()
    console.log("✅ Customers data fetched:", { count: customersData.customers?.length || 0 })

    // Transform backend response to match frontend expectations
    const transformedData = {
      customers: customersData.customers?.map((customer: any) => ({
        id: customer.customerId,
        name: `${customer.firstName} ${customer.lastName}`,
        email: customer.email,
        phone: customer.phone,
        status: customer.active ? 'active' : 'inactive',
        points: customer.points || 0,
        tier: customer.level?.name || 'Bronze',
        lastActivity: customer.lastActivityAt || customer.createdAt,
        totalSpent: customer.totalSpent || 0,
      })) || [],
      total: customersData.total || 0,
      page: parseInt(page),
      totalPages: Math.ceil((customersData.total || 0) / parseInt(limit)),
    }

    return NextResponse.json(transformedData)

  } catch (error: unknown) {
    console.error("💥 Error fetching customers:", error)
    
    return NextResponse.json({ 
      message: "Failed to fetch customers",
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    }, { status: 500 })
  }
} 