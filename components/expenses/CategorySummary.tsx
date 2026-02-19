import { Expense } from '@/types/expense'
import { formatCurrency, CATEGORY_COLORS } from '@/lib/utils'
import { Category } from '@/types/expense'

interface CategorySummaryProps {
    expenses: Expense[]
}

export default function CategorySummary({ expenses }: CategorySummaryProps) {
    const expenseOnly = expenses.filter((e) => e.type === 'expense')
    const total = expenseOnly.reduce((sum, e) => sum + Number(e.amount), 0)

    const categoryData = expenseOnly
        .reduce((acc, e) => {
            const existing = acc.find((a) => a.category === e.category)
            if (existing) { existing.total += Number(e.amount); existing.count += 1 }
            else acc.push({ category: e.category as Category, total: Number(e.amount), count: 1 })
            return acc
        }, [] as { category: Category; total: number; count: number }[])
        .sort((a, b) => b.total - a.total)

    if (categoryData.length === 0) {
        return (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center justify-center h-48">
                <p className="text-zinc-600 text-sm">ไม่มีข้อมูลรายจ่าย</p>
            </div>
        )
    }

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-6">
                สรุปรายจ่ายตามหมวดหมู่
            </h3>
            <div className="flex flex-col gap-4">
                {categoryData.map((cat) => {
                    const pct = total > 0 ? (cat.total / total) * 100 : 0
                    const color = CATEGORY_COLORS[cat.category] || '#6b7280'
                    return (
                        <div key={cat.category}>
                            <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                                    <span className="text-sm text-zinc-300">{cat.category}</span>
                                    <span className="text-xs text-zinc-600">{cat.count} รายการ</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-zinc-500">{pct.toFixed(1)}%</span>
                                    <span className="text-sm font-medium text-zinc-100 font-mono">{formatCurrency(cat.total)}</span>
                                </div>
                            </div>
                            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{ width: `${pct}%`, backgroundColor: color }}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}