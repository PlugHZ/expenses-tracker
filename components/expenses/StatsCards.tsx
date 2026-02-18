import { Expense, Category } from '@/types/expense'
import { formatCurrency, CATEGORY_COLORS } from '@/lib/utils'
import { TrendingDown, TrendingUp, Wallet, Tag } from 'lucide-react'

interface StatsCardsProps {
    expenses: Expense[]
    loading: boolean
}

export default function StatsCards({ expenses, loading }: StatsCardsProps) {
    const totalIncome = expenses
        .filter((e) => e.type === 'income')
        .reduce((sum, e) => sum + Number(e.amount), 0)

    const totalExpense = expenses
        .filter((e) => e.type === 'expense')
        .reduce((sum, e) => sum + Number(e.amount), 0)

    const balance = totalIncome - totalExpense

    const topCategory = expenses
        .filter((e) => e.type === 'expense')
        .reduce((acc, e) => {
            acc[e.category] = (acc[e.category] || 0) + Number(e.amount)
            return acc
        }, {} as Record<string, number>)

    const topCat = Object.entries(topCategory).sort((a, b) => b[1] - a[1])[0]?.[0] as Category | undefined

    const cards = [
        {
            label: 'รายรับ',
            value: formatCurrency(totalIncome),
            icon: TrendingUp,
            color: 'text-emerald-400',
            bg: 'bg-emerald-400/10',
            valueColor: 'text-emerald-400',
        },
        {
            label: 'รายจ่าย',
            value: formatCurrency(totalExpense),
            icon: TrendingDown,
            color: 'text-red-400',
            bg: 'bg-red-400/10',
            valueColor: 'text-red-400',
        },
        {
            label: 'ยอดคงเหลือ',
            value: formatCurrency(balance),
            icon: Wallet,
            color: balance >= 0 ? 'text-amber-400' : 'text-red-400',
            bg: balance >= 0 ? 'bg-amber-400/10' : 'bg-red-400/10',
            valueColor: balance >= 0 ? 'text-amber-400' : 'text-red-400',
        },
        {
            label: 'หมวดหมู่สูงสุด',
            value: topCat || '-',
            icon: Tag,
            color: 'text-purple-400',
            bg: 'bg-purple-400/10',
            valueColor: 'text-zinc-100',
            dotColor: topCat ? CATEGORY_COLORS[topCat] : undefined,
        },
    ]

    if (loading) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 animate-pulse">
                        <div className="h-3 bg-zinc-800 rounded w-1/2 mb-4" />
                        <div className="h-6 bg-zinc-800 rounded w-3/4" />
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card) => {
                const Icon = card.icon
                return (
                    <div key={card.label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{card.label}</span>
                            <div className={`${card.bg} p-2 rounded-lg`}>
                                <Icon size={14} className={card.color} />
                            </div>
                        </div>
                        <p className={`text-xl font-semibold flex items-center gap-2 ${card.valueColor}`}>
                            {card.dotColor && (
                                <span className="w-2 h-2 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: card.dotColor }} />
                            )}
                            {card.value}
                        </p>
                    </div>
                )
            })}
        </div>
    )
}