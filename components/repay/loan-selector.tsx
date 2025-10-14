"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import useSWR from "swr"
import type { Loan } from "@/lib/types"
import { AlertCircle } from "lucide-react"

interface LoanSelectorProps {
  onSelect: (loan: Loan) => void
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function LoanSelector({ onSelect }: LoanSelectorProps) {
  const { data: loans, isLoading } = useSWR<Loan[]>("/api/loans", fetcher)

  if (isLoading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="h-32 bg-muted rounded" />
      </Card>
    )
  }

  const activeLoans = loans?.filter((loan) => loan.status === "active") || []

  if (activeLoans.length === 0) {
    return (
      <Card className="p-12 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">활성 대출이 없습니다</h3>
        <p className="text-muted-foreground">상환할 대출이 없습니다</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">상환할 대출 선택</h3>
      {activeLoans.map((loan) => {
        const daysRemaining = Math.ceil(
          (new Date(loan.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
        )
        const accruedInterest = (loan.loanAmount * loan.interestRate * 0.01 * daysRemaining) / 365

        return (
          <Card
            key={loan.id}
            className="p-6 cursor-pointer hover:border-accent transition-colors"
            onClick={() => onSelect(loan)}
          >
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">대출 금액</div>
                <div className="text-xl font-bold">₩{loan.loanAmount.toLocaleString()}</div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">담보 가치</div>
                <div className="text-xl font-bold">₩{loan.collateralValue.toLocaleString()}</div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">누적 이자</div>
                <div className="text-xl font-bold text-yellow-500">₩{accruedInterest.toLocaleString()}</div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">남은 기간</div>
                <div className="text-xl font-bold">{daysRemaining}일</div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                만기일: {new Date(loan.dueDate).toLocaleDateString("ko-KR")}
              </div>
              <Button size="sm">상환하기</Button>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
