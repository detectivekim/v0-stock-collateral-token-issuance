// Zustand store for portfolio state
import { create } from "zustand"
import type { Portfolio } from "@/lib/types"

interface PortfolioStore extends Portfolio {
  updatePortfolio: (data: Partial<Portfolio>) => void
  calculateHealthFactor: () => void
}

export const usePortfolioStore = create<PortfolioStore>((set, get) => ({
  userId: "",
  totalValue: 0,
  collateralValue: 0,
  loanValue: 0,
  healthFactor: 0,
  liquidationPrice: 0,

  updatePortfolio: (data) => set((state) => ({ ...state, ...data })),

  calculateHealthFactor: () => {
    const { totalValue, collateralValue, loanValue } = get()
    const healthFactor = loanValue > 0 ? (totalValue + collateralValue) / loanValue : 0
    set({ healthFactor })
  },
}))
