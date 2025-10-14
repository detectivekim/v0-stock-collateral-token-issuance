"use client"

import { useAuth } from "@/lib/mock-auth-provider"
import { NavBar } from "@/components/dashboard/nav-bar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Copy, CheckCircle2, QrCode } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ReceivePage() {
  const { authenticated, user } = useAuth()
  const router = useRouter()
  const [copied, setCopied] = useState(false)

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
            <h1 className="text-3xl font-bold mb-2">받기</h1>
            <p className="text-muted-foreground">토큰을 받을 주소를 공유하세요</p>
          </div>

          <Card className="p-8">
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="h-64 w-64 rounded-xl bg-muted/30 flex items-center justify-center border-2 border-dashed border-border">
                  <div className="text-center">
                    <QrCode className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">QR 코드</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">지갑 주소</label>
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
                    주소가 복사되었습니다
                  </p>
                )}
              </div>

              <Button onClick={handleCopy} className="w-full" size="lg">
                <Copy className="h-4 w-4 mr-2" />
                주소 복사
              </Button>
            </div>
          </Card>

          <Card className="p-6 mt-6">
            <h3 className="font-semibold mb-4">지원 토큰</h3>
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
            <AlertDescription>
              이 주소로 KRW1, ETH, USDT 등의 토큰을 받을 수 있습니다. 다른 네트워크의 토큰을 전송하지 마세요.
            </AlertDescription>
          </Alert>
        </div>
      </main>
    </div>
  )
}
