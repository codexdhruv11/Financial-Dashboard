"use client"

import React from 'react'
import { DashboardCard, DashboardCardProps } from '@/components/dashboard/dashboard-card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ArrowDown, ArrowUp, Minus, TrendingDown, TrendingUp, LucideIcon } from 'lucide-react'

export interface StatCardProps extends Omit<DashboardCardProps, 'children'> {
  value: string | number
  label: string
  change?: number
  changeLabel?: string
  trend?: 'up' | 'down' | 'neutral'
  icon?: LucideIcon
  size?: 'small' | 'medium' | 'large'
  valuePrefix?: string
  valueSuffix?: string
  loading?: boolean
  badge?: string
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

export function StatCard({
  value,
  label,
  change,
  changeLabel = 'vs last period',
  trend,
  icon: Icon,
  size = 'medium',
  valuePrefix,
  valueSuffix,
  loading = false,
  badge,
  badgeVariant = 'default',
  className,
  ...props
}: StatCardProps) {
  // Determine trend based on change if not explicitly provided
  const effectiveTrend = trend || (change !== undefined ? (change > 0 ? 'up' : change < 0 ? 'down' : 'neutral') : undefined)
  
  const sizeClasses = {
    small: {
      value: 'text-xl md:text-2xl',
      label: 'text-xs',
      change: 'text-xs',
      icon: 'h-4 w-4',
      padding: 'p-3',
    },
    medium: {
      value: 'text-2xl md:text-3xl lg:text-4xl',
      label: 'text-sm',
      change: 'text-sm',
      icon: 'h-5 w-5',
      padding: 'p-4',
    },
    large: {
      value: 'text-3xl md:text-4xl lg:text-5xl',
      label: 'text-base',
      change: 'text-base',
      icon: 'h-6 w-6',
      padding: 'p-6',
    },
  }

  const trendConfig = {
    up: {
      icon: TrendingUp,
      arrow: ArrowUp,
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20',
    },
    down: {
      icon: TrendingDown,
      arrow: ArrowDown,
      color: 'text-danger',
      bgColor: 'bg-danger/10',
      borderColor: 'border-danger/20',
    },
    neutral: {
      icon: Minus,
      arrow: Minus,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
      borderColor: 'border-muted',
    },
  }

  const currentSize = sizeClasses[size]
  const currentTrend = effectiveTrend ? trendConfig[effectiveTrend] : null

  if (loading) {
    return (
      <DashboardCard
        variant="compact"
        className={cn(currentSize.padding, className)}
        {...props}
      >
        <div className="space-y-3">
          <div className="skeleton h-4 w-24" />
          <div className="skeleton h-10 w-32" />
          <div className="skeleton h-3 w-20" />
        </div>
      </DashboardCard>
    )
  }

  const TrendIcon = currentTrend?.arrow
  const formattedChange = change !== undefined ? 
    `${change > 0 ? '+' : ''}${change.toFixed(1)}%` : null

  return (
    <DashboardCard
      variant="compact"
      className={cn(currentSize.padding, className)}
      icon={Icon}
      actions={badge && <Badge variant={badgeVariant}>{badge}</Badge>}
      {...props}
    >
      <div className="space-y-2">
        <p className={cn('text-muted-foreground font-medium', currentSize.label)}>
          {label}
        </p>
        
        <div className="flex items-baseline gap-2">
          <div className={cn('font-bold', currentSize.value)}>
            {valuePrefix}
            {typeof value === 'number' ? value.toLocaleString() : value}
            {valueSuffix}
          </div>
        </div>

        {(change !== undefined || effectiveTrend) && (
          <div className="flex items-center gap-2">
            {currentTrend && (
              <div className={cn(
                'inline-flex items-center gap-1 rounded-md px-2 py-1',
                currentTrend.bgColor,
                'border',
                currentTrend.borderColor
              )}>
                {TrendIcon && (
                  <TrendIcon className={cn('h-3 w-3', currentTrend.color)} />
                )}
                {formattedChange && (
                  <span className={cn('font-medium', currentSize.change, currentTrend.color)}>
                    {formattedChange}
                  </span>
                )}
              </div>
            )}
            {changeLabel && (
              <span className={cn('text-muted-foreground', currentSize.change)}>
                {changeLabel}
              </span>
            )}
          </div>
        )}
      </div>
    </DashboardCard>
  )
}

// Grid layout component for stat cards
export function StatCardGrid({ 
  children,
  columns = 4,
  className,
  ...props
}: {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4 | 5 | 6
  className?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  }

  return (
    <div 
      className={cn(
        'grid gap-4',
        columnClasses[columns],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Loading skeleton for StatCard
export function StatCardSkeleton({
  size = 'medium',
  className,
  ...props
}: Pick<StatCardProps, 'size' | 'className'>) {
  return <StatCard value="" label="" loading size={size} className={className} {...props} />
}
