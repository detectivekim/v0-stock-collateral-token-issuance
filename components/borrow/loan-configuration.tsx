"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"
import { AlertCircle, TrendingDown, Percent } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface LoanConfigurationProps {
  collateralValue: number
  onConfirm: (loanAmount: number) => void
  onBack: () => void
}

export function LoanConfiguration({ collateralValue, onConfirm, onBack }: LoanConfigurationProps) {
  const maxLoan = collateralValue * 3
  const [loanAmount, setLoanAmount] = useState(maxLoan * 0.5)
  const [customAmount, setCustomAmount] = useState("")

  const ltv = (loanAmount / collateralValue) * 100
  const liquidationPrice = collateralValue + loanAmount * 0.1
  const interestRate = 5.5

  const handleSliderChange = (value: number[]) => {
    setLoanAmount(value[0])
    setCustomAmount("")
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    const amount = Number.parseFloat(value.replace(/,/g, ""))
    if (!isNaN(amount) && amount <= maxLoan) {
      setLoanAmount(amount)
    }
  }

  const riskLevel = ltv >= 250 ? "high" : ltv >= 200 ? "medium" : "low"
  const riskColor =
    riskLevel === "high" ? "text-destructive" : riskLevel === "medium" ? "text-yellow-500" : "text-accent"
  const riskLabel = riskLevel === "high" ? "위험" : riskLevel === "medium" ? "주의" : "안전"

  return (
    <div className="space-y-6">
      {/* Loan Amount Input */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Percent className="h-5 w-5 text-accent" />
          <h3 className="text-lg font-semibold">대출 금액 설정</h3>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">대출 금액 (KRW1)</label>
            <Input
              type="text"
              value={customAmount || `₩${loanAmount.toLocaleString()}`}
              onChange={(e) => handleCustomAmountChange(e.target.value)}
              className="text-2xl font-bold h-14"
              placeholder="₩0"
            />
            <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
              <span>최소: ₩{(maxLoan * 0.1).toLocaleString()}</span>
              <span>최대: ₩{maxLoan.toLocaleString()}</span>
            </div>
          </div>

          <div>
            <Slider
              value={[loanAmount]}
              onValueChange={handleSliderChange}
              max={maxLoan}
              min={maxLoan * 0.1}
              step={100000}
              className="py-4"
            />
          </div>

          {/* Quick Select */}
          <div className="grid grid-cols-4 gap-2">
            {[25, 50, 75, 100].map((percent) => (
              <Button
                key={percent}
                variant="outline"
                size="sm"
                onClick={() => {
                  setLoanAmount((maxLoan * percent) / 100)
                  setCustomAmount("")
                }}
                className="bg-transparent"
              >
                {percent}%
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Loan Details */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">대출 상세 정보</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">담보 가치</span>
            <span className="font-semibold">₩{collateralValue.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">대출 금액</span>
            <span className="font-semibold text-accent">₩{loanAmount.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">LTV 비율</span>
            <span className={`font-semibold ${riskColor}`}>
              {ltv.toFixed(1)}% ({riskLabel})
            </span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">이자율 (연)</span>
            <span className="font-semibold">{interestRate}%</span>
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="text-muted-foreground">청산 가격</span>
            <span className="font-semibold">₩{liquidationPrice.toLocaleString()}</span>
          </div>
        </div>
      </Card>

      {/* Risk Warning */}
      {riskLevel !== "low" && (
        <Alert variant={riskLevel === "high" ? "destructive" : "default"}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {riskLevel === "high"
              ? "LTV 비율이 매우 높습니다. 주가 하락 시 청산 위험이 있습니다."
              : "LTV 비율이 높은 편입니다. 담보 비율을 주의깊게 모니터링하세요."}
          </AlertDescription>
        </Alert>
      )}

      {/* Liquidation Info */}
      <Card className="p-6 bg-muted/30">
        <div className="flex items-start gap-3">
          <TrendingDown className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold mb-2">청산 안내</h4>
            <p className="text-sm text-muted-foreground">
              담보 가치가 ₩{liquidationPrice.toLocaleString()} 이하로 떨어지면 자동으로 청산됩니다. 청산을 방지하려면
              담보를 추가하거나 대출을 상환하세요.
            </p>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1 bg-transparent">
          이전
        </Button>
        <Button onClick={() => onConfirm(loanAmount)} className="flex-1">
          대출 실행
        </Button>
      </div>
    </div>
  )
}
