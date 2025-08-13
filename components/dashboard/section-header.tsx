"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

export interface SectionHeaderProps {
  title: string
  description?: string
  icon?: LucideIcon
  level?: 'h1' | 'h2' | 'h3'
  variant?: 'default' | 'large' | 'compact'
  actions?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

export function SectionHeader({
  title,
  description,
  icon: Icon,
  level = 'h2',
  variant = 'default',
  actions,
  className,
  children,
}: SectionHeaderProps) {
  const variantStyles = {
    default: {
      wrapper: 'mb-6',
      title: 'text-2xl font-bold tracking-tight',
      description: 'text-muted-foreground',
      icon: 'h-6 w-6',
    },
    large: {
      wrapper: 'mb-8',
      title: 'text-3xl md:text-4xl font-bold tracking-tight',
      description: 'text-lg text-muted-foreground',
      icon: 'h-8 w-8',
    },
    compact: {
      wrapper: 'mb-4',
      title: 'text-lg font-semibold',
      description: 'text-sm text-muted-foreground',
      icon: 'h-5 w-5',
    },
  }

  const currentVariant = variantStyles[variant]
  const HeadingTag = level

  return (
    <div className={cn(currentVariant.wrapper, className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            {Icon && (
              <Icon className={cn('text-muted-foreground', currentVariant.icon)} />
            )}
            <HeadingTag className={currentVariant.title}>
              {title}
            </HeadingTag>
          </div>
          {description && (
            <p className={currentVariant.description}>
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
      {children}
    </div>
  )
}

// Preset action buttons for common use cases
export function SectionHeaderActions({
  primaryAction,
  secondaryActions = [],
}: {
  primaryAction?: {
    label: string
    onClick?: () => void
    href?: string
    icon?: LucideIcon
  }
  secondaryActions?: Array<{
    label: string
    onClick?: () => void
    href?: string
    icon?: LucideIcon
  }>
}) {
  return (
    <>
      {secondaryActions.map((action, index) => {
        const Icon = action.icon
        return (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={action.onClick}
            asChild={!!action.href}
          >
            {action.href ? (
              <a href={action.href}>
                {Icon && <Icon className="mr-2 h-4 w-4" />}
                {action.label}
              </a>
            ) : (
              <>
                {Icon && <Icon className="mr-2 h-4 w-4" />}
                {action.label}
              </>
            )}
          </Button>
        )
      })}
      {primaryAction && (
        <Button
          size="sm"
          onClick={primaryAction.onClick}
          asChild={!!primaryAction.href}
        >
          {primaryAction.href ? (
            <a href={primaryAction.href}>
              {primaryAction.icon && (
                <primaryAction.icon className="mr-2 h-4 w-4" />
              )}
              {primaryAction.label}
            </a>
          ) : (
            <>
              {primaryAction.icon && (
                <primaryAction.icon className="mr-2 h-4 w-4" />
              )}
              {primaryAction.label}
            </>
          )}
        </Button>
      )}
    </>
  )
}

// Breadcrumb component for section navigation
export function SectionBreadcrumb({
  items,
  className,
}: {
  items: Array<{ label: string; href?: string }>
  className?: string
}) {
  return (
    <nav className={cn('flex items-center space-x-2 text-sm mb-4', className)}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="text-muted-foreground">/</span>}
          {item.href ? (
            <a
              href={item.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </a>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}
