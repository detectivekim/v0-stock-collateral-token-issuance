"use client"

import { Card } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownLeft, RefreshCw, Plus } from "lucide-react"
import { useTranslation } from "@/lib/i18n-provider"
import { useAppState } from "@/store/app-state"
import type { Transaction } from "@/lib/types"

const transactionIcons = {
  borrow: Plus,
  repay: ArrowDownLeft,
  collateral_add: Plus,
  swap: RefreshCw,
  send: ArrowUpRight,
  receive: ArrowDownLeft,
}

export function RecentTransactions() {
  const { t } = useTranslation()
  const { transactions } = useAppState()

  const getTransactionLabel = (type: Transaction["type"]) => {
    return t(`dashboard.txType.${type}`)
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{t("dashboard.recentTransactions")}</h3>
      <div className="space-y-3">
        {transactions?.slice(0, 5).map((tx) => {
          const Icon = transactionIcons[tx.type]
          const label = getTransactionLabel(tx.type)

          return (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <div className="font-medium">{label}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(tx.timestamp).toLocaleDateString("ko-KR", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">
                  {tx.type === "send" || tx.type === "repay" ? "-" : "+"}₩{tx.amount.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">{tx.token}</div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
