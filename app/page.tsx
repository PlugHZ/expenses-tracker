'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus } from 'lucide-react'
import { Expense, ExpenseFormData, Category, TransactionType } from '@/types/expense'
import { getDateRangeFromPeriod } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import StatsCards from '@/components/expenses/StatsCards'
import ExpenseTable from '@/components/expenses/ExpenseTable'
import ExpenseForm from '@/components/expenses/ExpenseForm'
import FilterBar, { TimePeriod } from '@/components/expenses/FilterBar'
import { format } from 'date-fns'
import Charts from '@/components/expenses/Charts'

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editExpense, setEditExpense] = useState<Expense | null>(null)
  const [period, setPeriod] = useState<TimePeriod>('30days')
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [type, setType] = useState<TransactionType | 'all'>('all')

  const fetchExpenses = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      const fromDate = getDateRangeFromPeriod(period)
      if (fromDate) params.set('from', format(fromDate, 'yyyy-MM-dd'))
      params.set('sort', 'date')
      params.set('order', 'desc')

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

  const handleAdd = async (data: ExpenseFormData) => {
    const res = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('บันทึกไม่สำเร็จ')
    await fetchExpenses()
    setModalOpen(false)
  }

  const handleEdit = async (data: ExpenseFormData) => {
    if (!editExpense) return
    const res = await fetch(`/api/expenses/${editExpense.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('อัปเดตไม่สำเร็จ')
    await fetchExpenses()
    setModalOpen(false)
    setEditExpense(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('ยืนยันการลบรายการนี้?')) return
    await fetch(`/api/expenses/${id}`, { method: 'DELETE' })
    await fetchExpenses()
  }

  const openEdit = (expense: Expense) => {
    setEditExpense(expense)
    setModalOpen(true)
  }

  const openAdd = () => {
    setEditExpense(null)
    setModalOpen(true)
  }

  // กรองทั้ง type และ category ใช้ทั้ง StatsCards และ ExpenseTable
  const filteredExpenses = expenses.filter((e) => {
    const matchType = type === 'all' || e.type === type
    const matchCategory =
      category === 'all' ||
      e.type === 'income' ||
      e.category === category
    return matchType && matchCategory
  })

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col gap-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">บันทึกรายรับรายจ่าย</h1>
            <p className="text-sm text-zinc-500 mt-1">สรุปการเงินของคุณ</p>
          </div>
          <Button onClick={openAdd} variant="primary">
            <Plus size={16} />
            เพิ่มรายการ
          </Button>
        </div>

        {/* Stats */}
        <StatsCards expenses={filteredExpenses} loading={loading} />
        <Charts expenses={filteredExpenses} loading={loading} />

        {/* Filter */}
        <FilterBar
          period={period}
          category={category}
          type={type}
          onPeriodChange={setPeriod}
          onCategoryChange={setCategory}
          onTypeChange={setType}
        />

        {/* Table */}
        <ExpenseTable
          expenses={filteredExpenses}
          loading={loading}
          onEdit={openEdit}
          onDelete={handleDelete}
        />

      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditExpense(null) }}
        title={editExpense ? 'แก้ไขรายการ' : 'เพิ่มรายการใหม่'}
      >
        <ExpenseForm
          initialData={editExpense || undefined}
          onSubmit={editExpense ? handleEdit : handleAdd}
          onCancel={() => { setModalOpen(false); setEditExpense(null) }}
        />
      </Modal>
    </main>
  )
}