'use client'

import { StatCard } from '@/components/dashboard/stat-card'
import { DashboardCard } from '@/components/dashboard/dashboard-card'
import { ErrorDisplay } from '@/components/dashboard/error-display'
import { useMarketSummary } from '@/lib/data-fetching'
import { 
  getMarketStatusColor, 
  formatMarketChange, 
  calculateMarketSummaryMetrics,
  getIndicesByRegion,
  formatCompactNumber
} from '@/lib/dashboard-utils'
import { MarketIndicesGrid } from './market-indices-grid'
import { Skeleton } from '@/components/ui/skeleton'
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react'

export function MarketOverview() {
  const { data: marketData, loading, error } = useMarketSummary()

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    )
  }

  if (error || !marketData) {
    return (
      <ErrorDisplay 
        error={error || new Error('No market data available')} 
        context="market"
      />
    )
  }

  const { indices } = marketData
  const metrics = calculateMarketSummaryMetrics(indices)
  const { indian, us } = getIndicesByRegion(indices)

  // Get key indices for stat cards with null safety
  let nifty, sensex, sp500, nasdaq
  
  try {
    nifty = indices.find(i => i?.symbol?.includes('NIFTY'))
  } catch (error) {
    console.warn('Error finding NIFTY index:', error)
  }
  
  try {
    sensex = indices.find(i => i?.symbol?.includes('SENSEX'))
  } catch (error) {
    console.warn('Error finding SENSEX index:', error)
  }
  
  try {
    sp500 = indices.find(i => i?.symbol?.includes('SPX') || i?.name?.includes('S&P'))
  } catch (error) {
    console.warn('Error finding S&P 500 index:', error)
  }
  
  try {
    nasdaq = indices.find(i => i?.symbol?.includes('NASDAQ'))
  } catch (error) {
    console.warn('Error finding NASDAQ index:', error)
  }
  
  // Enhanced validation function with comprehensive checks
  const isValidIndex = (index: any) => {
    if (!index) return false
    
    // Check for required properties
    if (typeof index.value !== 'number' || 
        typeof index.changePercent !== 'number' || 
        typeof index.change !== 'number') {
      return false
    }
    
    // Check for NaN and Infinity
    if (isNaN(index.value) || !isFinite(index.value) ||
        isNaN(index.changePercent) || !isFinite(index.changePercent) ||
        isNaN(index.change) || !isFinite(index.change)) {
      return false
    }
    
    // Check for required string properties
    if (!index.symbol || typeof index.symbol !== 'string' ||
        !index.name || typeof index.name !== 'string') {
      return false
    }
    
    // Check for reasonable value ranges for market data
    // Index values should be positive and within reasonable bounds
    if (index.value < 0 || index.value > 1000000) {
      console.warn(`Index ${index.symbol} has unreasonable value: ${index.value}`)
      return false
    }
    
    // Change percent should be within reasonable daily movement (-20% to +20%)
    if (index.changePercent < -20 || index.changePercent > 20) {
      console.warn(`Index ${index.symbol} has unreasonable change percent: ${index.changePercent}%`)
      return false
    }
    
    return true
  }

  return (
    <div className="space-y-6">
      {/* Key Market Indices Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isValidIndex(nifty) && (
          <StatCard
            label="NIFTY 50"
            value={nifty!.value.toFixed(2)}
            change={nifty!.changePercent}
            icon={nifty!.changePercent >= 0 ? TrendingUp : TrendingDown}
            trend={nifty!.changePercent >= 0 ? 'up' : 'down'}
            changeLabel={`${formatMarketChange(nifty!.change)} (${formatMarketChange(nifty!.changePercent)}%)`}
          />
        )}
        {isValidIndex(sensex) && (
          <StatCard
            label="BSE SENSEX"
            value={sensex!.value.toFixed(2)}
            change={sensex!.changePercent}
            icon={sensex!.changePercent >= 0 ? TrendingUp : TrendingDown}
            trend={sensex!.changePercent >= 0 ? 'up' : 'down'}
            changeLabel={`${formatMarketChange(sensex!.change)} (${formatMarketChange(sensex!.changePercent)}%)`}
          />
        )}
        {isValidIndex(sp500) && (
          <StatCard
            label="S&P 500"
            value={sp500!.value.toFixed(2)}
            change={sp500!.changePercent}
            icon={sp500!.changePercent >= 0 ? TrendingUp : TrendingDown}
            trend={sp500!.changePercent >= 0 ? 'up' : 'down'}
            changeLabel={`${formatMarketChange(sp500!.change)} (${formatMarketChange(sp500!.changePercent)}%)`}
          />
        )}
        {isValidIndex(nasdaq) && (
          <StatCard
            label="NASDAQ"
            value={nasdaq!.value.toFixed(2)}
            change={nasdaq!.changePercent}
            icon={nasdaq!.changePercent >= 0 ? TrendingUp : TrendingDown}
            trend={nasdaq!.changePercent >= 0 ? 'up' : 'down'}
            changeLabel={`${formatMarketChange(nasdaq!.change)} (${formatMarketChange(nasdaq!.changePercent)}%)`}
          />
        )}
      </div>

      {/* Market Summary Metrics */}
      <DashboardCard>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Market Summary</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Average Change</p>
              <p className={`text-2xl font-bold ${getMarketStatusColor(metrics.averageChange)}`}>
                {formatMarketChange(metrics.averageChange)}%
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Volume</p>
              <p className="text-2xl font-bold">
                {formatCompactNumber(metrics.totalVolume)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Gainers</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {metrics.positiveCount}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Losers</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {metrics.negativeCount}
              </p>
            </div>
          </div>
        </div>
      </DashboardCard>

      {/* Indian Indices */}
      {indian.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Indian Markets</h3>
          <MarketIndicesGrid indices={indian} />
        </div>
      )}

      {/* US Indices */}
      {us.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">US Markets</h3>
          <MarketIndicesGrid indices={us} />
        </div>
      )}
    </div>
  )
}
