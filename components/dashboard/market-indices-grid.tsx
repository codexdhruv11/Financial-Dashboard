'use client'

import { MarketData } from '@/types'
import { StatCard } from '@/components/dashboard/stat-card'
import { 
  getMarketStatusColor, 
  formatMarketChange,
  getMarketTrendIcon,
  formatCompactNumber
} from '@/lib/dashboard-utils'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Clock, TrendingUp, TrendingDown } from 'lucide-react'

interface MarketIndicesGridProps {
  indices: MarketData[]
  isLoading?: boolean
}

export function MarketIndicesGrid({ indices, isLoading }: MarketIndicesGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    )
  }

  if (!indices || indices.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          No market data available
        </div>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {indices.map((index) => {
        const Icon = getMarketTrendIcon(index.changePercent)
        const isPositive = index.changePercent >= 0
        
        return (
          <Card key={index.symbol} className="overflow-hidden">
            <div className="p-4 space-y-3">
              {/* Header with Symbol and Icon */}
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-sm">{index.symbol}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {index.name}
                  </p>
                </div>
                <Icon className={`h-5 w-5 ${getMarketStatusColor(index.changePercent)}`} />
              </div>

              {/* Current Value */}
              <div>
                <p className="text-2xl font-bold">
                  {index.value.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </p>
              </div>

              {/* Change Information */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${getMarketStatusColor(index.changePercent)}`}>
                    {formatMarketChange(index.change)}
                  </span>
                  <span className={`text-sm px-1.5 py-0.5 rounded ${
                    isPositive 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                      : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {formatMarketChange(index.changePercent)}%
                  </span>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t text-xs">
                <div>
                  <p className="text-muted-foreground">Volume</p>
                  <p className="font-medium">{formatCompactNumber(index.volume)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">52W Range</p>
                  <p className="font-medium">
                    {formatCompactNumber(index.low52Week)} - {formatCompactNumber(index.high52Week)}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
