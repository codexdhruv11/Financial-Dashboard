import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { Asset, AssetCategory, PortfolioSummary } from '@/types'

// Mark route as dynamic
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    // Get query parameters
    const category = searchParams.get('category') as AssetCategory | null
    const summary = searchParams.get('summary') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')
    const sortBy = searchParams.get('sortBy') || 'totalValue'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    
    // Build file path and check existence
    const jsonPath = path.join(process.cwd(), 'public', 'data', 'assets.json')
    
    try {
      await fs.access(jsonPath)
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: 'Data file not found',
          error: {
            code: 'FILE_NOT_FOUND',
            details: 'Assets data file does not exist'
          }
        },
        { status: 404 }
      )
    }
    
    // Read the JSON file
    const jsonData = await fs.readFile(jsonPath, 'utf-8')
    let assets: Asset[] = JSON.parse(jsonData)
    
    // Apply filters
    if (category) {
      assets = assets.filter(a => a.category === category)
    }
    
    // Sort assets
    assets.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'totalValue':
          comparison = a.totalValue - b.totalValue
          break
        case 'unrealizedGainPercent':
          comparison = a.unrealizedGainPercent - b.unrealizedGainPercent
          break
        case 'allocation':
          comparison = a.allocation - b.allocation
          break
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'performance':
          comparison = a.performance.year - b.performance.year
          break
        default:
          comparison = 0
      }
      
      return sortOrder === 'desc' ? -comparison : comparison
    })
    
    // If summary is requested, return portfolio summary
    if (summary) {
      const totalValue = assets.reduce((sum, a) => sum + a.totalValue, 0)
      const totalCostBasis = assets.reduce((sum, a) => sum + a.costBasis, 0)
      const totalUnrealizedGain = totalValue - totalCostBasis
      const totalUnrealizedGainPercent = (totalUnrealizedGain / totalCostBasis) * 100
      
      // Calculate today's gain (using day performance)
      const todayGain = assets.reduce((sum, a) => 
        sum + (a.totalValue * (a.performance.day / 100)), 0
      )
      const todayGainPercent = (todayGain / totalValue) * 100
      
      // Calculate asset allocation by category
      const categoryMap = new Map<AssetCategory, number>()
      assets.forEach(asset => {
        const current = categoryMap.get(asset.category) || 0
        categoryMap.set(asset.category, current + asset.totalValue)
      })
      
      const assetAllocation = Array.from(categoryMap.entries()).map(([category, value]) => ({
        category,
        value,
        percentage: (value / totalValue) * 100
      }))
      
      const portfolioSummary: PortfolioSummary = {
        totalValue,
        totalCostBasis,
        totalUnrealizedGain,
        totalUnrealizedGainPercent,
        todayGain,
        todayGainPercent,
        assetAllocation
      }
      
      return NextResponse.json({
        success: true,
        data: portfolioSummary
      })
    }
    
    // Calculate pagination
    const total = assets.length
    const totalPages = Math.ceil(total / pageSize)
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedAssets = assets.slice(startIndex, endIndex)
    
    // Return paginated response
    return NextResponse.json({
      success: true,
      data: {
        data: paginatedAssets,
        page,
        pageSize,
        total,
        totalPages
      }
    })
  } catch (error) {
    console.error('Error fetching assets:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    )
  }
}
