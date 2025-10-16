"use client"

import { usePrivy } from "@privy-io/react-auth"
import { NavBar } from "@/components/dashboard/nav-bar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Copy, CheckCircle2, QrCode } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTranslation } from "@/lib/i18n-provider"

export default function ReceivePage() {
  const { authenticated, user } = usePrivy()
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    if (!authenticated) {
      router.push("/")
    }
  }, [authenticated, router])

  if (!authenticated) {
    return null
  }

  const walletAddress = user?.walletAddress || "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{t("receive.title")}</h1>
            <p className="text-muted-foreground">{t("receive.subtitle")}</p>
          </div>

          <Card className="p-8">
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="h-64 w-64 rounded-xl bg-muted/30 flex items-center justify-center border-2 border-dashed border-border">
                  <div className="text-center">
                    <QrCode className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">{t("receive.qr")}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t("receive.address")}</label>
                <Card className="p-4 bg-muted/30">
                  <div className="flex items-center gap-3">
                    <code className="flex-1 text-sm font-mono break-all">{walletAddress}</code>
                    <Button variant="ghost" size="icon" onClick={handleCopy} className="flex-shrink-0">
                      {copied ? <CheckCircle2 className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </Card>
                {copied && (
                  <p className="text-xs text-accent flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    {t("receive.addressCopied")}
                  </p>
                )}
              </div>

              <Button onClick={handleCopy} className="w-full" size="lg">
                <Copy className="h-4 w-4 mr-2" />
                {t("receive.copy")}
              </Button>
            </div>
          </Card>

          <Card className="p-6 mt-6">
            <h3 className="font-semibold mb-4">{t("receive.supportedTokens")}</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { symbol: "KRW1", icon: "₩" },
                { symbol: "ETH", icon: "Ξ" },
                { symbol: "USDT", icon: "₮" },
              ].map((token) => (
                <div key={token.symbol} className="p-3 rounded-lg bg-muted/30 text-center">
                  <div className="text-2xl mb-1">{token.icon}</div>
                  <div className="text-sm font-medium">{token.symbol}</div>
                </div>
              ))}
            </div>
          </Card>

          <Alert className="mt-6">
            <AlertDescription>{t("receive.warning")}</AlertDescription>
          </Alert>
        </div>
      </main>
    </div>
  )
}
