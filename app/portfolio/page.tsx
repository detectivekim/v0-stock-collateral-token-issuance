"use client"

import { usePrivy } from "@/lib/mock-auth-provider"
import { NavBar } from "@/components/dashboard/nav-bar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import type { Token, StockAccount, Loan, Portfolio } from "@/lib/types"
import { useTranslation } from "@/lib/i18n-provider"
import { TrendingUp, Plus, ArrowRight } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function LoanPage() {
  const { authenticated, ready } = usePrivy()
  const router = useRouter()
  const { data: tokens } = useSWR<Token[]>("/api/tokens", fetcher)
  const { data: stockAccounts } = useSWR<StockAccount[]>("/api/stock-accounts", fetcher)
  const { data: loans } = useSWR<Loan[]>("/api/loans", fetcher)
  const { data: portfolio } = useSWR<Portfolio>("/api/portfolio", fetcher)
  const { t } = useTranslation()

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/")
    }
  }, [authenticated, ready, router])

  if (!ready || !authenticated) {
    return null
  }

  const cryptoCollateral = tokens?.reduce((sum, token) => sum + token.value, 0) || 0
  const stockCollateral = stockAccounts?.reduce((sum, account) => sum + account.totalValue, 0) || 0
  const totalCollateral = cryptoCollateral + stockCollateral

  const calculateAccruedInterest = (loan: Loan) => {
    const startDate = new Date(loan.startDate)
    const daysSinceStart = Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    return (loan.loanAmount * loan.interestRate * daysSinceStart) / 365 / 100
  }

  const totalAccruedInterest = loans?.reduce((sum, loan) => sum + calculateAccruedInterest(loan), 0) || 0
  const dailyInterest = loans?.reduce((sum, loan) => sum + (loan.loanAmount * loan.interestRate) / 365 / 100, 0) || 0

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t("loan.title")}</h1>
          <p className="text-muted-foreground">{t("loan.subtitle")}</p>
        </div>

        <section>
          <h2 className="text-2xl font-semibold mb-4">{t("loan.collateralStatus")}</h2>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-2">{t("loan.totalCollateral")}</div>
              <div className="text-3xl font-bold">₩{totalCollateral.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground mt-2">
                {t("loan.healthFactor")}: {portfolio?.healthFactor.toFixed(2) || "N/A"}
              </div>
            </Card>

            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-2">{t("loan.cryptoCollateral")}</div>
              <div className="text-3xl font-bold">₩{cryptoCollateral.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground mt-2">{tokens?.length || 0}개 토큰</div>
            </Card>

            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-2">{t("loan.stockCollateral")}</div>
              <div className="text-3xl font-bold">₩{stockCollateral.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground mt-2">{stockAccounts?.length || 0}개 계좌</div>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">담보 계좌 상세</h3>
            {stockAccounts?.map((account) => {
              const isUsedAsCollateral = loans?.some((loan) => loan.collateralAccounts?.includes(account.id))
              const linkedLoan = loans?.find((loan) => loan.collateralAccounts?.includes(account.id))

              return (
                <Card key={account.id} className={`p-4 ${isUsedAsCollateral ? "border-accent" : ""}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{account.brokerage}</span>
                        {isUsedAsCollateral && (
                          <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">담보 사용 중</span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">{account.accountNumber}</div>
                      {linkedLoan && (
                        <div className="text-sm text-accent mt-1">
                          → KRW1 ₩{linkedLoan.loanAmount.toLocaleString()} 발행됨
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">₩{account.totalValue.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">{account.stocks.length}개 종목</div>
                    </div>
                  </div>
                </Card>
              )
            })}

            {tokens && tokens.length > 0 && (
              <>
                <h3 className="text-lg font-semibold mt-6">담보 암호화폐</h3>
                {tokens
                  .filter((token) => token.symbol !== "KRW1")
                  .map((token) => {
                    const isUsedAsCollateral = loans?.some((loan) => loan.collateralTokens?.includes(token.symbol))
                    const linkedLoan = loans?.find((loan) => loan.collateralTokens?.includes(token.symbol))

                    return (
                      <Card key={token.symbol} className={`p-4 ${isUsedAsCollateral ? "border-accent" : ""}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{token.name}</span>
                              {isUsedAsCollateral && (
                                <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">담보 사용 중</span>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {token.balance} {token.symbol}
                            </div>
                            {linkedLoan && (
                              <div className="text-sm text-accent mt-1">
                                → KRW1 ₩{linkedLoan.loanAmount.toLocaleString()} 발행에 사용
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">₩{token.value.toLocaleString()}</div>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
              </>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">{t("loan.interestStatus")}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-2">{t("loan.dailyInterest")}</div>
              <div className="text-2xl font-bold">₩{dailyInterest.toLocaleString()}</div>
            </Card>

            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-2">{t("loan.totalInterest")}</div>
              <div className="text-2xl font-bold text-orange-500">₩{totalAccruedInterest.toLocaleString()}</div>
            </Card>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">{t("loan.activeLoans")}</h2>
            <div className="flex gap-2">
              <Button onClick={() => router.push("/borrow")} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                {t("loan.addCollateral")}
              </Button>
              <Button onClick={() => router.push("/borrow")} className="bg-accent hover:bg-accent/90">
                <TrendingUp className="h-4 w-4 mr-2" />
                {t("loan.newLoan")}
              </Button>
            </div>
          </div>

          {loans && loans.length > 0 ? (
            <div className="space-y-4">
              {loans.map((loan) => {
                const accruedInterest = calculateAccruedInterest(loan)
                const totalRepayment = loan.loanAmount + accruedInterest

                const loanCollateralAccounts = stockAccounts?.filter((account) =>
                  loan.collateralAccounts?.includes(account.id),
                )
                const loanCollateralTokens = tokens?.filter((token) => loan.collateralTokens?.includes(token.symbol))

                return (
                  <Card key={loan.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-sm text-muted-foreground">발행된 KRW1</div>
                        <div className="text-2xl font-bold">₩{loan.loanAmount.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          담보 가치: ₩{loan.collateralValue.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">{t("loan.healthFactor")}</div>
                        <div className="text-xl font-semibold text-accent">{portfolio?.healthFactor.toFixed(2)}</div>
                      </div>
                    </div>

                    {(loanCollateralAccounts && loanCollateralAccounts.length > 0) ||
                    (loanCollateralTokens && loanCollateralTokens.length > 0) ? (
                      <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                        <div className="text-sm font-medium mb-2">담보 자산</div>
                        <div className="space-y-1">
                          {loanCollateralAccounts?.map((account) => (
                            <div key={account.id} className="text-sm flex items-center justify-between">
                              <span className="text-muted-foreground">
                                {account.brokerage} ({account.accountNumber})
                              </span>
                              <span className="font-medium">₩{account.totalValue.toLocaleString()}</span>
                            </div>
                          ))}
                          {loanCollateralTokens?.map((token) => (
                            <div key={token.symbol} className="text-sm flex items-center justify-between">
                              <span className="text-muted-foreground">
                                {token.name} ({token.balance} {token.symbol})
                              </span>
                              <span className="font-medium">₩{token.value.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-muted-foreground">{t("loan.interest")}</div>
                        <div className="font-semibold">{loan.interestRate}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">{t("loan.accruedInterest")}</div>
                        <div className="font-semibold text-orange-500">₩{accruedInterest.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">{t("loan.dueDate")}</div>
                        <div className="font-semibold">{new Date(loan.dueDate).toLocaleDateString("ko-KR")}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">{t("loan.liquidationPrice")}</div>
                        <div className="font-semibold text-red-500">
                          ₩{portfolio?.liquidationPrice.toLocaleString()}
                        </div>
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
      </main>
    </div>
  )
}
