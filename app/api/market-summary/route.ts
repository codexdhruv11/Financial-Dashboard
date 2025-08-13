import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { MarketData, MarketSummary } from '@/types'

// Mark route as dynamic
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    // Get query parameters
    const symbols = searchParams.get('symbols')?.split(',')
    const sector = searchParams.get('sector')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    
    // Build file path and check existence
    const jsonPath = path.join(process.cwd(), 'public', 'data', 'market-data.json')
    
    try {
      await fs.access(jsonPath)
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: 'Data file not found',
          error: {
            code: 'FILE_NOT_FOUND',
            details: 'Market data file does not exist'
          }
        },
        { status: 404 }
      )
    }
    
    // Read the JSON file
    const jsonData = await fs.readFile(jsonPath, 'utf-8')
    let marketData: MarketData[] = JSON.parse(jsonData)
    
    // Filter by symbols if provided
    if (symbols && symbols.length > 0) {
      marketData = marketData.filter(m => symbols.includes(m.symbol))
    }
    
    // Filter by sector if provided
    if (sector) {
      marketData = marketData.filter(m => m.sector === sector)
    }
    
    // Filter historical data by date range if provided
    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : new Date('1900-01-01')
      const end = endDate ? new Date(endDate) : new Date()
      
      marketData = marketData.map(item => ({
        ...item,
        historicalData: item.historicalData.filter(h => {
          const date = new Date(h.date)
          return date >= start && date <= end
        })
      }))
    }
    
    // Create market summary
    const indices = marketData.filter(m => m.sector === 'Index')
    const stocks = marketData.filter(m => m.sector !== 'Index')
    
    // Find top movers (stocks with highest absolute percentage change)
    const topMovers = stocks
      .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
      .slice(0, 5)
    
    // Calculate sector performance
    const sectorMap = new Map<string, { total: number, count: number }>()
    
    stocks.forEach(stock => {
      if (stock.sector && stock.sector !== 'Index') {
        const current = sectorMap.get(stock.sector) || { total: 0, count: 0 }
        sectorMap.set(stock.sector, {
          total: current.total + stock.changePercent,
          count: current.count + 1
        })
      }
    })
    
    const sectorPerformance = Array.from(sectorMap.entries())
      .map(([sector, data]) => ({
        sector,
        changePercent: data.total / data.count
      }))
      .sort((a, b) => b.changePercent - a.changePercent)
    
    const summary: MarketSummary = {
      indices,
      topMovers,
      sectorPerformance
    }
    
    // Return the response
    return NextResponse.json({
      success: true,
      data: summary
    })
  } catch (error) {
    console.error('Error fetching market summary:', error)
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
