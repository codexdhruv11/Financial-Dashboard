'use client'

import React, { useState, useMemo } from 'react'
import { LineChart } from '@/components/dashboard/charts/line-chart'
import { 
  generateLeadTrendData, 
  prepareLeadTrendsChartData
} from '@/lib/dashboard-utils'
import { Lead } from '@/types'
import { Skeleton } from '@/components/ui/skeleton'

export interface LeadsTrendChartProps {
  leads: Lead[]
  loading?: boolean
  error?: string
  className?: string
}

export function LeadsTrendChart({
  leads,
  loading = false,
  error,
  className = '',
}: LeadsTrendChartProps) {
  const [timePeriod, setTimePeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  
  // Memoize trend data generation based on leads and time period
  const trendData = useMemo(() => {
    return generateLeadTrendData(leads || [], timePeriod)
  }, [leads, timePeriod])
  
  // Memoize chart data preparation based on trend data
  const chartData = useMemo(() => {
    return prepareLeadTrendsChartData(trendData)
  }, [trendData])

  if (loading) {
    return <Skeleton className="h-[300px] w-full" />
  }

  if (error || !leads || leads.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        <p className="text-sm">{error || 'No lead data available'}</p>
      </div>
    )
  }

  return (
    <LineChart 
      data={chartData} 
      size="medium"
      loading={loading}
      error={error}
      timePeriod={timePeriod}
      onTimePeriodChange={setTimePeriod}
      className={className}
    />
  )
}
