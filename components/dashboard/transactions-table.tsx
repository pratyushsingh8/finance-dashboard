'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Empty } from '@/components/ui/empty'
import { SearchIcon, ArrowUpDownIcon, ArrowUpIcon, ArrowDownIcon, InboxIcon, ReceiptIcon } from 'lucide-react'
import type { Transaction, FilterType, SortKey, SortOrder } from '@/lib/types'

interface TransactionsTableProps {
  transactions: Transaction[]
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('desc')
    }
  }

  const filteredAndSortedTransactions = transactions
    .filter((t) => {
      const matchesSearch = t.category.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase())
      const matchesFilter = filter === 'all' || t.type === filter
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      const multiplier = sortOrder === 'asc' ? 1 : -1
      if (sortKey === 'amount') {
        return (a.amount - b.amount) * multiplier
      }
      return (new Date(a.date).getTime() - new Date(b.date).getTime()) * multiplier
    })

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) {
      return <ArrowUpDownIcon className="ml-1.5 size-3.5 text-muted-foreground/50" />
    }
    return sortOrder === 'asc' 
      ? <ArrowUpIcon className="ml-1.5 size-3.5 text-foreground" />
      : <ArrowDownIcon className="ml-1.5 size-3.5 text-foreground" />
  }

  return (
    <Card className="border-0 bg-card shadow-sm ring-1 ring-border/50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-2">
          <ReceiptIcon className="size-4 text-muted-foreground sm:size-5" />
          <h2 className="text-sm font-semibold sm:text-base">Recent Transactions</h2>
          <Badge variant="secondary" className="ml-1 text-xs font-normal sm:ml-2">
            {filteredAndSortedTransactions.length}
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2 border-b border-border/50 px-4 py-3 sm:flex-row sm:items-center sm:gap-3 sm:px-6 sm:py-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
          <Input
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 border-border/50 bg-secondary/30 pl-9 text-sm placeholder:text-muted-foreground/50 focus-visible:ring-1"
          />
        </div>
        <Select value={filter} onValueChange={(value: FilterType) => setFilter(value)}>
          <SelectTrigger className="h-9 w-full border-border/50 bg-secondary/30 text-sm sm:w-[130px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="px-4 py-3 sm:px-6 sm:py-4">
        {filteredAndSortedTransactions.length === 0 ? (
          <div className="py-8 sm:py-12">
            <Empty
              icon={InboxIcon}
              title="No transactions found"
              description={search || filter !== 'all' 
                ? "Try adjusting your search or filter" 
                : "Add your first transaction to get started"}
            />
          </div>
        ) : (
          <div className="-mx-4 overflow-x-auto sm:mx-0 sm:overflow-visible">
            <div className="inline-block min-w-full align-middle sm:rounded-lg sm:border sm:border-border/50">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 bg-muted/30 hover:bg-muted/30">
                    <TableHead className="h-10 whitespace-nowrap px-3 text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:px-4 sm:text-xs">
                      Description
                    </TableHead>
                    <TableHead className="hidden h-10 whitespace-nowrap px-3 text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:table-cell sm:px-4 sm:text-xs">
                      Category
                    </TableHead>
                    <TableHead className="h-10 whitespace-nowrap px-3 text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:px-4 sm:text-xs">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-2 h-auto p-0 text-[10px] font-medium uppercase tracking-wider text-muted-foreground hover:bg-transparent hover:text-foreground sm:-ml-3 sm:text-xs"
                        onClick={() => handleSort('amount')}
                      >
                        Amount
                        <SortIcon columnKey="amount" />
                      </Button>
                    </TableHead>
                    <TableHead className="h-10 whitespace-nowrap px-3 text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:px-4 sm:text-xs">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-2 h-auto p-0 text-[10px] font-medium uppercase tracking-wider text-muted-foreground hover:bg-transparent hover:text-foreground sm:-ml-3 sm:text-xs"
                        onClick={() => handleSort('date')}
                      >
                        Date
                        <SortIcon columnKey="date" />
                      </Button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedTransactions.map((transaction, index) => (
                    <TableRow 
                      key={transaction.id} 
                      className={`border-border/50 transition-colors hover:bg-muted/50 ${
                        index === filteredAndSortedTransactions.length - 1 ? 'border-0' : ''
                      }`}
                    >
                      <TableCell className="px-3 py-3 sm:px-4 sm:py-3.5">
                        <div className="font-medium">{transaction.description}</div>
                        <div className="mt-0.5 text-xs text-muted-foreground sm:hidden">
                          {transaction.category}
                        </div>
                      </TableCell>
                      <TableCell className="hidden px-3 py-3 sm:table-cell sm:px-4 sm:py-3.5">
                        <Badge 
                          variant="secondary" 
                          className="font-normal text-muted-foreground"
                        >
                          {transaction.category}
                        </Badge>
                      </TableCell>
                      <TableCell className={`whitespace-nowrap px-3 py-3 text-sm font-medium tabular-nums sm:px-4 sm:py-3.5 ${
                        transaction.type === 'income' ? 'text-success' : 'text-destructive'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-3 py-3 text-sm text-muted-foreground sm:px-4 sm:py-3.5">
                        {formatDate(transaction.date)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
