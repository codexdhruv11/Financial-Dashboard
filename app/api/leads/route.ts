import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { Lead, LeadStatus, LeadSource } from '@/types'

// Mark route as dynamic
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    // Get query parameters
    const status = searchParams.get('status') as LeadStatus | null
    const source = searchParams.get('source') as LeadSource | null
    const assignedTo = searchParams.get('assignedTo')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const analytics = searchParams.get('analytics') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const sortBy = searchParams.get('sortBy') || 'createdDate'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const scheme = searchParams.get('scheme')
    const search = searchParams.get('search')
    
    // Build file path and check existence
    const jsonPath = path.join(process.cwd(), 'public', 'data', 'leads.json')
    
    try {
      await fs.access(jsonPath)
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: 'Data file not found',
          error: {
            code: 'FILE_NOT_FOUND',
            details: 'Leads data file does not exist'
          }
        },
        { status: 404 }
      )
    }
    
    // Read the JSON file
    const jsonData = await fs.readFile(jsonPath, 'utf-8')
    let leads: Lead[] = JSON.parse(jsonData)
    
    // Apply filters
    if (status) {
      leads = leads.filter(l => l.status === status)
    }
    
    if (source) {
      leads = leads.filter(l => l.source === source)
    }
    
    if (assignedTo) {
      leads = leads.filter(l => l.assignedTo === assignedTo)
    }
    
    if (startDate) {
      const start = new Date(startDate)
      leads = leads.filter(l => new Date(l.createdDate) >= start)
    }
    
    if (endDate) {
      const end = new Date(endDate)
      leads = leads.filter(l => new Date(l.createdDate) <= end)
    }
    
    // Apply scheme filter
    if (scheme) {
      leads = leads.filter(l => {
        const leadWithScheme = l as any
        return leadWithScheme.scheme && 
               leadWithScheme.scheme.toLowerCase().includes(scheme.toLowerCase())
      })
    }
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      leads = leads.filter(l => 
        l.company.toLowerCase().includes(searchLower) ||
        l.contactName.toLowerCase().includes(searchLower) ||
        l.contactEmail.toLowerCase().includes(searchLower) ||
        (l.contactPhone && l.contactPhone.includes(search))
      )
    }
    
    // If analytics is requested, return lead analytics
    if (analytics) {
      const totalLeads = leads.length
      const totalPotentialValue = leads.reduce((sum, l) => sum + l.potentialValue, 0)
      
      // Status breakdown
      const statusMap = new Map<LeadStatus, number>()
      leads.forEach(lead => {
        const current = statusMap.get(lead.status) || 0
        statusMap.set(lead.status, current + 1)
      })
      
      const statusBreakdown = Array.from(statusMap.entries()).map(([status, count]) => ({
        status,
        count,
        percentage: (count / totalLeads) * 100
      }))
      
      // Source breakdown
      const sourceMap = new Map<LeadSource, number>()
      leads.forEach(lead => {
        const current = sourceMap.get(lead.source) || 0
        sourceMap.set(lead.source, current + 1)
      })
      
      const sourceBreakdown = Array.from(sourceMap.entries()).map(([source, count]) => ({
        source,
        count,
        percentage: (count / totalLeads) * 100
      }))
      
      // Calculate conversion metrics
      const closedWon = leads.filter(l => l.status === LeadStatus.ClosedWon).length
      const closedLost = leads.filter(l => l.status === LeadStatus.ClosedLost).length
      const conversionRate = totalLeads > 0 ? (closedWon / totalLeads) * 100 : 0
      
      // Average potential value
      const averagePotentialValue = totalLeads > 0 ? totalPotentialValue / totalLeads : 0
      
      return NextResponse.json({
        success: true,
        data: {
          totalLeads,
          totalPotentialValue,
          averagePotentialValue,
          closedWon,
          closedLost,
          conversionRate,
          statusBreakdown,
          sourceBreakdown
        }
      })
    }
    
    // Sort leads
    leads.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'createdDate':
          comparison = new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
          break
        case 'lastContactedDate':
          comparison = new Date(a.lastContactedDate).getTime() - new Date(b.lastContactedDate).getTime()
          break
        case 'potentialValue':
          comparison = a.potentialValue - b.potentialValue
          break
        case 'company':
          comparison = a.company.localeCompare(b.company)
          break
        default:
          comparison = 0
      }
      
      return sortOrder === 'desc' ? -comparison : comparison
    })
    
    // Calculate pagination
    const total = leads.length
    const totalPages = Math.ceil(total / pageSize)
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedLeads = leads.slice(startIndex, endIndex)
    
    // Return paginated response
    return NextResponse.json({
      success: true,
      data: {
        data: paginatedLeads,
        page,
        pageSize,
        total,
        totalPages
      }
    })
  } catch (error) {
    console.error('Error fetching leads:', error)
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
