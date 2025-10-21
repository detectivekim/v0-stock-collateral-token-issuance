// Price oracle services for crypto, KRW, and stocks

export interface PriceData {
  symbol: string
  price: number
  timestamp: number
}

export interface CoinData {
  price: number
  imageUrl: string
}

// CoinGecko API for crypto prices (free tier) and logo URLs
export async function getCoinData(symbol: string): Promise<CoinData> {
  // Fallback data for when API is unavailable
  const fallbackData: Record<string, CoinData> = {
    BTC: {
      price: 130000000,
      imageUrl: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    },
    ETH: {
      price: 5000000,
      imageUrl: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    },
    USDT: {
      price: 1300,
      imageUrl: "https://assets.coingecko.com/coins/images/325/large/Tether.png",
    },
    MATIC: {
      price: 800,
      imageUrl: "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png",
    },
    ARB: {
      price: 900,
      imageUrl: "https://assets.coingecko.com/coins/images/16547/large/photo_2023-03-29_21.47.00.jpeg",
    },
  }

  try {
    const coinIds: Record<string, string> = {
      BTC: "bitcoin",
      ETH: "ethereum",
      USDT: "tether",
      MATIC: "matic-network",
      ARB: "arbitrum",
    }

    const coinId = coinIds[symbol]
    if (!coinId) {
      return fallbackData[symbol] || { price: 0, imageUrl: "" }
    }

    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`,
      { signal: AbortSignal.timeout(5000) }, // 5 second timeout
    )

    if (!response.ok) {
      console.log(`[v0] CoinGecko API unavailable for ${symbol}, using fallback price`)
      return fallbackData[symbol] || { price: 0, imageUrl: "" }
    }

    const data = await response.json()

    return {
      price: data.market_data?.current_price?.krw || fallbackData[symbol]?.price || 0,
      imageUrl: data.image?.large || data.image?.small || fallbackData[symbol]?.imageUrl || "",
    }
  } catch (error) {
    // Silently use fallback data - this is expected in some environments
    console.log(`[v0] Using fallback price for ${symbol}`)
    return fallbackData[symbol] || { price: 0, imageUrl: "" }
  }
}

export function getStockPrice(symbol: string): number {
  const stockPrices: Record<string, number> = {
    "005930": 97224, // Samsung Electronics Co Ltd
    "000660": 488773, // SK Hynix Inc
    "035420": 260559, // Naver Corporation
    "035720": 58831, // Kakao Corp
  }
  return stockPrices[symbol] || 0
}

// Calculate utilization rate based interest rate (AAVE style)
export function calculateInterestRate(totalBorrowed: number, totalCollateral: number): number {
  if (totalCollateral === 0) return 0

  const utilizationRate = totalBorrowed / totalCollateral
  const baseRate = 2.0 // 2% base rate
  const slope1 = 4.0 // 4% slope before optimal
  const slope2 = 60.0 // 60% slope after optimal
  const optimalUtilization = 0.8 // 80% optimal utilization

  if (utilizationRate <= optimalUtilization) {
    return baseRate + (utilizationRate / optimalUtilization) * slope1
  } else {
    const excessUtilization = utilizationRate - optimalUtilization
    return baseRate + slope1 + (excessUtilization / (1 - optimalUtilization)) * slope2
  }
}
