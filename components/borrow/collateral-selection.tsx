"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { useAppState } from "@/store/app-state"
import { TrendingUp, Building2 } from "lucide-react"
import { useTranslation } from "@/lib/i18n-provider"
import Image from "next/image"

interface CollateralSelectionProps {
  onNext: (selectedAccounts: string[]) => void
}

export function CollateralSelection({ onNext }: CollateralSelectionProps) {
  const { t } = useTranslation()
  const stockAccounts = useAppState((state) => state.stockAccounts)
  const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(new Set())

  const toggleAccount = (accountId: string) => {
    const newSelected = new Set(selectedAccounts)
    if (newSelected.has(accountId)) {
      newSelected.delete(accountId)
    } else {
      newSelected.add(accountId)
    }
    setSelectedAccounts(newSelected)
  }

  const calculateTotalValue = () => {
    let total = 0
    stockAccounts.forEach((account) => {
      if (selectedAccounts.has(account.id)) {
        total += account.totalValue
      }
    })
    return total
  }

  const handleNext = () => {
    onNext(Array.from(selectedAccounts))
  }

  const totalValue = calculateTotalValue()
  const maxLoanAmount = totalValue * 0.7

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-accent" />
          <h3 className="text-lg font-semibold">{t("borrow.selectCollateral")}</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-6">{t("borrow.selectCollateralDesc")}</p>

        <div className="space-y-4">
          {stockAccounts.map((account) => {
            const isSelected = selectedAccounts.has(account.id)

            return (
              <div
                key={account.id}
                className={`p-6 rounded-lg border-2 transition-all cursor-pointer ${
                  isSelected ? "border-accent bg-accent/5" : "border-border hover:border-accent/50 bg-transparent"
                }`}
                onClick={() => toggleAccount(account.id)}
              >
                <div className="flex items-start gap-4">
                  <Checkbox checked={isSelected} onCheckedChange={() => toggleAccount(account.id)} />

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-semibold text-lg">{account.brokerage}</div>
                        <div className="text-sm text-muted-foreground">{account.accountNumber}</div>
                      </div>
                    </div>

                    {/* Stock list in the account */}
                    <div className="space-y-2 mt-4 pl-8">
                      {account.stocks.map((stock) => (
                        <div key={stock.symbol} className="flex items-center gap-3 py-2">
                          {stock.imageUrl && (
                            <Image
                              src={stock.imageUrl || "/placeholder.svg"}
                              alt={stock.name}
                              width={24}
                              height={24}
                              className="rounded"
                              unoptimized
                            />
                          )}
                          <div className="flex-1">
                            <div className="text-sm font-medium">{stock.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {stock.quantity}
                              {t("common.shares")} × ₩{stock.currentPrice.toLocaleString()}
                            </div>
                          </div>
                          <div className="text-sm font-semibold">₩{stock.totalValue.toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-muted-foreground mb-1">{t("common.totalValue")}</div>
                    <div className="text-xl font-bold">₩{account.totalValue.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {selectedAccounts.size === 0 && (
          <div className="mt-6 p-4 bg-muted/30 rounded-lg text-center text-sm text-muted-foreground">
            {t("borrow.selectAccountWarning")}
          </div>
        )}
      </Card>

      {/* Summary */}
      <Card className="p-6 bg-accent/5 border-accent/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">{t("borrow.selectedCollateralValue")}</div>
            <div className="text-3xl font-bold mt-1">₩{totalValue.toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">{t("borrow.maxLoanAmount")}</div>
            <div className="text-2xl font-bold text-accent mt-1">₩{maxLoanAmount.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-1">(LTV 70%)</div>
          </div>
        </div>
      </Card>

      <Button onClick={handleNext} disabled={selectedAccounts.size === 0} className="w-full" size="lg">
        {t("common.next")}
      </Button>
    </div>
  )
}
