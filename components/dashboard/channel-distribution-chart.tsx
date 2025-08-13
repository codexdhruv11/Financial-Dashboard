'use client'

import React, { useMemo } from 'react'
import { DonutChart } from '@/components/dashboard/charts/donut-chart'
import { 
  calculateChannelBreakdown, 
  prepareChannelDistributionChartData,
  formatCompactNumber,
  formatPercentage,
  getLeadSourceIcon 
} from '@/lib/dashboard-utils'
import { Lead } from '@/types'
import { Skeleton } from '@/components/ui/skeleton'

export interface ChannelDistributionChartProps {
  leads: Lead[]
  loading?: boolean
  error?: string
  className?: string
}

export function ChannelDistributionChart({
  leads,
  loading = false,
  error,
  className = '',
}: ChannelDistributionChartProps) {
  // Memoize channel breakdown calculation to prevent recalculation on every render
  const channels = useMemo(
    () => calculateChannelBreakdown(leads || []),
    [leads]
  )
  
  // Memoize chart data preparation
  const chartData = useMemo(
    () => prepareChannelDistributionChartData(channels),
    [channels]
  )
  
  // Memoize total leads calculation
  const totalLeads = useMemo(
    () => channels.reduce((sum, channel) => sum + channel.count, 0),
    [channels]
  )

  if (loading) {
    return <Skeleton className="h-[300px] w-full" />
  }

  if (error || !leads || leads.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        <p className="text-sm">{error || 'No leads available'}</p>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
      <div>
        <DonutChart 
          data={chartData} 
          size="medium"
          centerText={{
            value: formatCompactNumber(totalLeads),
            label: 'Total Leads'
          }}
          loading={loading}
          error={error}
        />
      </div>
      <div className="space-y-3">
        <div className="text-sm text-muted-foreground mb-4">
          Channel Distribution
        </div>
        {channels.map((channel, index) => {
          const colors = chartData.datasets[0].backgroundColor as string[]
          const Icon = getLeadSourceIcon(channel.source)
          return (
            <div key={channel.source} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: colors[index] }}
                />
                <Icon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{channel.source}</p>
                  <p className="text-xs text-muted-foreground">{formatPercentage(channel.percentage, 1, false)} of total</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{channel.count}</p>
                <p className="text-xs text-muted-foreground">leads</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
