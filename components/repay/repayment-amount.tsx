"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"
import type { Loan } from "@/lib/types"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import useSWR from "swr"
import type { Token } from "@/lib/types"

interface RepaymentAmountProps {
  loan: Loan
  method: "krw1" | "swap" | "liquidate" | "deposit"
  onConfirm: (amount: number) => void
  onBack: () => void
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function RepaymentAmount({ loan, method, onConfirm, onBack }: RepaymentAmountProps) {
  const { data: tokens } = useSWR<Token[]>("/api/tokens", fetcher)
  const accruedInterest = (loan.loanAmount * loan.interestRate * 0.01 * 180) / 365
  const totalOwed = loan.loanAmount + accruedInterest

  const [repayAmount, setRepayAmount] = useState(totalOwed)
  const [customAmount, setCustomAmount] = useState("")
  const [selectedToken, setSelectedToken] = useState<string>("ETH")

  const krw1Balance = tokens?.find((t) => t.symbol === "KRW1")?.balance || 0
  const selectedTokenBalance = tokens?.find((t) => t.symbol === selectedToken)?.balance || 0

  const handleSliderChange = (value: number[]) => {
    setRepayAmount(value[0])
    setCustomAmount("")
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    const amount = Number.parseFloat(value.replace(/,/g, ""))
    if (!isNaN(amount) && amount <= totalOwed) {
      setRepayAmount(amount)
    }
  }

  const isFullRepayment = repayAmount >= totalOwed
  const remainingDebt = totalOwed - repayAmount

  const canRepay =
    method === "krw1"
      ? krw1Balance >= repayAmount
      : method === "swap"
        ? selectedTokenBalance > 0
        : method === "liquidate"
          ? loan.collateralValue >= repayAmount
          : true

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">상환 금액 설정</h3>
        <p className="text-sm text-muted-foreground">
          {method === "krw1" && "KRW1 토큰으로 상환할 금액을 입력하세요"}
          {method === "swap" && "스왑할 토큰과 금액을 선택하세요"}
          {method === "liquidate" && "청산할 주식 금액을 설정하세요"}
          {method === "deposit" && "입금받을 KRW1 금액을 입력하세요"}
        </p>
      </div>

      {/* Loan Summary */}
      <Card className="p-6 bg-muted/30">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">원금</div>
            <div className="text-lg font-semibold">₩{loan.loanAmount.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">누적 이자</div>
            <div className="text-lg font-semibold text-yellow-500">₩{accruedInterest.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">총 상환 금액</div>
            <div className="text-lg font-bold text-accent">₩{totalOwed.toLocaleString()}</div>
          </div>
        </div>
      </Card>

      {/* Token Selection for Swap */}
      {method === "swap" && (
        <Card className="p-6">
          <h4 className="font-semibold mb-4">스왑할 토큰 선택</h4>
          <div className="grid grid-cols-3 gap-3">
            {tokens
              ?.filter((t) => t.symbol !== "KRW1")
              .map((token) => (
                <button
                  key={token.symbol}
                  onClick={() => setSelectedToken(token.symbol)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedToken === token.symbol
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-accent/50 bg-transparent"
                  }`}
                >
                  <div className="text-2xl mb-2">{token.icon}</div>
                  <div className="font-semibold text-sm">{token.symbol}</div>
                  <div className="text-xs text-muted-foreground">{token.balance.toLocaleString()}</div>
                </button>
              ))}
          </div>
        </Card>
      )}

      {/* Amount Input */}
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">상환 금액</label>
            <Input
              type="text"
              value={customAmount || `₩${repayAmount.toLocaleString()}`}
              onChange={(e) => handleCustomAmountChange(e.target.value)}
              className="text-2xl font-bold h-14"
              placeholder="₩0"
            />
            <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
              <span>최소: ₩{(totalOwed * 0.1).toLocaleString()}</span>
              <span>최대: ₩{totalOwed.toLocaleString()}</span>
            </div>
          </div>

          <div>
            <Slider
              value={[repayAmount]}
              onValueChange={handleSliderChange}
              max={totalOwed}
              min={totalOwed * 0.1}
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
                  setRepayAmount((totalOwed * percent) / 100)
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

      {/* Repayment Details */}
      <Card className="p-6">
        <h4 className="font-semibold mb-4">상환 상세</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">상환 금액</span>
            <span className="font-semibold">₩{repayAmount.toLocaleString()}</span>
          </div>

          {!isFullRepayment && (
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">남은 부채</span>
              <span className="font-semibold text-yellow-500">₩{remainingDebt.toLocaleString()}</span>
            </div>
          )}

          {method === "liquidate" && (
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">청산 수수료 (2%)</span>
              <span className="font-semibold text-destructive">₩{(repayAmount * 0.02).toLocaleString()}</span>
            </div>
          )}

          <div className="flex items-center justify-between py-2">
            <span className="text-muted-foreground">상환 후 담보 가치</span>
            <span className="font-semibold text-accent">
              ₩{(method === "liquidate" ? loan.collateralValue - repayAmount : loan.collateralValue).toLocaleString()}
            </span>
          </div>
        </div>
      </Card>

      {/* Warnings */}
      {!canRepay && method === "krw1" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>KRW1 잔액이 부족합니다. 현재 잔액: ₩{krw1Balance.toLocaleString()}</AlertDescription>
        </Alert>
      )}

      {isFullRepayment && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>전액 상환 시 담보가 즉시 해제됩니다.</AlertDescription>
        </Alert>
      )}

      {method === "liquidate" && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>주식 청산 시 2%의 수수료가 발생하며, 시장가로 매도됩니다.</AlertDescription>
        </Alert>
      )}

      {method === "deposit" && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            외부 지갑에서 KRW1을 입금받은 후 상환을 진행하세요. 입금 주소는 다음 단계에서 확인할 수 있습니다.
          </AlertDescription>
        </Alert>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1 bg-transparent">
          이전
        </Button>
        <Button onClick={() => onConfirm(repayAmount)} disabled={!canRepay} className="flex-1">
          {method === "deposit" ? "입금 주소 확인" : "상환 실행"}
        </Button>
      </div>
    </div>
  )
}
