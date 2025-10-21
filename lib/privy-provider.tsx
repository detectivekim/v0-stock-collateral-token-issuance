"use client"

import type React from "react"
import { PrivyProvider } from "@privy-io/react-auth"
import { useEffect } from "react"
import { mainnet, base } from "viem/chains"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    console.log("[v0] Privy App ID:", "cmgq7boke000rjs0cun5ww5t6")
    console.log("[v0] Privy config:", {
      loginMethods: ["email", "wallet"],
      supportedChains: ["mainnet", "base"],
    })

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Log Privy errors for debugging
      if (
        event.reason?.message?.includes("auth.privy.io") ||
        event.reason?.message?.includes("TimeoutError") ||
        event.reason?.code === "api_error"
      ) {
        console.error("[v0] Privy error:", event.reason)
        event.preventDefault()
      }
    }

    window.addEventListener("unhandledrejection", handleUnhandledRejection)
    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    }
  }, [])

  return (
    <PrivyProvider
      appId="cmgq7boke000rjs0cun5ww5t6"
      config={{
        loginMethods: ["email", "wallet"],
        appearance: {
          theme: "dark",
          accentColor: "#00D395",
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
        supportedChains: [mainnet, base],
      }}
      onSuccess={(user) => {
        console.log("[v0] Privy login success:", user)
      }}
    >
      {children}
    </PrivyProvider>
  )
}
