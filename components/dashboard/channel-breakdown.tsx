'use client'

import { LeadSource } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  getLeadSourceIcon,
  formatLeadValue,
  formatPercentage
} from '@/lib/dashboard-utils'

interface ChannelBreakdownProps {
  channels: {
    source: LeadSource
    count: number
    percentage: number
    totalValue: number
  }[]
}

export function ChannelBreakdown({ channels }: ChannelBreakdownProps) {
  if (!channels || channels.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No channel data available
      </div>
    )
  }

  // Get max count for scaling progress bars
  const maxCount = Math.max(...channels.map(c => c.count))

  return (
    <div className="space-y-4">
      {channels.map((channel) => {
        const Icon = getLeadSourceIcon(channel.source)
        const progressValue = (channel.count / maxCount) * 100

        return (
          <div key={channel.source} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{channel.source}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {channel.count} leads
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {formatPercentage(channel.percentage, 1)}
                </span>
              </div>
            </div>
            
            <Progress value={progressValue} className="h-2" />
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Value: {formatLeadValue(channel.totalValue)}</span>
              <span>Avg: {channel.count > 0 ? formatLeadValue(channel.totalValue / channel.count) : '₹0'}</span>
            </div>
          </div>
        )
      })}

      {/* Summary */}
      <div className="pt-4 border-t">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Total Sources</p>
            <p className="font-semibold">{channels.length}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total Value</p>
            <p className="font-semibold">
              {formatLeadValue(channels.reduce((sum, c) => sum + c.totalValue, 0))}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
