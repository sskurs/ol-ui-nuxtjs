import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  const body = await req.json()

  // pretend we created the user
  return NextResponse.json({ message: `User ${body.email} registered 👍` }, { status: 201 })
}
