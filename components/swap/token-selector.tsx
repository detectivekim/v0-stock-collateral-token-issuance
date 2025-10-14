"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { useState } from "react"
import type { Token } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface TokenSelectorProps {
  tokens: Token[]
  selectedToken: Token | null
  onSelect: (token: Token) => void
  label: string
}

export function TokenSelector({ tokens, selectedToken, onSelect, label }: TokenSelectorProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-between h-auto py-3 bg-transparent">
          {selectedToken ? (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center text-lg">
                {selectedToken.icon}
              </div>
              <div className="text-left">
                <div className="font-semibold">{selectedToken.symbol}</div>
                <div className="text-xs text-muted-foreground">{selectedToken.name}</div>
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground">{label}</span>
          )}
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>토큰 선택</DialogTitle>
          <DialogDescription>스왑할 토큰을 선택하세요</DialogDescription>
        </DialogHeader>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {tokens.map((token) => (
            <button
              key={token.symbol}
              onClick={() => {
                onSelect(token)
                setOpen(false)
              }}
              className="w-full p-4 rounded-lg hover:bg-muted transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-xl">
                  {token.icon}
                </div>
                <div className="text-left">
                  <div className="font-semibold">{token.symbol}</div>
                  <div className="text-sm text-muted-foreground">{token.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{token.balance.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">₩{token.value.toLocaleString()}</div>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
