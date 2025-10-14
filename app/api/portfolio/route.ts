import { NextResponse } from "next/server"
import { mockPortfolio } from "@/lib/mock-data"

export async function GET() {
  return NextResponse.json(mockPortfolio)
}
