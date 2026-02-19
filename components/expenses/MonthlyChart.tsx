'use client'

import { Expense } from '@/types/expense'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, LineChart, Line, Legend
} from 'recharts'

interface MonthlyChartProps {
    expenses: Expense[]
}

export default function MonthlyChart({ expenses }: MonthlyChartProps) {
    // สรุปรายเดือน
    const monthlyData = expenses.reduce((acc, e) => {
        const month = e.date.slice(0, 7) // YYYY-MM
        const existing = acc.find((a) => a.month === month)
        if (existing) {
            if (e.type === 'income') existing.income += Number(e.amount)
            else existing.expense += Number(e.amount)
            existing.balance = existing.income - existing.expense
        } else {
            acc.push({
                month,
                income: e.type === 'income' ? Number(e.amount) : 0,
                expense: e.type === 'expense' ? Number(e.amount) : 0,
                balance: e.type === 'income' ? Number(e.amount) : -Number(e.amount),
            })
        }
        return acc
    }, [] as { month: string; income: number; expense: number; balance: number }[])
        .sort((a, b) => a.month.localeCompare(b.month))
        .map((d) => ({
            ...d,
            month: new Date(d.month + '-01').toLocaleDateString('th-TH', { month: 'short', year: '2-digit' })
        }))

    if (monthlyData.length === 0) {
        return (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-72 flex items-center justify-center">
                <p className="text-zinc-600 text-sm">ไม่มีข้อมูล</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Bar Chart รายรับ vs รายจ่าย */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-6">
                    รายรับ vs รายจ่าย รายเดือน
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={monthlyData} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#71717a' }} />
                        <YAxis tick={{ fontSize: 11, fill: '#71717a' }} />
                        <Tooltip
                            contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: 8 }}
                            labelStyle={{ color: '#e4e4e7' }}
                            formatter={(value) => [`฿${Number(value).toLocaleString()}`, '']}
                        />
                        <Legend formatter={(value) => <span style={{ color: '#a1a1aa', fontSize: 12 }}>{value}</span>} />
                        <Bar dataKey="income" name="รายรับ" fill="#34d399" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="expense" name="รายจ่าย" fill="#f87171" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Line Chart ยอดคงเหลือสะสม */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-6">
                    ยอดคงเหลือรายเดือน
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#71717a' }} />
                        <YAxis tick={{ fontSize: 11, fill: '#71717a' }} />
                        <Tooltip
                            contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: 8 }}
                            labelStyle={{ color: '#e4e4e7' }}
                            formatter={(value) => [`฿${Number(value).toLocaleString()}`, 'ยอดคงเหลือ']}
                        />
                        <Line
                            type="monotone"
                            dataKey="balance"
                            name="ยอดคงเหลือ"
                            stroke="#f59e0b"
                            strokeWidth={2}
                            dot={{ fill: '#f59e0b', r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}