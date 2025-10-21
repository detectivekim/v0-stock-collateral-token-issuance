// Core types for the application

export interface User {
  id: string
  email: string
  walletAddress: string
  createdAt: Date
}

export interface Portfolio {
  userId: string
  totalValue: number
  collateralValue: number
  loanValue: number
  healthFactor: number
  liquidationPrice: number
}

export interface StockAccount {
  id: string
  brokerage: string // 증권사
  accountNumber: string
  stocks: Stock[]
  totalValue: number
}

export interface Stock {
  symbol: string
  name: string
  quantity: number
  currentPrice: number
  totalValue: number
  imageUrl?: string // Added imageUrl field for stock logos
}

export interface Loan {
  id: string
  userId: string
  collateralValue: number
  loanAmount: number
  interestRate: number
  startDate: Date
  dueDate: Date
  status: "active" | "repaid" | "liquidated"
  collateralAccounts?: string[] // Array of stock account IDs used as collateral
  collateralTokens?: string[] // Array of token symbols used as collateral
}

export interface Token {
  symbol: string
  name: string
  balance: number
  value: number
  icon: string
  imageUrl?: string
  network: "ethereum" | "polygon" | "arbitrum" | "optimism" | "base"
  networkIcon: string
}

export interface Transaction {
  id: string
  userId: string
  type: "borrow" | "repay" | "collateral_add" | "swap" | "send" | "receive"
  amount: number
  token: string
  timestamp: Date
  status: "pending" | "completed" | "failed"
}
