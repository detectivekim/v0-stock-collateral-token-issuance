"use client"

import { usePrivy } from "@privy-io/react-auth"
import { useTranslation } from "@/lib/i18n-provider"
import { NavBar } from "@/components/dashboard/nav-bar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import type { Token } from "@/lib/types"
import { ChevronRight, TrendingUp, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const generateChartData = (basePrice: number) => {
  const data = []
  const now = Date.now()
  for (let i = 23; i >= 0; i--) {
    const variance = (Math.random() - 0.5) * basePrice * 0.1
    data.push({
      time: new Date(now - i * 60 * 60 * 1000).toLocaleTimeString("en-US", { hour: "2-digit" }),
      price: basePrice + variance,
    })
  }
  return data
}

export default function TradePage() {
  const { authenticated, ready } = usePrivy()
  const { t } = useTranslation()
  const router = useRouter()
  const { data: tokens } = useSWR<Token[]>("/api/tokens", fetcher)

  const [selectedToken, setSelectedToken] = useState<Token | null>(null)
  const [amount, setAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [tradeSuccess, setTradeSuccess] = useState<"buy" | "sell" | null>(null)
  const [showTokenSelector, setShowTokenSelector] = useState(false)

  const paymentToken = tokens?.find((t) => t.symbol === "KRW1")

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/")
    }
  }, [authenticated, ready, router])

  useEffect(() => {
    if (tokens && tokens.length > 0) {
      setSelectedToken(tokens.find((t) => t.symbol === "ETH") || tokens[0])
    }
  }, [tokens])

  if (!ready || !authenticated) {
    return null
  }

  const handleAmountChange = (value: string) => {
    const cleaned = value.replace(/[^\d.]/g, "")
    setAmount(cleaned)
  }

  const estimatedBuyQuantity =
    selectedToken && amount && paymentToken ? (Number.parseFloat(amount) / selectedToken.value).toFixed(6) : "0"

  const estimatedSellAmount =
    selectedToken && amount ? (Number.parseFloat(amount) * selectedToken.value).toFixed(0) : "0"

  const hasInsufficientBalanceForBuy = paymentToken && amount && Number.parseFloat(amount) > paymentToken.balance

  const hasInsufficientBalanceForSell = selectedToken && amount && Number.parseFloat(amount) > selectedToken.balance

  const canBuy = selectedToken && amount && Number.parseFloat(amount) > 0 && !hasInsufficientBalanceForBuy
  const canSell = selectedToken && amount && Number.parseFloat(amount) > 0 && !hasInsufficientBalanceForSell

  const handleTrade = async (type: "buy" | "sell") => {
    if ((type === "buy" && !canBuy) || (type === "sell" && !canSell)) return

    setIsProcessing(true)

    await fetch("/api/swap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fromToken: type === "buy" ? "KRW1" : selectedToken?.symbol,
        toToken: type === "buy" ? selectedToken?.symbol : "KRW1",
        amount: Number.parseFloat(amount),
      }),
    })

    setTradeSuccess(type)
    setTimeout(() => {
      setTradeSuccess(null)
      setAmount("")
    }, 2000)

    setIsProcessing(false)
  }

  const chartData = selectedToken ? generateChartData(selectedToken.value) : []

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {!showTokenSelector ? (
            <Card
              className="p-4 mb-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setShowTokenSelector(true)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {selectedToken ? (
                    <>
                      <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                        <span className="text-xl font-bold">{selectedToken.symbol[0]}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-lg">{selectedToken.name}</div>
                        <div className="text-sm text-muted-foreground">{selectedToken.symbol}</div>
                      </div>
                    </>
                  ) : (
                    <div className="text-muted-foreground">Select token</div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-2xl font-bold">₩{selectedToken?.value.toLocaleString()}</div>
                    <div className="text-sm text-accent flex items-center gap-1 justify-end">
                      <TrendingUp className="h-3 w-3" />
                      +2.5%
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-4 mb-4">
              <div className="space-y-2">
                <div className="text-sm font-medium mb-3">{t("trade.selectToken")}</div>
                {tokens
                  ?.filter((t) => t.symbol !== "KRW1")
                  .map((token) => (
                    <div
                      key={token.symbol}
                      className="p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedToken(token)
                        setShowTokenSelector(false)
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                            <span className="text-lg font-bold">{token.symbol[0]}</span>
                          </div>
                          <div>
                            <div className="font-semibold">{token.name}</div>
                            <div className="text-sm text-muted-foreground">{token.symbol}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">₩{token.value.toLocaleString()}</div>
                          <div className="text-sm text-accent flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            +2.5%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          )}

          <Card className="p-6 mb-4">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={["auto", "auto"]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`₩${value.toLocaleString()}`, "Price"]}
                />
                <Line type="monotone" dataKey="price" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 mb-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">{t("trade.amount")}</label>
                <div className="relative">
                  <Input
                    type="text"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder={t("trade.enterAmount")}
                    className="text-4xl font-bold h-auto py-4 border-0 focus-visible:ring-0 bg-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t("trade.krw1Balance")}:</span>
                    <span className="ml-2 font-medium">₩{paymentToken?.balance.toLocaleString() || "0"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {selectedToken?.symbol} {t("trade.balance")}:
                    </span>
                    <span className="ml-2 font-medium">{selectedToken?.balance.toFixed(6) || "0"}</span>
                  </div>
                </div>
              </div>

              {selectedToken && amount && (
                <div className="pt-4 border-t space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t("trade.buyYouGet")}</span>
                    <span className="font-semibold text-accent">
                      {estimatedBuyQuantity} {selectedToken.symbol}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t("trade.sellYouGet")}</span>
                    <span className="font-semibold text-destructive">
                      ₩{Number(estimatedSellAmount).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {(hasInsufficientBalanceForBuy || hasInsufficientBalanceForSell) && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                {hasInsufficientBalanceForBuy && t("trade.insufficientKRW1")}
                {hasInsufficientBalanceForSell && t("trade.insufficientToken")}
              </AlertDescription>
            </Alert>
          )}

          {tradeSuccess && (
            <Alert className="mb-4 border-accent">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              <AlertDescription>
                {tradeSuccess === "buy" ? t("trade.buySuccess") : t("trade.sellSuccess")}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => handleTrade("buy")}
              disabled={!canBuy || isProcessing}
              className="h-14 text-lg font-semibold bg-accent hover:bg-accent/90"
              size="lg"
            >
              {isProcessing ? t("trade.processing") : `${t("trade.buy")} ${selectedToken?.symbol || ""}`}
            </Button>

            <Button
              onClick={() => handleTrade("sell")}
              disabled={!canSell || isProcessing}
              className="h-14 text-lg font-semibold bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              size="lg"
            >
              {isProcessing ? t("trade.processing") : `${t("trade.sell")} ${selectedToken?.symbol || ""}`}
            </Button>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-muted/30">
            <div className="text-sm text-muted-foreground space-y-2">
              <div className="flex items-center justify-between">
                <span>{t("trade.fee")}</span>
                <span>0.3%</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
