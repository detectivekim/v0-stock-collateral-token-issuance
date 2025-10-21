"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useTranslation } from "@/lib/i18n-provider"
import { useAppState } from "@/store/app-state"
import Image from "next/image"

export function AssetsList() {
  const { tokens } = useAppState()
  const { t } = useTranslation()
  const [selectedNetwork, setSelectedNetwork] = useState<string>("all")

  const networks = ["all", "ethereum", "polygon", "arbitrum"]
  const networkLabels: Record<string, string> = {
    all: "All Networks",
    ethereum: "Ethereum",
    polygon: "Polygon",
    arbitrum: "Arbitrum",
  }

  const filteredTokens = tokens?.filter((token) => selectedNetwork === "all" || token.network === selectedNetwork)

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {networks.map((network) => (
          <Button
            key={network}
            variant={selectedNetwork === network ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedNetwork(network)}
            className="whitespace-nowrap"
          >
            {networkLabels[network]}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredTokens?.map((token) => (
          <div
            key={token.symbol}
            className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center overflow-hidden">
                  {token.imageUrl ? (
                    <Image
                      src={token.imageUrl || "/placeholder.svg"}
                      alt={token.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <span className="text-xl">{token.icon}</span>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-background border-2 border-card flex items-center justify-center text-[10px]">
                  {token.networkIcon}
                </div>
              </div>
              <div>
                <div className="font-semibold">{token.symbol}</div>
                <div className="text-sm text-muted-foreground">{token.name}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold">₩{token.value.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">
                {token.balance.toLocaleString()} {token.symbol}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
