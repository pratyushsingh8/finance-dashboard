'use client'

import { useState, useMemo } from 'react'
import { DashboardHeader } from './dashboard-header'
import { SummaryCards } from './summary-cards'
import { TransactionsTable } from './transactions-table'
import { Insights } from './insights'
import { Charts } from './charts'
import { mockTransactions } from '@/lib/mock-data'
import type { Transaction, Role } from '@/lib/types'

export function FinanceDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [role, setRole] = useState<Role>('admin')

  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
    }
  }, [transactions])

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: crypto.randomUUID(),
    }
    setTransactions((prev) => [transaction, ...prev])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <DashboardHeader
        role={role}
        onRoleChange={setRole}
        onAddTransaction={handleAddTransaction}
      />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="space-y-6 sm:space-y-8">
          {/* Summary Cards */}
          <section>
            <SummaryCards
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
              balance={balance}
            />
          </section>

          {/* Charts */}
          <section>
            <Charts transactions={transactions} />
          </section>

          {/* Transactions Table and Insights */}
          <section className="grid gap-6 sm:gap-8 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <TransactionsTable transactions={transactions} />
            </div>
            <div className="xl:col-span-1">
              <Insights transactions={transactions} />
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
