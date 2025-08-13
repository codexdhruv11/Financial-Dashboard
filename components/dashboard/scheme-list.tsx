"use client"

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Asset } from '@/types'
import { 
  getAssetCategoryIcon,
  formatCurrency,
  formatPercentage
} from '@/lib/dashboard-utils'
import { cn } from '@/lib/utils'
import { ArrowUp, ArrowDown, Minus } from 'lucide-react'

interface SchemeListProps {
  assets: Asset[]
  className?: string
  compact?: boolean
  showPerformance?: boolean
  limit?: number
}

export function SchemeList({
  assets,
  className,
  compact = false,
  showPerformance = true,
  limit
}: SchemeListProps) {
  const displayAssets = limit ? assets.slice(0, limit) : assets
  const totalValue = assets.reduce((sum, asset) => sum + asset.totalValue, 0)

  if (displayAssets.length === 0) {
    return (
      <div className={cn("text-center py-8 text-muted-foreground", className)}>
        <p>No schemes available</p>
      </div>
    )
  }

  const getPerformanceIcon = (performance?: number) => {
    if (!performance) return Minus
    return performance > 0 ? ArrowUp : performance < 0 ? ArrowDown : Minus
  }

  const getPerformanceColor = (performance?: number) => {
    if (!performance) return 'text-muted-foreground'
    return performance > 0 ? 'text-success' : performance < 0 ? 'text-danger' : 'text-muted-foreground'
  }

  return (
    <div className={cn("space-y-2", className)}>
      {displayAssets.map((asset) => {
        const Icon = getAssetCategoryIcon(asset.category)
        const allocation = totalValue > 0 ? (asset.totalValue / totalValue) * 100 : 0
        const dayPerformance = asset.performance?.day || 0
        const PerformanceIcon = getPerformanceIcon(dayPerformance)
        const performanceColor = getPerformanceColor(dayPerformance)
        
        return (
          <div
            key={asset.id}
            className={cn(
              "flex items-center justify-between rounded-lg border bg-card transition-colors hover:bg-accent/50",
              compact ? "p-2" : "p-3"
            )}
          >
            <div className="flex items-center gap-3 flex-1">
              <div className={cn(
                "flex items-center justify-center rounded-full bg-muted",
                compact ? "h-8 w-8" : "h-10 w-10"
              )}>
                <Icon className={cn("text-muted-foreground", compact ? "h-4 w-4" : "h-5 w-5")} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={cn(
                    "font-medium truncate",
                    compact ? "text-sm" : "text-base"
                  )}>
                    {asset.name}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {asset.symbol}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className={cn(
                    "text-muted-foreground",
                    compact ? "text-xs" : "text-sm"
                  )}>
                    {asset.category}
                  </span>
                  <span className={cn(
                    "text-muted-foreground",
                    compact ? "text-xs" : "text-sm"
                  )}>
                    {allocation.toFixed(1)}% allocation
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className={cn(
                  "font-semibold",
                  compact ? "text-sm" : "text-base"
                )}>
                  {formatCurrency(asset.totalValue)}
                </div>
                {showPerformance && (
                  <div className={cn("flex items-center gap-1 justify-end", compact && "text-xs")}>
                    <PerformanceIcon className={cn("h-3 w-3", performanceColor)} />
                    <span className={performanceColor}>
                      {formatPercentage(dayPerformance, 1, false)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
      
      {limit && assets.length > limit && (
        <div className="text-center pt-2">
          <button className="text-sm text-primary hover:underline">
            View all {assets.length} schemes
          </button>
        </div>
      )}
    </div>
  )
}

// Loading skeleton
export function SchemeListSkeleton({
  count = 5,
  className,
  compact = false
}: {
  count?: number
  className?: string
  compact?: boolean
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "flex items-center justify-between rounded-lg border bg-card",
            compact ? "p-2" : "p-3"
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "rounded-full bg-muted animate-pulse",
              compact ? "h-8 w-8" : "h-10 w-10"
            )} />
            <div className="space-y-1">
              <div className={cn(
                "h-4 w-32 bg-muted rounded animate-pulse",
                compact && "h-3"
              )} />
              <div className={cn(
                "h-3 w-24 bg-muted rounded animate-pulse",
                compact && "h-2"
              )} />
            </div>
          </div>
          <div className="space-y-1">
            <div className={cn(
              "h-4 w-20 bg-muted rounded animate-pulse",
              compact && "h-3"
            )} />
            <div className={cn(
              "h-3 w-16 bg-muted rounded animate-pulse",
              compact && "h-2"
            )} />
          </div>
        </div>
      ))}
    </div>
  )
}
