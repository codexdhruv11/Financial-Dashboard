import React, { useState, useEffect, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Search } from 'lucide-react'
import { Lead, LeadStatus, LeadSource } from '@/types'

// Custom debounce hook
function useDebounce<T>(value: T, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  
  return debouncedValue
}

interface InvestorFiltersProps {
  leads?: Lead[]
  searchQuery: string
  statusFilter: LeadStatus | 'all'
  sourceFilter: LeadSource | 'all'
  schemeFilter: string
  assignedToFilter?: string
  sortBy: 'name' | 'value' | 'date'
  sortOrder: 'asc' | 'desc'
  onSearchChange: (value: string) => void
  onStatusChange: (value: LeadStatus | 'all') => void
  onSourceChange: (value: LeadSource | 'all') => void
  onSchemeChange: (value: string) => void
  onAssignedToChange?: (value: string) => void
  onSortByChange: (value: 'name' | 'value' | 'date') => void
  onSortOrderChange: (value: 'asc' | 'desc') => void
  onClearFilters: () => void
}

export function InvestorFilters({
  leads = [],
  searchQuery,
  statusFilter,
  sourceFilter,
  schemeFilter,
  assignedToFilter,
  sortBy,
  sortOrder,
  onSearchChange,
  onStatusChange,
  onSourceChange,
  onSchemeChange,
  onAssignedToChange,
  onSortByChange,
  onSortOrderChange,
  onClearFilters
}: InvestorFiltersProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)
  const debouncedSearchQuery = useDebounce(localSearchQuery, 300)

  // Update parent component with debounced search
  useEffect(() => {
    onSearchChange(debouncedSearchQuery)
  }, [debouncedSearchQuery, onSearchChange])

  // Sync local search with parent when cleared
  useEffect(() => {
    if (searchQuery === '' && localSearchQuery !== '') {
      setLocalSearchQuery('')
    }
  }, [searchQuery])

  // Extract unique schemes and assignees from leads
  const uniqueSchemes = useMemo(() => {
    const schemes = leads
      .map(lead => lead.scheme)
      .filter(Boolean) as string[]
    return Array.from(new Set(schemes)).sort()
  }, [leads])

  const uniqueAssignees = useMemo(() => {
    const assignees = leads
      .map(lead => lead.assignedTo)
      .filter(Boolean) as string[]
    return Array.from(new Set(assignees)).sort()
  }, [leads])

  const hasActiveFilters = localSearchQuery || statusFilter !== 'all' || 
    sourceFilter !== 'all' || schemeFilter || assignedToFilter

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Filters & Search</h3>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setLocalSearchQuery('')
                onClearFilters()
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Search Input with Debounce */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by company or contact..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={(value) => onStatusChange(value as LeadStatus | 'all')}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value={LeadStatus.New}>New</SelectItem>
              <SelectItem value={LeadStatus.Contacted}>Contacted</SelectItem>
              <SelectItem value={LeadStatus.Qualified}>Qualified</SelectItem>
              <SelectItem value={LeadStatus.Proposal}>Proposal Sent</SelectItem>
              <SelectItem value={LeadStatus.Negotiation}>Negotiation</SelectItem>
              <SelectItem value={LeadStatus.ClosedWon}>Closed - Won</SelectItem>
              <SelectItem value={LeadStatus.ClosedLost}>Closed - Lost</SelectItem>
            </SelectContent>
          </Select>

          {/* Source Filter */}
          <Select value={sourceFilter} onValueChange={(value) => onSourceChange(value as LeadSource | 'all')}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value={LeadSource.Website}>Website</SelectItem>
              <SelectItem value={LeadSource.Referral}>Referral</SelectItem>
              <SelectItem value={LeadSource.SocialMedia}>Social Media</SelectItem>
              <SelectItem value={LeadSource.Email}>Email Marketing</SelectItem>
              <SelectItem value={LeadSource.WhatsApp}>WhatsApp</SelectItem>
              <SelectItem value={LeadSource.ColdCall}>Cold Call</SelectItem>
            </SelectContent>
          </Select>

          {/* Scheme Filter - Now as Select */}
          <Select value={schemeFilter || 'all'} onValueChange={(value) => onSchemeChange(value === 'all' ? '' : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by scheme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Schemes</SelectItem>
              {uniqueSchemes.map(scheme => (
                <SelectItem key={scheme} value={scheme}>
                  {scheme}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Second Row: Assigned To and Sort Options */}
        <div className="flex gap-4 flex-wrap">
          {/* Assigned To Filter */}
          {onAssignedToChange && (
            <Select 
              value={assignedToFilter || 'all'} 
              onValueChange={(value) => onAssignedToChange(value === 'all' ? '' : value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Assigned to" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                {uniqueAssignees.map(assignee => (
                  <SelectItem key={assignee} value={assignee}>
                    {assignee}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Sort Options */}
          <Select value={sortBy} onValueChange={(value) => onSortByChange(value as 'name' | 'value' | 'date')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Company Name</SelectItem>
              <SelectItem value="value">Potential Value</SelectItem>
              <SelectItem value="date">Last Contact</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={(value) => onSortOrderChange(value as 'asc' | 'desc')}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  )
}
