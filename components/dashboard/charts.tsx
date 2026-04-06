'use client'

import { useMemo } from 'react'
import { Card } from '@/components/ui/card'
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { TrendingUpIcon, PieChartIcon } from 'lucide-react'
import type { Transaction } from '@/lib/types'

interface ChartsProps {
  transactions: Transaction[]
}

const COLORS = [
  'oklch(0.65 0.18 160)',
  'oklch(0.65 0.18 250)',
  'oklch(0.75 0.15 80)',
  'oklch(0.6 0.2 25)',
  'oklch(0.65 0.15 300)',
]

export function Charts({ transactions }: ChartsProps) {
  const trendData = useMemo(() => {
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    const dailyData: Record<string, { income: number; expense: number }> = {}

    sortedTransactions.forEach((t) => {
      if (!dailyData[t.date]) {
        dailyData[t.date] = { income: 0, expense: 0 }
      }
      if (t.type === 'income') {
        dailyData[t.date].income += t.amount
      } else {
        dailyData[t.date].expense += t.amount
      }
    })

    return Object.entries(dailyData)
      .map(([date, data]) => ({
        date: new Date(date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        income: data.income,
        expense: data.expense,
      }))
      .slice(-10)
  }, [transactions])

  const categoryData = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'expense')
    const categoryTotals: Record<string, number> = {}

    expenses.forEach((t) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount
    })

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
  }, [transactions])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean
    payload?: Array<{ value: number; name: string; color: string }>
    label?: string
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-border/50 bg-popover px-3 py-2 shadow-lg">
          <p className="mb-1.5 text-xs font-medium text-foreground">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const PieTooltip = ({ active, payload }: {
    active?: boolean
    payload?: Array<{ payload: { name: string; value: number } }>
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-border/50 bg-popover px-3 py-2 shadow-lg">
          <p className="text-xs font-medium text-foreground">{payload[0].payload.name}</p>
          <p className="text-xs text-muted-foreground">
            {formatCurrency(payload[0].payload.value)}
          </p>
        </div>
      )
    }
    return null
  }

  if (transactions.length === 0) {
    return null
  }

  return (
    <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
      {/* Line Chart */}
      <Card className="border-0 bg-card shadow-sm ring-1 ring-border/50">
        <div className="flex items-center gap-2 border-b border-border/50 px-4 py-3 sm:px-6 sm:py-4">
          <TrendingUpIcon className="size-4 text-muted-foreground sm:size-5" />
          <h2 className="text-sm font-semibold sm:text-base">Income vs Expenses</h2>
        </div>
        <div className="p-3 sm:p-6">
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240} className="sm:!h-[280px]">
              <LineChart data={trendData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0 0)" strokeOpacity={0.5} />
                <XAxis 
                  dataKey="date" 
                  stroke="oklch(0.5 0 0)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  stroke="oklch(0.5 0 0)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                  width={45}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '12px', fontSize: '11px' }}
                  formatter={(value) => <span className="text-[11px] text-muted-foreground sm:text-xs">{value}</span>}
                />
                <Line
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke="oklch(0.65 0.18 145)"
                  strokeWidth={2}
                  dot={{ fill: 'oklch(0.65 0.18 145)', strokeWidth: 0, r: 2 }}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  name="Expense"
                  stroke="oklch(0.6 0.2 25)"
                  strokeWidth={2}
                  dot={{ fill: 'oklch(0.6 0.2 25)', strokeWidth: 0, r: 2 }}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground sm:h-[280px]">
              No data available
            </div>
          )}
        </div>
      </Card>

      {/* Pie Chart */}
      <Card className="border-0 bg-card shadow-sm ring-1 ring-border/50">
        <div className="flex items-center gap-2 border-b border-border/50 px-4 py-3 sm:px-6 sm:py-4">
          <PieChartIcon className="size-4 text-muted-foreground sm:size-5" />
          <h2 className="text-sm font-semibold sm:text-base">Expenses by Category</h2>
        </div>
        <div className="p-3 sm:p-6">
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240} className="sm:!h-[280px]">
              <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: 'oklch(0.5 0 0)', strokeWidth: 1 }}
                >
                  {categoryData.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      stroke="oklch(0.14 0 0)"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground sm:h-[280px]">
              No expense data available
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
