// Zustand store for UI state
import { create } from "zustand"

interface UIStore {
  isBorrowModalOpen: boolean
  isRepayModalOpen: boolean
  isSwapModalOpen: boolean
  selectedStock: any | null

  openBorrowModal: (stock?: any) => void
  closeBorrowModal: () => void
  openRepayModal: () => void
  closeRepayModal: () => void
  openSwapModal: () => void
  closeSwapModal: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  isBorrowModalOpen: false,
  isRepayModalOpen: false,
  isSwapModalOpen: false,
  selectedStock: null,

  openBorrowModal: (stock) => set({ isBorrowModalOpen: true, selectedStock: stock }),
  closeBorrowModal: () => set({ isBorrowModalOpen: false, selectedStock: null }),
  openRepayModal: () => set({ isRepayModalOpen: true }),
  closeRepayModal: () => set({ isRepayModalOpen: false }),
  openSwapModal: () => set({ isSwapModalOpen: true }),
  closeSwapModal: () => set({ isSwapModalOpen: false }),
}))
