'use client'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoonIcon, SunIcon, WalletIcon, UserIcon, ShieldIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import type { Role } from '@/lib/types'
import { AddTransactionModal } from './add-transaction-modal'
import type { Transaction } from '@/lib/types'

interface DashboardHeaderProps {
  role: Role
  onRoleChange: (role: Role) => void
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void
}

export function DashboardHeader({ role, onRoleChange, onAddTransaction }: DashboardHeaderProps) {
  const { setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-4 sm:h-16 sm:gap-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary sm:size-9">
            <WalletIcon className="size-4 text-primary-foreground sm:size-5" />
          </div>
          <div className="hidden min-[400px]:block">
            <h1 className="text-sm font-semibold tracking-tight sm:text-base">Finance</h1>
            <p className="text-[10px] text-muted-foreground sm:text-xs">Dashboard</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Role Selector */}
          <Select value={role} onValueChange={(value) => onRoleChange(value as Role)}>
            <SelectTrigger className="h-8 w-[90px] border-border/50 bg-secondary/30 text-xs sm:h-9 sm:w-[120px] sm:text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="viewer">
                <span className="flex items-center gap-2">
                  <UserIcon className="size-3.5" />
                  Viewer
                </span>
              </SelectItem>
              <SelectItem value="admin">
                <span className="flex items-center gap-2">
                  <ShieldIcon className="size-3.5" />
                  Admin
                </span>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Add Transaction - Admin Only */}
          {role === 'admin' && (
            <AddTransactionModal onAdd={onAddTransaction} />
          )}

          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="size-8 border-border/50 bg-secondary/30 sm:size-9">
                <SunIcon className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <MoonIcon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
