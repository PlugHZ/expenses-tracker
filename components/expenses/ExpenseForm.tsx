'use client'

import { useState, useEffect } from 'react'
import { ExpenseFormData, Category, TransactionType } from '@/types/expense'
import { CATEGORIES } from '@/lib/utils'
import Button from '@/components/ui/Button'

interface ExpenseFormProps {
    initialData?: ExpenseFormData
    onSubmit: (data: ExpenseFormData) => Promise<void>
    onCancel: () => void
}

const defaultForm: ExpenseFormData = {
    title: '',
    amount: 0,
    category: 'Food',
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
    notes: '',
}

export default function ExpenseForm({ initialData, onSubmit, onCancel }: ExpenseFormProps) {
    const [form, setForm] = useState<ExpenseFormData>(initialData || defaultForm)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        setForm(initialData || defaultForm)
    }, [initialData])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.title.trim()) { setError('กรุณาใส่ชื่อรายการ'); return }
        if (!form.amount || form.amount <= 0) { setError('กรุณาใส่จำนวนเงินที่ถูกต้อง'); return }

        setLoading(true)
        setError('')
        try {
            await onSubmit(form)
        } catch (err: any) {
            setError(err.message || 'เกิดข้อผิดพลาด')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-2.5 rounded-lg">
                    {error}
                </div>
            )}

            {/* Type Toggle */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">ประเภท</label>
                <div className="grid grid-cols-2 gap-2">
                    {(['expense', 'income'] as TransactionType[]).map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setForm({ ...form, type: t })}
                            className={`py-2.5 rounded-lg text-sm font-medium border transition-all ${form.type === t
                                ? t === 'expense'
                                    ? 'border-red-500 bg-red-500/10 text-red-400'
                                    : 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                                : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-500'
                                }`}
                        >
                            {t === 'expense' ? '💸 รายจ่าย' : '💰 รายรับ'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Title */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">ชื่อรายการ</label>
                <input
                    type="text"
                    placeholder="เช่น ข้าวกลางวัน, เงินเดือน..."
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500 transition-colors placeholder:text-zinc-600"
                />
            </div>

            {/* Amount & Date */}
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">จำนวนเงิน (฿)</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={form.amount || ''}
                        onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
                        className="bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500 transition-colors placeholder:text-zinc-600"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">วันที่</label>
                    <input
                        type="date"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        className="bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500 transition-colors"
                    />
                </div>
            </div>

            {/* Category */}
            {form.type === 'expense' && (
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">หมวดหมู่</label>
                    <div className="grid grid-cols-3 gap-2">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setForm({ ...form, category: cat })}
                                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${form.category === cat
                                        ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                                        : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-500'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Notes */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">หมายเหตุ (ไม่บังคับ)</label>
                <textarea
                    placeholder="รายละเอียดเพิ่มเติม..."
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={2}
                    className="bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500 transition-colors placeholder:text-zinc-600 resize-none"
                />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-2">
                <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
                    ยกเลิก
                </Button>
                <Button type="submit" variant="primary" disabled={loading} className="flex-[2]">
                    {loading ? 'กำลังบันทึก...' : initialData ? 'อัปเดต' : 'บันทึก'}
                </Button>
            </div>
        </form>
    )
}