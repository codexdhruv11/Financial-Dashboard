'use client'

import React from 'react'
import { PieChart } from '@/components/dashboard/charts/pie-chart'
import { AssetCategory } from '@/types'

export default function TestPieChartPage() {
  // Test with hardcoded data
  const testData = {
    labels: ['Stocks', 'Bonds', 'ETFs', 'Cash'],
    datasets: [{
      data: [45000, 30000, 15000, 10000],
      backgroundColor: [
        'rgba(54, 162, 235, 0.8)',  // Blue
        'rgba(255, 206, 86, 0.8)',   // Yellow
        'rgba(75, 192, 192, 0.8)',   // Teal
        'rgba(153, 102, 255, 0.8)',  // Purple
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
      ],
      borderWidth: 2,
      hoverOffset: 4,
    }]
  }

  // Test with CSS variables
  const cssVarData = {
    labels: ['Stocks', 'Bonds', 'ETFs', 'Cash'],
    datasets: [{
      data: [45000, 30000, 15000, 10000],
      backgroundColor: [
        'hsl(220, 70%, 50%)',  // --chart-1
        'hsl(160, 60%, 45%)',  // --chart-2
        'hsl(30, 80%, 55%)',   // --chart-3
        'hsl(280, 65%, 60%)',  // --chart-4
      ],
      borderColor: [
        'hsl(220, 70%, 40%)',
        'hsl(160, 60%, 35%)',
        'hsl(30, 80%, 45%)',
        'hsl(280, 65%, 50%)',
      ],
      borderWidth: 2,
      hoverOffset: 4,
    }]
  }

  // Test with CSS variables using var()
  const cssVarData2 = {
    labels: ['Stocks', 'Bonds', 'ETFs', 'Cash'],
    datasets: [{
      data: [45000, 30000, 15000, 10000],
      backgroundColor: [
        'hsl(var(--chart-1))',
        'hsl(var(--chart-2))',
        'hsl(var(--chart-3))',
        'hsl(var(--chart-4))',
      ],
      borderColor: [
        'hsl(var(--chart-1) / 0.8)',
        'hsl(var(--chart-2) / 0.8)',
        'hsl(var(--chart-3) / 0.8)',
        'hsl(var(--chart-4) / 0.8)',
      ],
      borderWidth: 2,
      hoverOffset: 4,
    }]
  }

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-2xl font-bold mb-8">Pie Chart Color Test</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Test 1: RGBA Colors</h2>
          <p className="text-sm text-muted-foreground mb-4">Using hardcoded RGBA colors</p>
          <div className="h-[300px]">
            <PieChart 
              data={testData} 
              size="medium"
              ariaLabel="Test pie chart with RGBA colors"
            />
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Test 2: HSL Colors</h2>
          <p className="text-sm text-muted-foreground mb-4">Using hardcoded HSL colors</p>
          <div className="h-[300px]">
            <PieChart 
              data={cssVarData} 
              size="medium"
              ariaLabel="Test pie chart with HSL colors"
            />
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Test 3: CSS Variables</h2>
          <p className="text-sm text-muted-foreground mb-4">Using CSS variables (current implementation)</p>
          <div className="h-[300px]">
            <PieChart 
              data={cssVarData2} 
              size="medium"
              ariaLabel="Test pie chart with CSS variables"
            />
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-muted">
        <h2 className="text-lg font-semibold mb-4">CSS Variable Values</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>--chart-1:</strong> 220 70% 50% (Blue)</p>
            <p><strong>--chart-2:</strong> 160 60% 45% (Green)</p>
            <p><strong>--chart-3:</strong> 30 80% 55% (Orange)</p>
            <p><strong>--chart-4:</strong> 280 65% 60% (Purple)</p>
          </div>
          <div>
            <p><strong>--chart-5:</strong> 340 75% 55% (Pink)</p>
            <p><strong>--chart-6:</strong> 200 80% 50% (Cyan)</p>
            <p><strong>--chart-7:</strong> 120 65% 40% (Green)</p>
            <p><strong>--chart-8:</strong> 45 90% 60% (Yellow)</p>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Color Swatches</h2>
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded" style={{ backgroundColor: 'hsl(220, 70%, 50%)' }}></div>
            <span className="text-xs mt-1">Chart 1</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded" style={{ backgroundColor: 'hsl(160, 60%, 45%)' }}></div>
            <span className="text-xs mt-1">Chart 2</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded" style={{ backgroundColor: 'hsl(30, 80%, 55%)' }}></div>
            <span className="text-xs mt-1">Chart 3</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded" style={{ backgroundColor: 'hsl(280, 65%, 60%)' }}></div>
            <span className="text-xs mt-1">Chart 4</span>
          </div>
        </div>
      </div>
    </div>
  )
}
