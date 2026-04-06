'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { PlusIcon } from 'lucide-react'
import type { Transaction, TransactionType, Category } from '@/lib/types'
import { incomeCategories, expenseCategories } from '@/lib/mock-data'

interface AddTransactionModalProps {
  onAdd: (transaction: Omit<Transaction, 'id'>) => void
}

export function AddTransactionModal({ onAdd }: AddTransactionModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<TransactionType>('expense')
  const [category, setCategory] = useState<Category | ''>('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const categories = type === 'income' ? incomeCategories : expenseCategories

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!description.trim()) {
      newErrors.description = 'Description is required'
    }
    
    const parsedAmount = parseFloat(amount)
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = 'Please enter a valid positive amount'
    } else if (parsedAmount > 1000000000) {
      newErrors.amount = 'Amount is too large'
    }
    
    if (!category) {
      newErrors.category = 'Category is required'
    }
    
    if (!date) {
      newErrors.date = 'Date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) {
      return
    }

    setLoading(true)
    
    await new Promise(resolve => setTimeout(resolve, 300))

    onAdd({
      description: description.trim(),
      amount: parseFloat(amount),
      type,
      category: category as Category,
      date,
    })

    setDescription('')
    setAmount('')
    setType('expense')
    setCategory('')
    setDate(new Date().toISOString().split('T')[0])
    setErrors({})
    setLoading(false)
    setOpen(false)
  }

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType)
    setCategory('')
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow empty, or valid positive numbers including decimals
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value)
      // Clear error when user starts typing valid input
      if (errors.amount && value && parseFloat(value) > 0) {
        setErrors((prev) => {
          const { amount: _, ...rest } = prev
          return rest
        })
      }
    }
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value)
    // Clear error when user starts typing
    if (errors.description && e.target.value.trim()) {
      setErrors((prev) => {
        const { description: _, ...rest } = prev
        return rest
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1 text-xs sm:h-9 sm:gap-1.5 sm:text-sm">
          <PlusIcon className="size-3.5 sm:size-4" />
          <span className="hidden min-[500px]:inline">Add Transaction</span>
          <span className="min-[500px]:hidden">Add</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-lg">Add Transaction</DialogTitle>
          <DialogDescription className="text-sm">
            Enter the details for your new transaction.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Input
                id="description"
                placeholder="e.g., Grocery shopping"
                value={description}
                onChange={handleDescriptionChange}
                maxLength={100}
                className={`h-9 ${errors.description ? 'border-destructive ring-1 ring-destructive/30' : 'border-border/50'}`}
              />
              {errors.description && (
                <p className="text-xs text-destructive">{errors.description}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium">
                Amount ($)
              </Label>
              <Input
                id="amount"
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={amount}
                onChange={handleAmountChange}
                className={`h-9 ${errors.amount ? 'border-destructive ring-1 ring-destructive/30' : 'border-border/50'}`}
              />
              {errors.amount && (
                <p className="text-xs text-destructive">{errors.amount}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-medium">
                  Type
                </Label>
                <Select value={type} onValueChange={handleTypeChange}>
                  <SelectTrigger className="h-9 border-border/50">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  Category
                </Label>
                <Select value={category} onValueChange={(value: Category) => {
                    setCategory(value)
                    if (errors.category) {
                      setErrors((prev) => {
                        const { category: _, ...rest } = prev
                        return rest
                      })
                    }
                  }}>
                  <SelectTrigger className={`h-9 ${errors.category ? 'border-destructive ring-1 ring-destructive/30' : 'border-border/50'}`}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-xs text-destructive">{errors.category}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value)
                  if (errors.date && e.target.value) {
                    setErrors((prev) => {
                      const { date: _, ...rest } = prev
                      return rest
                    })
                  }
                }}
                className={`h-9 ${errors.date ? 'border-destructive ring-1 ring-destructive/30' : 'border-border/50'}`}
              />
              {errors.date && (
                <p className="text-xs text-destructive">{errors.date}</p>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)} className="h-9">
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={loading} className="h-9">
              {loading && <Spinner className="mr-2 size-3.5" />}
              Add Transaction
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
