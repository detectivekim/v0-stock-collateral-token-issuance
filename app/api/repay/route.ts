import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const body = await request.json()

  return NextResponse.json({
    success: true,
    transactionId: "TX-" + Date.now(),
    amount: body.amount,
    message: "상환이 완료되었습니다.",
  })
}
