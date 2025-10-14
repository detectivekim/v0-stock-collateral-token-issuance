"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Wallet, RefreshCw, TrendingDown, ArrowDownToLine } from "lucide-react"
import type { Loan } from "@/lib/types"

interface RepaymentMethodProps {
  loan: Loan
  onMethodSelect: (method: "krw1" | "swap" | "liquidate" | "deposit") => void
  onBack: () => void
}

export function RepaymentMethod({ loan, onMethodSelect, onBack }: RepaymentMethodProps) {
  const [selectedMethod, setSelectedMethod] = useState<"krw1" | "swap" | "liquidate" | "deposit" | null>(null)

  const methods = [
    {
      id: "krw1" as const,
      icon: Wallet,
      title: "KRW1로 상환",
      description: "보유 중인 KRW1 토큰으로 직접 상환합니다",
      recommended: true,
    },
    {
      id: "swap" as const,
      icon: RefreshCw,
      title: "다른 토큰으로 상환",
      description: "보유 토큰을 KRW1로 스왑한 후 상환합니다",
      recommended: false,
    },
    {
      id: "liquidate" as const,
      icon: TrendingDown,
      title: "주식 청산 후 상환",
      description: "담보 주식을 매도하여 상환합니다 (수수료 발생)",
      recommended: false,
    },
    {
      id: "deposit" as const,
      icon: ArrowDownToLine,
      title: "지갑 입금 후 상환",
      description: "외부에서 KRW1을 입금받아 상환합니다",
      recommended: false,
    },
  ]

  const handleContinue = () => {
    if (selectedMethod) {
      onMethodSelect(selectedMethod)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">상환 방법 선택</h3>
        <p className="text-sm text-muted-foreground">대출을 상환할 방법을 선택하세요</p>
      </div>

      {/* Loan Summary */}
      <Card className="p-6 bg-muted/30">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">대출 금액</div>
            <div className="text-xl font-bold">₩{loan.loanAmount.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">누적 이자</div>
            <div className="text-xl font-bold text-yellow-500">
              ₩{((loan.loanAmount * loan.interestRate * 0.01 * 180) / 365).toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">총 상환 금액</div>
            <div className="text-xl font-bold text-accent">
              ₩{(loan.loanAmount + (loan.loanAmount * loan.interestRate * 0.01 * 180) / 365).toLocaleString()}
            </div>
          </div>
        </div>
      </Card>

      {/* Methods */}
      <div className="grid md:grid-cols-2 gap-4">
        {methods.map((method) => {
          const Icon = method.icon
          const isSelected = selectedMethod === method.id

          return (
            <Card
              key={method.id}
              className={`p-6 cursor-pointer transition-all ${
                isSelected ? "border-2 border-accent bg-accent/5" : "border-2 border-transparent hover:border-accent/50"
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{method.title}</h4>
                    {method.recommended && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent font-medium">
                        추천
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1 bg-transparent">
          이전
        </Button>
        <Button onClick={handleContinue} disabled={!selectedMethod} className="flex-1">
          다음
        </Button>
      </div>
    </div>
  )
}
