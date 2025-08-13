'use client'

import React, { useMemo } from 'react'
import { PieChart } from '@/components/dashboard/charts/pie-chart'
import { 
  calculateAssetAllocation, 
  prepareAssetAllocationChartData,
  formatCurrency,
  formatPercentage 
} from '@/lib/dashboard-utils'
import { Asset } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export interface AssetAllocationChartProps {
  assets: Asset[]
  loading?: boolean
  error?: string
  className?: string
  size?: 'small' | 'medium' | 'large'
  showLegend?: boolean
  ariaLabel?: string
  ariaDescription?: string
}

export function AssetAllocationChart({
  assets,
  loading = false,
  error,
  className = '',
  size = 'medium',
  showLegend = true,
  ariaLabel,
  ariaDescription,
}: AssetAllocationChartProps) {
  // Memoize allocation calculation to prevent recalculation on every render
  const allocation = useMemo(
    () => calculateAssetAllocation(assets || []),
    [assets]
  )
  
  // Memoize chart data preparation
  const chartData = useMemo(
    () => prepareAssetAllocationChartData(allocation),
    [allocation]
  )
  
  // Memoize total value calculation
  const totalValue = useMemo(
    () => allocation.reduce((sum, item) => sum + item.value, 0),
    [allocation]
  )

  if (loading) {
    return (
      <div className={className}>
        <Skeleton className="h-[300px] w-full" />
      </div>
    )
  }

  if (error || !assets || assets.length === 0) {
    return (
      <div className={className}>
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          <p className="text-sm">{error || 'No assets available'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className={showLegend ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : ""}>
        <div>
          <PieChart 
            data={chartData} 
            size={size}
            loading={loading}
            error={error}
            ariaLabel={ariaLabel}
            ariaDescription={ariaDescription}
          />
        </div>
        {showLegend && (
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground mb-4">
              Total Portfolio Value: <span className="text-foreground font-semibold">{formatCurrency(totalValue)}</span>
            </div>
            {allocation.map((item, index) => {
              const colors = chartData.datasets[0].backgroundColor as string[]
              return (
                <div key={item.category} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: colors[index] }}
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-sm font-medium">{item.category}</p>
                      <p className="text-xs text-muted-foreground">{item.count} assets</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(item.value)}</p>
                    <p className="text-xs text-muted-foreground">{formatPercentage(item.percentage, 1, false)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
