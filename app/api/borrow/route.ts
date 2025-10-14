import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const body = await request.json()

  return NextResponse.json({
    success: true,
    loanId: "LOAN-" + Date.now(),
    amount: body.amount,
    message: "대출이 성공적으로 실행되었습니다.",
  })
}
