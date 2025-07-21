// app/api/admin/transfers/bulk/route.ts
// -----------------------------------------------------------
// Admin bulk transfers API endpoint for bulk point operations
// -----------------------------------------------------------

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getMembers, updateMember } from "@/lib/member-storage"
import { createTransfer } from "@/lib/transfer-storage"

export async function POST(req: NextRequest) {
  console.log("🚀 Admin bulk transfers API route called!")
  
  // TODO: Add proper authentication middleware
  // For now, allow access without authentication for development
  
  try {
    const body = await req.json()
    console.log("📝 Received bulk transfer data:", body)
    
    // Validate required fields
    const { operation, points, reason, memberIds, adminName } = body
    
    if (!operation || !points || !reason || !memberIds || !Array.isArray(memberIds)) {
      return NextResponse.json({ 
        message: "Operation, points, reason, and member IDs array are required" 
      }, { status: 400 })
    }
    
    // Validate points amount
    const pointsNumber = Number(points)
    if (isNaN(pointsNumber) || pointsNumber <= 0) {
      return NextResponse.json({ 
        message: "Points must be a positive number" 
      }, { status: 400 })
    }
    
    // Validate operation type
    if (!['add', 'deduct'].includes(operation)) {
      return NextResponse.json({ 
        message: "Operation must be 'add' or 'deduct'" 
      }, { status: 400 })
    }
    
    // Get all members
    const membersResult = getMembers(1, 10000, '')
    const members = membersResult.members
    
    const results = []
    const errors = []
    
    // Process each member
    for (const memberId of memberIds) {
      const member = members.find(m => m.id === memberId)
      
      if (!member) {
        errors.push(`Member ${memberId} not found`)
        continue
      }
      
      try {
        const currentPoints = member.points || 0
        let newPoints = currentPoints
        
        if (operation === 'add') {
          newPoints = currentPoints + pointsNumber
        } else if (operation === 'deduct') {
          if (currentPoints < pointsNumber) {
            errors.push(`Insufficient points for ${member.name} (${currentPoints} available, ${pointsNumber} required)`)
            continue
          }
          newPoints = currentPoints - pointsNumber
        }
        
        // Update member points
        updateMember(memberId, {
          points: newPoints,
          lastActivity: new Date().toISOString()
        })
        
        // Create transfer record
        const transfer = createTransfer({
          fromMemberId: operation === 'add' ? 'system' : memberId,
          fromMemberName: operation === 'add' ? 'System' : member.name,
          toMemberId: operation === 'add' ? memberId : 'system',
          toMemberName: operation === 'add' ? member.name : 'System',
          points: pointsNumber,
          reason: reason,
          status: 'completed',
          adminName: adminName || "Admin",
          metadata: {
            transferType: operation === 'add' ? 'system-to-member' : 'member-to-system',
            notes: `Bulk ${operation} operation`
          }
        })
        
        results.push({
          memberId,
          memberName: member.name,
          oldPoints: currentPoints,
          newPoints,
          transferId: transfer.id,
          success: true
        })
        
      } catch (error) {
        errors.push(`Failed to process ${member.name}: ${error}`)
      }
    }
    
    console.log(`✅ Bulk operation completed: ${results.length} successful, ${errors.length} errors`)
    
    return NextResponse.json({
      message: "Bulk operation completed",
      results,
      errors,
      summary: {
        totalProcessed: memberIds.length,
        successful: results.length,
        failed: errors.length
      }
    }, { status: 200 })
    
  } catch (error: unknown) {
    console.error("💥 Error executing bulk transfer:", error)
    
    return NextResponse.json({ 
      message: "Failed to execute bulk transfer",
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    }, { status: 500 })
  }
} 