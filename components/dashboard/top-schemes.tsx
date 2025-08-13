"use client"

import React from 'react'
import { DashboardCard } from './dashboard-card'
import { Badge } from '@/components/ui/badge'
import { Asset } from '@/types'
import { 
  getAssetCategoryIcon,
  formatCurrency,
  formatPercentage,
  getTopPerformingAssets
} from '@/lib/dashboard-utils'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Star } from 'lucide-react'

interface TopSchemesProps {
  assets: Asset[]
  className?: string
  featured?: string[] // Names or symbols of featured schemes (e.g., HDFC, ICICI)
}

export function TopSchemes({
  assets,
  className,
  featured = ['HDFC', 'ICICI']
}: TopSchemesProps) {
  // Get featured schemes (HDFC, ICICI)
  const featuredSchemes = assets.filter(asset => 
    featured.some(f => 
      asset.name.toLowerCase().includes(f.toLowerCase()) || 
      asset.symbol.toLowerCase().includes(f.toLowerCase())
    )
  )

  // Get top performing schemes that aren't already featured
  const topPerformers = getTopPerformingAssets(assets, 3).filter(
    asset => !featuredSchemes.find(f => f.id === asset.id)
  )

  // Combine featured and top performers
  const displaySchemes = [...featuredSchemes, ...topPerformers].slice(0, 4)

  if (displaySchemes.length === 0) {
    return null
  }

  return (
    <div className={cn("grid gap-4 md:grid-cols-2", className)}>
      {displaySchemes.map((asset) => {
        const Icon = getAssetCategoryIcon(asset.category)
        const dayPerformance = asset.performance?.day || 0
        const weekPerformance = asset.performance?.week || 0
        const monthPerformance = asset.performance?.month || 0
        const isFeatured = featuredSchemes.find(f => f.id === asset.id)
        
        return (
          <DashboardCard
            key={asset.id}
            variant="compact"
            className={cn(
              "relative overflow-hidden",
              isFeatured && "ring-2 ring-primary"
            )}
          >
            {isFeatured && (
              <div className="absolute top-2 right-2">
                <Badge variant="default" className="gap-1">
                  <Star className="h-3 w-3" />
                  Featured
                </Badge>
              </div>
            )}
            
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">
                      {asset.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {asset.symbol}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {asset.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Current Value</span>
                  <span className="font-bold text-lg">
                    {formatCurrency(asset.totalValue)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Quantity</span>
                  <span className="font-medium">
                    {asset.quantity.toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Day</p>
                    <p className={cn(
                      "text-sm font-medium",
                      dayPerformance > 0 ? "text-success" : dayPerformance < 0 ? "text-danger" : ""
                    )}>
                      {formatPercentage(dayPerformance, 1, true)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Week</p>
                    <p className={cn(
                      "text-sm font-medium",
                      weekPerformance > 0 ? "text-success" : weekPerformance < 0 ? "text-danger" : ""
                    )}>
                      {formatPercentage(weekPerformance, 1, true)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Month</p>
                    <p className={cn(
                      "text-sm font-medium",
                      monthPerformance > 0 ? "text-success" : monthPerformance < 0 ? "text-danger" : ""
                    )}>
                      {formatPercentage(monthPerformance, 1, true)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Performance indicator */}
              {dayPerformance !== 0 && (
                <div className={cn(
                  "absolute bottom-0 left-0 right-0 h-1",
                  dayPerformance > 0 ? "bg-success" : "bg-danger"
                )} />
              )}
            </div>
          </DashboardCard>
        )
      })}
    </div>
  )
}

// Loading skeleton
export function TopSchemesSkeleton({
  className
}: {
  className?: string
}) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2", className)}>
      {[1, 2, 3, 4].map((i) => (
        <DashboardCard key={i} variant="compact">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-muted animate-pulse" />
              <div className="space-y-1 flex-1">
                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                <div className="h-3 w-24 bg-muted rounded animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                <div className="h-5 w-24 bg-muted rounded animate-pulse" />
              </div>
              <div className="flex justify-between">
                <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                <div className="h-4 w-16 bg-muted rounded animate-pulse" />
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="space-y-1">
                    <div className="h-3 w-8 bg-muted rounded animate-pulse mx-auto" />
                    <div className="h-4 w-12 bg-muted rounded animate-pulse mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DashboardCard>
      ))}
    </div>
  )
}
