"use client"

import { useTranslation } from "@/lib/i18n-provider"
import { NavBar } from "@/components/dashboard/nav-bar"
import { AssetsList } from "@/components/dashboard/assets-list"
import { StocksList } from "@/components/dashboard/stocks-list"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { useEffect, useState } from "react"
import { useAppState } from "@/store/app-state"

export default function DashboardPage() {
  const { t } = useTranslation()
  const { tokens, stockAccounts, initializeAssets, refreshPrices } = useAppState()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      console.log("[v0] Initializing dashboard assets...")
      try {
        await initializeAssets()
        console.log("[v0] Assets initialized successfully")
        setIsLoading(false)
      } catch (error) {
        console.error("[v0] Failed to initialize assets:", error)
        setIsLoading(false)
      }
    }
    init()

    // Refresh prices every minute
    const interval = setInterval(refreshPrices, 60000)
    return () => clearInterval(interval)
  }, [initializeAssets, refreshPrices])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  const cryptoAssets = tokens.reduce((sum, token) => sum + token.value, 0)
  const stockAssets = stockAccounts.reduce((sum, account) => sum + account.totalValue, 0)

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">{t("dashboard.title")}</h2>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="p-6 rounded-lg border bg-card">
              <p className="text-sm text-muted-foreground mb-2">{t("dashboard.cryptoAssets")}</p>
              <p className="text-3xl font-bold">₩{cryptoAssets.toLocaleString()}</p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <p className="text-sm text-muted-foreground mb-2">{t("dashboard.stockAssets")}</p>
              <p className="text-3xl font-bold">₩{stockAssets.toLocaleString()}</p>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">{t("dashboard.tokens")}</h2>
              <AssetsList />
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">{t("dashboard.stocks")}</h2>
              <StocksList />
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">{t("dashboard.quickActions")}</h2>
              <QuickActions />
            </div>

            <div>
              <RecentTransactions />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
