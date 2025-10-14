"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, ArrowUpRight, RefreshCw, TrendingUp } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">빠른 실행</h3>
      <div className="grid grid-cols-2 gap-3">
        <Link href="/borrow">
          <Button variant="outline" className="w-full gap-2 h-auto py-4 flex-col bg-transparent">
            <Plus className="h-5 w-5 text-accent" />
            <span className="font-semibold">대출하기</span>
            <span className="text-xs text-muted-foreground">KRW1 발행</span>
          </Button>
        </Link>

        <Link href="/repay">
          <Button variant="outline" className="w-full gap-2 h-auto py-4 flex-col bg-transparent">
            <ArrowUpRight className="h-5 w-5 text-accent" />
            <span className="font-semibold">상환하기</span>
            <span className="text-xs text-muted-foreground">대출 상환</span>
          </Button>
        </Link>

        <Link href="/buy">
          <Button variant="outline" className="w-full gap-2 h-auto py-4 flex-col bg-transparent">
            <RefreshCw className="h-5 w-5 text-accent" />
            <span className="font-semibold">스왑</span>
            <span className="text-xs text-muted-foreground">토큰 교환</span>
          </Button>
        </Link>

        <Link href="/sell">
          <Button variant="outline" className="w-full gap-2 h-auto py-4 flex-col bg-transparent">
            <TrendingUp className="h-5 w-5 text-accent" />
            <span className="font-semibold">거래</span>
            <span className="text-xs text-muted-foreground">Perp DEX</span>
          </Button>
        </Link>
      </div>
    </Card>
  )
}
