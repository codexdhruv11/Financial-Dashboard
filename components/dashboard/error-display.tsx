'use client'

import { AlertCircle, RefreshCw, WifiOff, ServerCrash, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { DashboardCard } from '@/components/dashboard/dashboard-card'

interface ErrorDisplayProps {
  error: Error | unknown
  title?: string
  onRetry?: () => void
  context?: 'market' | 'leads' | 'general'
}

export function ErrorDisplay({ 
  error, 
  title = 'Error Loading Data', 
  onRetry,
  context = 'general' 
}: ErrorDisplayProps) {
  // Determine error type and provide specific messaging
  const getErrorDetails = () => {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    // Network errors
    if (errorMessage.toLowerCase().includes('network') || 
        errorMessage.toLowerCase().includes('fetch')) {
      return {
        icon: WifiOff,
        title: 'Network Connection Error',
        description: 'Unable to connect to the server. Please check your internet connection and try again.',
        variant: 'destructive' as const
      }
    }
    
    // Server errors
    if (errorMessage.includes('500') || 
        errorMessage.includes('502') || 
        errorMessage.includes('503')) {
      return {
        icon: ServerCrash,
        title: 'Server Error',
        description: 'Our servers are experiencing issues. Please try again in a few moments.',
        variant: 'destructive' as const
      }
    }
    
    // Authentication/Authorization errors
    if (errorMessage.includes('401') || 
        errorMessage.includes('403') ||
        errorMessage.toLowerCase().includes('unauthorized') ||
        errorMessage.toLowerCase().includes('forbidden')) {
      return {
        icon: ShieldAlert,
        title: 'Access Denied',
        description: 'You don\'t have permission to access this data. Please contact your administrator.',
        variant: 'destructive' as const
      }
    }
    
    // Rate limiting
    if (errorMessage.includes('429') || 
        errorMessage.toLowerCase().includes('rate limit')) {
      return {
        icon: AlertCircle,
        title: 'Too Many Requests',
        description: 'You\'ve made too many requests. Please wait a moment before trying again.',
        variant: 'default' as const
      }
    }
    
    // Context-specific errors
    if (context === 'market') {
      return {
        icon: AlertCircle,
        title: 'Market Data Unavailable',
        description: 'Unable to fetch latest market data. This might be due to market hours or data provider issues.',
        variant: 'default' as const
      }
    }
    
    if (context === 'leads') {
      return {
        icon: AlertCircle,
        title: 'Leads Data Unavailable',
        description: 'Unable to load your leads information. Please try refreshing or contact support if the issue persists.',
        variant: 'default' as const
      }
    }
    
    // Default error
    return {
      icon: AlertCircle,
      title: title,
      description: errorMessage || 'An unexpected error occurred. Please try again.',
      variant: 'destructive' as const
    }
  }
  
  const errorDetails = getErrorDetails()
  const Icon = errorDetails.icon
  
  return (
    <DashboardCard>
      <div className="p-6">
        <Alert variant={errorDetails.variant}>
          <Icon className="h-4 w-4" />
          <AlertTitle>{errorDetails.title}</AlertTitle>
          <AlertDescription className="mt-2">
            <div className="space-y-3">
              <p>{errorDetails.description}</p>
              
              {/* Error details for debugging (only in development) */}
              {process.env.NODE_ENV === 'development' && error instanceof Error && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                    Technical Details
                  </summary>
                  <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                    {error.stack || error.message}
                  </pre>
                </details>
              )}
              
              {/* Retry button */}
              {onRetry && (
                <Button 
                  onClick={onRetry} 
                  variant="outline" 
                  size="sm"
                  className="mt-3"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              )}
            </div>
          </AlertDescription>
        </Alert>
        
        {/* Additional help text */}
        <div className="mt-4 text-sm text-muted-foreground">
          <p>If this problem persists, please:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Check your internet connection</li>
            <li>Clear your browser cache</li>
            <li>Contact support with error code: {new Date().getTime()}</li>
          </ul>
        </div>
      </div>
    </DashboardCard>
  )
}
