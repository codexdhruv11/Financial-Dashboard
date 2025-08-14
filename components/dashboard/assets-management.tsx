"use client"

import React, { useState } from 'react'
import { DashboardCard } from './dashboard-card'
import { StatCard, StatCardGrid } from './stat-card'
import { AssetAllocationBreakdown } from './asset-allocation-breakdown'
import { AssetAllocationChart } from './asset-allocation-chart'
import { SchemeList } from './scheme-list'
import { TopSchemes } from './top-schemes'
import { useAssets } from '@/lib/data-fetching'
import { 
  calculatePortfolioTotals,
  formatCurrency,
  formatPercentage
} from '@/lib/dashboard-utils'
import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart,
  Briefcase,
  Activity,
  AlertCircle,
  BarChart3,
  List
} from 'lucide-react'

interface AssetsManagementProps {
  className?: string
}

export function AssetsManagement({ className }: AssetsManagementProps) {
  const { data, loading, error } = useAssets()
  const assets = data?.data || []

  if (loading) {
    return <AssetsManagementSkeleton className={className} />
  }

  if (error) {
    return (
      <div className={cn("rounded-lg border bg-card p-8 text-center", className)}>
        <AlertCircle className="h-12 w-12 mx-auto text-danger mb-4" />
        <h3 className="text-lg font-semibold mb-2">Error Loading Assets</h3>
        <p className="text-muted-foreground">{error?.message || 'Failed to load assets'}</p>
      </div>
    )
  }

  if (assets.length === 0) {
    return (
      <div className={cn("rounded-lg border bg-card p-8 text-center", className)}>
        <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="font-semibold text-lg mb-2">No Assets Found</h3>
        <p className="text-muted-foreground">Start building your portfolio by adding assets</p>
      </div>
    )
  }

  const portfolioTotals = calculatePortfolioTotals(assets)

  return (
    <div className={cn("space-y-6", className)}>
      {/* Quick summary of how the portfolio is doing */}
      <StatCardGrid columns={4}>
        <StatCard
          label="Total Portfolio Value"
          value={formatCurrency(portfolioTotals.totalValue)}
          icon={DollarSign}
          size="medium"
        />
        <StatCard
          label="Total Gains"
          value={formatCurrency(Math.abs(portfolioTotals.totalGains))}
          change={portfolioTotals.totalGainsPercentage}
          changeLabel="all time"
          icon={portfolioTotals.totalGains >= 0 ? TrendingUp : TrendingDown}
          trend={portfolioTotals.totalGains >= 0 ? 'up' : 'down'}
          size="medium"
        />
        <StatCard
          label="Day Change"
          value={formatCurrency(Math.abs(portfolioTotals.dayChange))}
          change={portfolioTotals.dayChangePercentage}
          changeLabel="today"
          icon={Activity}
          trend={portfolioTotals.dayChange >= 0 ? 'up' : 'down'}
          size="medium"
        />
        <StatCard
          label="Total Assets"
          value={assets.length.toString()}
          icon={Briefcase}
          size="medium"
        />
      </StatCardGrid>

      {/* Best performing investments right now */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Top Schemes</h3>
        <TopSchemes assets={assets} />
      </div>

      {/* Split view showing allocation and holdings */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Nice visual breakdown of where money is invested */}
        <DashboardCard
          title="Asset Allocation"
          description="Portfolio breakdown by category"
          icon={PieChart}
          className="lg:col-span-1"
        >
          <Tabs defaultValue="chart" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chart" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span>Chart View</span>
              </TabsTrigger>
              <TabsTrigger value="breakdown" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                <span>Details</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="chart" className="mt-4">
              <div className="min-h-[300px]">
                <AssetAllocationChart 
                  assets={assets} 
                  size="medium"
                  ariaLabel="Asset allocation pie chart"
                  ariaDescription="Visual representation of portfolio asset allocation by category"
                />
              </div>
            </TabsContent>
            <TabsContent value="breakdown" className="mt-4">
              <div className="min-h-[300px]">
                <AssetAllocationBreakdown assets={assets} />
              </div>
            </TabsContent>
          </Tabs>
        </DashboardCard>

        {/* List of all the investments */}
        <DashboardCard
          title="All Schemes"
          description={`${assets.length} schemes in portfolio`}
          icon={Briefcase}
        >
          <SchemeList 
            assets={assets} 
            compact={true}
            limit={5}
          />
        </DashboardCard>
      </div>
    </div>
  )
}

// Shows while we're fetching the data
export function AssetsManagementSkeleton({
  className
}: {
  className?: string
}) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Loading placeholders for the stat cards */}
      <StatCardGrid columns={4}>
        {[1, 2, 3, 4].map(i => (
          <DashboardCard key={i} variant="compact">
            <div className="space-y-3">
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              <div className="h-8 w-32 bg-muted rounded animate-pulse" />
              <div className="h-3 w-20 bg-muted rounded animate-pulse" />
            </div>
          </DashboardCard>
        ))}
      </StatCardGrid>

      {/* Loading placeholder for top performers */}
      <div>
        <div className="h-6 w-32 bg-muted rounded animate-pulse mb-4" />
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map(i => (
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
                  <div className="h-4 w-full bg-muted rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                </div>
              </div>
            </DashboardCard>
          ))}
        </div>
      </div>

      {/* Loading placeholders for the main content */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardCard>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-muted animate-pulse" />
                  <div className="space-y-1">
                    <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-12 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex justify-between items-center p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                  <div className="space-y-1">
                    <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  )
}
