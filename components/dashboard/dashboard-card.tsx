"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

export interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  icon?: LucideIcon
  iconColor?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  variant?: 'default' | 'highlighted' | 'compact'
  loading?: boolean
  actions?: React.ReactNode
  footer?: React.ReactNode
  children?: React.ReactNode
}

export function DashboardCard({
  title,
  description,
  icon: Icon,
  iconColor = 'primary',
  variant = 'default',
  loading = false,
  actions,
  footer,
  children,
  className,
  ...props
}: DashboardCardProps) {
  const iconColorClasses = {
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger',
    info: 'text-info',
  }

  const variantClasses = {
    default: '',
    highlighted: 'border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10',
    compact: '',
  }

  if (loading) {
    return (
      <Card className={cn('relative overflow-hidden', variantClasses[variant], className)} {...props}>
        {(title || description) && (
          <CardHeader className={variant === 'compact' ? 'pb-3' : ''}>
            <div className="space-y-2">
              <div className="skeleton h-6 w-1/3" />
              {description && <div className="skeleton h-4 w-2/3" />}
            </div>
          </CardHeader>
        )}
        <CardContent className={variant === 'compact' ? 'pb-4' : ''}>
          <div className="space-y-3">
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-5/6" />
            <div className="skeleton h-4 w-4/6" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card 
      className={cn(
        'relative overflow-hidden transition-all hover:shadow-dashboard-md',
        variantClasses[variant],
        className
      )} 
      {...props}
    >
      {(title || description || Icon || actions) && (
        <CardHeader className={variant === 'compact' ? 'pb-3' : ''}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              {Icon && (
                <div className={cn('mt-0.5', iconColorClasses[iconColor])}>
                  <Icon className="h-5 w-5" />
                </div>
              )}
              <div className="space-y-1">
                {title && <CardTitle className={variant === 'compact' ? 'text-lg' : ''}>{title}</CardTitle>}
                {description && <CardDescription>{description}</CardDescription>}
              </div>
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        </CardHeader>
      )}
      
      {children && (
        <CardContent className={variant === 'compact' ? 'pb-4' : ''}>
          {children}
        </CardContent>
      )}
      
      {footer && (
        <CardFooter className={variant === 'compact' ? 'pt-3' : ''}>
          {footer}
        </CardFooter>
      )}
    </Card>
  )
}

// Loading skeleton component for DashboardCard
export function DashboardCardSkeleton({ 
  variant = 'default',
  className,
  ...props 
}: Pick<DashboardCardProps, 'variant' | 'className'>) {
  return <DashboardCard loading variant={variant} className={className} {...props} />
}
