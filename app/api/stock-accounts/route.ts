import { NextResponse } from "next/server"
import { mockStockAccounts } from "@/lib/mock-data"

export async function GET() {
  return NextResponse.json(mockStockAccounts)
}
