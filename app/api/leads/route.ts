import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { Lead, LeadStatus, LeadSource } from '@/types'

// Keep this route dynamic
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    // Pull out all the query params
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
    
    // Check if we have the leads data file
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
    
    // Load all the leads data
    const jsonData = await fs.readFile(jsonPath, 'utf-8')
    let leads: Lead[] = JSON.parse(jsonData)
    
    // Filter based on request parameters
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
    
    // Smart scheme filtering with fuzzy matching
    if (scheme) {
      const q = scheme.toLowerCase().trim()
      const brand = q.split(/\s+/)[0] || ''
      
      // Handle different ways people refer to the same scheme
      const schemeAliases: Record<string, string[]> = {
        'bluechip': ['balanced', 'blue chip'],
        'midcap': ['mid-cap', 'mid cap'],
        'smallcap': ['small-cap', 'small cap']
      }
      
      leads = leads.filter(l => {
        const leadWithScheme = l as any
        const s = (leadWithScheme.scheme || '').toLowerCase()
        if (!s) return false
        
        // Try exact and partial matches first
        if (s.includes(q) || q.includes(s)) return true
        
        // Match by brand name (first word)
        if (brand && s.includes(brand)) return true
        
        // Try the alias mappings
        for (const [key, aliases] of Object.entries(schemeAliases)) {
          if (q.includes(key) && aliases.some(alias => s.includes(alias))) return true
          if (aliases.some(alias => q.includes(alias)) && s.includes(key)) return true
        }
        
        return false
      })
    }
    
    // General text search across key fields
    if (search) {
      const searchLower = search.toLowerCase()
      leads = leads.filter(l => 
        l.company.toLowerCase().includes(searchLower) ||
        l.contactName.toLowerCase().includes(searchLower) ||
        l.contactEmail.toLowerCase().includes(searchLower) ||
        (l.contactPhone && l.contactPhone.includes(search))
      )
    }
    
    // Return analytics summary instead of lead list
    if (analytics) {
      const totalLeads = leads.length
      const totalPotentialValue = leads.reduce((sum, l) => sum + l.potentialValue, 0)
      
      // Count by status
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
      
      // Count by source
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
      
      // Figure out win/loss rates
      const closedWon = leads.filter(l => l.status === LeadStatus.ClosedWon).length
      const closedLost = leads.filter(l => l.status === LeadStatus.ClosedLost).length
      const conversionRate = totalLeads > 0 ? (closedWon / totalLeads) * 100 : 0
      
      // Average deal size
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
    
    // Sort the results
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
    
    // Paginate the results
    const total = leads.length
    const totalPages = Math.ceil(total / pageSize)
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedLeads = leads.slice(startIndex, endIndex)
    
    // Send back the page of results
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
