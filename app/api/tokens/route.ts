import { NextResponse } from "next/server"
import { mockTokens } from "@/lib/mock-data"

export async function GET() {
  return NextResponse.json(mockTokens)
}
