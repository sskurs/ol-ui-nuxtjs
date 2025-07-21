// app/api/auth/login/route.ts
// -----------------------------------------------------------
// Login endpoint that integrates with Symfony backend for all user types
// -----------------------------------------------------------

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

type Role = "consumer" | "partner" | "admin"

interface BackendLoginResponse {
  token: string
  user: {
    id: string
    username: string
    roles: string[]
  }
}

export async function POST(req: NextRequest) {
  // Parse incoming JSON
  const body = await req.json().catch(() => ({}))

  const {
    email = "",
    password = "",
    role = "consumer",
    accessCode = "",
  } = body as {
    email?: string
    password?: string
    role?: Role
    organizationCode?: string
    accessCode?: string
  }

  // Basic validation
  if (!email || !password) {
    return NextResponse.json({ message: "Email and password are required." }, { status: 400 })
  }

  // Get backend URL from environment or use default
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
  
  console.log("🔐 Login attempt:", { email, role, backendUrl })
  
  try {
    let backendEndpoint: string
    let requestBody: any

    // Determine backend endpoint based on role
    switch (role) {
      case "admin":
        backendEndpoint = `${backendUrl}/api/auth/login`
        requestBody = {
          email: email, // Use the email from the UI
          password: password,
        }
        break
      case "partner":
        backendEndpoint = `${backendUrl}/api/seller/login`
        requestBody = {
          username: email,
          password: password,
        }
        break
      case "consumer":
        backendEndpoint = `${backendUrl}/api/auth/login`
        requestBody = {
          email: email,
          password: password,
        }
        break
      default:
        return NextResponse.json({ message: "Invalid role specified." }, { status: 400 })
    }

    console.log("🌐 Calling backend endpoint:", backendEndpoint)
    
    // Call Symfony backend login endpoint
    const response = await fetch(backendEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    console.log("📡 Backend response status:", response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("❌ Backend login failed:", { status: response.status, error: errorData })
      
      return NextResponse.json({ 
        message: errorData.message || `${role} login failed (${response.status}). Please check your credentials.` 
      }, { status: response.status })
    }

    const backendData: BackendLoginResponse = await response.json()
    console.log("✅ Backend login successful:", { userId: backendData.user.id })

    // Transform backend response to match frontend expectations
    const user = {
      id: backendData.user.id,
      name: backendData.user.username, // Use username as name for now
      email: email,
      role: role,
      permissions: backendData.user.roles,
      lastLogin: new Date().toISOString(),
    }

    return NextResponse.json({
      token: backendData.token,
      user,
    })

  } catch (error: unknown) {
    console.error("💥 Login error:", error)
    
    // Provide more specific error messages based on error type
    let errorMessage = "Connection to backend failed. Please try again."
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      errorMessage = "Cannot connect to backend server. Please ensure the backend is running."
    } else if (error instanceof Error) {
      errorMessage = `Backend connection error: ${error.message}`
    }
    
    return NextResponse.json({ 
      message: errorMessage,
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    }, { status: 500 })
  }
}

// Optional GET so you can open `/api/auth/login` in the browser
export function GET() {
  return NextResponse.json({ 
    ok: true, 
    message: "Login API is running",
    backendUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000",
    supportedRoles: ["admin", "partner", "consumer"]
  })
}
