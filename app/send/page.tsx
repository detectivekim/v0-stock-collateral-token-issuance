"use client"

import { useAuth } from "@/lib/mock-auth-provider"
import { NavBar } from "@/components/dashboard/nav-bar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import type { Token } from "@/lib/types"
import { TokenSelector } from "@/components/swap/token-selector"
import { Send, AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function SendPage() {
  const { authenticated, user } = useAuth()
  const router = useRouter()
  const { data: tokens } = useSWR<Token[]>("/api/tokens", fetcher)

  const [selectedToken, setSelectedToken] = useState<Token | null>(null)
  const [amount, setAmount] = useState("")
  const [recipientAddress, setRecipientAddress] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [sendSuccess, setSendSuccess] = useState(false)

  useEffect(() => {
    if (!authenticated) {
      router.push("/")
    }
  }, [authenticated, router])

  useEffect(() => {
    if (tokens && tokens.length > 0) {
      setSelectedToken(tokens[0])
    }
  }, [tokens])

  if (!authenticated) {
    return null
  }

  const handleAmountChange = (value: string) => {
    const numValue = value.replace(/[^0-9.]/g, "")
    setAmount(numValue)
  }

  const handleSend = async () => {
    if (!selectedToken || !amount || !recipientAddress) return

    setIsSending(true)

    const response = await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: selectedToken.symbol,
        amount: Number.parseFloat(amount),
        recipient: recipientAddress,
      }),
    })

    if (response.ok) {
      setSendSuccess(true)
      setTimeout(() => {
        setSendSuccess(false)
        setAmount("")
        setRecipientAddress("")
      }, 3000)
    }

    setIsSending(false)
  }

  const hasInsufficientBalance = selectedToken && amount && Number.parseFloat(amount) > selectedToken.balance

  const isValidAddress = recipientAddress.length >= 10

  const canSend = selectedToken && amount && recipientAddress && !hasInsufficientBalance && isValidAddress

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">전송</h1>
            <p className="text-muted-foreground">토큰을 다른 지갑으로 전송하세요</p>
          </div>

          <Card className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">토큰 선택</label>
                <TokenSelector
                  tokens={tokens || []}
                  selectedToken={selectedToken}
                  onSelect={setSelectedToken}
                  label="토큰 선택"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">전송 금액</label>
                <Card className="p-4 bg-muted/30">
                  <Input
                    type="text"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder="0.0"
                    className="text-2xl font-bold h-14 bg-transparent border-0 focus-visible:ring-0"
                  />
                  {selectedToken && (
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-muted-foreground">잔액: {selectedToken.balance.toLocaleString()}</span>
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-accent"
                        onClick={() => setAmount(selectedToken.balance.toString())}
                      >
                        최대
                      </Button>
                    </div>
                  )}
                </Card>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">받는 주소</label>
                <Input
                  type="text"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  placeholder="0x..."
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">받는 사람의 지갑 주소를 입력하세요</p>
              </div>

              {selectedToken && amount && recipientAddress && (
                <Card className="p-4 bg-muted/30">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">전송 금액</span>
                      <span className="font-medium">
                        {amount} {selectedToken.symbol}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">예상 수수료</span>
                      <span className="font-medium">₩{(Number.parseFloat(amount) * 0.001).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="text-muted-foreground">총 금액</span>
                      <span className="font-semibold">
                        {(Number.parseFloat(amount) * 1.001).toFixed(6)} {selectedToken.symbol}
                      </span>
                    </div>
                  </div>
                </Card>
              )}

              {hasInsufficientBalance && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>잔액이 부족합니다</AlertDescription>
                </Alert>
              )}

              {recipientAddress && !isValidAddress && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>올바른 주소를 입력하세요</AlertDescription>
                </Alert>
              )}

              {sendSuccess && (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>전송이 완료되었습니다!</AlertDescription>
                </Alert>
              )}

              <Button onClick={handleSend} disabled={!canSend || isSending} className="w-full" size="lg">
                <Send className="h-4 w-4 mr-2" />
                {isSending ? "전송 중..." : "전송"}
              </Button>
            </div>
          </Card>

          <Alert className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>전송한 토큰은 되돌릴 수 없습니다. 받는 주소를 다시 한번 확인하세요.</AlertDescription>
          </Alert>
        </div>
      </main>
    </div>
  )
}
