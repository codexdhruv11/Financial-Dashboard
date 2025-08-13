"use client"

import { useEffect, useState } from 'react'
import {
  DashboardCard,
  StatCard,
  StatCardGrid,
  SectionHeader,
  SectionHeaderActions,
  TransactionSnapshot,
  AssetsManagement,
  MarketOverview,
  LeadsOverview,
  ToDoSection,
} from '@/components/dashboard'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity,
  PieChart,
  BarChart3,
  ArrowUpRight,
  Download,
  Calendar
} from 'lucide-react'
import { Transaction } from '@/types'

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch transactions from API
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/transactions')
        if (response.ok) {
          const result = await response.json()
          // Handle paginated response structure
          if (result.success && result.data) {
            setTransactions(result.data.data || [])
          } else {
            setTransactions([])
          }
        }
      } catch (error) {
        console.error('Error fetching transactions:', error)
        setTransactions([])
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  return (
    <div className="space-y-8">
      {/* Page Header with new SectionHeader component */}
      <SectionHeader
        title="Dashboard"
        description="Welcome to your financial dashboard - Track your portfolio performance and market insights"
        variant="large"
        icon={BarChart3}
        actions={
          <SectionHeaderActions
            primaryAction={{
              label: 'Generate Report',
              icon: Download,
              onClick: () => console.log('Generate report'),
            }}
            secondaryActions={[
              {
                label: 'View Calendar',
                icon: Calendar,
                onClick: () => console.log('View calendar'),
              },
            ]}
          />
        }
      />

      {/* Key Metrics using StatCard components */}
      <div>
        <SectionHeader
          title="Key Metrics"
          description="Your portfolio performance at a glance"
          variant="compact"
        />
        <StatCardGrid columns={4}>
          <StatCard
            label="Total Portfolio Value"
            value={125650}
            valuePrefix="$"
            change={12.5}
            trend="up"
            icon={DollarSign}
            iconColor="success"
          />
          <StatCard
            label="Today's Gain/Loss"
            value={2340}
            valuePrefix="+$"
            change={1.8}
            trend="up"
            icon={TrendingUp}
            iconColor="success"
          />
          <StatCard
            label="Active Positions"
            value={24}
            change={-4.2}
            trend="down"
            icon={PieChart}
            iconColor="info"
          />
          <StatCard
            label="Account Status"
            value="Active"
            badge="Premium"
            badgeVariant="default"
            icon={Activity}
            iconColor="primary"
          />
        </StatCardGrid>
      </div>

      {/* Alerts & To-Do Section */}
      <div>
        <SectionHeader
          title="Alerts & To-Do"
          description="Important tasks and investment opportunities"
          variant="compact"
        />
        <ToDoSection />
      </div>

      {/* Transaction Snapshot Section */}
      <div>
        <SectionHeader
          title="Transaction Overview"
          description="Monitor your transaction activity and cash flow"
          variant="compact"
        />
        <TransactionSnapshot 
          transactions={transactions}
          showList={true}
          listLimit={5}
        />
      </div>

      {/* Assets Management Section */}
      <div>
        <SectionHeader
          title="Assets Management"
          description="Monitor and manage your investment portfolio"
          variant="compact"
        />
        <AssetsManagement />
      </div>

      {/* Market Insights */}
      <div>
        <SectionHeader
          title="Market Overview"
          description="Today's market summary and key indices"
          variant="compact"
        />
        <MarketOverview />
      </div>

      {/* Leads Overview */}
      <div>
        <SectionHeader
          title="Leads Overview"
          description="Monitor your sales pipeline and prospect activity"
          variant="compact"
        />
        <LeadsOverview />
      </div>

      {/* Large Dashboard Card for main content */}
      <DashboardCard
        title="Performance Chart"
        description="Portfolio value over time - Interactive charts will be implemented in Phase 2"
        icon={TrendingUp}
        iconColor="primary"
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline">1D</Button>
            <Button size="sm" variant="outline">1W</Button>
            <Button size="sm" variant="outline">1M</Button>
            <Button size="sm" variant="default">1Y</Button>
          </div>
        }
        footer={
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Last updated: 2 minutes ago</span>
            <Button variant="link" size="sm" className="h-auto p-0">
              View detailed analytics →
            </Button>
          </div>
        }
      >
        <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/10">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">
              Interactive charts will be integrated in the next development phase
            </p>
            <p className="text-sm text-muted-foreground">
              This will display portfolio performance trends, asset allocation charts, and market comparisons
            </p>
          </div>
        </div>
      </DashboardCard>

      {/* Loading State Examples */}
      <div>
        <SectionHeader
          title="Loading States"
          description="Example of loading skeleton states for dashboard components"
          variant="compact"
        />
        <div className="grid gap-4 md:grid-cols-3">
          <DashboardCard loading title="Loading Card" description="This shows skeleton state" />
          <StatCard loading value="" label="" />
          <DashboardCard loading variant="highlighted" />
        </div>
      </div>
    </div>
  )
}
