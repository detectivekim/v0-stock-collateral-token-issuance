"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import useSWR from "swr"
import type { Portfolio } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n-provider"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function PortfolioOverview() {
  const { data: portfolio, isLoading } = useSWR<Portfolio>("/api/portfolio", fetcher)
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-4 bg-muted rounded w-24 mb-2" />
            <div className="h-8 bg-muted rounded w-32" />
          </Card>
        ))}
      </div>
    )
  }

  if (!portfolio) return null

  const getHealthFactorStyles = (hf: number) => {
    if (hf >= 2) {
      return {
        textColor: "text-accent",
        borderColor: "border-accent",
        status: "safe",
      }
    } else if (hf >= 1.5) {
      return {
        textColor: "text-yellow-500",
        borderColor: "border-yellow-500",
        status: "warning",
      }
    } else {
      return {
        textColor: "text-destructive",
        borderColor: "border-destructive",
        status: "danger",
      }
    }
  }

  const healthStyles = getHealthFactorStyles(portfolio.healthFactor)

  return (
    <div className="grid md:grid-cols-4 gap-4">
      {/* Total Value */}
      <Card className="p-6 bg-gradient-to-br from-card to-accent/5 border-accent/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">{t("dashboard.totalAssets")}</span>
          <TrendingUp className="h-4 w-4 text-accent" />
        </div>
        <div className="text-3xl font-bold">₩{portfolio.totalValue.toLocaleString()}</div>
        <div className="text-xs text-accent mt-1">+2.3% {t("dashboard.today")}</div>
      </Card>

      {/* Collateral */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">{t("dashboard.collateralValue")}</span>
        </div>
        <div className="text-3xl font-bold">₩{portfolio.collateralValue.toLocaleString()}</div>
        <div className="text-xs text-muted-foreground mt-1">{t("dashboard.stockCollateral")}</div>
      </Card>

      {/* Loans */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">{t("dashboard.loanAmount")}</span>
        </div>
        <div className="text-3xl font-bold">₩{portfolio.loanValue.toLocaleString()}</div>
        <div className="text-xs text-muted-foreground mt-1">{t("dashboard.krw1Token")}</div>
      </Card>

      {/* Health Factor */}
      <Card className={cn("p-6 border-2", healthStyles.borderColor)}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">{t("dashboard.healthFactor")}</span>
          <span className={cn("text-xs font-semibold px-2 py-1 rounded-full", healthStyles.textColor)}>
            {t(`dashboard.${healthStyles.status}`)}
          </span>
        </div>
        <div className={cn("text-3xl font-bold", healthStyles.textColor)}>{portfolio.healthFactor.toFixed(2)}</div>
        <div className="text-xs text-muted-foreground mt-1">
          {t("dashboard.liquidationPrice")}: ₩{portfolio.liquidationPrice.toLocaleString()}
        </div>
      </Card>
    </div>
  )
}
