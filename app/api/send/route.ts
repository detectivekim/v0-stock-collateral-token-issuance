import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const body = await request.json()

  return NextResponse.json({
    success: true,
    transactionId: "SEND-" + Date.now(),
    token: body.token,
    amount: body.amount,
    recipient: body.recipient,
    message: "전송이 완료되었습니다.",
  })
}
