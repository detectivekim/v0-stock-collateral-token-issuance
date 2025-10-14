"use client"

import { useAuth } from "@/lib/mock-auth-provider"
import { NavBar } from "@/components/dashboard/nav-bar"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LoanSelector } from "@/components/repay/loan-selector"
import { RepaymentMethod } from "@/components/repay/repayment-method"
import { RepaymentAmount } from "@/components/repay/repayment-amount"
import type { Loan } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type Step = "select" | "method" | "amount" | "success"

export default function RepayPage() {
  const { authenticated } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState<Step>("select")
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null)
  const [repaymentMethod, setRepaymentMethod] = useState<"krw1" | "swap" | "liquidate" | "deposit" | null>(null)
  const [repayAmount, setRepayAmount] = useState(0)

  useEffect(() => {
    if (!authenticated) {
      router.push("/")
    }
  }, [authenticated, router])

  if (!authenticated) {
    return null
  }

  const handleLoanSelect = (loan: Loan) => {
    setSelectedLoan(loan)
    setStep("method")
  }

  const handleMethodSelect = (method: "krw1" | "swap" | "liquidate" | "deposit") => {
    setRepaymentMethod(method)
    setStep("amount")
  }

  const handleRepayConfirm = async (amount: number) => {
    setRepayAmount(amount)

    const response = await fetch("/api/repay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        loanId: selectedLoan?.id,
        amount,
        method: repaymentMethod,
      }),
    })

    if (response.ok) {
      setStep("success")
    }
  }

  const steps = [
    { id: "select", label: "대출 선택" },
    { id: "method", label: "방법 선택" },
    { id: "amount", label: "금액 설정" },
    { id: "success", label: "완료" },
  ]

  const currentStepIndex = steps.findIndex((s) => s.id === step)

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">대출 상환</h1>
            <p className="text-muted-foreground">대출을 상환하고 담보를 회수하세요</p>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((s, index) => (
                <div key={s.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                        index <= currentStepIndex
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {index < currentStepIndex ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
                    </div>
                    <div className="text-sm mt-2 font-medium">{s.label}</div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-2 rounded transition-colors ${
                        index < currentStepIndex ? "bg-accent" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {step === "select" && <LoanSelector onSelect={handleLoanSelect} />}

          {step === "method" && selectedLoan && (
            <RepaymentMethod loan={selectedLoan} onMethodSelect={handleMethodSelect} onBack={() => setStep("select")} />
          )}

          {step === "amount" && selectedLoan && repaymentMethod && (
            <RepaymentAmount
              loan={selectedLoan}
              method={repaymentMethod}
              onConfirm={handleRepayConfirm}
              onBack={() => setStep("method")}
            />
          )}

          {step === "success" && (
            <Card className="p-12 text-center">
              <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-8 w-8 text-accent" />
              </div>
              <h2 className="text-2xl font-bold mb-2">상환이 완료되었습니다!</h2>
              <p className="text-muted-foreground mb-8">₩{repayAmount.toLocaleString()}이 상환되었습니다</p>

              <div className="grid md:grid-cols-2 gap-4 max-w-md mx-auto">
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full bg-transparent">
                    대시보드로
                  </Button>
                </Link>
                <Link href="/portfolio">
                  <Button className="w-full">포트폴리오 보기</Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
