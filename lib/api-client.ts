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

// API Client Configuration
interface ApiClientConfig {
  baseURL?: string
  headers?: Record<string, string>
  cache?: boolean
  timeout?: number
}

// Request interceptor type
type RequestInterceptor = (config: RequestInit) => RequestInit | Promise<RequestInit>

// Response interceptor type
type ResponseInterceptor = (response: Response) => Response | Promise<Response>

// API Client Class
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

  // Add request interceptor
  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor)
  }

  // Add response interceptor
  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor)
  }

  // Build full URL
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

  // Apply request interceptors
  private async applyRequestInterceptors(config: RequestInit): Promise<RequestInit> {
    let finalConfig = config
    
    for (const interceptor of this.requestInterceptors) {
      finalConfig = await interceptor(finalConfig)
    }
    
    return finalConfig
  }

  // Apply response interceptors
  private async applyResponseInterceptors(response: Response): Promise<Response> {
    let finalResponse = response
    
    for (const interceptor of this.responseInterceptors) {
      finalResponse = await interceptor(finalResponse)
    }
    
    return finalResponse
  }

  // Generic request method
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
    
    // Check cache for GET requests
    if (method === 'GET' && this.cache && options?.cache !== false) {
      const cached = getCachedData<ApiResponse<T>>(cacheKey)
      if (cached) return cached
    }
    
    // Create abort controller for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)
    
    try {
      // Prepare request config
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
      
      // Apply request interceptors
      config = await this.applyRequestInterceptors(config)
      
      // Make request
      let response = await fetch(url, config)
      
      // Apply response interceptors
      response = await this.applyResponseInterceptors(response)
      
      // Parse response
      const data = await response.json()
      
      // Handle API errors
      if (!response.ok || !data.success) {
        throw new Error(data.error?.details || `HTTP ${response.status}: ${response.statusText}`)
      }
      
      // Cache successful GET requests
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

  // HTTP Methods
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

  // Specific API methods

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

  // Batch operations
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

// Create default instance
const apiClient = new ApiClient()

// Add default request interceptor for authentication (example)
apiClient.addRequestInterceptor((config) => {
  // Add auth token if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
  if (token) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`
    }
  }
  return config
})

// Add default response interceptor for error handling
apiClient.addResponseInterceptor(async (response) => {
  // Log errors
  if (!response.ok) {
    console.error(`API Error: ${response.status} ${response.statusText}`)
  }
  return response
})

// Export default instance and class
export default apiClient
export { apiClient }
