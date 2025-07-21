// app/api/health/route.ts
// -----------------------------------------------------------
// Health check endpoint for database connectivity
// -----------------------------------------------------------

import { NextResponse } from "next/server"
import { apiService } from "@/lib/apiService"

export async function GET() {
  console.log("🏥 Health check endpoint called!")
  
  try {
    // Test database connection
    const isConnected = await apiService.testConnection()
    const connectionInfo = apiService.getConnectionInfo()
    
    if (isConnected) {
      return NextResponse.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        database: {
          connected: true,
          host: connectionInfo.host,
          port: connectionInfo.port,
          database: connectionInfo.database,
          username: connectionInfo.username
        },
        message: "Database connection successful"
      })
    } else {
      return NextResponse.json({
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        database: {
          connected: false,
          host: connectionInfo.host,
          port: connectionInfo.port,
          database: connectionInfo.database,
          username: connectionInfo.username
        },
        message: "Database connection failed"
      }, { status: 503 })
    }
  } catch (error) {
    console.error("💥 Health check failed:", error)
    
    return NextResponse.json({
      status: "error",
      timestamp: new Date().toISOString(),
      database: {
        connected: false,
        error: error instanceof Error ? error.message : "Unknown error"
      },
      message: "Health check failed"
    }, { status: 500 })
  }
} 