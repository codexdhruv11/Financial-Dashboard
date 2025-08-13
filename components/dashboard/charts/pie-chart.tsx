'use client'

import React from 'react'
import { Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js'
import { Skeleton } from '@/components/ui/skeleton'
import { getChartOptions } from '@/lib/dashboard-utils'
import { AlertCircle } from 'lucide-react'

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend)

export interface PieChartProps {
  data: ChartData<'pie'>
  options?: ChartOptions<'pie'>
  loading?: boolean
  error?: string
  size?: 'small' | 'medium' | 'large'
  className?: string
  ariaLabel?: string
  ariaDescription?: string
}

const sizeMap = {
  small: 'h-[200px]',
  medium: 'h-[300px]',
  large: 'h-[400px]',
}

export function PieChart({
  data,
  options,
  loading = false,
  error,
  size = 'medium',
  className = '',
  ariaLabel,
  ariaDescription,
}: PieChartProps) {
  // Helper function for consistent percentage calculation
  const pct = (value: number, total: number) => total > 0 ? ((value / total) * 100).toFixed(1) : '0.0'
  // Enhanced chart options with accessibility
  const chartOptions = getChartOptions('pie', {
    ...options,
    plugins: {
      ...options?.plugins,
      tooltip: {
        ...options?.plugins?.tooltip,
        callbacks: {
          ...options?.plugins?.tooltip?.callbacks,
          // Add percentage to tooltips for better context
          label: function(context: any) {
            const label = context.label || ''
            const value = context.parsed || 0
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
            return `${label}: ${value} (${pct(value, total)}%)`
          }
        }
      },
      legend: {
        ...options?.plugins?.legend,
        labels: {
          ...options?.plugins?.legend?.labels,
          generateLabels: function(chart: any) {
            const original = ChartJS.defaults.plugins.legend.labels.generateLabels
            const labels = original.call(this, chart)
            // Add percentage to legend labels for accessibility
            labels.forEach((label: any, index: number) => {
              const dataset = chart.data.datasets[0]
              const total = dataset.data.reduce((a: number, b: number) => a + b, 0)
              const value = dataset.data[index]
              label.text = `${label.text} (${pct(value, total)}%)`
            })
            return labels
          }
        }
      }
    },
    // Add keyboard navigation support
    interaction: {
      ...options?.interaction,
      mode: 'point' as const,
      intersect: true,
    },
    // Ensure focus is visible
    onHover: (event: any, activeElements: any[]) => {
      (event.native.target as HTMLElement).style.cursor = activeElements.length > 0 ? 'pointer' : 'default'
    },
  })
  
  const sizeClass = sizeMap[size]

  if (loading) {
    return (
      <div className={`${sizeClass} ${className} flex items-center justify-center`}
           role="status"
           aria-label="Loading chart">
        <Skeleton className="w-full h-full rounded-lg" />
        <span className="sr-only">Loading pie chart...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`${sizeClass} ${className} flex flex-col items-center justify-center text-muted-foreground`}
           role="alert"
           aria-label="Chart error">
        <AlertCircle className="h-8 w-8 mb-2" aria-hidden="true" />
        <p className="text-sm text-center">{error}</p>
      </div>
    )
  }

  if (!data || !data.datasets || data.datasets.length === 0) {
    return (
      <div className={`${sizeClass} ${className} flex items-center justify-center text-muted-foreground`}
           role="status"
           aria-label="No data available">
        <p className="text-sm">No data available</p>
      </div>
    )
  }

  // Generate aria description from data
  const generateAriaDescription = () => {
    if (ariaDescription) return ariaDescription
    
    if (!data.labels || !data.datasets[0]?.data) return 'Pie chart'
    
    const dataset = data.datasets[0]
    const total = dataset.data.reduce((a: any, b: any) => Number(a) + Number(b), 0)
    const descriptions = data.labels.map((label, index) => {
      const value = dataset.data[index]
      return `${label}: ${value} (${pct(Number(value), total)}%)`
    })
    
    return `Pie chart showing distribution: ${descriptions.join(', ')}`
  }

  return (
    <div className={`${sizeClass} ${className} relative`}
         role="img"
         aria-label={ariaLabel || 'Pie chart'}
         aria-description={generateAriaDescription()}
         tabIndex={0}>
      <Pie data={data} options={chartOptions} 
           aria-label={ariaLabel || 'Pie chart'} />
      {/* Screen reader only data table representation */}
      <div className="sr-only" role="region" aria-live="polite">
        <table>
          <caption>{ariaLabel || 'Pie chart data'}</caption>
          <thead>
            <tr>
              <th>Category</th>
              <th>Value</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {data.labels?.map((label, index) => {
              const value = data.datasets[0].data[index]
              const total = data.datasets[0].data.reduce((a: any, b: any) => Number(a) + Number(b), 0)
              return (
                <tr key={index}>
                  <td>{String(label)}</td>
                  <td>{String(value)}</td>
                  <td>{pct(Number(value), total)}%</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
