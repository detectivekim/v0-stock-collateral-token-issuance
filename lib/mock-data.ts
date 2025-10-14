// Mock data for development
import type { StockAccount, Token, Transaction, Loan, Portfolio } from "./types"

export const mockStockAccounts: StockAccount[] = [
  {
    id: "1",
    brokerage: "삼성증권",
    accountNumber: "1234-5678-9012",
    totalValue: 15000000,
    stocks: [
      {
        symbol: "005930",
        name: "삼성전자",
        quantity: 100,
        currentPrice: 70000,
        totalValue: 7000000,
      },
      {
        symbol: "000660",
        name: "SK하이닉스",
        quantity: 50,
        currentPrice: 160000,
        totalValue: 8000000,
      },
    ],
  },
  {
    id: "2",
    brokerage: "미래에셋증권",
    accountNumber: "9876-5432-1098",
    totalValue: 8000000,
    stocks: [
      {
        symbol: "035420",
        name: "NAVER",
        quantity: 40,
        currentPrice: 200000,
        totalValue: 8000000,
      },
    ],
  },
]

export const mockTokens: Token[] = [
  {
    symbol: "KRW1",
    name: "Korean Won Stablecoin",
    balance: 30000000,
    value: 30000000,
    icon: "₩",
    network: "ethereum",
    networkIcon: "🔷",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    balance: 2.5,
    value: 12500000,
    icon: "Ξ",
    network: "ethereum",
    networkIcon: "🔷",
  },
  {
    symbol: "USDT",
    name: "Tether",
    balance: 5000,
    value: 6500000,
    icon: "₮",
    network: "ethereum",
    networkIcon: "🔷",
  },
  {
    symbol: "MATIC",
    name: "Polygon",
    balance: 10000,
    value: 8000000,
    icon: "⬡",
    network: "polygon",
    networkIcon: "🟣",
  },
  {
    symbol: "ARB",
    name: "Arbitrum",
    balance: 5000,
    value: 4500000,
    icon: "🔵",
    network: "arbitrum",
    networkIcon: "🔵",
  },
]

export const mockTransactions: Transaction[] = [
  {
    id: "1",
    userId: "user1",
    type: "borrow",
    amount: 30000000,
    token: "KRW1",
    timestamp: new Date("2025-01-10"),
    status: "completed",
  },
  {
    id: "2",
    userId: "user1",
    type: "swap",
    amount: 10000000,
    token: "ETH",
    timestamp: new Date("2025-01-09"),
    status: "completed",
  },
  {
    id: "3",
    userId: "user1",
    type: "collateral_add",
    amount: 15000000,
    token: "KRW",
    timestamp: new Date("2025-01-08"),
    status: "completed",
  },
]

export const mockLoans: Loan[] = [
  {
    id: "1",
    userId: "user1",
    collateralValue: 23000000,
    loanAmount: 30000000,
    interestRate: 5.5,
    startDate: new Date("2025-01-10"),
    dueDate: new Date("2025-07-10"),
    status: "active",
    collateralAccounts: ["1"], // 삼성증권 계좌
    collateralTokens: ["ETH"], // ETH도 담보로 사용
  },
]

export const mockPortfolio: Portfolio = {
  userId: "user1",
  totalValue: 72000000, // 주식 23M + 토큰 49M
  collateralValue: 23000000,
  loanValue: 30000000,
  healthFactor: 1.77, // (23M + 49M) / 30M = 2.4
  liquidationPrice: 33000000, // 청산 가격
}
