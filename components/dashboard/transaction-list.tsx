"use client"

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { 
  formatDashboardDate, 
  formatTransactionAmount, 
  getTransactionTypeIcon,
  getTransactionStatusBadgeVariant 
} from '@/lib/dashboard-utils'
import { Transaction } from '@/types'
import { cn } from '@/lib/utils'

export interface TransactionListProps {
  transactions: Transaction[]
  className?: string
  showDate?: boolean
  showStatus?: boolean
  compact?: boolean
}

export function TransactionList({
  transactions,
  className,
  showDate = true,
  showStatus = true,
  compact = false
}: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className={cn("flex items-center justify-center py-8 text-muted-foreground", className)}>
        <p className="text-sm">No transactions to display</p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-2", className)}>
      {transactions.map((transaction) => {
        const Icon = getTransactionTypeIcon(transaction.type)
        const badgeVariant = getTransactionStatusBadgeVariant(transaction.status)
        
        return (
          <div
            key={transaction.id}
            className={cn(
              "flex items-center justify-between rounded-lg border bg-card p-3 transition-colors hover:bg-accent/50",
              compact && "p-2"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full bg-muted",
                compact && "h-8 w-8"
              )}>
                <Icon className={cn("h-5 w-5 text-muted-foreground", compact && "h-4 w-4")} />
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "font-medium",
                    compact && "text-sm"
                  )}>
                    {transaction.company || transaction.symbol || 'Transaction'}
                  </span>
                  {transaction.symbol && transaction.company && (
                    <span className="text-xs text-muted-foreground">
                      {transaction.symbol}
                    </span>
                  )}
                </div>
                
                {showDate && (
                  <span className={cn(
                    "text-sm text-muted-foreground",
                    compact && "text-xs"
                  )}>
                    {formatDashboardDate(transaction.date, 'short')}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className={cn(
                  "font-semibold",
                  compact && "text-sm",
                  transaction.type === 'Buy' || transaction.type === 'Withdrawal' 
                    ? "text-danger" 
                    : "text-success"
                )}>
                  {formatTransactionAmount(transaction.total, transaction.type)}
                </div>
                {transaction.quantity > 1 && transaction.price && (
                  <div className="text-xs text-muted-foreground">
                    {transaction.quantity} @ {formatTransactionAmount(transaction.price, transaction.type, false)}
                  </div>
                )}
              </div>
              
              {showStatus && (
                <Badge variant={badgeVariant} className={compact ? "text-xs px-2 py-0" : ""}>
                  {transaction.status}
                </Badge>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Loading skeleton for TransactionList
export function TransactionListSkeleton({
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
            "flex items-center justify-between rounded-lg border bg-card p-3",
            compact && "p-2"
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "h-10 w-10 rounded-full bg-muted animate-pulse",
              compact && "h-8 w-8"
            )} />
            <div className="flex flex-col gap-1">
              <div className={cn(
                "h-4 w-24 bg-muted rounded animate-pulse",
                compact && "h-3"
              )} />
              <div className={cn(
                "h-3 w-16 bg-muted rounded animate-pulse",
                compact && "h-2"
              )} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={cn(
              "h-5 w-20 bg-muted rounded animate-pulse",
              compact && "h-4"
            )} />
            <div className={cn(
              "h-5 w-16 bg-muted rounded-full animate-pulse",
              compact && "h-4"
            )} />
          </div>
        </div>
      ))}
    </div>
  )
}
