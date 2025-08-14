import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Building2, Mail, Phone, Calendar } from 'lucide-react'
import { Lead } from '@/types'
import { 
  formatDashboardDate,
  getLeadStatusColor,
  formatLeadValue
} from '@/lib/dashboard-utils'

interface InvestorCardProps {
  lead: Lead
  onContact?: () => void
  onViewDetails?: () => void
}

export function InvestorCard({ lead, onContact, onViewDetails }: InvestorCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        {/* Company Header */}
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-semibold text-lg flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              {lead.company}
            </h4>
            <p className="text-sm text-muted-foreground">{lead.contactName}</p>
          </div>
          <Badge className={getLeadStatusColor(lead.status)}>
            {lead.status}
          </Badge>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-3 w-3" />
            <span className="truncate">{lead.contactEmail}</span>
          </div>
          {lead.contactPhone && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-3 w-3" />
              <span>{lead.contactPhone}</span>
            </div>
          )}
        </div>

        {/* Value and Source */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Potential Value</p>
            <p className="text-lg font-semibold">{formatLeadValue(lead.potentialValue)}</p>
          </div>
          <Badge variant="outline">{lead.source}</Badge>
        </div>

        {/* Scheme if available */}
        {lead.scheme && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {lead.scheme}
            </Badge>
          </div>
        )}

        {/* Last Contact */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>Last contact: {formatDashboardDate(lead.lastContactedDate, 'relative')}</span>
        </div>

        {/* Assigned To */}
        {lead.assignedTo && (
          <div className="text-sm text-muted-foreground">
            Assigned to: {lead.assignedTo}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            variant="default" 
            className="flex-1"
            onClick={onContact}
          >
            Contact
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={onViewDetails}
          >
            View Details
          </Button>
        </div>
      </div>
    </Card>
  )
}
