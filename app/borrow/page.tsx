"use client"

import { usePrivy } from "@privy-io/react-auth"
import { NavBar } from "@/components/dashboard/nav-bar"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { BrokerageConsent } from "@/components/borrow/brokerage-consent"
import { CollateralSelection } from "@/components/borrow/collateral-selection"
import { LoanConfiguration } from "@/components/borrow/loan-configuration"
import { Card } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAppState } from "@/store/app-state"

type Step = "consent" | "selection" | "configuration" | "success"

export default function BorrowPage() {
  const { authenticated } = usePrivy()
  const router = useRouter()
  const stockAccounts = useAppState((state) => state.stockAccounts)
  const createLoan = useAppState((state) => state.createLoan)
  const addStockCollateral = useAppState((state) => state.addStockCollateral)
  const [step, setStep] = useState<Step>("consent")
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([])
  const [loanAmount, setLoanAmount] = useState(0)

  useEffect(() => {
    if (!authenticated) {
      router.push("/")
    }
  }, [authenticated, router])

  if (!authenticated) {
    return null
  }

  const collateralValue = selectedAccountIds.reduce((sum, accountId) => {
    const account = stockAccounts.find((acc) => acc.id === accountId)
    return sum + (account?.totalValue || 0)
  }, 0)

  const handleConsentComplete = () => {
    setStep("selection")
  }

  const handleCollateralSelected = (accountIds: string[]) => {
    console.log("[v0] Collateral selected:", accountIds)
    setSelectedAccountIds(accountIds)
    setStep("configuration")
  }

  const handleLoanConfirm = async (amount: number) => {
    console.log("[v0] Executing loan:", { amount, selectedAccountIds, collateralValue })

    setLoanAmount(amount)

    try {
      // Add selected stock accounts as collateral
      selectedAccountIds.forEach((accountId) => {
        console.log("[v0] Adding collateral:", accountId)
        addStockCollateral(accountId)
      })

      // Create the loan
      console.log("[v0] Creating loan with amount:", amount)
      createLoan(amount)

      console.log("[v0] Loan created successfully")
      setStep("success")
    } catch (error) {
      console.error("[v0] Failed to create loan:", error)
    }
  }

  const steps = [
    { id: "consent", label: "약관 동의" },
    { id: "selection", label: "담보 선택" },
    { id: "configuration", label: "대출 설정" },
    { id: "success", label: "완료" },
  ]

  const currentStepIndex = steps.findIndex((s) => s.id === step)

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">대출하기</h1>
            <p className="text-muted-foreground">주식을 담보로 KRW1 토큰을 발행하세요</p>
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

          {step === "consent" && <BrokerageConsent onComplete={handleConsentComplete} />}

          {step === "selection" && <CollateralSelection onNext={handleCollateralSelected} />}

          {step === "configuration" && (
            <LoanConfiguration
              collateralValue={collateralValue}
              onConfirm={handleLoanConfirm}
              onBack={() => setStep("selection")}
            />
          )}

          {step === "success" && (
            <Card className="p-12 text-center">
              <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-8 w-8 text-accent" />
              </div>
              <h2 className="text-2xl font-bold mb-2">대출이 완료되었습니다!</h2>
              <p className="text-muted-foreground mb-8">
                ₩{loanAmount.toLocaleString()} KRW1 토큰이 지갑에 입금되었습니다
              </p>

              <div className="grid md:grid-cols-2 gap-4 max-w-md mx-auto">
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full bg-transparent">
                    대시보드로
                  </Button>
                </Link>
                <Link href="/buy">
                  <Button className="w-full">스왑하기</Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
