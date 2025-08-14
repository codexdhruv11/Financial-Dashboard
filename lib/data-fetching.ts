import { 
  Transaction, 
  Asset, 
  MarketSummary, 
  Lead, 
  PortfolioSummary,
  PaginatedResponse,
  ApiResponse 
} from '@/types'

// Base URL for API calls - in production this would be an environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

// Helper function to construct URL with query params
function buildUrl(endpoint: string, params?: Record<string, any>): string {
  const url = new URL(endpoint, API_BASE_URL || window.location.origin)
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.append(key, String(value))
      }
    })
  }
  
  return url.toString()
}

// Generic fetch wrapper with error handling
async function fetchWithErrorHandling<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.error?.details || 'API request failed')
    }
    
    return data.data
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
}

// Server-side data fetching functions (for use in Server Components)

export async function getTransactions(params?: {
  type?: string
  status?: string
  startDate?: string
  endDate?: string
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: string
}): Promise<PaginatedResponse<Transaction>> {
  const url = buildUrl('/api/transactions', params)
  return fetchWithErrorHandling<PaginatedResponse<Transaction>>(url)
}

export async function getMarketSummary(params?: {
  symbols?: string[]
  sector?: string
  startDate?: string
  endDate?: string
}): Promise<MarketSummary> {
  const queryParams = params ? {
    ...params,
    symbols: params.symbols?.join(',')
  } : undefined
  
  const url = buildUrl('/api/market-summary', queryParams)
  return fetchWithErrorHandling<MarketSummary>(url)
}

export async function getAssets(params?: {
  category?: string
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: string
}): Promise<PaginatedResponse<Asset>> {
  const url = buildUrl('/api/assets', params)
  return fetchWithErrorHandling<PaginatedResponse<Asset>>(url)
}

export async function getPortfolioSummary(): Promise<PortfolioSummary> {
  const url = buildUrl('/api/assets', { summary: true })
  return fetchWithErrorHandling<PortfolioSummary>(url)
}

export async function getLeads(params?: {
  status?: string
  source?: string
  assignedTo?: string
  startDate?: string
  endDate?: string
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: string
  scheme?: string
  search?: string
}): Promise<PaginatedResponse<Lead>> {
  const url = buildUrl('/api/leads', params)
  return fetchWithErrorHandling<PaginatedResponse<Lead>>(url)
}

export async function getLeadAnalytics(params?: {
  status?: string
  source?: string
  assignedTo?: string
  startDate?: string
  endDate?: string
}): Promise<any> {
  const url = buildUrl('/api/leads', { ...params, analytics: true })
  return fetchWithErrorHandling<any>(url)
}

// Client-side hooks (for use in Client Components)
// These would typically use SWR or React Query in production

import { useState, useEffect, useRef } from 'react'

// Deep comparison utility for hook dependencies
function useDeepCompareMemo<T>(value: T): T {
  const ref = useRef<T>(value)
  const signalRef = useRef<number>(0)
  
  if (!deepEqual(value, ref.current)) {
    ref.current = value
    signalRef.current += 1
  }
  
  return ref.current
}

// Simple deep equality check
function deepEqual(a: any, b: any): boolean {
  if (a === b) return true
  if (a == null || b == null) return false
  if (typeof a !== 'object' || typeof b !== 'object') return false
  
  const keysA = Object.keys(a)
  const keysB = Object.keys(b)
  
  if (keysA.length !== keysB.length) return false
  
  for (const key of keysA) {
    if (!keysB.includes(key)) return false
    if (!deepEqual(a[key], b[key])) return false
  }
  
  return true
}

export function useTransactions(params?: Parameters<typeof getTransactions>[0]) {
  const [data, setData] = useState<PaginatedResponse<Transaction> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const memoizedParams = useDeepCompareMemo(params)
  
  useEffect(() => {
    let cancelled = false
    
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await getTransactions(memoizedParams)
        if (!cancelled) {
          setData(result)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Unknown error'))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }
    
    fetchData()
    
    return () => {
      cancelled = true
    }
  }, [memoizedParams])
  
  return { data, loading, error }
}

export function useMarketSummary(params?: Parameters<typeof getMarketSummary>[0]) {
  const [data, setData] = useState<MarketSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const memoizedParams = useDeepCompareMemo(params)
  
  useEffect(() => {
    let cancelled = false
    
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await getMarketSummary(memoizedParams)
        if (!cancelled) {
          setData(result)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Unknown error'))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }
    
    fetchData()
    
    return () => {
      cancelled = true
    }
  }, [memoizedParams])
  
  return { data, loading, error }
}

export function useAssets(params?: Parameters<typeof getAssets>[0]) {
  const [data, setData] = useState<PaginatedResponse<Asset> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const memoizedParams = useDeepCompareMemo(params)
  
  useEffect(() => {
    let cancelled = false
    
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await getAssets(memoizedParams)
        if (!cancelled) {
          setData(result)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Unknown error'))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }
    
    fetchData()
    
    return () => {
      cancelled = true
    }
  }, [memoizedParams])
  
  return { data, loading, error }
}

export function usePortfolioSummary() {
  const [data, setData] = useState<PortfolioSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await getPortfolioSummary()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  return { data, loading, error }
}

export function useLeads(params?: Parameters<typeof getLeads>[0]) {
  const [data, setData] = useState<PaginatedResponse<Lead> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const memoizedParams = useDeepCompareMemo(params)
  
  useEffect(() => {
    let cancelled = false
    
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await getLeads(memoizedParams)
        if (!cancelled) {
          setData(result)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Unknown error'))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }
    
    fetchData()
    
    return () => {
      cancelled = true
    }
  }, [memoizedParams])
  
  return { data, loading, error }
}

// Data transformation utilities

export function transformTransactionData(transactions: Transaction[]) {
  return transactions.map(t => ({
    ...t,
    formattedDate: new Date(t.date).toLocaleDateString(),
    formattedTotal: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(t.total)
  }))
}

export function calculatePortfolioMetrics(assets: Asset[]) {
  const totalValue = assets.reduce((sum, a) => sum + a.totalValue, 0)
  const totalGain = assets.reduce((sum, a) => sum + a.unrealizedGain, 0)
  const averagePerformance = assets.reduce((sum, a) => 
    sum + (a.performance.year * a.allocation / 100), 0
  )
  
  return {
    totalValue,
    totalGain,
    averagePerformance
  }
}

// Caching utilities

const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key)
  
  if (!cached) return null
  
  const isExpired = Date.now() - cached.timestamp > CACHE_DURATION
  
  if (isExpired) {
    cache.delete(key)
    return null
  }
  
  return cached.data as T
}

export function setCachedData(key: string, data: any): void {
  cache.set(key, {
    data,
    timestamp: Date.now()
  })
}

// Retry logic for failed requests

export async function fetchWithRetry<T>(
  fetchFn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error | null = null
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetchFn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error')
      
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
      }
    }
  }
  
  throw lastError || new Error('Max retries exceeded')
}
