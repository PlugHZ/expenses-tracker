'use client'

import { Expense } from '@/types/expense'
import { formatCurrency, formatDate } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { Pencil, Trash2, TrendingDown, TrendingUp } from 'lucide-react'

interface ExpenseTableProps {
    expenses: Expense[]
    loading: boolean
    onEdit: (expense: Expense) => void
    onDelete: (id: string) => void
}

export default function ExpenseTable({ expenses, loading, onEdit, onDelete }: ExpenseTableProps) {
    if (loading) {
        return (
            <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-zinc-800 last:border-0 animate-pulse">
                        <div className="h-4 bg-zinc-800 rounded w-1/3" />
                        <div className="h-4 bg-zinc-800 rounded w-1/4 ml-auto" />
                    </div>
                ))}
            </div>
        )
    }

    if (expenses.length === 0) {
        return (
            <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-16 text-center">
                <p className="text-zinc-500 text-sm">ยังไม่มีรายการ</p>
            </div>
        )
    }

    return (
        <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-zinc-800 bg-zinc-800/50">
                <div className="col-span-1 text-xs font-medium text-zinc-500 uppercase tracking-wider">ประเภท</div>
                <div className="col-span-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">รายการ</div>
                <div className="col-span-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">หมวดหมู่</div>
                <div className="col-span-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">วันที่</div>
                <div className="col-span-2 text-xs font-medium text-zinc-500 uppercase tracking-wider text-right">จำนวนเงิน</div>
                <div className="col-span-1" />
            </div>

            {/* Rows */}
            {expenses.map((expense) => (
                <div
                    key={expense.id}
                    className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-zinc-800 last:border-0 hover:bg-zinc-800/30 transition-colors"
                >
                    {/* Type */}
                    <div className="col-span-1 flex items-center">
                        {expense.type === 'income' ? (
                            <div className="bg-emerald-400/10 p-1.5 rounded-lg">
                                <TrendingUp size={13} className="text-emerald-400" />
                            </div>
                        ) : (
                            <div className="bg-red-400/10 p-1.5 rounded-lg">
                                <TrendingDown size={13} className="text-red-400" />
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <div className="col-span-3 flex flex-col justify-center">
                        <p className="text-sm text-zinc-100 font-medium truncate">{expense.title}</p>
                        {expense.notes && (
                            <p className="text-xs text-zinc-500 truncate mt-0.5">{expense.notes}</p>
                        )}
                    </div>

                    {/* Category */}
                    <div className="col-span-3 flex items-center">
                        <Badge category={expense.category} />
                    </div>

                    {/* Date */}
                    <div className="col-span-2 flex items-center">
                        <span className="text-sm text-zinc-400">{formatDate(expense.date)}</span>
                    </div>

                    {/* Amount */}
                    <div className="col-span-2 flex items-center justify-end">
                        <span className={`text-sm font-medium font-mono ${expense.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                            }`}>
                            {expense.type === 'income' ? '+' : '-'}{formatCurrency(expense.amount)}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 flex items-center justify-end gap-1">
                        <Button variant="secondary" size="sm" onClick={() => onEdit(expense)} className="p-1.5">
                            <Pencil size={13} />
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => onDelete(expense.id)} className="p-1.5">
                            <Trash2 size={13} />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    )
}