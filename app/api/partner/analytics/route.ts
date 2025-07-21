// app/api/partner/analytics/route.ts
// -----------------------------------------------------------
// Partner analytics endpoint for business insights
// -----------------------------------------------------------

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { calculatePartnerAnalytics } from "@/lib/analytics-calculator"

export async function GET(req: NextRequest) {
  console.log("🚀 Partner analytics API route called!")
  
  // TODO: Add proper authentication middleware
  // For now, allow access without authentication for development
  
  try {
    // Calculate real-time partner analytics
    const analytics = calculatePartnerAnalytics()
    
    console.log(`✅ Returning real-time partner analytics: customers=${analytics.totalCustomers}, points=${analytics.pointsIssued}, revenue=${analytics.totalSpent}`)
    
    return NextResponse.json({
      totalCustomers: analytics.totalCustomers,
      activeCustomers: analytics.activeCustomers,
      pointsIssued: analytics.pointsIssued,
      totalSpent: analytics.totalSpent,
      averagePointsPerCustomer: analytics.averagePointsPerCustomer,
      averageSpentPerCustomer: analytics.averageSpentPerCustomer,
      monthlyData: analytics.monthlyData
    })
  } catch (error) {
    console.error("💥 Error fetching partner analytics:", error)
    return NextResponse.json({ 
      message: "Failed to fetch partner analytics",
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    }, { status: 500 })
  }
} 