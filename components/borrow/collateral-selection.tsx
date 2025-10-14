"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import useSWR from "swr"
import type { StockAccount } from "@/lib/types"
import { TrendingUp } from "lucide-react"

interface CollateralSelectionProps {
  onNext: (selectedStocks: { accountId: string; stockSymbol: string; value: number }[]) => void
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function CollateralSelection({ onNext }: CollateralSelectionProps) {
  const { data: stockAccounts } = useSWR<StockAccount[]>("/api/stock-accounts", fetcher)
  const [selectedStocks, setSelectedStocks] = useState<Set<string>>(new Set())

  const toggleStock = (accountId: string, stockSymbol: string) => {
    const key = `${accountId}-${stockSymbol}`
    const newSelected = new Set(selectedStocks)
    if (newSelected.has(key)) {
      newSelected.delete(key)
    } else {
      newSelected.add(key)
    }
    setSelectedStocks(newSelected)
  }

  const calculateTotalValue = () => {
    let total = 0
    stockAccounts?.forEach((account) => {
      account.stocks.forEach((stock) => {
        if (selectedStocks.has(`${account.id}-${stock.symbol}`)) {
          total += stock.totalValue
        }
      })
    })
    return total
  }

  const handleNext = () => {
    const selected: { accountId: string; stockSymbol: string; value: number }[] = []
    stockAccounts?.forEach((account) => {
      account.stocks.forEach((stock) => {
        if (selectedStocks.has(`${account.id}-${stock.symbol}`)) {
          selected.push({
            accountId: account.id,
            stockSymbol: stock.symbol,
            value: stock.totalValue,
          })
        }
      })
    })
    onNext(selected)
  }

  const totalValue = calculateTotalValue()

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-accent" />
          <h3 className="text-lg font-semibold">담보 주식 선택</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-6">대출 담보로 사용할 주식을 선택하세요</p>

        <div className="space-y-6">
          {stockAccounts?.map((account) => (
            <div key={account.id} className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <div>
                  <div className="font-semibold">{account.brokerage}</div>
                  <div className="text-sm text-muted-foreground">{account.accountNumber}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">₩{account.totalValue.toLocaleString()}</div>
                </div>
              </div>

              <div className="space-y-2">
                {account.stocks.map((stock) => {
                  const key = `${account.id}-${stock.symbol}`
                  const isSelected = selectedStocks.has(key)

                  return (
                    <div
                      key={stock.symbol}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        isSelected ? "border-accent bg-accent/5" : "border-border hover:border-accent/50 bg-transparent"
                      }`}
                      onClick={() => toggleStock(account.id, stock.symbol)}
                    >
                      <Checkbox checked={isSelected} onCheckedChange={() => toggleStock(account.id, stock.symbol)} />
                      <div className="flex-1">
                        <div className="font-medium">{stock.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {stock.quantity}주 × ₩{stock.currentPrice.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">₩{stock.totalValue.toLocaleString()}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Summary */}
      <Card className="p-6 bg-accent/5 border-accent/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">선택한 담보 가치</div>
            <div className="text-3xl font-bold mt-1">₩{totalValue.toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">최대 대출 가능</div>
            <div className="text-2xl font-bold text-accent mt-1">₩{(totalValue * 3).toLocaleString()}</div>
          </div>
        </div>
      </Card>

      <Button onClick={handleNext} disabled={selectedStocks.size === 0} className="w-full" size="lg">
        다음 단계
      </Button>
    </div>
  )
}
