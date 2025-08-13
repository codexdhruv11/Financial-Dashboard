"use client"

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Asset, AssetCategory } from '@/types'
import { 
  calculateAssetAllocation,
  getAssetCategoryIcon,
  formatCurrency,
  formatPercentage
} from '@/lib/dashboard-utils'
import { cn } from '@/lib/utils'

interface AssetAllocationBreakdownProps {
  assets: Asset[]
  className?: string
}

export function AssetAllocationBreakdown({
  assets,
  className
}: AssetAllocationBreakdownProps) {
  const allocations = calculateAssetAllocation(assets)

  if (allocations.length === 0) {
    return (
      <div className={cn("text-center py-8 text-muted-foreground", className)}>
        <p>No asset allocation data available</p>
      </div>
    )
  }

  const getCategoryColor = (category: AssetCategory): string => {
    switch (category) {
      case AssetCategory.Stock:
        return 'text-blue-600 bg-blue-50'
      case AssetCategory.Bond:
        return 'text-green-600 bg-green-50'
      case AssetCategory.ETF:
        return 'text-purple-600 bg-purple-50'
      case AssetCategory.MutualFund:
        return 'text-orange-600 bg-orange-50'
      case AssetCategory.Crypto:
        return 'text-yellow-600 bg-yellow-50'
      case AssetCategory.Cash:
        return 'text-gray-600 bg-gray-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {allocations.map((allocation) => {
        const Icon = getAssetCategoryIcon(allocation.category)
        const colorClass = getCategoryColor(allocation.category)
        
        return (
          <div
            key={allocation.category}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", colorClass)}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-sm">{allocation.category}</p>
                <p className="text-xs text-muted-foreground">
                  {allocation.count} {allocation.count === 1 ? 'asset' : 'assets'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold text-sm">
                  {formatCurrency(allocation.value)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {allocation.percentage.toFixed(1)}%
                </p>
              </div>
              
              {/* Progress bar */}
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn("h-full transition-all", colorClass.split(' ')[0].replace('text', 'bg'))}
                  style={{ width: `${Math.min(allocation.percentage, 100)}%` }}
                />
              </div>
            </div>
          </div>
        )
      })}

      {/* Total summary */}
      <div className="pt-3 border-t">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-muted-foreground">
            Total Portfolio Value
          </span>
          <span className="text-lg font-bold">
            {formatCurrency(assets.reduce((sum, asset) => sum + asset.totalValue, 0))}
          </span>
        </div>
      </div>
    </div>
  )
}

// Loading skeleton
export function AssetAllocationBreakdownSkeleton({
  className
}: {
  className?: string
}) {
  return (
    <div className={cn("space-y-4", className)}>
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between p-3 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-muted animate-pulse" />
            <div className="space-y-1">
              <div className="h-4 w-20 bg-muted rounded animate-pulse" />
              <div className="h-3 w-16 bg-muted rounded animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="space-y-1">
              <div className="h-4 w-16 bg-muted rounded animate-pulse" />
              <div className="h-3 w-12 bg-muted rounded animate-pulse" />
            </div>
            <div className="w-24 h-2 bg-muted rounded-full animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}
