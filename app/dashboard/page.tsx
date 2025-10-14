"use client"

import { usePrivy } from "@/lib/mock-auth-provider"
import { useTranslation } from "@/lib/i18n-provider"
import { NavBar } from "@/components/dashboard/nav-bar"
import { AssetsList } from "@/components/dashboard/assets-list"
import { StocksList } from "@/components/dashboard/stocks-list"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { authenticated, ready } = usePrivy()
  const { t } = useTranslation()
  const router = useRouter()

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/")
    }
  }, [authenticated, ready, router])

  if (!ready || !authenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Asset Overview */}
        <section>
          <h2 className="text-2xl font-bold mb-4">{t("dashboard.title")}</h2>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="p-6 rounded-lg border bg-card">
              <p className="text-sm text-muted-foreground mb-2">{t("dashboard.cryptoAssets")}</p>
              <p className="text-3xl font-bold">₩45,230,000</p>
              <p className="text-sm text-green-500 mt-1">+12.5%</p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <p className="text-sm text-muted-foreground mb-2">{t("dashboard.stockAssets")}</p>
              <p className="text-3xl font-bold">₩28,500,000</p>
              <p className="text-sm text-red-500 mt-1">-2.3%</p>
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
