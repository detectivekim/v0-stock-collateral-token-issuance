import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const body = await request.json()

  return NextResponse.json({
    success: true,
    collateralId: "COL-" + Date.now(),
    amount: body.amount,
    message: "담보가 추가되었습니다.",
  })
}
