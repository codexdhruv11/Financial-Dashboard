import { 
  Transaction, 
  Asset, 
  MarketSummary, 
  Lead, 
  PortfolioSummary,
  PaginatedResponse,
  ApiResponse,
  TransactionType,
  TransactionStatus,
  AssetCategory,
  LeadStatus,
  LeadSource
} from '@/types'
import { getCachedData, setCachedData } from './data-fetching'

// Config options for our API calls
interface ApiClientConfig {
  baseURL?: string
  headers?: Record<string, string>
  cache?: boolean
  timeout?: number
}

// Function to mess with requests before they go out
type RequestInterceptor = (config: RequestInit) => RequestInit | Promise<RequestInit>

// Function to process responses when they come back
type ResponseInterceptor = (response: Response) => Response | Promise<Response>

// Main class that handles all our API communication
export class ApiClient {
  private baseURL: string
  private headers: Record<string, string>
  private cache: boolean
  private timeout: number
  private requestInterceptors: RequestInterceptor[] = []
  private responseInterceptors: ResponseInterceptor[] = []

  constructor(config: ApiClientConfig = {}) {
    this.baseURL = config.baseURL || process.env.NEXT_PUBLIC_API_URL || ''
    this.headers = {
      'Content-Type': 'application/json',
      ...config.headers
    }
    this.cache = config.cache ?? true
    this.timeout = config.timeout ?? 30000
  }

  // Hook into requests before they're sent
  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor)
  }

  // Hook into responses after they arrive
  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor)
  }

  // Piece together the complete URL with params
  private buildURL(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(endpoint, this.baseURL || window.location.origin)
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            url.searchParams.append(key, value.join(','))
          } else {
            url.searchParams.append(key, String(value))
          }
        }
      })
    }
    
    return url.toString()
  }

  // Run all the request hooks in order
  private async applyRequestInterceptors(config: RequestInit): Promise<RequestInit> {
    let finalConfig = config
    
    for (const interceptor of this.requestInterceptors) {
      finalConfig = await interceptor(finalConfig)
    }
    
    return finalConfig
  }

  // Run all the response hooks in order
  private async applyResponseInterceptors(response: Response): Promise<Response> {
    let finalResponse = response
    
    for (const interceptor of this.responseInterceptors) {
      finalResponse = await interceptor(finalResponse)
    }
    
    return finalResponse
  }

  // The workhorse function that actually makes the HTTP calls
  private async request<T>(
    method: string,
    endpoint: string,
    options?: {
      params?: Record<string, any>
      body?: any
      headers?: Record<string, string>
      cache?: boolean
    }
  ): Promise<ApiResponse<T>> {
    const url = this.buildURL(endpoint, options?.params)
    const cacheKey = `${method}:${url}`
    
    // Only GET requests get cached - no point caching mutations
    if (method === 'GET' && this.cache && options?.cache !== false) {
      const cached = getCachedData<ApiResponse<T>>(cacheKey)
      if (cached) return cached
    }
    
    // Set up timeout handling so we don't wait forever
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)
    
    try {
      // Build up the fetch options
      let config: RequestInit = {
        method,
        headers: {
          ...this.headers,
          ...options?.headers
        },
        signal: controller.signal
      }
      
      if (options?.body) {
        config.body = JSON.stringify(options.body)
      }
      
      // Let interceptors modify the request if needed
      config = await this.applyRequestInterceptors(config)
      
      // Fire off the actual HTTP request
      let response = await fetch(url, config)
      
      // Let interceptors process the response
      response = await this.applyResponseInterceptors(response)
      
      // Extract the JSON data
      const data = await response.json()
      
      // Check if something went wrong
      if (!response.ok || !data.success) {
        throw new Error(data.error?.details || `HTTP ${response.status}: ${response.statusText}`)
      }
      
      // Save successful GETs for later
      if (method === 'GET' && this.cache && options?.cache !== false) {
        setCachedData(cacheKey, data)
      }
      
      return data
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout')
      }
      throw error
    } finally {
      clearTimeout(timeoutId)
    }
  }

  // Convenience methods for common HTTP verbs
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, { params })
  }

  async post<T>(endpoint: string, body?: any, params?: Record<string, any>): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, { body, params })
  }

  async put<T>(endpoint: string, body?: any, params?: Record<string, any>): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, { body, params })
  }

  async delete<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint, { params })
  }

  // Business-specific methods for our app's endpoints

  async fetchTransactions(params?: {
    type?: TransactionType
    status?: TransactionStatus
    startDate?: Date | string
    endDate?: Date | string
    page?: number
    pageSize?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<PaginatedResponse<Transaction>> {
    const queryParams = params ? {
      ...params,
      startDate: params.startDate instanceof Date ? params.startDate.toISOString() : params.startDate,
      endDate: params.endDate instanceof Date ? params.endDate.toISOString() : params.endDate
    } : undefined
    
    const response = await this.get<PaginatedResponse<Transaction>>('/api/transactions', queryParams)
    return response.data!
  }

  async fetchMarketSummary(params?: {
    symbols?: string[]
    sector?: string
    startDate?: Date | string
    endDate?: Date | string
  }): Promise<MarketSummary> {
    const queryParams = params ? {
      ...params,
      startDate: params.startDate instanceof Date ? params.startDate.toISOString() : params.startDate,
      endDate: params.endDate instanceof Date ? params.endDate.toISOString() : params.endDate
    } : undefined
    
    const response = await this.get<MarketSummary>('/api/market-summary', queryParams)
    return response.data!
  }

  async fetchAssets(params?: {
    category?: AssetCategory
    page?: number
    pageSize?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<PaginatedResponse<Asset>> {
    const response = await this.get<PaginatedResponse<Asset>>('/api/assets', params)
    return response.data!
  }

  async fetchPortfolioSummary(): Promise<PortfolioSummary> {
    const response = await this.get<PortfolioSummary>('/api/assets', { summary: true })
    return response.data!
  }

  async fetchLeads(params?: {
    status?: LeadStatus
    source?: LeadSource
    assignedTo?: string
    startDate?: Date | string
    endDate?: Date | string
    page?: number
    pageSize?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<PaginatedResponse<Lead>> {
    const queryParams = params ? {
      ...params,
      startDate: params.startDate instanceof Date ? params.startDate.toISOString() : params.startDate,
      endDate: params.endDate instanceof Date ? params.endDate.toISOString() : params.endDate
    } : undefined
    
    const response = await this.get<PaginatedResponse<Lead>>('/api/leads', queryParams)
    return response.data!
  }

  async fetchLeadAnalytics(params?: {
    status?: LeadStatus
    source?: LeadSource
    assignedTo?: string
    startDate?: Date | string
    endDate?: Date | string
  }): Promise<any> {
    const queryParams = {
      ...params,
      analytics: true,
      startDate: params?.startDate instanceof Date ? params.startDate.toISOString() : params?.startDate,
      endDate: params?.endDate instanceof Date ? params.endDate.toISOString() : params?.endDate
    }
    
    const response = await this.get<any>('/api/leads', queryParams)
    return response.data!
  }

  // Fetch multiple things at once for the dashboard
  async fetchDashboardData(): Promise<{
    portfolio: PortfolioSummary
    market: MarketSummary
    recentTransactions: PaginatedResponse<Transaction>
    topAssets: PaginatedResponse<Asset>
  }> {
    const [portfolio, market, recentTransactions, topAssets] = await Promise.all([
      this.fetchPortfolioSummary(),
      this.fetchMarketSummary(),
      this.fetchTransactions({ pageSize: 5, sortBy: 'date', sortOrder: 'desc' }),
      this.fetchAssets({ pageSize: 5, sortBy: 'totalValue', sortOrder: 'desc' })
    ])
    
    return {
      portfolio,
      market,
      recentTransactions,
      topAssets
    }
  }
}

// Set up a ready-to-use client instance
const apiClient = new ApiClient()

// Automatically attach auth token to all requests if we have one
apiClient.addRequestInterceptor((config) => {
  // Check if user is logged in and add their token
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
  if (token) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`
    }
  }
  return config
})

// Log any API errors for debugging
apiClient.addResponseInterceptor(async (response) => {
  // Keep track of what went wrong
  if (!response.ok) {
    console.error(`API Error: ${response.status} ${response.statusText}`)
  }
  return response
})

// Export both the instance and the class in case someone needs a custom client
export default apiClient
export { apiClient }
