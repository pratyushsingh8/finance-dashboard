'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LightbulbIcon, TrendingUpIcon, TrendingDownIcon, AlertCircleIcon } from 'lucide-react'
import type { Transaction } from '@/lib/types'

interface InsightsProps {
  transactions: Transaction[]
}

export function Insights({ transactions }: InsightsProps) {
  const expenses = transactions.filter((t) => t.type === 'expense')
  const income = transactions.filter((t) => t.type === 'income')

  const categorySpending = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount
    return acc
  }, {} as Record<string, number>)

  const highestSpendingCategory = Object.entries(categorySpending).sort(
    (a, b) => b[1] - a[1]
  )[0]

  const categoryIncome = income.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount
    return acc
  }, {} as Record<string, number>)

  const topIncomeSource = Object.entries(categoryIncome).sort(
    (a, b) => b[1] - a[1]
  )[0]

  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  if (transactions.length === 0) {
    return (
      <Card className="border-0 bg-card shadow-sm ring-1 ring-border/50">
        <div className="flex items-center gap-2 border-b border-border/50 px-4 py-3 sm:px-6 sm:py-4">
          <LightbulbIcon className="size-4 text-muted-foreground sm:size-5" />
          <h2 className="text-sm font-semibold sm:text-base">Insights</h2>
        </div>
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertCircleIcon className="size-4" />
            <span className="text-sm">Add transactions to see insights</span>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="border-0 bg-card shadow-sm ring-1 ring-border/50">
      <div className="flex items-center gap-2 border-b border-border/50 px-4 py-3 sm:px-6 sm:py-4">
        <LightbulbIcon className="size-4 text-muted-foreground sm:size-5" />
        <h2 className="text-sm font-semibold sm:text-base">Insights</h2>
      </div>
      <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
        {/* Income vs Expense Summary */}
        <div className="space-y-2 sm:space-y-3">
          <h3 className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:text-xs">
            Overview
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-success/5 p-2.5 ring-1 ring-success/20 sm:gap-3 sm:p-3">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-success/10 sm:size-8">
                <TrendingUpIcon className="size-3.5 text-success sm:size-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-medium text-muted-foreground sm:text-[11px]">Income</p>
                <p className="truncate text-xs font-semibold text-success sm:text-sm">{formatCurrency(totalIncome)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-destructive/5 p-2.5 ring-1 ring-destructive/20 sm:gap-3 sm:p-3">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-destructive/10 sm:size-8">
                <TrendingDownIcon className="size-3.5 text-destructive sm:size-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-medium text-muted-foreground sm:text-[11px]">Expenses</p>
                <p className="truncate text-xs font-semibold text-destructive sm:text-sm">{formatCurrency(totalExpenses)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Highest Spending Category */}
        {highestSpendingCategory && (
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:text-xs">
              Top Expense
            </h3>
            <div className="flex items-center justify-between rounded-lg bg-secondary/30 p-2.5 sm:p-3">
              <Badge variant="secondary" className="text-xs font-normal">
                {highestSpendingCategory[0]}
              </Badge>
              <span className="text-xs font-semibold text-destructive sm:text-sm">
                {formatCurrency(highestSpendingCategory[1])}
              </span>
            </div>
          </div>
        )}

        {/* Top Income Source */}
        {topIncomeSource && (
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:text-xs">
              Top Income
            </h3>
            <div className="flex items-center justify-between rounded-lg bg-secondary/30 p-2.5 sm:p-3">
              <Badge variant="secondary" className="text-xs font-normal">
                {topIncomeSource[0]}
              </Badge>
              <span className="text-xs font-semibold text-success sm:text-sm">
                {formatCurrency(topIncomeSource[1])}
              </span>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="space-y-2 sm:space-y-3">
          <h3 className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:text-xs">
            Stats
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-secondary/30 px-2.5 py-2 text-center sm:px-3 sm:py-2.5">
              <p className="text-base font-semibold sm:text-lg">{transactions.length}</p>
              <p className="text-[10px] text-muted-foreground sm:text-[11px]">Transactions</p>
            </div>
            <div className="rounded-lg bg-secondary/30 px-2.5 py-2 text-center sm:px-3 sm:py-2.5">
              <p className="text-base font-semibold sm:text-lg">
                {Object.keys({ ...categorySpending, ...categoryIncome }).length}
              </p>
              <p className="text-[10px] text-muted-foreground sm:text-[11px]">Categories</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
