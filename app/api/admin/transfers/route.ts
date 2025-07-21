// app/api/admin/transfers/route.ts
// -----------------------------------------------------------
// Admin transfers API endpoint for point transfer management
// -----------------------------------------------------------

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { transferStorage } from "@/lib/transfer-storage"

export async function GET(req: NextRequest) {
  console.log("🚀 Admin transfers API route called!")
  
  // TODO: Add proper authentication middleware
  // For now, allow access without authentication for development
  
  try {
    // Get query parameters for pagination and search
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const perPage = parseInt(searchParams.get('perPage') || '10')
    const search = searchParams.get('search') || ''
    
    // Get transfers with pagination and search
    const result = await transferStorage.getTransfers(page, perPage, search)
    
    // Get transfer statistics
    const stats = await transferStorage.getTransferStats()
    
    console.log(`✅ Returning ${result.transfers.length} transfers (page ${page}, total: ${result.total})`)
    
    return NextResponse.json({
      transfers: result.transfers,
      total: result.total,
      page: result.page,
      perPage,
      totalPages: result.totalPages,
      stats
    })
  } catch (error) {
    console.error("💥 Error fetching transfers:", error)
    return NextResponse.json({ 
      message: "Failed to fetch transfers",
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  console.log("🚀 Admin transfer execution API route called!")
  
  try {
    const body = await req.json()
    console.log("📝 Received transfer data:", body)
    
    // Validate required fields
    const { fromMemberId, toMemberId, points, reason, adminName } = body
    
    if (!fromMemberId || !toMemberId || !points || !reason) {
      return NextResponse.json({ 
        message: "From member, to member, points, and reason are required" 
      }, { status: 400 })
    }
    
    // Validate points amount
    const pointsNumber = Number(points)
    if (isNaN(pointsNumber) || pointsNumber <= 0) {
      return NextResponse.json({ 
        message: "Points must be a positive number" 
      }, { status: 400 })
    }
    
    // Execute the transfer
    const result = await transferStorage.executeTransfer({
      fromMemberId,
      toMemberId,
      points: pointsNumber,
      reason,
      notes: adminName || "Admin"
    })
    
    if (!result) {
      return NextResponse.json({ 
        message: "Transfer failed" 
      }, { status: 400 })
    }
    
    console.log("✅ Transfer executed successfully:", result.id)
    
    return NextResponse.json({
      message: "Transfer executed successfully",
      transfer: result
    }, { status: 201 })
    
  } catch (error: unknown) {
    console.error("💥 Error executing transfer:", error)
    
    return NextResponse.json({ 
      message: "Failed to execute transfer",
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    }, { status: 500 })
  }
} 