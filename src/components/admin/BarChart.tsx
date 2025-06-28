"use client"

import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

interface BarChartData {
  name: string
  listings: number
  sold: number
  avgPrice: number
}

interface BarChartProps {
  data: BarChartData[]
  type: 'brands' | 'models'
}

export default function BarChart({ data, type }: BarChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current || !data.length) return

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext('2d')
    if (!ctx) return

    const labels = data.map(item => item.name)
    
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Total Listings',
            data: data.map(item => item.listings),
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: '#3b82f6',
            borderWidth: 1,
          },
          {
            label: 'Sold',
            data: data.map(item => item.sold),
            backgroundColor: 'rgba(16, 185, 129, 0.8)',
            borderColor: '#10b981',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index' as const,
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'top' as const,
          },
          tooltip: {
            mode: 'index' as const,
            intersect: false,
            callbacks: {
              afterBody: function(context) {
                const dataIndex = context[0].dataIndex
                const avgPrice = data[dataIndex].avgPrice
                return `Average Price: €${avgPrice.toLocaleString()}`
              }
            }
          },
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: type === 'brands' ? 'Brands' : 'Models',
            },
            ticks: {
              maxRotation: 45,
              minRotation: 45,
            },
          },
          y: {
            type: 'linear' as const,
            display: true,
            position: 'left' as const,
            title: {
              display: true,
              text: 'Number of Listings',
            },
            beginAtZero: true,
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, type])

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  return <canvas ref={chartRef} />
} 