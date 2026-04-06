'use client'

import { Card } from '@/components/ui/card'
import { ArrowDownIcon, ArrowUpIcon, WalletIcon, TrendingUpIcon } from 'lucide-react'


interface SummaryCardsProps {
  totalIncome: number
  totalExpenses: number
  balance: number
}

export function SummaryCards({ totalIncome, totalExpenses, balance }: SummaryCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const savingsRate = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0

  const cards = [
    {
      label: 'Total Balance',
      value: formatCurrency(balance),
      subtitle: 'Current net worth',
      icon: WalletIcon,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      valueColor: balance >= 0 ? 'text-foreground' : 'text-destructive',
    },
    {
      label: 'Total Income',
      value: formatCurrency(totalIncome),
      subtitle: 'All time earnings',
      icon: ArrowUpIcon,
      iconBg: 'bg-success/10',
      iconColor: 'text-success',
      valueColor: 'text-success',
    },
    {
      label: 'Total Expenses',
      value: formatCurrency(totalExpenses),
      subtitle: 'All time spending',
      icon: ArrowDownIcon,
      iconBg: 'bg-destructive/10',
      iconColor: 'text-destructive',
      valueColor: 'text-destructive',
    },
    {
      label: 'Savings Rate',
      value: `${savingsRate}%`,
      subtitle: 'Of income saved',
      icon: TrendingUpIcon,
      iconBg: 'bg-chart-2/10',
      iconColor: 'text-chart-2',
      valueColor: 'text-chart-2',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <Card 
          key={card.label} 
          className="relative overflow-hidden border-0 bg-card shadow-sm ring-1 ring-border/50 transition-shadow hover:shadow-md"
        >
          <div className="p-4 sm:p-6">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1 space-y-0.5 sm:space-y-1">
                <p className="truncate text-[11px] font-medium text-muted-foreground sm:text-[13px]">
                  {card.label}
                </p>
                <p className={`truncate text-lg font-semibold tracking-tight sm:text-2xl ${card.valueColor}`}>
                  {card.value}
                </p>
                <p className="hidden text-xs text-muted-foreground/80 sm:block">
                  {card.subtitle}
                </p>
              </div>
              <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg sm:size-10 ${card.iconBg}`}>
                <card.icon className={`size-4 sm:size-5 ${card.iconColor}`} />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
