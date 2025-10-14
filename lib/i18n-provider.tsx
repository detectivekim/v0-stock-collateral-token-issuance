"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "ko"

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Brand
    "brand.name": "Seesaw Finance",
    "brand.tagline": "Stock-Collateralized Lending Platform",

    // Navigation
    "nav.dashboard": "Portfolio",
    "nav.portfolio": "Loan",
    "nav.send": "Send",
    "nav.receive": "Receive",
    "nav.buy": "Trade",
    "nav.sell": "Sell",
    "nav.login": "Login",
    "nav.logout": "Logout",

    // Landing Page
    "landing.hero.title": "Unlock Liquidity from Your Stocks",
    "landing.hero.subtitle":
      "Borrow KRW1 tokens using your stock portfolio as collateral. Trade crypto without selling your investments.",
    "landing.hero.cta": "Get Started",
    "landing.features.title": "How It Works",
    "landing.feature1.title": "Stock Collateral Lending",
    "landing.feature1.desc": "Leverage your stock holdings to borrow up to 3x in KRW1 tokens.",
    "landing.feature2.title": "Trade Crypto",
    "landing.feature2.desc": "Use borrowed KRW1 to trade cryptocurrencies on integrated DEXs.",
    "landing.feature3.title": "Flexible Repayment",
    "landing.feature3.desc": "Repay with KRW1, other tokens, or liquidate collateral.",

    // Dashboard
    "dashboard.title": "Asset Overview",
    "dashboard.totalValue": "Total Value",
    "dashboard.collateral": "Collateral",
    "dashboard.loans": "Loans",
    "dashboard.healthFactor": "Health Factor",
    "dashboard.quickActions": "Quick Actions",
    "dashboard.borrow": "Borrow",
    "dashboard.repay": "Repay",
    "dashboard.addCollateral": "Add Collateral",
    "dashboard.recentTransactions": "Recent Transactions",
    "dashboard.assets": "Assets",
    "dashboard.stocks": "Stocks",
    "dashboard.tokens": "Tokens",
    "dashboard.cryptoAssets": "Total Crypto Assets",
    "dashboard.stockAssets": "Total Stock Assets",
    "dashboard.shares": "shares",
    "dashboard.share": "share",

    // Loan
    "loan.title": "Loan",
    "loan.subtitle": "Manage your loans and collateral",
    "loan.collateralStatus": "Collateral Status",
    "loan.totalCollateral": "Total Collateral",
    "loan.cryptoCollateral": "Crypto Collateral",
    "loan.stockCollateral": "Stock Collateral",
    "loan.activeLoans": "Active Loans",
    "loan.loanAmount": "Loan Amount",
    "loan.interest": "Interest",
    "loan.accruedInterest": "Accrued Interest",
    "loan.dueDate": "Due Date",
    "loan.healthFactor": "Health Factor",
    "loan.liquidationPrice": "Liquidation Price",
    "loan.actions": "Actions",
    "loan.addCollateral": "Add Collateral",
    "loan.newLoan": "New Loan",
    "loan.repay": "Repay",
    "loan.noLoans": "No Active Loans",
    "loan.noLoansDesc": "Start your first loan by adding collateral",
    "loan.interestStatus": "Interest Status",
    "loan.dailyInterest": "Daily Interest",
    "loan.totalInterest": "Total Interest Accrued",

    // Borrow
    "borrow.title": "Borrow",
    "borrow.subtitle": "Borrow KRW1 using your stocks as collateral",
    "borrow.step.brokerage": "Brokerage",
    "borrow.step.collateral": "Collateral",
    "borrow.step.configuration": "Configuration",
    "borrow.selectStocks": "Select stocks to use as collateral",
    "borrow.maxBorrow": "Max Borrow",
    "borrow.loanAmount": "Loan Amount (KRW1)",
    "borrow.loanDetails": "Loan Details",
    "borrow.execute": "Execute Loan",
    "borrow.success": "Loan Completed!",
    "borrow.toDashboard": "To Dashboard",
    "borrow.addCollateral": "Add collateral or repay loan.",

    // Repay
    "repay.title": "Repay Loan",
    "repay.subtitle": "Repay your loan and recover collateral",
    "repay.step.select": "Select Loan",
    "repay.step.method": "Method",
    "repay.step.amount": "Amount",
    "repay.selectLoan": "Select Loan to Repay",
    "repay.noLoans": "No Active Loans",
    "repay.noLoansDesc": "No loans to repay",
    "repay.method.krw1": "Repay with KRW1",
    "repay.method.krw1.desc": "Directly repay with your KRW1 tokens",
    "repay.method.swap": "Repay with Other Tokens",
    "repay.method.swap.desc": "Swap your tokens to KRW1 and repay",
    "repay.method.liquidate": "Liquidate Stocks",
    "repay.method.liquidate.desc": "Sell collateral stocks to repay (fees apply)",
    "repay.method.deposit": "Deposit & Repay",
    "repay.method.deposit.desc": "Deposit KRW1 from external wallet and repay",
    "repay.selectMethod": "Select Repayment Method",
    "repay.selectMethodDesc": "Choose how to repay your loan",
    "repay.totalRepayment": "Total Repayment",
    "repay.setAmount": "Set Repayment Amount",
    "repay.repaymentAmount": "Repayment Amount",
    "repay.repaymentDetails": "Repayment Details",
    "repay.afterCollateral": "Collateral After Repayment",
    "repay.fullRepayNote": "Full repayment will immediately release collateral.",
    "repay.depositNote":
      "Deposit KRW1 from external wallet, then proceed with repayment. Deposit address will be shown in the next step.",
    "repay.execute": "Execute Repayment",
    "repay.checkAddress": "Check Deposit Address",
    "repay.success": "Repayment Completed!",
    "repay.successDesc": "₩{amount} has been repaid",
    "repay.viewPortfolio": "View Portfolio",

    // Swap
    "swap.title": "Swap",
    "swap.from": "From",
    "swap.to": "To",
    "swap.balance": "Balance",
    "swap.rate": "Rate",
    "swap.slippage": "Slippage",
    "swap.fee": "Fee",
    "swap.execute": "Swap",

    // Send/Receive
    "send.title": "Send",
    "send.token": "Token",
    "send.amount": "Amount",
    "send.recipient": "Recipient Address",
    "send.execute": "Send",
    "receive.title": "Receive",
    "receive.address": "Your Wallet Address",
    "receive.copy": "Copy Address",
    "receive.qr": "QR Code",

    // Common
    "common.loading": "Loading...",
    "common.next": "Next",
    "common.back": "Back",
    "common.cancel": "Cancel",
    "common.confirm": "Confirm",
    "common.max": "Max",
    "common.available": "Available",
    "common.error": "Error loading data",
  },
  ko: {
    // Brand
    "brand.name": "Seesaw Finance",
    "brand.tagline": "주식 담보 대출 플랫폼",

    // Navigation
    "nav.dashboard": "포트폴리오",
    "nav.portfolio": "대출",
    "nav.send": "전송",
    "nav.receive": "받기",
    "nav.buy": "거래",
    "nav.sell": "판매",
    "nav.login": "로그인",
    "nav.logout": "로그아웃",

    // Landing Page
    "landing.hero.title": "주식으로 유동성을 확보하세요",
    "landing.hero.subtitle":
      "보유 주식을 담보로 KRW1 토큰을 대출받으세요. 투자를 매도하지 않고 암호화폐를 거래할 수 있습니다.",
    "landing.hero.cta": "시작하기",
    "landing.features.title": "작동 방식",
    "landing.feature1.title": "주식 담보 대출",
    "landing.feature1.desc": "보유 주식의 가치를 활용하여 최대 3배까지 KRW1 토큰을 대출받으세요.",
    "landing.feature2.title": "암호화폐 거래",
    "landing.feature2.desc": "대출받은 KRW1로 통합 DEX에서 암호화폐를 거래하세요.",
    "landing.feature3.title": "유연한 상환",
    "landing.feature3.desc": "KRW1, 다른 토큰으로 상환하거나 담보를 청산할 수 있습니다.",

    // Dashboard
    "dashboard.title": "자산 현황",
    "dashboard.totalValue": "총 가치",
    "dashboard.collateral": "담보",
    "dashboard.loans": "대출",
    "dashboard.healthFactor": "건강도",
    "dashboard.quickActions": "빠른 실행",
    "dashboard.borrow": "대출하기",
    "dashboard.repay": "상환하기",
    "dashboard.addCollateral": "담보 추가",
    "dashboard.recentTransactions": "최근 거래",
    "dashboard.assets": "자산",
    "dashboard.stocks": "주식",
    "dashboard.tokens": "토큰",
    "dashboard.cryptoAssets": "총 암호화폐 자산",
    "dashboard.stockAssets": "총 주식 자산",
    "dashboard.shares": "주",
    "dashboard.share": "주",

    // Loan
    "loan.title": "대출",
    "loan.subtitle": "대출 현황과 담보를 관리하세요",
    "loan.collateralStatus": "담보 현황",
    "loan.totalCollateral": "총 담보 가치",
    "loan.cryptoCollateral": "암호화폐 담보",
    "loan.stockCollateral": "주식 담보",
    "loan.activeLoans": "활성 대출",
    "loan.loanAmount": "대출 금액",
    "loan.interest": "이자율",
    "loan.accruedInterest": "누적 이자",
    "loan.dueDate": "만기일",
    "loan.healthFactor": "건강도",
    "loan.liquidationPrice": "청산 가격",
    "loan.actions": "실행",
    "loan.addCollateral": "담보 추가",
    "loan.newLoan": "새 대출",
    "loan.repay": "상환하기",
    "loan.noLoans": "활성 대출이 없습니다",
    "loan.noLoansDesc": "담보를 추가하여 첫 대출을 시작하세요",
    "loan.interestStatus": "이자 현황",
    "loan.dailyInterest": "일일 이자",
    "loan.totalInterest": "총 누적 이자",

    // Borrow
    "borrow.title": "대출하기",
    "borrow.subtitle": "주식을 담보로 KRW1을 대출받으세요",
    "borrow.step.brokerage": "증권사",
    "borrow.step.collateral": "담보",
    "borrow.step.configuration": "대출 설정",
    "borrow.selectStocks": "대출 담보로 사용할 주식을 선택하세요",
    "borrow.maxBorrow": "최대 대출 가능",
    "borrow.loanAmount": "대출 금액 (KRW1)",
    "borrow.loanDetails": "대출 상세 정보",
    "borrow.execute": "대출 실행",
    "borrow.success": "대출이 완료되었습니다!",
    "borrow.toDashboard": "대시보드로",
    "borrow.addCollateral": "담보를 추가하거나 대출을 상환하세요.",

    // Repay
    "repay.title": "대출 상환",
    "repay.subtitle": "대출을 상환하고 담보를 회수하세요",
    "repay.step.select": "대출 선택",
    "repay.step.method": "방법",
    "repay.step.amount": "금액",
    "repay.selectLoan": "상환할 대출 선택",
    "repay.noLoans": "활성 대출이 없습니다",
    "repay.noLoansDesc": "상환할 대출이 없습니다",
    "repay.method.krw1": "KRW1로 상환",
    "repay.method.krw1.desc": "보유 중인 KRW1 토큰으로 직접 상환합니다",
    "repay.method.swap": "다른 토큰으로 상환",
    "repay.method.swap.desc": "보유 토큰을 KRW1로 스왑한 후 상환합니다",
    "repay.method.liquidate": "주식 청산 후 상환",
    "repay.method.liquidate.desc": "담보 주식을 매도하여 상환합니다 (수수료 발생)",
    "repay.method.deposit": "지갑 입금 후 상환",
    "repay.method.deposit.desc": "외부에서 KRW1을 입금받아 상환합니다",
    "repay.selectMethod": "상환 방법 선택",
    "repay.selectMethodDesc": "대출을 상환할 방법을 선택하세요",
    "repay.totalRepayment": "총 상환 금액",
    "repay.setAmount": "상환 금액 설정",
    "repay.repaymentAmount": "상환 금액",
    "repay.repaymentDetails": "상환 상세",
    "repay.afterCollateral": "상환 후 담보 가치",
    "repay.fullRepayNote": "전액 상환 시 담보가 즉시 해제됩니다.",
    "repay.depositNote":
      "외부 지갑에서 KRW1을 입금받은 후 상환을 진행하세요. 입금 주소는 다음 단계에서 확인할 수 있습니다.",
    "repay.execute": "상환 실행",
    "repay.checkAddress": "입금 주소 확인",
    "repay.success": "상환이 완료되었습니다!",
    "repay.successDesc": "₩{amount}이 상환되었습니다",
    "repay.viewPortfolio": "포트폴리오 보기",

    // Swap
    "swap.title": "스왑",
    "swap.from": "보내기",
    "swap.to": "받기",
    "swap.balance": "잔액",
    "swap.rate": "환율",
    "swap.slippage": "슬리피지",
    "swap.fee": "수수료",
    "swap.execute": "스왑",

    // Send/Receive
    "send.title": "전송",
    "send.token": "토큰",
    "send.amount": "금액",
    "send.recipient": "받는 주소",
    "send.execute": "전송",
    "receive.title": "받기",
    "receive.address": "내 지갑 주소",
    "receive.copy": "주소 복사",
    "receive.qr": "QR 코드",

    // Common
    "common.loading": "로딩중...",
    "common.next": "다음",
    "common.back": "이전",
    "common.cancel": "취소",
    "common.confirm": "확인",
    "common.max": "최대",
    "common.available": "사용 가능",
    "common.error": "데이터를 불러오는 중 오류가 발생했습니다",
  },
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ko")

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language
    if (saved && (saved === "en" || saved === "ko")) {
      setLanguageState(saved)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string) => {
    return translations[language][key] || key
  }

  return <I18nContext.Provider value={{ language, setLanguage, t }}>{children}</I18nContext.Provider>
}

export function useTranslation() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useTranslation must be used within I18nProvider")
  }
  return context
}
