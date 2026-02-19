'use client'

import { useState, useEffect, useCallback } from 'react'
import { Expense } from '@/types/expense'
import { getDateRangeFromPeriod } from '@/lib/utils'
import StatsCards from '@/components/expenses/StatsCards'
import MonthlyChart from '@/components/expenses/MonthlyChart'
import CategorySummary from '@/components/expenses/CategorySummary'
import Charts from '@/components/expenses/Charts'
import FilterBar, { TimePeriod } from '@/components/expenses/FilterBar'
import { format } from 'date-fns'

export default function DashboardPage() {
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [loading, setLoading] = useState(true)
    const [period, setPeriod] = useState<TimePeriod>('1year')

    const fetchExpenses = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            const fromDate = getDateRangeFromPeriod(period)
            if (fromDate) params.set('from', format(fromDate, 'yyyy-MM-dd'))
            params.set('sort', 'date')
            params.set('order', 'asc')

            const res = await fetch(`/api/expenses?${params}`)
            const data = await res.json()
            if (Array.isArray(data)) setExpenses(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [period])

    useEffect(() => {
        fetchExpenses()
    }, [fetchExpenses])

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col gap-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-100">Dashboard</h1>
                        <p className="text-sm text-zinc-500 mt-1">ภาพรวมการเงินของคุณ</p>
                    </div>
                </div>

                {/* Period Filter เฉพาะช่วงเวลา */}
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium w-16">ช่วงเวลา</span>
                    <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1 gap-1 flex-wrap">
                        {(['7days', '30days', '90days', '6months', '1year', 'all'] as TimePeriod[]).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${period === p ? 'bg-amber-500 text-white' : 'text-zinc-400 hover:text-zinc-200'
                                    }`}
                            >
                                {p === '7days' ? '7 วัน' : p === '30days' ? '30 วัน' : p === '90days' ? '90 วัน' : p === '6months' ? '6 เดือน' : p === '1year' ? '1 ปี' : 'ทั้งหมด'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <StatsCards expenses={expenses} loading={loading} />

                {/* Monthly Charts */}
                <MonthlyChart expenses={expenses} />

                {/* Daily Chart + Category */}
                <div className="flex flex-col gap-4">
                    <Charts expenses={expenses} loading={loading} />
                    <CategorySummary expenses={expenses} />
                </div>

            </div>
        </main>
    )
}