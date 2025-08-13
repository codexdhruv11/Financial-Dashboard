import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { Transaction, TransactionType, TransactionStatus } from '@/types'

// Mark route as dynamic
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    // Get query parameters
    const type = searchParams.get('type') as TransactionType | null
    const status = searchParams.get('status') as TransactionStatus | null
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const sortBy = searchParams.get('sortBy') || 'date'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    
    // Build file path and check existence
    const jsonPath = path.join(process.cwd(), 'public', 'data', 'transactions.json')
    
    try {
      await fs.access(jsonPath)
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: 'Data file not found',
          error: {
            code: 'FILE_NOT_FOUND',
            details: 'Transactions data file does not exist'
          }
        },
        { status: 404 }
      )
    }
    
    // Read the JSON file
    const jsonData = await fs.readFile(jsonPath, 'utf-8')
    let transactions: Transaction[] = JSON.parse(jsonData)
    
    // Apply filters
    if (type) {
      transactions = transactions.filter(t => t.type === type)
    }
    
    if (status) {
      transactions = transactions.filter(t => t.status === status)
    }
    
    if (startDate) {
      const start = new Date(startDate)
      transactions = transactions.filter(t => new Date(t.date) >= start)
    }
    
    if (endDate) {
      const end = new Date(endDate)
      transactions = transactions.filter(t => new Date(t.date) <= end)
    }
    
    // Sort transactions
    transactions.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
          break
        case 'total':
          comparison = a.total - b.total
          break
        case 'company':
          comparison = (a.company || '').localeCompare(b.company || '')
          break
        default:
          comparison = 0
      }
      
      return sortOrder === 'desc' ? -comparison : comparison
    })
    
    // Calculate pagination
    const total = transactions.length
    const totalPages = Math.ceil(total / pageSize)
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedTransactions = transactions.slice(startIndex, endIndex)
    
    // Return paginated response
    return NextResponse.json({
      success: true,
      data: {
        data: paginatedTransactions,
        page,
        pageSize,
        total,
        totalPages
      }
    })
  } catch (error) {
    console.error('Error fetching transactions:', error)
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
