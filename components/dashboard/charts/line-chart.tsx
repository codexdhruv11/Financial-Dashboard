'use client'

import React from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  Filler,
  Point,
} from 'chart.js'
import { Skeleton } from '@/components/ui/skeleton'
import { getChartOptions } from '@/lib/dashboard-utils'
import { AlertCircle } from 'lucide-react'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export interface LineChartProps {
  data: ChartData<'line'>
  options?: ChartOptions<'line'>
  loading?: boolean
  error?: string
  size?: 'small' | 'medium' | 'large'
  className?: string
  timePeriod?: 'daily' | 'weekly' | 'monthly'
  onTimePeriodChange?: (period: 'daily' | 'weekly' | 'monthly') => void
  ariaLabel?: string
  ariaDescription?: string
}

const sizeMap = {
  small: 'h-[200px]',
  medium: 'h-[300px]',
  large: 'h-[400px]',
}

export function LineChart({
  data,
  options,
  loading = false,
  error,
  size = 'medium',
  className = '',
  timePeriod = 'daily',
  onTimePeriodChange,
  ariaLabel,
  ariaDescription,
}: LineChartProps) {
  // Enhanced chart options with accessibility
  const chartOptions = getChartOptions('line', {
    ...options,
    plugins: {
      ...options?.plugins,
      tooltip: {
        ...options?.plugins?.tooltip,
        // Improve tooltip accessibility
        enabled: true,
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          ...options?.plugins?.tooltip?.callbacks,
          title: function(tooltipItems: any) {
            return tooltipItems[0]?.label || ''
          },
          label: function(context: any) {
            let label = context.dataset.label || ''
            if (label) {
              label += ': '
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y
            }
            return label
          }
        }
      },
      legend: {
        ...options?.plugins?.legend,
        labels: {
          ...options?.plugins?.legend?.labels,
          // Add keyboard navigation hints
          generateLabels: function(chart: any) {
            const original = ChartJS.defaults.plugins.legend.labels.generateLabels
            const labels = original.call(this, chart)
            return labels
          }
        }
      }
    },
    // Add keyboard navigation support
    interaction: {
      ...options?.interaction,
      mode: 'index' as const,
      intersect: false,
    },
    // Ensure focus is visible
    onHover: (event: any, activeElements: any[]) => {
      (event.native.target as HTMLElement).style.cursor = activeElements.length > 0 ? 'pointer' : 'default'
    },
  })
  
  const sizeClass = sizeMap[size]

  if (loading) {
    return (
      <div className={`${className}`}>
        {onTimePeriodChange && (
          <div className="flex justify-end mb-4" role="group" aria-label="Time period selector">
            <div className="flex gap-1 p-1 bg-muted rounded-lg">
              {(['daily', 'weekly', 'monthly'] as const).map((period) => (
                <button
                  key={period}
                  className="px-3 py-1 text-xs rounded-md capitalize opacity-50"
                  disabled
                  aria-disabled="true"
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className={`${sizeClass} flex items-center justify-center`}
             role="status"
             aria-label="Loading chart">
          <Skeleton className="w-full h-full rounded-lg" />
          <span className="sr-only">Loading line chart...</span>
        </div>
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
    
    if (!data.labels || !data.datasets || data.datasets.length === 0) return 'Line chart'
    
    const dataPoints = data.labels.length
    const seriesCount = data.datasets.length
    const seriesNames = data.datasets.map(d => d.label).join(', ')
    
    return `Line chart showing ${seriesCount} data series (${seriesNames}) over ${dataPoints} time points`
  }

  // Generate summary statistics for screen readers
  const generateDataSummary = () => {
    if (!data.datasets) return null
    
    return data.datasets.map(dataset => {
      const values = dataset.data as number[]
      const min = Math.min(...values)
      const max = Math.max(...values)
      const avg = values.reduce((a, b) => a + b, 0) / values.length
      
      return {
        label: dataset.label || 'Series',
        min,
        max,
        average: avg.toFixed(1)
      }
    })
  }

  return (
    <div className={`${className}`}>
      {onTimePeriodChange && (
        <div className="flex justify-end mb-4" 
             role="group" 
             aria-label="Time period selector">
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            {(['daily', 'weekly', 'monthly'] as const).map((period) => (
              <button
                key={period}
                onClick={() => onTimePeriodChange(period)}
                className={`px-3 py-1 text-xs rounded-md capitalize transition-colors ${
                  timePeriod === period
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                aria-pressed={timePeriod === period}
                aria-label={`View ${period} data`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className={`${sizeClass} relative`}
           role="img"
           aria-label={ariaLabel || 'Line chart'}
           aria-description={generateAriaDescription()}
           tabIndex={0}>
        <Line data={data} options={chartOptions}
              aria-label={ariaLabel || 'Line chart'} />
        {/* Screen reader only data table representation */}
        <div className="sr-only" role="region" aria-live="polite">
          <table>
            <caption>{ariaLabel || 'Line chart data'} - {timePeriod} view</caption>
            <thead>
              <tr>
                <th>Time Point</th>
                {data.datasets?.map((dataset, idx) => (
                  <th key={idx}>{dataset.label || `Series ${idx + 1}`}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.labels?.map((label, labelIdx) => (
                <tr key={labelIdx}>
                  <td>{String(label)}</td>
                  {data.datasets?.map((dataset, datasetIdx) => {
                    const value = dataset.data[labelIdx]
                    const displayValue = value !== null && value !== undefined 
                      ? typeof value === 'object' ? `(${(value as Point).x}, ${(value as Point).y})` : String(value)
                      : 'N/A'
                    return <td key={datasetIdx}>{displayValue}</td>
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          {/* Summary statistics */}
          <div className="mt-4">
            <h4>Summary Statistics</h4>
            {generateDataSummary()?.map((summary, idx) => (
              <div key={idx}>
                <p>{summary.label}: Min: {summary.min}, Max: {summary.max}, Average: {summary.average}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
