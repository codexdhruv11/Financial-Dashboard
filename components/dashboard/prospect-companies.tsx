'use client'

import { Lead } from '@/types'
import { Badge } from '@/components/ui/badge'
import { 
  formatLeadValue,
  getLeadStatusColor,
  getLeadSourceIcon,
  formatDashboardDate
} from '@/lib/dashboard-utils'
import { Building2, Calendar, User } from 'lucide-react'

interface ProspectCompaniesProps {
  prospects: Lead[]
}

export function ProspectCompanies({ prospects }: ProspectCompaniesProps) {
  if (!prospects || prospects.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No prospect companies available
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {prospects.map((prospect) => {
        const SourceIcon = getLeadSourceIcon(prospect.source)
        
        return (
          <div 
            key={prospect.id} 
            className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          >
            <div className="space-y-2">
              {/* Company and Value */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-semibold text-sm">{prospect.company}</h4>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>{prospect.contactName}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">
                    {formatLeadValue(prospect.potentialValue)}
                  </p>
                  <p className="text-xs text-muted-foreground">Potential</p>
                </div>
              </div>

              {/* Status and Source */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getLeadStatusColor(prospect.status)}`}
                  >
                    {prospect.status}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <SourceIcon className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {prospect.source}
                    </span>
                  </div>
                </div>
              </div>

              {/* Last Contact */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>Last contact: {formatDashboardDate(prospect.lastContactedDate, 'relative')}</span>
              </div>
            </div>
          </div>
        )
      })}

      {/* View All Link */}
      <div className="pt-2 text-center">
        <button className="text-sm text-primary hover:underline">
          View all prospects →
        </button>
      </div>
    </div>
  )
}
