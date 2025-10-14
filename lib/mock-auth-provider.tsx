"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface MockUser {
  id: string
  email: string
  walletAddress: string
}

interface MockAuthContextType {
  authenticated: boolean
  ready: boolean // Added ready state
  user: MockUser | null
  login: () => void
  logout: () => void
}

const MockAuthContext = createContext<MockAuthContextType | undefined>(undefined)

export function MockAuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false)
  const [ready, setReady] = useState(false) // Initialize ready state
  const [user, setUser] = useState<MockUser | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem("mockUser")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setAuthenticated(true)
    }
    setReady(true)
  }, [])

  const login = () => {
    const mockUser: MockUser = {
      id: "user-" + Date.now(),
      email: "demo@seesawfinance.com",
      walletAddress: "0x" + Math.random().toString(16).substring(2, 42),
    }
    localStorage.setItem("mockUser", JSON.stringify(mockUser))
    setUser(mockUser)
    setAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem("mockUser")
    setUser(null)
    setAuthenticated(false)
  }

  return (
    <MockAuthContext.Provider value={{ authenticated, ready, user, login, logout }}>
      {children}
    </MockAuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(MockAuthContext)
  if (!context) {
    throw new Error("useAuth must be used within MockAuthProvider")
  }
  return context
}

export function usePrivy() {
  return useAuth()
}
