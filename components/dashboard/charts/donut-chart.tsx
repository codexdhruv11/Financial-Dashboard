'use client'

import React from 'react'
import { Doughnut } from 'react-chartjs-2'
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

export interface DonutChartProps {
  data: ChartData<'doughnut'>
  options?: ChartOptions<'doughnut'>
  centerText?: {
    value: string
    label?: string
  }
  loading?: boolean
  error?: string
  size?: 'small' | 'medium' | 'large'
  className?: string
  ariaLabel?: string
  ariaDescription?: string
}

const sizeMap = {
  small: { height: 'h-[200px]', valueFontSize: 18, labelFontSize: 10, valueOffset: -8, labelOffset: 12 },
  medium: { height: 'h-[300px]', valueFontSize: 24, labelFontSize: 12, valueOffset: -10, labelOffset: 15 },
  large: { height: 'h-[400px]', valueFontSize: 32, labelFontSize: 14, valueOffset: -12, labelOffset: 20 },
}

export function DonutChart({
  data,
  options,
  centerText,
  loading = false,
  error,
  size = 'medium',
  className = '',
  ariaLabel,
  ariaDescription,
}: DonutChartProps) {
  const sizeConfig = sizeMap[size]
  
  // Helper function for consistent percentage calculation
  const pct = (value: number, total: number) => total > 0 ? ((value / total) * 100).toFixed(1) : '0.0'
  
  // Enhanced chart options with accessibility
  const chartOptions = getChartOptions('donut', {
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
  })

  if (loading) {
    return (
      <div className={`${sizeConfig.height} ${className} flex items-center justify-center`}
           role="status"
           aria-label="Loading chart">
        <Skeleton className="w-full h-full rounded-lg" />
        <span className="sr-only">Loading donut chart...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`${sizeConfig.height} ${className} flex flex-col items-center justify-center text-muted-foreground`}
           role="alert"
           aria-label="Chart error">
        <AlertCircle className="h-8 w-8 mb-2" aria-hidden="true" />
        <p className="text-sm text-center">{error}</p>
      </div>
    )
  }

  if (!data || !data.datasets || data.datasets.length === 0) {
    return (
      <div className={`${sizeConfig.height} ${className} flex items-center justify-center text-muted-foreground`}
           role="status"
           aria-label="No data available">
        <p className="text-sm">No data available</p>
      </div>
    )
  }

  // Custom plugin for center text with responsive sizing
  const centerTextPlugin = centerText ? {
    id: 'centerText',
    beforeDraw: (chart: any) => {
      const { ctx, chartArea } = chart
      if (!chartArea) return

      ctx.save()
      const centerX = (chartArea.left + chartArea.right) / 2
      const centerY = (chartArea.top + chartArea.bottom) / 2

      // Draw value with responsive font size
      ctx.font = `bold ${sizeConfig.valueFontSize}px sans-serif`
      ctx.fillStyle = 'hsl(var(--foreground))'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(centerText.value, centerX, centerY + sizeConfig.valueOffset)

      // Draw label if provided with responsive font size
      if (centerText.label) {
        ctx.font = `${sizeConfig.labelFontSize}px sans-serif`
        ctx.fillStyle = 'hsl(var(--muted-foreground))'
        ctx.fillText(centerText.label, centerX, centerY + sizeConfig.labelOffset)
      }

      ctx.restore()
    },
  } : null

  // Generate aria description from data
  const generateAriaDescription = () => {
    if (ariaDescription) return ariaDescription
    
    if (!data.labels || !data.datasets[0]?.data) return 'Donut chart'
    
    const dataset = data.datasets[0]
    const total = dataset.data.reduce((a: any, b: any) => Number(a) + Number(b), 0)
    const descriptions = data.labels.map((label, index) => {
      const value = dataset.data[index]
      return `${label}: ${value} (${pct(Number(value), total)}%)`
    })
    
    return `Donut chart showing distribution: ${descriptions.join(', ')}`
  }

  return (
    <div className={`${sizeConfig.height} ${className} relative`}
         role="img"
         aria-label={ariaLabel || 'Donut chart'}
         aria-description={generateAriaDescription()}>
      <Doughnut 
        data={data} 
        options={chartOptions} 
        plugins={centerTextPlugin ? [centerTextPlugin] : undefined}
        aria-label={ariaLabel || 'Donut chart'}
      />
      {/* Screen reader only data table representation */}
      <div className="sr-only" role="region" aria-live="polite">
        {centerText && (
          <p>Center display: {centerText.value} {centerText.label || ''}</p>
        )}
        <table>
          <caption>{ariaLabel || 'Donut chart data'}</caption>
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
