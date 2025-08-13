// Enums for various types
export enum TransactionType {
  Buy = "Buy",
  Sell = "Sell",
  Deposit = "Deposit",
  Withdrawal = "Withdrawal",
}

export enum TransactionStatus {
  Completed = "Completed",
  Pending = "Pending",
  Cancelled = "Cancelled",
  Failed = "Failed",
  Expired = "Expired",
  Reviewed = "Reviewed",
}

export enum AssetCategory {
  Stock = "Stock",
  Bond = "Bond",
  ETF = "ETF",
  MutualFund = "Mutual Fund",
  Cash = "Cash",
  Crypto = "Crypto",
}

export enum LeadStatus {
  New = "New",
  Contacted = "Contacted",
  Qualified = "Qualified",
  Proposal = "Proposal Sent",
  Negotiation = "Negotiation",
  ClosedWon = "Closed - Won",
  ClosedLost = "Closed - Lost",
}

export enum LeadSource {
  Website = "Website",
  Referral = "Referral",
  SocialMedia = "Social Media",
  Email = "Email Marketing",
  WhatsApp = "WhatsApp",
  ColdCall = "Cold Call",
}

// Interface for a single transaction
export interface Transaction {
  id: string
  type: TransactionType
  symbol?: string
  company?: string
  quantity: number
  price?: number
  total: number
  date: string
  status: TransactionStatus
  fees: number
}

// Interface for a portfolio asset holding
export interface Asset {
  id: string
  symbol: string
  name: string
  category: AssetCategory
  quantity: number
  currentPrice: number
  totalValue: number
  costBasis: number
  unrealizedGain: number
  unrealizedGainPercent: number
  allocation: number
  performance: {
    day: number
    week: number
    month: number
    year: number
  }
}

// Interface for market data of an index or stock
export interface MarketData {
  symbol: string
  name: string
  value: number
  change: number
  changePercent: number
  timestamp: string
  high52Week: number
  low52Week: number
  marketCap: number
  volume: number
  sector?: string
  historicalData: {
    date: string
    close: number
  }[]
}

// Interface for a lead or prospect
export interface Lead {
  id: string
  company: string
  contactName: string
  contactEmail: string
  contactPhone?: string
  source: LeadSource
  status: LeadStatus
  potentialValue: number
  assignedTo?: string
  createdDate: string
  lastContactedDate: string
  interactionHistory: {
    date: string
    type: 'Call' | 'Email' | 'Meeting' | 'Note'
    summary: string
  }[]
}

// Utility type for paginated API responses
export interface PaginatedResponse<T> {
  data: T[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

// Utility type for generic API response
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: {
    code: string
    details?: any
  }
}

// Type for portfolio summary
export interface PortfolioSummary {
  totalValue: number
  totalCostBasis: number
  totalUnrealizedGain: number
  totalUnrealizedGainPercent: number
  todayGain: number
  todayGainPercent: number
  assetAllocation: {
    category: AssetCategory
    value: number
    percentage: number
  }[]
}

// Type for market summary
export interface MarketSummary {
  indices: MarketData[]
  topMovers: MarketData[]
  sectorPerformance: {
    sector: string
    changePercent: number
  }[]
}

