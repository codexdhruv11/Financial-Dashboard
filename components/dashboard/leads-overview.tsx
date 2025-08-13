'use client'

import { StatCard } from '@/components/dashboard/stat-card'
import { DashboardCard } from '@/components/dashboard/dashboard-card'
import { ErrorDisplay } from '@/components/dashboard/error-display'
import { useLeads } from '@/lib/data-fetching'
import { 
  calculateChannelBreakdown,
  calculateLeadMetrics,
  getTopProspectCompanies,
  formatLeadValue,
  formatCompactNumber
} from '@/lib/dashboard-utils'
import { ChannelBreakdown } from './channel-breakdown'
import { ChannelDistributionChart } from './channel-distribution-chart'
import { LeadsTrendChart } from './leads-trend-chart'
import { ProspectCompanies } from './prospect-companies'
import { Skeleton } from '@/components/ui/skeleton'
import { Users, DollarSign, TrendingUp, Target, PieChart, LineChart } from 'lucide-react'

export function LeadsOverview() {
  const { data: leadsResponse, loading, error } = useLeads()

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  if (error || !leadsResponse) {
    return (
      <ErrorDisplay 
        error={error || new Error('No leads data available')} 
        context="leads"
      />
    )
  }

  // Extract the leads array from the paginated response
  const leads = leadsResponse.data || []
  
  const metrics = calculateLeadMetrics(leads)
  const channelBreakdown = calculateChannelBreakdown(leads)
  const topProspects = getTopProspectCompanies(leads, 5)

  return (
    <div className="space-y-6">
      {/* Key Lead Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Leads"
          value={metrics.totalLeads.toString()}
          icon={Users}
          // Remove change props until historical data is available
        />
        <StatCard
          label="Pipeline Value"
          value={formatLeadValue(metrics.totalPotentialValue)}
          icon={DollarSign}
        />
        <StatCard
          label="Conversion Rate"
          value={`${metrics.conversionRate.toFixed(1)}%`}
          icon={TrendingUp}
        />
        <StatCard
          label="Qualified Leads"
          value={metrics.qualifiedLeads.toString()}
          icon={Target}
        />
      </div>

      {/* Lead Summary Metrics */}
      <DashboardCard>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Lead Summary</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Active Leads</p>
              <p className="text-2xl font-bold">
                {metrics.activeLeads}
              </p>
              <p className="text-xs text-muted-foreground">
                Currently in pipeline
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Average Deal Size</p>
              <p className="text-2xl font-bold">
                {formatLeadValue(metrics.averageDealSize)}
              </p>
              <p className="text-xs text-muted-foreground">
                Per qualified lead
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Pipeline</p>
              <p className="text-2xl font-bold">
                {formatLeadValue(metrics.totalPotentialValue)}
              </p>
              <p className="text-xs text-muted-foreground">
                Potential revenue
              </p>
            </div>
          </div>
        </div>
      </DashboardCard>

      {/* Prospect Trends Chart */}
      <DashboardCard
        title="Prospect Trends"
        description="Lead acquisition and conversion trends over time"
        icon={LineChart}
      >
        <div className="p-6">
          <LeadsTrendChart leads={leads} />
        </div>
      </DashboardCard>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Channel Distribution Chart */}
        <DashboardCard
          title="Lead Sources"
          description="Distribution of leads by acquisition channel"
          icon={PieChart}
        >
          <div className="p-6">
            <ChannelDistributionChart leads={leads} />
          </div>
        </DashboardCard>

        {/* Top Prospect Companies */}
        <DashboardCard>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Top Prospects</h3>
            <ProspectCompanies prospects={topProspects} />
          </div>
        </DashboardCard>
      </div>
    </div>
  )
}
