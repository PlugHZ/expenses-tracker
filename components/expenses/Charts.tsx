'use client'

import { Expense } from '@/types/expense'
import { CATEGORY_COLORS } from '@/lib/utils'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'

interface ChartsProps {
    expenses: Expense[]
    loading: boolean
}

export default function Charts({ expenses, loading }: ChartsProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-72 animate-pulse" />
                ))}
            </div>
        )
    }

    // ข้อมูลสำหรับ Pie Chart (รายจ่ายตามหมวดหมู่)
    const categoryData = expenses
        .filter((e) => e.type === 'expense')
        .reduce((acc, e) => {
            const existing = acc.find((a) => a.name === e.category)
            if (existing) existing.value += Number(e.amount)
            else acc.push({ name: e.category, value: Number(e.amount) })
            return acc
        }, [] as { name: string; value: number }[])
        .sort((a, b) => b.value - a.value)

    // ข้อมูลสำหรับ Bar Chart (รายรับ vs รายจ่ายตามวัน)
    const dailyData = expenses.reduce((acc, e) => {
        const date = e.date
        const existing = acc.find((a) => a.date === date)
        if (existing) {
            if (e.type === 'income') existing.income += Number(e.amount)
            else existing.expense += Number(e.amount)
        } else {
            acc.push({
                date,
                income: e.type === 'income' ? Number(e.amount) : 0,
                expense: e.type === 'expense' ? Number(e.amount) : 0,
            })
        }
        return acc
    }, [] as { date: string; income: number; expense: number }[])
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-14) // แสดงแค่ 14 วันล่าสุด
        .map((d) => ({ ...d, date: d.date.slice(5) })) // เอาแค่ MM-DD

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Bar Chart */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-6">
                    รายรับ vs รายจ่ายรายวัน
                </h3>
                {dailyData.length === 0 ? (
                    <div className="h-52 flex items-center justify-center text-zinc-600 text-sm">ไม่มีข้อมูล</div>
                ) : (
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={dailyData} barGap={2}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#71717a' }} />
                            <YAxis tick={{ fontSize: 11, fill: '#71717a' }} />
                            <Tooltip
                                contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: 8 }}
                                labelStyle={{ color: '#e4e4e7' }}
                            />
                            <Bar dataKey="income" name="รายรับ" fill="#34d399" radius={[3, 3, 0, 0]} />
                            <Bar dataKey="expense" name="รายจ่าย" fill="#f87171" radius={[3, 3, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Pie Chart */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-6">
                    รายจ่ายตามหมวดหมู่
                </h3>
                {categoryData.length === 0 ? (
                    <div className="h-52 flex items-center justify-center text-zinc-600 text-sm">ไม่มีข้อมูล</div>
                ) : (
                    <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {categoryData.map((entry) => (
                                    <Cell
                                        key={entry.name}
                                        fill={CATEGORY_COLORS[entry.name as keyof typeof CATEGORY_COLORS] || '#6b7280'}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: 8 }}
                                formatter={(value) => [`฿${Number(value).toLocaleString()}`, '']}
                            />
                            <Legend
                                formatter={(value) => <span style={{ color: '#a1a1aa', fontSize: 12 }}>{value}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>

        </div>
    )
}