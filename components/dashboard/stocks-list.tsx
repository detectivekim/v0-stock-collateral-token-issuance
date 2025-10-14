"use client"

import { Card } from "@/components/ui/card"
import { useTranslation } from "@/lib/i18n-provider"
import useSWR from "swr"
import type { StockAccount } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function StocksList() {
  const { t } = useTranslation()
  const { data: accounts, error } = useSWR<StockAccount[]>("/api/stock-accounts", fetcher)

  if (error) {
    return (
      <Card className="p-6">
        <p className="text-destructive">{t("common.error")}</p>
      </Card>
    )
  }

  if (!accounts) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {accounts.map((account) => (
        <Card key={account.id} className="p-6">
          {/* Account Header */}
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

          {/* Stocks List */}
          <div className="space-y-3">
            {account.stocks.map((stock) => (
              <div
                key={stock.symbol}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* Stock Icon */}
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{stock.name.substring(0, 2)}</span>
                  </div>

                  {/* Stock Info */}
                  <div>
                    <p className="font-semibold">{stock.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {stock.symbol} · {stock.quantity} {t("dashboard.shares")}
                    </p>
                  </div>
                </div>

                {/* Stock Value */}
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
