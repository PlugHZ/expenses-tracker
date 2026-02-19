'use client'

import { useState } from 'react'
import { Expense } from '@/types/expense'
import { formatCurrency, formatDate } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { Pencil, Trash2, TrendingDown, TrendingUp, ChevronUp, ChevronDown } from 'lucide-react'

type SortKey = 'title' | 'date' | 'amount' | 'category'
type SortOrder = 'asc' | 'desc'

interface ExpenseTableProps {
    expenses: Expense[]
    loading: boolean
    onEdit: (expense: Expense) => void
    onDelete: (id: string) => void
}

export default function ExpenseTable({ expenses, loading, onEdit, onDelete }: ExpenseTableProps) {
    const [sortKey, setSortKey] = useState<SortKey>('date')
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

    const handleSort = (key: SortKey) => {
        if (sortKey === key) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        else { setSortKey(key); setSortOrder('asc') }
    }

    const sorted = [...expenses].sort((a, b) => {
        let valA: string | number = ''
        let valB: string | number = ''
        if (sortKey === 'title') { valA = a.title; valB = b.title }
        if (sortKey === 'date') { valA = a.date; valB = b.date }
        if (sortKey === 'amount') { valA = Number(a.amount); valB = Number(b.amount) }
        if (sortKey === 'category') { valA = a.category; valB = b.category }
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1
        return 0
    })

    const SortIcon = ({ col }: { col: SortKey }) => {
        if (sortKey !== col) return <ChevronUp size={12} className="text-zinc-600" />
        return sortOrder === 'asc'
            ? <ChevronUp size={12} className="text-amber-400" />
            : <ChevronDown size={12} className="text-amber-400" />
    }

    if (loading) {
        return (
            <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 px-4 sm:px-6 py-4 border-b border-zinc-800 last:border-0 animate-pulse">
                        <div className="h-4 bg-zinc-800 rounded w-1/3" />
                        <div className="h-4 bg-zinc-800 rounded w-1/4 ml-auto" />
                    </div>
                ))}
            </div>
        )
    }

    if (sorted.length === 0) {
        return (
            <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-16 text-center">
                <p className="text-zinc-500 text-sm">ยังไม่มีรายการ</p>
            </div>
        )
    }

    return (
        <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">

            {/* Desktop Header - ซ่อนบนมือถือ */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 border-b border-zinc-800 bg-zinc-800/50">
                <div className="col-span-1 text-xs font-medium text-zinc-500 uppercase tracking-wider">ประเภท</div>
                <button onClick={() => handleSort('title')} className="col-span-3 flex items-center gap-1 text-xs font-medium text-zinc-500 uppercase tracking-wider hover:text-zinc-300">
                    รายการ <SortIcon col="title" />
                </button>
                <button onClick={() => handleSort('category')} className="col-span-2 flex items-center gap-1 text-xs font-medium text-zinc-500 uppercase tracking-wider hover:text-zinc-300">
                    หมวดหมู่ <SortIcon col="category" />
                </button>
                <button onClick={() => handleSort('date')} className="col-span-3 flex items-center gap-1 text-xs font-medium text-zinc-500 uppercase tracking-wider hover:text-zinc-300">
                    วันที่ <SortIcon col="date" />
                </button>
                <button onClick={() => handleSort('amount')} className="col-span-2 flex items-center justify-end gap-1 text-xs font-medium text-zinc-500 uppercase tracking-wider hover:text-zinc-300">
                    จำนวนเงิน <SortIcon col="amount" />
                </button>
                <div className="col-span-1" />
            </div>

            {/* Rows */}
            {sorted.map((expense) => (
                <div key={expense.id} className="border-b border-zinc-800 last:border-0 hover:bg-zinc-800/30 transition-colors">

                    {/* Mobile Card */}
                    <div className="sm:hidden flex items-center gap-3 px-4 py-3">
                        <div className={`p-1.5 rounded-lg shrink-0 ${expense.type === 'income' ? 'bg-emerald-400/10' : 'bg-red-400/10'}`}>
                            {expense.type === 'income'
                                ? <TrendingUp size={13} className="text-emerald-400" />
                                : <TrendingDown size={13} className="text-red-400" />
                            }
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-zinc-100 font-medium truncate">{expense.title}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                                <Badge category={expense.category} />
                                <span className="text-xs text-zinc-500">{formatDate(expense.date)}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <span className={`text-sm font-medium font-mono ${expense.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                                {expense.type === 'income' ? '+' : '-'}{formatCurrency(expense.amount)}
                            </span>
                            <div className="flex gap-1">
                                <Button variant="secondary" size="sm" onClick={() => onEdit(expense)} className="p-1.5">
                                    <Pencil size={13} />
                                </Button>
                                <Button variant="danger" size="sm" onClick={() => onDelete(expense.id)} className="p-1.5">
                                    <Trash2 size={13} />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Row */}
                    <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4">
                        <div className="col-span-1 flex items-center">
                            <div className={`p-1.5 rounded-lg ${expense.type === 'income' ? 'bg-emerald-400/10' : 'bg-red-400/10'}`}>
                                {expense.type === 'income'
                                    ? <TrendingUp size={13} className="text-emerald-400" />
                                    : <TrendingDown size={13} className="text-red-400" />
                                }
                            </div>
                        </div>
                        <div className="col-span-3 flex flex-col justify-center">
                            <p className="text-sm text-zinc-100 font-medium truncate">{expense.title}</p>
                            {expense.notes && <p className="text-xs text-zinc-500 truncate mt-0.5">{expense.notes}</p>}
                        </div>
                        <div className="col-span-2 flex items-center">
                            <Badge category={expense.category} />
                        </div>
                        <div className="col-span-3 flex items-center">
                            <span className="text-sm text-zinc-400">{formatDate(expense.date)}</span>
                        </div>
                        <div className="col-span-2 flex items-center justify-end">
                            <span className={`text-sm font-medium font-mono ${expense.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                                {expense.type === 'income' ? '+' : '-'}{formatCurrency(expense.amount)}
                            </span>
                        </div>
                        <div className="col-span-1 flex items-center justify-end gap-1">
                            <Button variant="secondary" size="sm" onClick={() => onEdit(expense)} className="p-1.5">
                                <Pencil size={13} />
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => onDelete(expense.id)} className="p-1.5">
                                <Trash2 size={13} />
                            </Button>
                        </div>
                    </div>

                </div>
            ))}
        </div>
    )
}