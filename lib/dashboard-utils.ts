import { clsx, type ClassValue } from 'clsx'
import { Transaction, TransactionType, TransactionStatus, Asset, AssetCategory, MarketData, Lead, LeadSource, LeadStatus, TodoStatus, Todo } from '@/types'
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  ArrowUpCircle, 
  ArrowDownCircle,
  CircleDollarSign,
  TrendingUp,
  TrendingDown,
  Banknote,
  Building2,
  Coins,
  Bitcoin,
  Wallet,
  Mail,
  Users,
  MessageSquare,
  Globe,
  UserPlus,
  Phone,
  LucideIcon
} from 'lucide-react'

// Turn numbers into nice currency strings
export function formatCurrency(
  value: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
}

// Make big numbers readable (1.2K, 3.4M, etc.)
export function formatCompactNumber(value: number): string {
  const formatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  })
  return formatter.format(value)
}

// Figure out the percentage change between old and new values
export function calculatePercentageChange(
  current: number,
  previous: number
): number {
  if (previous === 0) return current === 0 ? 0 : 100
  return ((current - previous) / previous) * 100
}

// Format percentages with proper signs and decimals
export function formatPercentage(
  value: number,
  decimals: number = 1,
  includeSign: boolean = true
): string {
  const formatted = value.toFixed(decimals)
  const sign = includeSign && value > 0 ? '+' : ''
  return `${sign}${formatted}%`
}

// Is this going up, down, or staying flat?
export function getTrendDirection(
  current: number,
  previous: number,
  invertColors: boolean = false
): 'up' | 'down' | 'neutral' {
  if (current > previous) return invertColors ? 'down' : 'up'
  if (current < previous) return invertColors ? 'up' : 'down'
  return 'neutral'
}

// Apply color coding based on performance thresholds
export function getMetricStateClasses(
  value: number,
  thresholds?: {
    danger?: number
    warning?: number
    success?: number
  },
  invertColors: boolean = false
): string {
  if (!thresholds) return ''

  const { danger, warning, success } = thresholds

  if (invertColors) {
    if (danger !== undefined && value >= danger) return 'text-danger'
    if (warning !== undefined && value >= warning) return 'text-warning'
    if (success !== undefined && value <= success) return 'text-success'
  } else {
    if (danger !== undefined && value <= danger) return 'text-danger'
    if (warning !== undefined && value <= warning) return 'text-warning'
    if (success !== undefined && value >= success) return 'text-success'
  }

  return ''
}

// Format dates in different ways for the dashboard
export function formatDashboardDate(
  date: Date | string,
  format: 'short' | 'medium' | 'long' | 'relative' = 'medium'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    case 'medium':
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    case 'long':
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    case 'relative':
      return getRelativeTime(dateObj)
    default:
      return dateObj.toLocaleDateString()
  }
}

// Convert dates to human-readable time like "2 hours ago"
function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  const absSeconds = Math.abs(diffInSeconds)

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ]

  for (const interval of intervals) {
    const count = Math.floor(absSeconds / interval.seconds)
    if (count >= 1) {
      const label = count === 1 ? interval.label : `${interval.label}s`
      return diffInSeconds < 0 
        ? `in ${count} ${label}` 
        : `${count} ${label} ago`
    }
  }

  return 'just now'
}

// Create a nice set of colors for charts
export function getChartColors(count: number = 8): string[] {
  // Using real HSL values since Chart.js doesn't understand CSS variables
  const baseColors = [
    'hsl(220, 70%, 50%)',  // Blue
    'hsl(160, 60%, 45%)',  // Green
    'hsl(30, 80%, 55%)',   // Orange
    'hsl(280, 65%, 60%)',  // Purple
    'hsl(340, 75%, 55%)',  // Pink
    'hsl(200, 80%, 50%)',  // Cyan
    'hsl(120, 65%, 40%)',  // Green
    'hsl(45, 90%, 60%)',   // Yellow
  ]

  if (count <= baseColors.length) {
    return baseColors.slice(0, count)
  }

  // Need more colors? Generate them programmatically
  const colors = [...baseColors]
  for (let i = baseColors.length; i < count; i++) {
    colors.push(`hsl(${(i * 360) / count}, 60%, 50%)`)
  }
  return colors
}

/**
 * Format financial value with proper notation
 */
export function formatFinancialValue(
  value: number,
  options: {
    style?: 'currency' | 'decimal' | 'percent'
    currency?: string
    decimals?: number
    compact?: boolean
  } = {}
): string {
  const {
    style = 'decimal',
    currency = 'USD',
    decimals = 2,
    compact = false,
  } = options

  if (compact && style !== 'percent') {
    return formatCompactNumber(value)
  }

  switch (style) {
    case 'currency':
      return formatCurrency(value, currency)
    case 'percent':
      return formatPercentage(value, decimals)
    default:
      return value.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals,
      })
  }
}

/**
 * Generate gradient background classes
 */
export function getGradientClasses(
  type: 'primary' | 'success' | 'warning' | 'danger' | 'info',
  intensity: 'light' | 'medium' | 'dark' = 'medium'
): string {
  const intensityMap = {
    light: '5',
    medium: '10',
    dark: '20',
  }

  const opacity = intensityMap[intensity]
  return `bg-gradient-to-br from-${type}/${opacity} to-${type}/${parseInt(opacity) * 2}`
}

/**
 * Get badge variant for transaction status
 */
export function getTransactionStatusBadgeVariant(
  status: TransactionStatus
): 'completed' | 'pending' | 'cancelled' | 'failed' | 'expired' | 'reviewed' {
  switch (status) {
    case TransactionStatus.Completed:
      return 'completed'
    case TransactionStatus.Pending:
      return 'pending'
    case TransactionStatus.Cancelled:
      return 'cancelled'
    case TransactionStatus.Failed:
      return 'failed'
    case TransactionStatus.Expired:
      return 'expired'
    case TransactionStatus.Reviewed:
      return 'reviewed'
    default:
      return 'pending'
  }
}

/**
 * Calculate inflow and outflow from transactions
 */
export function calculateInflowOutflow(transactions: Transaction[]) {
  let inflow = 0
  let outflow = 0
  let inflowCount = 0
  let outflowCount = 0

  transactions.forEach(transaction => {
    if (transaction.status === TransactionStatus.Completed) {
      switch (transaction.type) {
        case TransactionType.Deposit:
        case TransactionType.Sell:
          inflow += transaction.total
          inflowCount++
          break
        case TransactionType.Withdrawal:
        case TransactionType.Buy:
          outflow += transaction.total
          outflowCount++
          break
      }
    }
  })

  return {
    inflow,
    outflow,
    inflowCount,
    outflowCount,
    netFlow: inflow - outflow
  }
}

/**
 * Get icon for transaction type
 */
export function getTransactionTypeIcon(type: TransactionType): LucideIcon {
  switch (type) {
    case TransactionType.Buy:
      return ArrowDownCircle
    case TransactionType.Sell:
      return ArrowUpCircle
    case TransactionType.Deposit:
      return ArrowDownLeft
    case TransactionType.Withdrawal:
      return ArrowUpRight
    default:
      return CircleDollarSign
  }
}

/**
 * Format transaction amount with sign
 */
export function formatTransactionAmount(
  amount: number,
  type: TransactionType,
  showSign: boolean = true
): string {
  const formatted = formatCurrency(Math.abs(amount))
  
  if (!showSign) return formatted
  
  switch (type) {
    case TransactionType.Buy:
    case TransactionType.Withdrawal:
      return `-${formatted}`
    case TransactionType.Sell:
    case TransactionType.Deposit:
      return `+${formatted}`
    default:
      return formatted
  }
}

/**
 * Calculate asset allocation by category
 */
export function calculateAssetAllocation(assets: Asset[]): {
  category: AssetCategory
  value: number
  percentage: number
  count: number
}[] {
  const totalValue = assets.reduce((sum, asset) => sum + asset.totalValue, 0)
  const categoryMap = new Map<AssetCategory, { value: number; count: number }>()

  // Aggregate by category
  assets.forEach(asset => {
    const existing = categoryMap.get(asset.category) || { value: 0, count: 0 }
    categoryMap.set(asset.category, {
      value: existing.value + asset.totalValue,
      count: existing.count + 1
    })
  })

  // Convert to array with percentages
  return Array.from(categoryMap.entries()).map(([category, data]) => ({
    category,
    value: data.value,
    percentage: totalValue > 0 ? (data.value / totalValue) * 100 : 0,
    count: data.count
  })).sort((a, b) => b.value - a.value)
}

/**
 * Get top performing assets
 */
export function getTopPerformingAssets(assets: Asset[], limit: number = 5): Asset[] {
  return [...assets]
    .sort((a, b) => {
      const aPerformance = a.performance?.day || 0
      const bPerformance = b.performance?.day || 0
      return bPerformance - aPerformance
    })
    .slice(0, limit)
}

/**
 * Format asset allocation for display
 */
export function formatAssetAllocation(allocation: {
  category: AssetCategory
  value: number
  percentage: number
  count: number
}): string {
  return `${allocation.category}: ${formatCurrency(allocation.value)} (${allocation.percentage.toFixed(1)}%)`
}

/**
 * Get icon for asset category
 */
export function getAssetCategoryIcon(category: AssetCategory): LucideIcon {
  switch (category) {
    case AssetCategory.Stock:
      return TrendingUp
    case AssetCategory.Bond:
      return Banknote
    case AssetCategory.ETF:
      return Building2
    case AssetCategory.MutualFund:
      return Coins
    case AssetCategory.Crypto:
      return Bitcoin
    case AssetCategory.Cash:
      return Wallet
    default:
      return CircleDollarSign
  }
}

/**
 * Calculate portfolio totals
 */
export function calculatePortfolioTotals(assets: Asset[]): {
  totalValue: number
  totalGains: number
  totalGainsPercentage: number
  dayChange: number
  dayChangePercentage: number
} {
  const totalValue = assets.reduce((sum, asset) => sum + asset.totalValue, 0)
  const totalCost = assets.reduce((sum, asset) => sum + asset.costBasis, 0)
  const totalGains = assets.reduce((sum, asset) => sum + asset.unrealizedGain, 0)
  const totalGainsPercentage = totalCost > 0 ? (totalGains / totalCost) * 100 : 0

  // Calculate day change
  const dayChange = assets.reduce((sum, asset) => {
    const dayPercentage = asset.performance?.day || 0
    const previousValue = asset.totalValue / (1 + dayPercentage / 100)
    return sum + (asset.totalValue - previousValue)
  }, 0)
  const dayChangePercentage = totalValue > 0 ? (dayChange / (totalValue - dayChange)) * 100 : 0

  return {
    totalValue,
    totalGains,
    totalGainsPercentage,
    dayChange,
    dayChangePercentage
  }
}

// Market Data Utilities

/**
 * Get color class based on market change value
 */
export function getMarketStatusColor(change: number): string {
  if (change > 0) return 'text-green-600 dark:text-green-400'
  if (change < 0) return 'text-red-600 dark:text-red-400'
  return 'text-gray-600 dark:text-gray-400'
}

/**
 * Format market change value with proper sign and formatting
 */
export function formatMarketChange(value: number, showSign: boolean = true): string {
  const formatted = Math.abs(value).toFixed(2)
  if (!showSign) return formatted
  return value >= 0 ? `+${formatted}` : `-${formatted}`
}

/**
 * Get trend icon based on market movement
 */
export function getMarketTrendIcon(change: number): LucideIcon {
  if (change > 0) return TrendingUp
  if (change < 0) return TrendingDown
  return CircleDollarSign
}

/**
 * Calculate overall market summary metrics
 */
export function calculateMarketSummaryMetrics(marketData: MarketData[]): {
  averageChange: number
  totalVolume: number
  positiveCount: number
  negativeCount: number
  neutralCount: number
} {
  let totalChange = 0
  let totalVolume = 0
  let positiveCount = 0
  let negativeCount = 0
  let neutralCount = 0

  marketData.forEach(data => {
    totalChange += data.changePercent
    totalVolume += data.volume
    
    if (data.changePercent > 0) positiveCount++
    else if (data.changePercent < 0) negativeCount++
    else neutralCount++
  })

  return {
    averageChange: marketData.length > 0 ? totalChange / marketData.length : 0,
    totalVolume,
    positiveCount,
    negativeCount,
    neutralCount
  }
}

/**
 * Categorize market indices by region
 */
export function getIndicesByRegion(marketData: MarketData[]): {
  indian: MarketData[]
  us: MarketData[]
  global: MarketData[]
} {
  const indian: MarketData[] = []
  const us: MarketData[] = []
  const global: MarketData[] = []

  marketData.forEach(data => {
    if (data.symbol.includes('NIFTY') || data.symbol.includes('SENSEX') || data.symbol.includes('BSE')) {
      indian.push(data)
    } else if (data.symbol.includes('SPX') || data.symbol.includes('NASDAQ') || data.symbol.includes('DJI') || 
               data.symbol.includes('S&P') || data.symbol.includes('DOW')) {
      us.push(data)
    } else {
      global.push(data)
    }
  })

  return { indian, us, global }
}

// Lead Data Utilities

/**
 * Calculate channel breakdown from leads array
 */
export function calculateChannelBreakdown(leads: Lead[]): {
  source: LeadSource
  count: number
  percentage: number
  totalValue: number
}[] {
  // Ensure leads is an array
  const safeLeads = Array.isArray(leads) ? leads : []
  
  const sourceMap = new Map<LeadSource, { count: number; totalValue: number }>()
  const totalLeads = safeLeads.length

  // Aggregate by source
  safeLeads.forEach(lead => {
    const existing = sourceMap.get(lead.source) || { count: 0, totalValue: 0 }
    sourceMap.set(lead.source, {
      count: existing.count + 1,
      totalValue: existing.totalValue + lead.potentialValue
    })
  })

  // Convert to array with percentages
  return Array.from(sourceMap.entries()).map(([source, data]) => ({
    source,
    count: data.count,
    percentage: totalLeads > 0 ? (data.count / totalLeads) * 100 : 0,
    totalValue: data.totalValue
  })).sort((a, b) => b.count - a.count)
}

/**
 * Get color class for lead status
 */
export function getLeadStatusColor(status: LeadStatus): string {
  switch (status) {
    case LeadStatus.New:
      return 'text-blue-600 dark:text-blue-400'
    case LeadStatus.Contacted:
      return 'text-cyan-600 dark:text-cyan-400'
    case LeadStatus.Qualified:
      return 'text-purple-600 dark:text-purple-400'
    case LeadStatus.Proposal:
      return 'text-orange-600 dark:text-orange-400'
    case LeadStatus.Negotiation:
      return 'text-yellow-600 dark:text-yellow-400'
    case LeadStatus.ClosedWon:
      return 'text-green-600 dark:text-green-400'
    case LeadStatus.ClosedLost:
      return 'text-red-600 dark:text-red-400'
    default:
      return 'text-gray-600 dark:text-gray-400'
  }
}

/**
 * Calculate lead metrics from array of leads
 */
export function calculateLeadMetrics(leads: Lead[]): {
  totalLeads: number
  totalPotentialValue: number
  averageDealSize: number
  conversionRate: number
  qualifiedLeads: number
  activeLeads: number
} {
  // Ensure leads is an array
  const safeLeads = Array.isArray(leads) ? leads : []
  
  const totalLeads = safeLeads.length
  const totalPotentialValue = safeLeads.reduce((sum, lead) => sum + lead.potentialValue, 0)
  const closedWonLeads = safeLeads.filter(lead => lead.status === LeadStatus.ClosedWon).length
  const closedLeads = safeLeads.filter(lead => 
    lead.status === LeadStatus.ClosedWon || lead.status === LeadStatus.ClosedLost
  ).length
  const qualifiedLeads = safeLeads.filter(lead => 
    lead.status === LeadStatus.Qualified || 
    lead.status === LeadStatus.Proposal || 
    lead.status === LeadStatus.Negotiation
  ).length
  const activeLeads = safeLeads.filter(lead => 
    lead.status !== LeadStatus.ClosedWon && lead.status !== LeadStatus.ClosedLost
  ).length

  return {
    totalLeads,
    totalPotentialValue,
    averageDealSize: totalLeads > 0 ? totalPotentialValue / totalLeads : 0,
    conversionRate: closedLeads > 0 ? (closedWonLeads / closedLeads) * 100 : 0,
    qualifiedLeads,
    activeLeads
  }
}

/**
 * Get icon for lead source
 */
export function getLeadSourceIcon(source: LeadSource): LucideIcon {
  switch (source) {
    case LeadSource.Email:
      return Mail
    case LeadSource.SocialMedia:
      return Users
    case LeadSource.WhatsApp:
      return MessageSquare
    case LeadSource.Website:
      return Globe
    case LeadSource.Referral:
      return UserPlus
    case LeadSource.ColdCall:
      return Phone
    default:
      return Users
  }
}

/**
 * Format lead value with proper currency notation
 */
export function formatLeadValue(value: number): string {
  if (value >= 10000000) { // 1 crore or more
    return `₹${(value / 10000000).toFixed(2)} Cr`
  } else if (value >= 100000) { // 1 lakh or more
    return `₹${(value / 100000).toFixed(2)} L`
  } else if (value >= 1000) { // 1 thousand or more
    return `₹${(value / 1000).toFixed(1)} K`
  }
  return `₹${value.toLocaleString('en-IN')}`
}

/**
 * Get top prospect companies by potential value
 */
export function getTopProspectCompanies(leads: Lead[], limit: number = 5): Lead[] {
  // Ensure leads is an array
  const safeLeads = Array.isArray(leads) ? leads : []
  
  return [...safeLeads]
    .filter(lead => 
      lead.status !== LeadStatus.ClosedWon && 
      lead.status !== LeadStatus.ClosedLost
    )
    .sort((a, b) => b.potentialValue - a.potentialValue)
    .slice(0, limit)
}

// Chart.js specific utilities

/**
 * Prepare asset allocation data for Chart.js pie chart
 */
export function prepareAssetAllocationChartData(allocation: {
  category: AssetCategory
  value: number
  percentage: number
  count: number
}[]) {
  const colors = getChartColors(allocation.length)
  
  return {
    labels: allocation.map(a => a.category),
    datasets: [{
      data: allocation.map(a => a.value),
      backgroundColor: colors,
      borderColor: colors.map(color => {
        // Create a slightly darker version for borders
        // Extract HSL values and reduce lightness by 10%
        const match = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/)
        if (match) {
          const [_, h, s, l] = match
          const newL = Math.max(0, parseInt(l) - 10)
          return `hsl(${h}, ${s}%, ${newL}%)`
        }
        return color
      }),
      borderWidth: 2,
      hoverOffset: 4,
    }]
  }
}

/**
 * Prepare channel distribution data for Chart.js donut chart
 */
export function prepareChannelDistributionChartData(channels: {
  source: LeadSource
  count: number
  percentage: number
  totalValue: number
}[]) {
  const colors = getChartColors(channels.length)
  
  return {
    labels: channels.map(c => c.source),
    datasets: [{
      data: channels.map(c => c.count),
      backgroundColor: colors,
      borderColor: colors.map(color => {
        // Create a slightly darker version for borders
        // Extract HSL values and reduce lightness by 10%
        const match = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/)
        if (match) {
          const [_, h, s, l] = match
          const newL = Math.max(0, parseInt(l) - 10)
          return `hsl(${h}, ${s}%, ${newL}%)`
        }
        return color
      }),
      borderWidth: 2,
      hoverOffset: 4,
    }]
  }
}

/**
 * Prepare lead trends data for Chart.js line chart
 */
export function prepareLeadTrendsChartData(trendData: Array<{ 
  date: string
  newLeads: number
  qualified: number
  closed: number 
}>) {
  return {
    labels: trendData.map(d => d.date),
    datasets: [
      {
        label: 'New Leads',
        data: trendData.map(d => d.newLeads),
        borderColor: 'hsl(var(--chart-1))',
        backgroundColor: 'hsl(var(--chart-1) / 0.1)',
        tension: 0.4,
      },
      {
        label: 'Qualified',
        data: trendData.map(d => d.qualified),
        borderColor: 'hsl(var(--chart-2))',
        backgroundColor: 'hsl(var(--chart-2) / 0.1)',
        tension: 0.4,
      },
      {
        label: 'Closed',
        data: trendData.map(d => d.closed),
        borderColor: 'hsl(var(--chart-3))',
        backgroundColor: 'hsl(var(--chart-3) / 0.1)',
        tension: 0.4,
      },
    ]
  }
}

/**
 * Get standardized Chart.js options for different chart types
 */
export function getChartOptions(type: 'pie' | 'donut' | 'line', options?: any) {
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'hsl(var(--background))',
        titleColor: 'hsl(var(--foreground))',
        bodyColor: 'hsl(var(--foreground))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
      },
    },
  }
  
  if (type === 'line') {
    return {
      ...baseOptions,
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'hsl(var(--border))',
          },
        },
      },
      ...options,
    }
  }
  
  if (type === 'donut') {
    return {
      ...baseOptions,
      cutout: '60%',
      ...options,
    }
  }
  
  return { ...baseOptions, ...options }
}

/**
 * Generate lead trend data from leads array
 */
export function generateLeadTrendData(
  leads: Lead[], 
  period: 'daily' | 'weekly' | 'monthly' = 'daily'
): Array<{ date: string; newLeads: number; qualified: number; closed: number }> {
  // Ensure leads is an array
  const safeLeads = Array.isArray(leads) ? leads : []
  
  const now = new Date()
  const trendData: Array<{ date: string; newLeads: number; qualified: number; closed: number }> = []
  
  const periods = period === 'daily' ? 7 : period === 'weekly' ? 4 : 12
  const periodMs = period === 'daily' ? 86400000 : period === 'weekly' ? 604800000 : 2592000000
  
  for (let i = periods - 1; i >= 0; i--) {
    const periodStart = new Date(now.getTime() - (i * periodMs))
    const periodEnd = new Date(periodStart.getTime() + periodMs)
    
    const periodLeads = safeLeads.filter(lead => {
      const leadDate = new Date(lead.createdDate)
      return leadDate >= periodStart && leadDate < periodEnd
    })
    
    const dateLabel = period === 'daily' 
      ? periodStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : period === 'weekly'
      ? `Week ${periods - i}`
      : periodStart.toLocaleDateString('en-US', { month: 'short' })
    
    trendData.push({
      date: dateLabel,
      newLeads: periodLeads.length,
      qualified: periodLeads.filter(l => 
        l.status === LeadStatus.Qualified || 
        l.status === LeadStatus.Proposal || 
        l.status === LeadStatus.Negotiation
      ).length,
      closed: periodLeads.filter(l => l.status === LeadStatus.ClosedWon).length,
    })
  }
  
  return trendData
}

// Todo System Utilities

/**
 * Generate unique ID for todo items
 */
export function generateTodoId(): string {
  return `todo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Create sample todos for demonstration
 */
export function createSampleTodos(): Todo[] {
  return [
    {
      id: generateTodoId(),
      title: "Review HDFC Mid-Cap Fund Performance",
      description: "Quarterly review of HDFC Mid-Cap Opportunities Fund returns and rebalancing decision",
      scheme: "HDFC Mid-Cap",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: TodoStatus.Open,
    },
    {
      id: generateTodoId(),
      title: "Market Alert: Tech Sector Correction",
      description: "Technology sector showing 10% correction - consider increasing allocation",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: TodoStatus.Open,
    },
    {
      id: generateTodoId(),
      title: "ICICI Prudential Bluechip Fund - New NFO",
      description: "New fund offer closing on 15th March. Min investment ₹5,000",
      scheme: "ICICI Bluechip",
      createdAt: new Date().toISOString(),
      status: TodoStatus.Open,
    },
    {
      id: generateTodoId(),
      title: "Tax Saving Investment Deadline",
      description: "Invest in ELSS funds before March 31st for tax benefits under 80C",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: TodoStatus.Open,
    },
    {
      id: generateTodoId(),
      title: "SIP Review for Axis Small Cap Fund",
      description: "Monthly SIP of ₹10,000 - Review performance after 6 months",
      scheme: "Axis Small Cap",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: TodoStatus.Reminded,
      remindAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]
}

/**
 * Format todo date for display
 */
export function formatTodoDate(date: string): string {
  const dateObj = new Date(date)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return 'Just now'
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  if (diffInHours < 48) return 'Yesterday'
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`
  
  return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/**
 * Get color classes for todo status
 */
export function getTodoStatusColor(status: TodoStatus): string {
  switch (status) {
    case TodoStatus.Open:
      return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
    case TodoStatus.Completed:
      return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
    case TodoStatus.Wished:
      return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
    case TodoStatus.Reminded:
      return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20'
    default:
      return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20'
  }
}
