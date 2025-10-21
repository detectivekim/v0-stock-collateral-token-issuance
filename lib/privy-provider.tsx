"use client"

import type React from "react"
import { PrivyProvider } from "@privy-io/react-auth"
import { useEffect } from "react"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const msg = event.reason?.message?.toLowerCase() || ""
      const errorName = event.reason?.name?.toLowerCase() || ""
      if (
        msg.includes("auth.privy.io") ||
        msg.includes("timeout") ||
        msg.includes("cross-origin") ||
        msg.includes("ethereum") ||
        msg.includes("getprovider") ||
        msg.includes("blocked a frame") ||
        msg.includes("failed to read") ||
        msg.includes("securityerror") ||
        msg.includes("walletconnector") ||
        errorName === "securityerror" ||
        event.reason?.code === "api_error"
      ) {
        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()
      }
    }

    const handleError = (event: ErrorEvent) => {
      const msg = event.message?.toLowerCase() || ""
      const errorName = event.error?.name?.toLowerCase() || ""
      if (
        msg.includes("cross-origin") ||
        msg.includes("ethereum") ||
        msg.includes("getprovider") ||
        msg.includes("blocked a frame") ||
        msg.includes("failed to read") ||
        msg.includes("securityerror") ||
        msg.includes("walletconnector") ||
        errorName === "securityerror"
      ) {
        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()
        return false
      }
    }

    window.addEventListener("unhandledrejection", handleUnhandledRejection, true)
    window.addEventListener("error", handleError, true)

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection, true)
      window.removeEventListener("error", handleError, true)
    }
  }, [])

  return (
    <PrivyProvider
      appId="cmgq7boke000rjs0cun5ww5t6"
      config={{
        loginMethods: ["email"],
        appearance: {
          theme: "dark",
          accentColor: "#00D395",
        },
      }}
    >
      {children}
    </PrivyProvider>
  )
}
