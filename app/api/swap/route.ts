import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const body = await request.json()

  return NextResponse.json({
    success: true,
    transactionId: "SWAP-" + Date.now(),
    fromToken: body.fromToken,
    toToken: body.toToken,
    amount: body.amount,
    message: "스왑이 완료되었습니다.",
  })
}
