"use client"

import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

interface TimeSeriesData {
  period: string
  count: number
  sold_count?: number
  avg_price?: number
  accepted_count?: number
  rejected_count?: number
  avg_rating?: number
}

interface LineChartProps {
  data: TimeSeriesData[]
  metric: string
}

export default function LineChart({ data, metric }: LineChartProps) {
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

    const labels = data.map(item => item.period)
    const datasets = []

    // Main metric dataset
    datasets.push({
      label: metric.charAt(0).toUpperCase() + metric.slice(1),
      data: data.map(item => item.count),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
    })

    // Additional datasets based on metric
    if (metric === 'listings' && data[0]?.sold_count !== undefined) {
      datasets.push({
        label: 'Sold',
        data: data.map(item => item.sold_count || 0),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
      })
    }

    if (metric === 'offers') {
      if (data[0]?.accepted_count !== undefined) {
        datasets.push({
          label: 'Accepted',
          data: data.map(item => item.accepted_count || 0),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 2,
          fill: false,
          tension: 0.4,
        })
      }
      if (data[0]?.rejected_count !== undefined) {
        datasets.push({
          label: 'Rejected',
          data: data.map(item => item.rejected_count || 0),
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderWidth: 2,
          fill: false,
          tension: 0.4,
        })
      }
    }

    if (metric === 'reviews' && data[0]?.avg_rating !== undefined) {
      datasets.push({
        label: 'Average Rating',
        data: data.map(item => item.avg_rating || 0),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        yAxisID: 'y1',
      })
    }

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets,
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
          },
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Period',
            },
          },
          y: {
            type: 'linear' as const,
            display: true,
            position: 'left' as const,
            title: {
              display: true,
              text: metric === 'reviews' ? 'Count' : 'Count',
            },
          },
          y1: {
            type: 'linear' as const,
            display: metric === 'reviews',
            position: 'right' as const,
            title: {
              display: true,
              text: 'Rating',
            },
            grid: {
              drawOnChartArea: false,
            },
            min: 0,
            max: 5,
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, metric])

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  return <canvas ref={chartRef} />
} 