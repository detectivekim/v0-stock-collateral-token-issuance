"use client"

import { Card } from "@/components/ui/card"
import useSWR from "swr"
import type { Transaction } from "@/lib/types"
import { ArrowUpRight, ArrowDownLeft, RefreshCw, Plus } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const transactionIcons = {
  borrow: Plus,
  repay: ArrowDownLeft,
  collateral_add: Plus,
  swap: RefreshCw,
  send: ArrowUpRight,
  receive: ArrowDownLeft,
}

const transactionLabels = {
  borrow: "대출",
  repay: "상환",
  collateral_add: "담보 추가",
  swap: "스왑",
  send: "전송",
  receive: "수신",
}

export function RecentTransactions() {
  const { data: transactions } = useSWR<Transaction[]>("/api/transactions", fetcher)

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">최근 거래</h3>
      <div className="space-y-3">
        {transactions?.map((tx) => {
          const Icon = transactionIcons[tx.type]
          const label = transactionLabels[tx.type]

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
