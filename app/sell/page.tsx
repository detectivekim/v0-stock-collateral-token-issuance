"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SellPage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/buy")
  }, [router])

  return null
}
