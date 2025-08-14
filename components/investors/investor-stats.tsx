import React from 'react'
import { Users, DollarSign, TrendingUp, Target } from 'lucide-react'
import { Lead } from '@/types'
import { 
  calculateLeadMetrics,
  formatLeadValue
} from '@/lib/dashboard-utils'
import { StatCard, StatCardGrid } from '@/components/dashboard/stat-card'

interface InvestorStatsProps {
  leads: Lead[]
}

export function InvestorStats({ leads }: InvestorStatsProps) {
  const metrics = calculateLeadMetrics(leads)

  return (
    <StatCardGrid columns={4}>
      <StatCard
        label="Total Investors"
        value={metrics.totalLeads}
        change={12.5}
        trend="up"
        icon={Users}
        iconColor="primary"
      />
      <StatCard
        label="Potential Value"
        value={metrics.totalPotentialValue}
        valuePrefix="₹"
        formatValue={(v) => formatLeadValue(v)}
        change={8.3}
        trend="up"
        icon={DollarSign}
        iconColor="success"
      />
      <StatCard
        label="Conversion Rate"
        value={metrics.conversionRate}
        valueSuffix="%"
        change={-2.1}
        trend="down"
        icon={TrendingUp}
        iconColor="warning"
      />
      <StatCard
        label="Active Deals"
        value={metrics.activeLeads}
        change={5}
        trend="up"
        icon={Target}
        iconColor="info"
      />
    </StatCardGrid>
  )
}
