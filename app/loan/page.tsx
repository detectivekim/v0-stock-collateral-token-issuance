"use client"

import { usePrivy } from "@privy-io/react-auth"
import { NavBar } from "@/components/dashboard/nav-bar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppState } from "@/store/app-state"
import { useTranslation } from "@/lib/i18n-provider"
import { TrendingUp, Plus, ArrowRight, AlertTriangle, Info } from "lucide-react"

export default function LoanPage() {
  const { authenticated, ready } = usePrivy()
  const router = useRouter()
  const { t } = useTranslation()

  const {
    tokens,
    stockAccounts,
    loans,
    collateral,
    getTotalCollateralValue,
    getTotalBorrowedValue,
    getHealthFactor,
    getCurrentInterestRate,
    refreshPrices,
  } = useAppState()

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/")
    }
  }, [authenticated, ready, router])

  useEffect(() => {
    const interval = setInterval(() => {
      refreshPrices()
    }, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [refreshPrices])

  if (!ready || !authenticated) {
    return null
  }

  const totalCollateral = getTotalCollateralValue()
  const totalBorrowed = getTotalBorrowedValue()
  const healthFactor = getHealthFactor()
  const currentInterestRate = getCurrentInterestRate()
  const liquidationThreshold = 0.9 // 90%
  const ltv = totalCollateral > 0 ? totalBorrowed / totalCollateral : 0

  const cryptoCollateralValue = collateral.filter((c) => c.type === "crypto").reduce((sum, c) => sum + c.value, 0)

  const stockCollateralValue = collateral.filter((c) => c.type === "stock").reduce((sum, c) => sum + c.value, 0)

  const activeLoans = loans.filter((l) => l.status === "active")

  const calculateAccruedInterest = (loan: (typeof loans)[0]) => {
    const startDate = new Date(loan.startDate)
    const daysSinceStart = Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    return (loan.loanAmount * loan.interestRate * daysSinceStart) / 365 / 100
  }

  const totalAccruedInterest = activeLoans.reduce((sum, loan) => sum + calculateAccruedInterest(loan), 0)

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t("loan.title")}</h1>
          <p className="text-muted-foreground">{t("loan.subtitle")}</p>
        </div>

        {ltv > 0.8 && (
          <Card className="p-4 bg-orange-500/10 border-orange-500">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <div className="font-semibold text-orange-500">청산 위험 경고</div>
                <div className="text-sm text-muted-foreground mt-1">
                  담보 비율이 90%에 도달하면 청산이 시작됩니다. 암호화폐가 먼저 청산되며, 암호화폐가 부족할 경우 주식 장
                  시작 전에 담보를 추가하거나 대출을 상환해야 합니다.
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Active Loans section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">{t("loan.activeLoans")}</h2>
            <Button onClick={() => router.push("/borrow")} className="bg-accent hover:bg-accent/90">
              <TrendingUp className="h-4 w-4 mr-2" />
              {t("loan.newLoan")}
            </Button>
          </div>

          {activeLoans.length > 0 ? (
            <div className="space-y-4">
              {activeLoans.map((loan) => {
                const accruedInterest = calculateAccruedInterest(loan)
                const totalRepayment = loan.loanAmount + accruedInterest
                const loanLTV = loan.loanAmount / loan.collateralValue
                const liquidationPrice = loan.loanAmount / liquidationThreshold

                return (
                  <Card key={loan.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-sm text-muted-foreground">{t("loan.issuedKRW1")}</div>
                        <div className="text-2xl font-bold">₩{loan.loanAmount.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {t("loan.collateralValue")}: ₩{loan.collateralValue.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          {t("loan.healthFactor")}
                          <div className="group relative">
                            <Info className="h-3 w-3 cursor-help" />
                            <div className="absolute right-0 top-6 w-64 p-3 bg-popover border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                              <div className="text-xs text-left">
                                <div className="font-semibold mb-1">청산 기준</div>
                                <div className="text-muted-foreground">
                                  • LTV 70%까지 대출 가능
                                  <br />• LTV 90% 도달 시 청산 시작
                                  <br />• 암호화폐 우선 청산
                                  <br />• 주식은 장 시작 전 경고
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`text-xl font-semibold ${healthFactor < 1.2 ? "text-red-500" : healthFactor < 1.5 ? "text-orange-500" : "text-accent"}`}
                        >
                          {healthFactor.toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">LTV: {(loanLTV * 100).toFixed(1)}%</div>
                      </div>
                    </div>

                    <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                      <div className="text-sm font-medium mb-2">{t("loan.collateralAssets")}</div>
                      <div className="space-y-1">
                        {loan.collateralAccounts?.map((accountId) => {
                          const account = stockAccounts.find((a) => a.id === accountId)
                          if (!account) return null
                          return (
                            <div key={accountId} className="text-sm flex items-center justify-between">
                              <span className="text-muted-foreground">
                                {account.brokerage} ({account.accountNumber})
                              </span>
                              <span className="font-medium">₩{account.totalValue.toLocaleString()}</span>
                            </div>
                          )
                        })}
                        {loan.collateralTokens?.map((symbol) => {
                          const token = tokens.find((t) => t.symbol === symbol)
                          const collateralItem = collateral.find((c) => c.id === symbol)
                          if (!token || !collateralItem) return null
                          return (
                            <div key={symbol} className="text-sm flex items-center justify-between">
                              <span className="text-muted-foreground">
                                {token.name} ({collateralItem.amount} {symbol})
                              </span>
                              <span className="font-medium">₩{collateralItem.value.toLocaleString()}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          {t("loan.interest")}
                          <div className="group relative">
                            <Info className="h-3 w-3 cursor-help" />
                            <div className="absolute left-0 top-6 w-64 p-3 bg-popover border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                              <div className="text-xs">
                                <div className="font-semibold mb-1">이자율 모델</div>
                                <div className="text-muted-foreground">
                                  AAVE 스타일 Utilization Rate 기반으로 이자율이 변동됩니다. 대출 사용률이 높을수록
                                  이자율이 상승합니다.
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="font-semibold">{loan.interestRate.toFixed(2)}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">{t("loan.accruedInterest")}</div>
                        <div className="font-semibold text-orange-500">₩{accruedInterest.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">{t("loan.liquidationPrice")}</div>
                        <div className="font-semibold text-red-500">₩{liquidationPrice.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={() => router.push("/repay")} className="flex-1">
                        {t("loan.repay")} (₩{totalRepayment.toLocaleString()})
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <div className="text-muted-foreground mb-4">{t("loan.noLoans")}</div>
              <p className="text-sm text-muted-foreground mb-6">{t("loan.noLoansDesc")}</p>
              <Button onClick={() => router.push("/borrow")} className="bg-accent hover:bg-accent/90">
                <TrendingUp className="h-4 w-4 mr-2" />
                {t("loan.newLoan")}
              </Button>
            </Card>
          )}
        </section>

        {/* Collateral Status */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">{t("loan.collateralStatus")}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-2">{t("loan.totalCollateral")}</div>
              <div className="text-3xl font-bold">₩{totalCollateral.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground mt-2">
                {t("loan.healthFactor")}: {healthFactor === Number.POSITIVE_INFINITY ? "∞" : healthFactor.toFixed(2)}
              </div>
            </Card>

            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-2">{t("loan.cryptoCollateral")}</div>
              <div className="text-2xl font-bold">₩{cryptoCollateralValue.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground mt-2">
                {collateral.filter((c) => c.type === "crypto").length} {t("loan.tokens")}
              </div>
            </Card>

            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-2">{t("loan.stockCollateral")}</div>
              <div className="text-2xl font-bold">₩{stockCollateralValue.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground mt-2">
                {collateral.filter((c) => c.type === "stock").length} {t("loan.accounts")}
              </div>
            </Card>
          </div>
        </section>

        {/* Collateral Details Section */}
        <section>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{t("loan.collateralAccountDetails")}</h3>
              <Button onClick={() => router.push("/borrow")} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                {t("loan.addCollateral")}
              </Button>
            </div>

            {collateral.length === 0 ? (
              <Card className="p-6 text-center text-muted-foreground">
                <p>{t("loan.noCollateralAccounts")}</p>
              </Card>
            ) : (
              <>
                {/* Stock collateral */}
                {collateral
                  .filter((c) => c.type === "stock")
                  .map((item) => {
                    const account = stockAccounts.find((a) => a.id === item.id)
                    if (!account) return null

                    const linkedLoan = activeLoans.find((loan) => loan.collateralAccounts?.includes(item.id))

                    return (
                      <Card key={item.id} className="p-4 border-accent">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{account.brokerage}</span>
                              <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                                {t("loan.inUse")}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground">{account.accountNumber}</div>
                            {linkedLoan && (
                              <div className="text-sm text-accent mt-1">
                                → KRW1 ₩{linkedLoan.loanAmount.toLocaleString()} {t("loan.issued")}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">₩{item.value.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">{account.stocks.length}개 종목</div>
                          </div>
                        </div>
                      </Card>
                    )
                  })}

                {/* Crypto collateral */}
                {collateral
                  .filter((c) => c.type === "crypto")
                  .map((item) => {
                    const token = tokens.find((t) => t.symbol === item.id)
                    if (!token) return null

                    const linkedLoan = activeLoans.find((loan) => loan.collateralTokens?.includes(item.id))

                    return (
                      <Card key={item.id} className="p-4 border-accent">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{token.name}</span>
                              <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                                {t("loan.inUse")}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {item.amount} {item.id}
                            </div>
                            {linkedLoan && (
                              <div className="text-sm text-accent mt-1">
                                → KRW1 ₩{linkedLoan.loanAmount.toLocaleString()} {t("loan.usedForIssuance")}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">₩{item.value.toLocaleString()}</div>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
