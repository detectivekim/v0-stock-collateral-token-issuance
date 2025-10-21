"use client"

import { Card } from "@/components/ui/card"
import { useTranslation } from "@/lib/i18n-provider"
import { useAppState } from "@/store/app-state"
import Image from "next/image"

export function StocksList() {
  const { t } = useTranslation()
  const { stockAccounts } = useAppState()

  if (!stockAccounts || stockAccounts.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground text-center">{t("dashboard.noStocks")}</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {stockAccounts.map((account) => (
        <Card key={account.id} className="p-6">
          <div className="flex items-center justify-between mb-4 pb-4 border-b">
            <div>
              <h3 className="font-semibold text-lg">{account.brokerage}</h3>
              <p className="text-sm text-muted-foreground">{account.accountNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">{t("dashboard.totalValue")}</p>
              <p className="text-xl font-bold">₩{account.totalValue.toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-3">
            {account.stocks.map((stock) => (
              <div
                key={stock.symbol}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-background border flex items-center justify-center overflow-hidden">
                    {stock.imageUrl ? (
                      <Image
                        src={stock.imageUrl || "/placeholder.svg"}
                        alt={stock.name}
                        width={40}
                        height={40}
                        className="object-contain"
                        unoptimized
                      />
                    ) : (
                      <span className="text-sm font-bold text-primary">{stock.name.substring(0, 2)}</span>
                    )}
                  </div>

                  <div>
                    <p className="font-semibold">{stock.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {stock.symbol} · {stock.quantity} {t("dashboard.shares")}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold">₩{stock.totalValue.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">
                    ₩{stock.currentPrice.toLocaleString()} / {t("dashboard.share")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  )
}
