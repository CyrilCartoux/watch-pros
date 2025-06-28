"use client"

import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

interface PieChartData {
  name: string
  value: number
  color: string
}

interface PieChartProps {
  data: PieChartData[]
}

export default function PieChart({ data }: PieChartProps) {
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

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.map(item => item.name),
        datasets: [
          {
            data: data.map(item => item.value),
            backgroundColor: data.map(item => item.color),
            borderColor: data.map(item => item.color),
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom' as const,
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || ''
                const value = context.parsed
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
                const percentage = ((value / total) * 100).toFixed(1)
                return `${label}: ${value} (${percentage}%)`
              }
            }
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data])

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  return <canvas ref={chartRef} />
} 