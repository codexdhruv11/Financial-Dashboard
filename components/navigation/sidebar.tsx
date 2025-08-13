"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  LayoutDashboard,
  TrendingUp,
  PieChart,
  CreditCard,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  ChevronDown,
  BarChart3,
  Wallet,
  Target,
  FileText,
  Bell
} from 'lucide-react'

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number
  subItems?: NavItem[]
}

const navigationItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Portfolio',
    href: '/portfolio',
    icon: PieChart,
    subItems: [
      {
        title: 'Overview',
        href: '/portfolio/overview',
        icon: BarChart3,
      },
      {
        title: 'Holdings',
        href: '/portfolio/holdings',
        icon: Wallet,
      },
      {
        title: 'Performance',
        href: '/portfolio/performance',
        icon: TrendingUp,
      },
    ],
  },
  {
    title: 'Markets',
    href: '/markets',
    icon: TrendingUp,
    badge: 'Live',
  },
  {
    title: 'Transactions',
    href: '/transactions',
    icon: CreditCard,
  },
  {
    title: 'Goals',
    href: '/goals',
    icon: Target,
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: FileText,
  },
  {
    title: 'Accounts',
    href: '/accounts',
    icon: Users,
  },
  {
    title: 'Investors',
    href: '/investors',
    icon: Users,
  },
]

const bottomNavigationItems: NavItem[] = [
  {
    title: 'Notifications',
    href: '/notifications',
    icon: Bell,
    badge: 3,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
  {
    title: 'Help & Support',
    href: '/help',
    icon: HelpCircle,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [expandedItems, setExpandedItems] = React.useState<string[]>([])

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  const renderNavItem = (item: NavItem, isNested = false) => {
    const hasSubItems = item.subItems && item.subItems.length > 0
    const isExpanded = expandedItems.includes(item.title)
    const Icon = item.icon
    const active = isActive(item.href) && !hasSubItems

    return (
      <div key={item.href} className={cn(isNested && "ml-4")}>
        <Button
          variant={active ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start",
            isNested && "pl-8"
          )}
          asChild={!hasSubItems}
          onClick={(e) => {
            if (hasSubItems) {
              e.preventDefault()
              toggleExpanded(item.title)
            } else {
              setIsMobileMenuOpen(false)
            }
          }}
        >
          {hasSubItems ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4" />
                <span>{item.title}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <Badge variant="default" className="ml-auto">
                    {item.badge}
                  </Badge>
                )}
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    isExpanded && "rotate-180"
                  )}
                />
              </div>
            </div>
          ) : (
            <Link href={item.href} className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4" />
                <span>{item.title}</span>
              </div>
              {item.badge && (
                <Badge variant="default" className="ml-auto">
                  {item.badge}
                </Badge>
              )}
            </Link>
          )}
        </Button>
        {hasSubItems && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.subItems!.map(subItem => renderNavItem(subItem, true))}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 md:hidden"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 transform bg-card border-r transition-transform duration-300 ease-in-out md:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo/Header */}
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold">PPYTECH</span>
            </Link>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {navigationItems.map(item => renderNavItem(item))}
          </nav>

          {/* Bottom Navigation */}
          <div className="border-t px-3 py-4">
            <nav className="space-y-1">
              {bottomNavigationItems.map(item => renderNavItem(item))}
            </nav>
            
            {/* User Profile Section */}
            <div className="mt-4 flex items-center rounded-lg border p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <span className="text-sm font-medium">DK</span>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium">Dhruv Kumar</p>
                <p className="text-xs text-muted-foreground">dhruv@ppytech.com</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
