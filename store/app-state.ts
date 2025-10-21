import { create } from "zustand"
import type { Token, StockAccount, Loan, Transaction } from "@/lib/types"
import { getCoinData, getStockPrice, calculateInterestRate } from "@/lib/oracles"

interface CollateralItem {
  type: "stock" | "crypto"
  id: string // account ID for stocks, symbol for crypto
  amount?: number // for crypto only
  value: number
}

interface AppState {
  // Assets
  tokens: Token[]
  stockAccounts: StockAccount[]

  // Collateral
  collateral: CollateralItem[]

  // Loans
  loans: Loan[]

  // Transactions
  transactions: Transaction[]

  // Prices (cached)
  cryptoPrices: Record<string, number>
  stockPrices: Record<string, number>

  // Actions
  initializeAssets: () => Promise<void>
  refreshPrices: () => Promise<void>

  // Collateral actions
  addStockCollateral: (accountId: string) => void
  addCryptoCollateral: (symbol: string, amount: number) => void
  removeCollateral: (id: string) => void

  // Loan actions
  createLoan: (amount: number) => void
  repayLoan: (loanId: string, amount: number) => void

  // Trade actions
  buyToken: (fromSymbol: string, toSymbol: string, amount: number) => void

  // Calculations
  getTotalCollateralValue: () => number
  getTotalBorrowedValue: () => number
  getHealthFactor: () => number
  getLiquidationRatio: () => number
  getCurrentInterestRate: () => number
  getMaxBorrowAmount: () => number
}

export const useAppState = create<AppState>()((set, get) => ({
  tokens: [],
  stockAccounts: [],
  collateral: [],
  loans: [],
  transactions: [],
  cryptoPrices: {},
  stockPrices: {},

  initializeAssets: async () => {
    const btcData = await getCoinData("BTC")
    const ethData = await getCoinData("ETH")
    const usdtData = await getCoinData("USDT")

    set({
      tokens: [
        {
          symbol: "BTC",
          name: "Bitcoin",
          balance: 0.7,
          value: 0.7 * btcData.price,
          icon: "₿",
          imageUrl: btcData.imageUrl,
          network: "ethereum",
          networkIcon: "🔷",
        },
        {
          symbol: "ETH",
          name: "Ethereum",
          balance: 12,
          value: 12 * ethData.price,
          icon: "Ξ",
          imageUrl: ethData.imageUrl,
          network: "ethereum",
          networkIcon: "🔷",
        },
        {
          symbol: "USDT",
          name: "Tether",
          balance: 7700,
          value: 7700 * usdtData.price,
          icon: "₮",
          imageUrl: usdtData.imageUrl,
          network: "ethereum",
          networkIcon: "🔷",
        },
        {
          symbol: "KRW1",
          name: "Korean Won Stablecoin",
          balance: 0,
          value: 0,
          icon: "₩",
          imageUrl: "",
          network: "ethereum",
          networkIcon: "🔷",
        },
      ],
      stockAccounts: [
        {
          id: "samsung",
          brokerage: "삼성증권",
          accountNumber: "1234-5678-9012",
          stocks: [
            {
              symbol: "000660",
              name: "SK Hynix Inc",
              quantity: 50,
              currentPrice: getStockPrice("000660"),
              totalValue: 50 * getStockPrice("000660"),
              imageUrl: "https://logo.clearbit.com/skhynix.com", // Added SK Hynix logo
            },
            {
              symbol: "005930",
              name: "Samsung Electronics Co Ltd",
              quantity: 100,
              currentPrice: getStockPrice("005930"),
              totalValue: 100 * getStockPrice("005930"),
              imageUrl: "https://logo.clearbit.com/samsung.com", // Added Samsung logo
            },
          ],
          totalValue: 50 * getStockPrice("000660") + 100 * getStockPrice("005930"),
        },
        {
          id: "mirae",
          brokerage: "미래에셋증권",
          accountNumber: "9876-5432-1098",
          stocks: [
            {
              symbol: "035420",
              name: "Naver Corporation",
              quantity: 40,
              currentPrice: getStockPrice("035420"),
              totalValue: 40 * getStockPrice("035420"),
              imageUrl: "https://logo.clearbit.com/naver.com", // Added Naver logo
            },
            {
              symbol: "035720",
              name: "Kakao Corp",
              quantity: 30,
              currentPrice: getStockPrice("035720"),
              totalValue: 30 * getStockPrice("035720"),
              imageUrl: "https://logo.clearbit.com/kakao.com", // Added Kakao logo
            },
          ],
          totalValue: 40 * getStockPrice("035420") + 30 * getStockPrice("035720"),
        },
      ],
      cryptoPrices: {
        BTC: btcData.price,
        ETH: ethData.price,
        USDT: usdtData.price,
      },
      stockPrices: {
        "000660": getStockPrice("000660"),
        "005930": getStockPrice("005930"),
        "035420": getStockPrice("035420"),
        "035720": getStockPrice("035720"),
      },
    })
  },

  refreshPrices: async () => {
    const btcData = await getCoinData("BTC")
    const ethData = await getCoinData("ETH")
    const usdtData = await getCoinData("USDT")

    const state = get()

    set({
      cryptoPrices: {
        BTC: btcData.price,
        ETH: ethData.price,
        USDT: usdtData.price,
      },
      tokens: state.tokens.map((token) => {
        if (token.symbol === "KRW1") return token
        const prices: Record<string, number> = {
          BTC: btcData.price,
          ETH: ethData.price,
          USDT: usdtData.price,
        }
        const price = prices[token.symbol] || 0
        return {
          ...token,
          value: token.balance * price,
        }
      }),
      stockAccounts: state.stockAccounts.map((account) => ({
        ...account,
        stocks: account.stocks.map((stock) => {
          const price = getStockPrice(stock.symbol)
          return {
            ...stock,
            currentPrice: price,
            totalValue: stock.quantity * price,
          }
        }),
        totalValue: account.stocks.reduce((sum, s) => sum + s.quantity * getStockPrice(s.symbol), 0),
      })),
    })
  },

  addStockCollateral: (accountId) => {
    const state = get()
    const account = state.stockAccounts.find((a) => a.id === accountId)
    if (!account || state.collateral.some((c) => c.id === accountId)) return

    set({
      collateral: [
        ...state.collateral,
        {
          type: "stock" as const,
          id: accountId,
          value: account.totalValue,
        },
      ],
      transactions: [
        ...state.transactions,
        {
          id: `tx-${Date.now()}`,
          userId: "user1",
          type: "collateral_add",
          amount: account.totalValue,
          token: account.brokerage,
          timestamp: new Date(),
          status: "completed",
        },
      ],
    })
  },

  addCryptoCollateral: (symbol, amount) => {
    const state = get()
    const token = state.tokens.find((t) => t.symbol === symbol)
    if (!token || token.balance < amount) return

    const price = state.cryptoPrices[symbol] || 0
    const value = amount * price

    const existing = state.collateral.find((c) => c.id === symbol)

    set({
      collateral: existing
        ? state.collateral.map((c) =>
            c.id === symbol
              ? {
                  ...c,
                  amount: (c.amount || 0) + amount,
                  value: c.value + value,
                }
              : c,
          )
        : [
            ...state.collateral,
            {
              type: "crypto" as const,
              id: symbol,
              amount,
              value,
            },
          ],
      tokens: state.tokens.map((t) =>
        t.symbol === symbol
          ? {
              ...t,
              balance: t.balance - amount,
              value: (t.balance - amount) * price,
            }
          : t,
      ),
      transactions: [
        ...state.transactions,
        {
          id: `tx-${Date.now()}`,
          userId: "user1",
          type: "collateral_add",
          amount: value,
          token: symbol,
          timestamp: new Date(),
          status: "completed",
        },
      ],
    })
  },

  removeCollateral: (id) => {
    const state = get()
    const item = state.collateral.find((c) => c.id === id)
    if (!item) return

    set({
      collateral: state.collateral.filter((c) => c.id !== id),
      tokens:
        item.type === "crypto" && item.amount
          ? state.tokens.map((t) =>
              t.symbol === id
                ? {
                    ...t,
                    balance: t.balance + item.amount!,
                    value: (t.balance + item.amount!) * (state.cryptoPrices[id] || 0),
                  }
                : t,
            )
          : state.tokens,
    })
  },

  createLoan: (amount) => {
    const maxBorrow = get().getMaxBorrowAmount()
    if (amount > maxBorrow) return

    const state = get()
    const collateralValue = get().getTotalCollateralValue()
    const interestRate = get().getCurrentInterestRate()

    const loan: Loan = {
      id: `loan-${Date.now()}`,
      userId: "user1",
      collateralValue,
      loanAmount: amount,
      interestRate,
      startDate: new Date(),
      dueDate: new Date(),
      status: "active",
      collateralAccounts: state.collateral.filter((c) => c.type === "stock").map((c) => c.id),
      collateralTokens: state.collateral.filter((c) => c.type === "crypto").map((c) => c.id),
    }

    set({
      loans: [...state.loans, loan],
      tokens: state.tokens.map((t) =>
        t.symbol === "KRW1"
          ? {
              ...t,
              balance: t.balance + amount,
              value: t.value + amount,
            }
          : t,
      ),
      transactions: [
        ...state.transactions,
        {
          id: `tx-${Date.now()}`,
          userId: "user1",
          type: "borrow",
          amount,
          token: "KRW1",
          timestamp: new Date(),
          status: "completed",
        },
      ],
    })
  },

  repayLoan: (loanId, amount) => {
    const state = get()
    const loan = state.loans.find((l) => l.id === loanId)
    const krw1Token = state.tokens.find((t) => t.symbol === "KRW1")

    if (!loan || !krw1Token || krw1Token.balance < amount) return

    const newLoanAmount = loan.loanAmount - amount
    const isFullyRepaid = newLoanAmount <= 0

    set({
      loans: state.loans.map((l) =>
        l.id === loanId
          ? {
              ...l,
              loanAmount: Math.max(0, newLoanAmount),
              status: isFullyRepaid ? "repaid" : l.status,
            }
          : l,
      ),
      tokens: state.tokens.map((t) => {
        if (t.symbol === "KRW1") {
          return {
            ...t,
            balance: t.balance - amount,
            value: t.value - amount,
          }
        }
        // Return collateral if fully repaid
        if (isFullyRepaid && loan.collateralTokens?.includes(t.symbol)) {
          const collateralItem = state.collateral.find((c) => c.id === t.symbol)
          if (collateralItem?.amount) {
            return {
              ...t,
              balance: t.balance + collateralItem.amount,
              value: (t.balance + collateralItem.amount) * (state.cryptoPrices[t.symbol] || 0),
            }
          }
        }
        return t
      }),
      collateral: isFullyRepaid
        ? state.collateral.filter(
            (c) => !loan.collateralAccounts?.includes(c.id) && !loan.collateralTokens?.includes(c.id),
          )
        : state.collateral,
      transactions: [
        ...state.transactions,
        {
          id: `tx-${Date.now()}`,
          userId: "user1",
          type: "repay",
          amount,
          token: "KRW1",
          timestamp: new Date(),
          status: "completed",
        },
      ],
    })
  },

  buyToken: (fromSymbol, toSymbol, amount) => {
    const state = get()
    const fromToken = state.tokens.find((t) => t.symbol === fromSymbol)
    const toToken = state.tokens.find((t) => t.symbol === toSymbol)

    if (!fromToken || !toToken || fromToken.balance < amount) return

    const fromPrice = fromSymbol === "KRW1" ? 1 : state.cryptoPrices[fromSymbol] || 0
    const toPrice = toSymbol === "KRW1" ? 1 : state.cryptoPrices[toSymbol] || 0
    const toAmount = (amount * fromPrice) / toPrice

    set({
      tokens: state.tokens.map((t) => {
        if (t.symbol === fromSymbol) {
          return {
            ...t,
            balance: t.balance - amount,
            value: (t.balance - amount) * fromPrice,
          }
        }
        if (t.symbol === toSymbol) {
          return {
            ...t,
            balance: t.balance + toAmount,
            value: (t.balance + toAmount) * toPrice,
          }
        }
        return t
      }),
      transactions: [
        ...state.transactions,
        {
          id: `tx-${Date.now()}`,
          userId: "user1",
          type: "swap",
          amount,
          token: `${fromSymbol} → ${toSymbol}`,
          timestamp: new Date(),
          status: "completed",
        },
      ],
    })
  },

  getTotalCollateralValue: () => {
    const state = get()
    return state.collateral.reduce((sum, item) => sum + item.value, 0)
  },

  getTotalBorrowedValue: () => {
    const state = get()
    return state.loans.filter((l) => l.status === "active").reduce((sum, l) => sum + l.loanAmount, 0)
  },

  getHealthFactor: () => {
    const collateralValue = get().getTotalCollateralValue()
    const borrowedValue = get().getTotalBorrowedValue()

    if (borrowedValue === 0) return Number.POSITIVE_INFINITY
    return collateralValue / borrowedValue
  },

  getLiquidationRatio: () => {
    const healthFactor = get().getHealthFactor()
    if (healthFactor === Number.POSITIVE_INFINITY) return 0
    return 1 / healthFactor
  },

  getCurrentInterestRate: () => {
    const collateralValue = get().getTotalCollateralValue()
    const borrowedValue = get().getTotalBorrowedValue()
    return calculateInterestRate(borrowedValue, collateralValue)
  },

  getMaxBorrowAmount: () => {
    const collateralValue = get().getTotalCollateralValue()
    const currentBorrowed = get().getTotalBorrowedValue()
    const maxLTV = 0.7
    return collateralValue * maxLTV - currentBorrowed
  },
}))
