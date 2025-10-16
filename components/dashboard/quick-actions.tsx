"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, ArrowUpRight, RefreshCw, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/lib/i18n-provider"

export function QuickActions() {
  const { t } = useTranslation()

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{t("dashboard.quickActions")}</h3>
      <div className="grid grid-cols-2 gap-3">
        <Link href="/borrow">
          <Button variant="outline" className="w-full gap-2 h-auto py-4 flex-col bg-transparent">
            <Plus className="h-5 w-5 text-accent" />
            <span className="font-semibold">{t("dashboard.borrow")}</span>
            <span className="text-xs text-muted-foreground">{t("dashboard.issueKRW1")}</span>
          </Button>
        </Link>

        <Link href="/repay">
          <Button variant="outline" className="w-full gap-2 h-auto py-4 flex-col bg-transparent">
            <ArrowUpRight className="h-5 w-5 text-accent" />
            <span className="font-semibold">{t("dashboard.repay")}</span>
            <span className="text-xs text-muted-foreground">{t("dashboard.repayLoan")}</span>
          </Button>
        </Link>

        <Link href="/buy">
          <Button variant="outline" className="w-full gap-2 h-auto py-4 flex-col bg-transparent">
            <RefreshCw className="h-5 w-5 text-accent" />
            <span className="font-semibold">{t("dashboard.swap")}</span>
            <span className="text-xs text-muted-foreground">{t("dashboard.exchangeTokens")}</span>
          </Button>
        </Link>

        <Link href="/sell">
          <Button variant="outline" className="w-full gap-2 h-auto py-4 flex-col bg-transparent">
            <TrendingUp className="h-5 w-5 text-accent" />
            <span className="font-semibold">{t("dashboard.trade")}</span>
            <span className="text-xs text-muted-foreground">{t("dashboard.perpDex")}</span>
          </Button>
        </Link>
      </div>
    </Card>
  )
}
