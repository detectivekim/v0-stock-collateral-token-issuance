"use client"

import { usePrivy } from "@privy-io/react-auth"
import { useTranslation } from "@/lib/i18n-provider"
import { NavBar } from "@/components/dashboard/nav-bar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppState } from "@/store/app-state"
import type { Token } from "@/lib/types"
import { ChevronRight, ArrowRightLeft } from "lucide-react"

const COINGECKO_IDS: Record<string, string> = {
  ETH: "ethereum",
  BTC: "bitcoin",
  USDT: "tether",
}

const TRADINGVIEW_SYMBOLS: Record<string, string> = {
  ETH: "BINANCE:ETHUSDT",
  BTC: "BINANCE:BTCUSDT",
  USDT: "BINANCE:USDTUSD",
}

const generateChartData = (basePrice: number) => {
  const data = []
  const now = Date.now()
  let currentPrice = basePrice

  for (let i = 23; i >= 0; i--) {
    // More realistic price movement with trend
    const trend = Math.sin(i / 4) * basePrice * 0.02
    const randomWalk = (Math.random() - 0.5) * basePrice * 0.015
    currentPrice = basePrice + trend + randomWalk

    data.push({
      time: new Date(now - i * 60 * 60 * 1000).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      price: Math.max(currentPrice, basePrice * 0.9), // Prevent negative prices
    })
  }
  return data
}

export default function TradePage() {
  const { authenticated, ready } = usePrivy()
  const { t } = useTranslation()
  const router = useRouter()
  const { tokens, buyToken } = useAppState()

  const [selectedToken, setSelectedToken] = useState<Token | null>(null)
  const [tokenAmount, setTokenAmount] = useState("")
  const [krwAmount, setKrwAmount] = useState("")
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

  useEffect(() => {
    console.log("[v0] Selected token:", selectedToken?.symbol)
  }, [selectedToken])

  const handleTokenAmountChange = (value: string) => {
    const cleaned = value.replace(/[^\d.]/g, "")
    setTokenAmount(cleaned)

    if (cleaned && selectedToken) {
      const krw = (Number.parseFloat(cleaned) * selectedToken.value).toFixed(0)
      setKrwAmount(krw)
    } else {
      setKrwAmount("")
    }
  }

  const handleKrwAmountChange = (value: string) => {
    const cleaned = value.replace(/[^\d.]/g, "")
    setKrwAmount(cleaned)

    if (cleaned && selectedToken) {
      const token = (Number.parseFloat(cleaned) / selectedToken.value).toFixed(6)
      setTokenAmount(token)
    } else {
      setTokenAmount("")
    }
  }

  const handleSwapAmounts = () => {
    const tempToken = tokenAmount
    const tempKrw = krwAmount
    setTokenAmount(tempKrw)
    setKrwAmount(tempToken)
  }

  const hasInsufficientBalanceForBuy = paymentToken && krwAmount && Number.parseFloat(krwAmount) > paymentToken.balance

  const hasInsufficientBalanceForSell =
    selectedToken && tokenAmount && Number.parseFloat(tokenAmount) > selectedToken.balance

  const canBuy = selectedToken && krwAmount && Number.parseFloat(krwAmount) > 0 && !hasInsufficientBalanceForBuy
  const canSell = selectedToken && tokenAmount && Number.parseFloat(tokenAmount) > 0 && !hasInsufficientBalanceForSell

  const handleTrade = async (type: "buy" | "sell") => {
    if ((type === "buy" && !canBuy) || (type === "sell" && !canSell)) return

    setIsProcessing(true)

    try {
      if (type === "buy") {
        buyToken("KRW1", selectedToken?.symbol || "", Number.parseFloat(krwAmount))
      } else {
        buyToken(selectedToken?.symbol || "", "KRW1", Number.parseFloat(tokenAmount))
      }

      setTradeSuccess(type)
      setTimeout(() => {
        setTradeSuccess(null)
        setTokenAmount("")
        setKrwAmount("")
      }, 2000)
    } catch (error) {
      console.error("[v0] Trade failed:", error)
    }

    setIsProcessing(false)
  }

  if (!ready || !authenticated) {
    return null
  }

  const coinGeckoId = selectedToken ? COINGECKO_IDS[selectedToken.symbol] || "ethereum" : "ethereum"

  const tradingViewSymbol = selectedToken
    ? TRADINGVIEW_SYMBOLS[selectedToken.symbol] || "BINANCE:ETHUSDT"
    : "BINANCE:ETHUSDT"

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
                      {selectedToken.imageUrl ? (
                        <img
                          src={selectedToken.imageUrl || "/placeholder.svg"}
                          alt={selectedToken.symbol}
                          className="h-12 w-12 rounded-full"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                          <span className="text-xl font-bold">{selectedToken.symbol[0]}</span>
                        </div>
                      )}
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
                        setTokenAmount("")
                        setKrwAmount("")
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {token.imageUrl ? (
                            <img
                              src={token.imageUrl || "/placeholder.svg"}
                              alt={token.symbol}
                              className="h-10 w-10 rounded-full"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                              <span className="text-lg font-bold">{token.symbol[0]}</span>
                            </div>
                          )}
                          <div>
                            <div className="font-semibold">{token.name}</div>
                            <div className="text-sm text-muted-foreground">{token.symbol}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">₩{token.value.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          )}

          <Card className="p-6 mb-4">
            <div className="mb-4">
              <div className="text-sm text-muted-foreground mb-1">{selectedToken?.symbol} Price Chart</div>
              <div className="text-2xl font-bold">₩{selectedToken?.value.toLocaleString()}</div>
            </div>
            <div className="w-full rounded-lg overflow-hidden bg-background" style={{ height: "400px" }}>
              <iframe
                src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview&symbol=${tradingViewSymbol}&interval=D&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=[]&theme=dark&style=1&timezone=Asia%2FSeoul&withdateranges=1&studies_overrides={}&overrides={}&enabled_features=[]&disabled_features=[]&locale=en&utm_source=localhost&utm_medium=widget_new&utm_campaign=chart&utm_term=${tradingViewSymbol}`}
                width="100%"
                height="100%"
                frameBorder="0"
                allowTransparency={true}
                scrolling="no"
                allowFullScreen={true}
                className="w-full h-full"
                title={`${selectedToken?.symbol} Price Chart`}
              />
            </div>
          </Card>

          <Card className="p-6 mb-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  {selectedToken?.symbol} {t("trade.amount")}
                </label>
                <Input
                  type="text"
                  value={tokenAmount}
                  onChange={(e) => handleTokenAmountChange(e.target.value)}
                  placeholder={`0.00 ${selectedToken?.symbol || ""}`}
                  className="text-2xl font-bold h-auto py-3"
                />
              </div>

              <div className="flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSwapAmounts}
                  className="rounded-full hover:bg-muted"
                  type="button"
                >
                  <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />
                </Button>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">KRW1 {t("trade.amount")}</label>
                <Input
                  type="text"
                  value={krwAmount}
                  onChange={(e) => handleKrwAmountChange(e.target.value)}
                  placeholder="₩0"
                  className="text-2xl font-bold h-auto py-3"
                />
              </div>

              <div className="flex items-center justify-between text-sm pt-2 border-t">
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t("trade.krw1Balance")}:</span>
                    <span className="font-medium">₩{paymentToken?.balance.toLocaleString() || "0"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {selectedToken?.symbol} {t("trade.balance")}:
                    </span>
                    <span className="font-medium">{selectedToken?.balance.toFixed(6) || "0"}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

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
