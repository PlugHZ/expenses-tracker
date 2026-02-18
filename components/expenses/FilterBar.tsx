'use client'

import { Category, TransactionType } from '@/types/expense'
import { CATEGORIES } from '@/lib/utils'

export type TimePeriod = '7days' | '30days' | '90days' | '6months' | '1year' | 'all'

interface FilterBarProps {
    period: TimePeriod
    category: Category | 'all'
    type: TransactionType | 'all'
    onPeriodChange: (period: TimePeriod) => void
    onCategoryChange: (category: Category | 'all') => void
    onTypeChange: (type: TransactionType | 'all') => void
}

const PERIODS: { value: TimePeriod; label: string }[] = [
    { value: '7days', label: '7 วัน' },
    { value: '30days', label: '30 วัน' },
    { value: '90days', label: '90 วัน' },
    { value: '6months', label: '6 เดือน' },
    { value: '1year', label: '1 ปี' },
    { value: 'all', label: 'ทั้งหมด' },
]

export default function FilterBar({
    period, category, type,
    onPeriodChange, onCategoryChange, onTypeChange
}: FilterBarProps) {
    return (
        <div className="flex flex-col gap-3">

            {/* Type */}
            <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium w-16">ประเภท</span>
                <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1 gap-1">
                    {[
                        { value: 'all', label: 'ทั้งหมด' },
                        { value: 'income', label: '💰 รายรับ' },
                        { value: 'expense', label: '💸 รายจ่าย' },
                    ].map((t) => (
                        <button
                            key={t.value}
                            onClick={() => onTypeChange(t.value as TransactionType | 'all')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${type === t.value
                                    ? 'bg-amber-500 text-white'
                                    : 'text-zinc-400 hover:text-zinc-200'
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Period */}
            <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium w-16">ช่วงเวลา</span>
                <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1 gap-1 flex-wrap">
                    {PERIODS.map((p) => (
                        <button
                            key={p.value}
                            onClick={() => onPeriodChange(p.value)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${period === p.value
                                    ? 'bg-amber-500 text-white'
                                    : 'text-zinc-400 hover:text-zinc-200'
                                }`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Category */}
            <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium w-16">หมวดหมู่</span>
                <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1 gap-1 flex-wrap">
                    <button
                        onClick={() => onCategoryChange('all')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${category === 'all'
                                ? 'bg-amber-500 text-white'
                                : 'text-zinc-400 hover:text-zinc-200'
                            }`}
                    >
                        ทั้งหมด
                    </button>
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => onCategoryChange(cat)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${category === cat
                                    ? 'bg-amber-500 text-white'
                                    : 'text-zinc-400 hover:text-zinc-200'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

        </div>
    )
}