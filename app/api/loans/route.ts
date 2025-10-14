import { NextResponse } from "next/server"
import { mockLoans } from "@/lib/mock-data"

export async function GET() {
  return NextResponse.json(mockLoans)
}
