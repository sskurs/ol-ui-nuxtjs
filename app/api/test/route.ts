import { NextResponse } from "next/server"

export async function GET() {
  console.log("🔍 /api/test route called!")
  return NextResponse.json({ message: "Test route working!", timestamp: new Date().toISOString() })
} 