"use client"

import React, { useMemo } from 'react'
import { ArrowUpIcon, ArrowDownIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { StatCard } from './stat-card'
import { TransactionList } from './transaction-list'
import { Badge } from '@/components/ui/badge'
import { Transaction, TransactionType, TransactionStatus } from '@/types'
import { formatTransactionAmount } from '@/lib/dashboard-utils'
import { cn } from '@/lib/utils'

export interface TransactionSnapshotProps {
  transactions: Transaction[]
  className?: string
  showList?: boolean
  listLimit?: number
}

export function TransactionSnapshot({
  transactions,
  className,
  showList = true,
  listLimit = 5
}: TransactionSnapshotProps) {
  // Crunch the numbers to get our dashboard metrics
  const metrics = useMemo(() => {
    // Make sure we actually have an array to work with
    const safeTransactions = Array.isArray(transactions) ? transactions : []
    
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    // Just look at the last month's activity
    const recentTransactions = safeTransactions.filter(t => 
      new Date(t.date) >= thirtyDaysAgo
    )
    
    // Track money coming in vs going out
    let inflow = 0
    let outflow = 0
    let inflowCount = 0
    let outflowCount = 0
    
    // Keep tabs on transaction statuses
    const statusCounts = {
      [TransactionStatus.Pending]: 0,
      [TransactionStatus.Expired]: 0,
      [TransactionStatus.Reviewed]: 0,
      [TransactionStatus.Completed]: 0,
      [TransactionStatus.Failed]: 0,
      [TransactionStatus.Cancelled]: 0
    }
    
    recentTransactions.forEach(transaction => {
      if (transaction.type === TransactionType.Sell || transaction.type === TransactionType.Deposit) {
        inflow += transaction.total
        inflowCount++
      } else if (transaction.type === TransactionType.Buy || transaction.type === TransactionType.Withdrawal) {
        outflow += transaction.total
        outflowCount++
      }
      
      // Add to the status counts
      if (transaction.status in statusCounts) {
        statusCounts[transaction.status]++
      }
    })
    
    // Get previous month's data for comparison
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)
    const previousTransactions = safeTransactions.filter(t => {
      const date = new Date(t.date)
      return date >= sixtyDaysAgo && date < thirtyDaysAgo
    })
    
    let previousInflow = 0
    let previousOutflow = 0
    
    previousTransactions.forEach(transaction => {
      if (transaction.type === TransactionType.Sell || transaction.type === TransactionType.Deposit) {
        previousInflow += transaction.total
      } else if (transaction.type === TransactionType.Buy || transaction.type === TransactionType.Withdrawal) {
        previousOutflow += transaction.total
      }
    })
    
    // Figure out if we're doing better or worse
    const inflowChange = previousInflow > 0 
      ? ((inflow - previousInflow) / previousInflow) * 100 
      : 0
    const outflowChange = previousOutflow > 0 
      ? ((outflow - previousOutflow) / previousOutflow) * 100 
      : 0
    
    return {
      inflow,
      outflow,
      inflowCount,
      outflowCount,
      inflowChange,
      outflowChange,
      statusCounts,
      totalTransactions: recentTransactions.length,
      recentTransactions
    }
  }, [transactions])
  
  // Pick the most recent ones to show
  const displayTransactions = showList 
    ? metrics.recentTransactions.slice(0, listLimit)
    : []

  return (
    <div className={cn("space-y-6", className)}>
      {/* Money flow summary cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard
          label="Total Inflow"
          value={formatTransactionAmount(metrics.inflow, TransactionType.Deposit, false)}
          badge={`${metrics.inflowCount} transactions`}
          icon={ArrowDownIcon}
          trend={metrics.inflowChange > 0 ? 'up' : metrics.inflowChange < 0 ? 'down' : 'neutral'}
          change={metrics.inflowChange !== 0 ? metrics.inflowChange : undefined}
          className="border-l-4 border-l-success"
        />
        
        <StatCard
          label="Total Outflow"
          value={formatTransactionAmount(metrics.outflow, TransactionType.Withdrawal, false)}
          badge={`${metrics.outflowCount} transactions`}
          icon={ArrowUpIcon}
          trend={metrics.outflowChange < 0 ? 'down' : metrics.outflowChange > 0 ? 'up' : 'neutral'}
          change={metrics.outflowChange !== 0 ? metrics.outflowChange : undefined}
          className="border-l-4 border-l-danger"
        />
      </div>
      
      {/* Quick status overview badges */}
      <div className="flex flex-wrap gap-2">
        {metrics.statusCounts[TransactionStatus.Pending] > 0 && (
          <Badge variant="pending" className="gap-1">
            <span className="font-semibold">{metrics.statusCounts[TransactionStatus.Pending]}</span>
            Pending
          </Badge>
        )}
        {metrics.statusCounts[TransactionStatus.Expired] > 0 && (
          <Badge variant="expired" className="gap-1">
            <span className="font-semibold">{metrics.statusCounts[TransactionStatus.Expired]}</span>
            Expired
          </Badge>
        )}
        {metrics.statusCounts[TransactionStatus.Reviewed] > 0 && (
          <Badge variant="reviewed" className="gap-1">
            <span className="font-semibold">{metrics.statusCounts[TransactionStatus.Reviewed]}</span>
            Reviewed
          </Badge>
        )}
        {metrics.statusCounts[TransactionStatus.Completed] > 0 && (
          <Badge variant="completed" className="gap-1">
            <span className="font-semibold">{metrics.statusCounts[TransactionStatus.Completed]}</span>
            Completed
          </Badge>
        )}
        {metrics.statusCounts[TransactionStatus.Failed] > 0 && (
          <Badge variant="failed" className="gap-1">
            <span className="font-semibold">{metrics.statusCounts[TransactionStatus.Failed]}</span>
            Failed
          </Badge>
        )}
        {metrics.statusCounts[TransactionStatus.Cancelled] > 0 && (
          <Badge variant="cancelled" className="gap-1">
            <span className="font-semibold">{metrics.statusCounts[TransactionStatus.Cancelled]}</span>
            Cancelled
          </Badge>
        )}
      </div>
      
      {/* Monthly activity summary */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Transaction Activity (30 days)
          </h3>
          <span className="text-2xl font-bold">{metrics.totalTransactions}</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            {metrics.inflowChange > 0 ? (
              <TrendingUp className="h-4 w-4 text-success" />
            ) : metrics.inflowChange < 0 ? (
              <TrendingDown className="h-4 w-4 text-danger" />
            ) : null}
            <span className="text-muted-foreground">Inflow</span>
            {metrics.inflowChange !== 0 && (
              <span className={cn(
                "font-medium",
                metrics.inflowChange > 0 ? "text-success" : "text-danger"
              )}>
                {metrics.inflowChange > 0 ? '+' : ''}{metrics.inflowChange.toFixed(1)}%
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {metrics.outflowChange < 0 ? (
              <TrendingDown className="h-4 w-4 text-success" />
            ) : metrics.outflowChange > 0 ? (
              <TrendingUp className="h-4 w-4 text-danger" />
            ) : null}
            <span className="text-muted-foreground">Outflow</span>
            {metrics.outflowChange !== 0 && (
              <span className={cn(
                "font-medium",
                metrics.outflowChange < 0 ? "text-success" : "text-danger"
              )}>
                {metrics.outflowChange > 0 ? '+' : ''}{metrics.outflowChange.toFixed(1)}%
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* List of latest transactions */}
      {showList && displayTransactions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Recent Transactions</h3>
          <TransactionList 
            transactions={displayTransactions}
            showStatus={true}
            showDate={true}
          />
        </div>
      )}
    </div>
  )
}

// Placeholder while loading transaction data
export function TransactionSnapshotSkeleton({
  className
}: {
  className?: string
}) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Loading cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6 animate-pulse">
          <div className="h-4 w-24 bg-muted rounded mb-2" />
          <div className="h-8 w-32 bg-muted rounded mb-1" />
          <div className="h-3 w-40 bg-muted rounded" />
        </div>
        <div className="rounded-lg border bg-card p-6 animate-pulse">
          <div className="h-4 w-24 bg-muted rounded mb-2" />
          <div className="h-8 w-32 bg-muted rounded mb-1" />
          <div className="h-3 w-40 bg-muted rounded" />
        </div>
      </div>
      
      {/* Loading badges */}
      <div className="flex gap-2">
        <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
        <div className="h-6 w-24 bg-muted rounded-full animate-pulse" />
        <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
      </div>
      
      {/* Loading summary */}
      <div className="rounded-lg border bg-card p-4 animate-pulse">
        <div className="h-4 w-48 bg-muted rounded mb-2" />
        <div className="h-6 w-16 bg-muted rounded" />
      </div>
    </div>
  )
}
