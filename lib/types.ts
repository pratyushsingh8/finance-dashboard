export type TransactionType = 'income' | 'expense'

export type Category = 
  | 'Salary'
  | 'Freelance'
  | 'Investments'
  | 'Food'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills'
  | 'Healthcare'
  | 'Other'

export interface Transaction {
  id: string
  description: string
  amount: number
  type: TransactionType
  category: Category
  date: string
}

export type Role = 'viewer' | 'admin'

export type SortKey = 'amount' | 'date'
export type SortOrder = 'asc' | 'desc'
export type FilterType = 'all' | 'income' | 'expense'
