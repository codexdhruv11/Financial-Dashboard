"use client"

import React, { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { useLeads } from '@/lib/data-fetching'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Filter, Users, AlertCircle } from 'lucide-react'
import { LeadStatus, LeadSource } from '@/types'
import { toastSuccess } from '@/lib/use-toast'
import { SectionHeader } from '@/components/dashboard/section-header'
import { InvestorCard, InvestorFilters, InvestorStats } from '@/components/investors'

export default function InvestorsPage() {
  const searchParams = useSearchParams()
  const schemeFromUrl = searchParams.get('scheme')
  
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all')
  const [sourceFilter, setSourceFilter] = useState<LeadSource | 'all'>('all')
  const [schemeFilter, setSchemeFilter] = useState<string>(schemeFromUrl || '')
  const [assignedToFilter, setAssignedToFilter] = useState<string>('')
  const [sortBy, setSortBy] = useState<'name' | 'value' | 'date'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Map sort field names for API
  const sortFieldMap = {
    name: 'company',
    value: 'potentialValue', 
    date: 'lastContactedDate'
  }

  // Fetch leads data with server-side filtering and sorting
  const { data: leadsData, loading, error } = useLeads({
    status: statusFilter !== 'all' ? statusFilter : undefined,
    source: sourceFilter !== 'all' ? sourceFilter : undefined,
    search: searchQuery || undefined,
    scheme: schemeFilter || undefined,
    assignedTo: assignedToFilter || undefined,
    sortBy: sortFieldMap[sortBy],
    sortOrder,
    pageSize: 100 // Get more results for better UX
  })

  // Extract leads from paginated response (server already filtered and sorted)
  const leads = useMemo(() => {
    if (leadsData?.data) {
      return Array.isArray(leadsData.data) ? leadsData.data : []
    }
    return []
  }, [leadsData])

  // Clear filters
  const clearFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
    setSourceFilter('all')
    setSchemeFilter('')
    setAssignedToFilter('')
    setSortBy('date')
    setSortOrder('desc')
  }

  // Handle contact action
  const handleContact = (lead: typeof leads[0]) => {
    toastSuccess(`Contacting ${lead.contactName}`, `Email sent to ${lead.contactEmail}`)
  }

  // Handle view details action
  const handleViewDetails = (lead: typeof leads[0]) => {
    toastSuccess('Opening details', `Viewing details for ${lead.company}`)
  }

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || 
    sourceFilter !== 'all' || schemeFilter || assignedToFilter

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <SectionHeader
        title="Investors & Prospects"
        description="Manage your investor relationships and track potential opportunities"
        variant="large"
        icon={Users}
      />

      {/* Key Metrics */}
      <div>
        <SectionHeader
          title="Pipeline Metrics"
          description="Overview of your investor pipeline"
          variant="compact"
        />
        <InvestorStats leads={leads} />
      </div>

      {/* Filters Section */}
      <InvestorFilters
        leads={leads}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        sourceFilter={sourceFilter}
        schemeFilter={schemeFilter}
        assignedToFilter={assignedToFilter}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSearchChange={setSearchQuery}
        onStatusChange={setStatusFilter}
        onSourceChange={setSourceFilter}
        onSchemeChange={setSchemeFilter}
        onAssignedToChange={setAssignedToFilter}
        onSortByChange={setSortBy}
        onSortOrderChange={setSortOrder}
        onClearFilters={clearFilters}
      />

      {/* Scheme Filter Alert */}
      {schemeFilter && (
        <Alert>
          <Filter className="h-4 w-4" />
          <AlertDescription>
            Showing investors interested in: <strong>{schemeFilter}</strong>
          </AlertDescription>
        </Alert>
      )}

      {/* Investors List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Investors ({leads.length})
        </h3>

        {loading ? (
          // Loading state
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-6">
                <div className="space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-8 w-full" />
                </div>
              </Card>
            ))}
          </div>
        ) : error ? (
          // Error state
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load investors. Please try again later.
            </AlertDescription>
          </Alert>
        ) : leads.length === 0 ? (
          // Empty state
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No investors found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {hasActiveFilters 
                  ? "Try adjusting your filters or search query"
                  : "Start adding investors to track your opportunities"}
              </p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          </Card>
        ) : (
          // Investors grid
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {leads.map((lead) => (
              <InvestorCard
                key={lead.id}
                lead={lead}
                onContact={() => handleContact(lead)}
                onViewDetails={() => handleViewDetails(lead)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
