"use client"

import type React from "react"

import { PrivyProvider } from "@privy-io/react-auth"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId="cmgq7boke000rjs0cun5ww5t6"
      config={{
        loginMethods: ["email", "google", "twitter"],
        appearance: {
          theme: "dark",
          accentColor: "#00D395",
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      {children}
    </PrivyProvider>
  )
}
