import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(_req: NextRequest) {
  // Normally you’d look up the user from the JWT in the Authorization header.
  // Here we just return a static mock user.
  return NextResponse.json({
    id: "u_1",
    name: "Mock User",
    email: "mock@example.com",
    role: "consumer",
  })
}
