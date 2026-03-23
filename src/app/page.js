'use client'

import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { fetchExpenses, fetchUsers, fetchCategories, createExpense, createUser, createCategory, deleteExpense, updateExpense } from '@/lib/api'
import Header from '@/components/Header'
import StatsCards from '@/components/StatsCards'
import ExpenseChart from '@/components/ExpenseChart'
import CategoryChart from '@/components/CategoryChart'
import Filters from '@/components/Filters'
import ExpenseTable from '@/components/ExpenseTable'
import ExpenseForm from '@/components/ExpenseForm'
import EntityForm from '@/components/EntityForm'
import CSVImport from '@/components/CSVImport'

export default function Home() {
  const [expenses, setExpenses] = useState([])
  const [users, setUsers] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedUser, setSelectedUser] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [showUserForm, setShowUserForm] = useState(false)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [showCSVImport, setShowCSVImport] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [loading, setLoading] = useState(true)
  const expenseFormRef = useRef(null)

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    setLoading(true)
    const [exp, usr, cat] = await Promise.all([
      fetchExpenses(),
      fetchUsers(),
      fetchCategories(),
    ])
    setExpenses(exp)
    setUsers(usr)
    setCategories(cat)
    setLoading(false)
  }

  async function handleAddExpense(data) {
    try {
      await createExpense(data)
      setShowExpenseForm(false)
      fetchAll()
      toast.success('Expense added successfully')
    } catch {
      toast.error('Failed to add expense')
    }
  }

  async function handleUpdateExpense(data) {
    try {
      await updateExpense(editingExpense._id, data)
      setEditingExpense(null)
      setShowExpenseForm(false)
      fetchAll()
      toast.success('Expense updated successfully')
    } catch {
      toast.error('Failed to update expense')
    }
  }

  async function handleDelete(id) {
    try {
      await deleteExpense(id)
      fetchAll()
      toast.success('Expense deleted')
    } catch {
      toast.error('Failed to delete expense')
    }
  }

  async function handleEdit(expense) {
    setShowExpenseForm(false)
    setEditingExpense(expense)
    setTimeout(() => {
      setShowExpenseForm(true)
      setTimeout(() => {
        expenseFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 50)
    }, 0)
  }

  async function handleAddUser(data) {
    try {
      await createUser(data)
      setShowUserForm(false)
      fetchAll()
      toast.success(`User "${data.name}" created`)
    } catch {
      toast.error('Failed to create user')
    }
  }

  async function handleAddCategory(data) {
    try {
      await createCategory(data)
      setShowCategoryForm(false)
      fetchAll()
      toast.success(`Category "${data.name}" created`)
    } catch {
      toast.error('Failed to create category')
    }
  }

  const filtered = expenses.filter(exp => {
    const matchUser = selectedUser === 'all' || exp.userId?._id === selectedUser
    const matchCat = selectedCategory === 'all' || exp.categoryId?._id === selectedCategory
    const expDate = new Date(exp.date)
    const matchFrom = !dateFrom || expDate >= new Date(dateFrom)
    const matchTo = !dateTo || expDate <= new Date(dateTo)
    return matchUser && matchCat && matchFrom && matchTo
  })

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontFamily: 'Syne, sans-serif', fontSize: '1.2rem' }}>Loading...</p>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', padding: '2rem' }}>
      <Header
        onAddExpense={() => {
          setEditingExpense(null)
          setShowExpenseForm(!showExpenseForm)
        }}
        onAddUser={() => setShowUserForm(!showUserForm)}
        onAddCategory={() => setShowCategoryForm(!showCategoryForm)}
        onImportCSV={() => setShowCSVImport(!showCSVImport)}
      />

      {showUserForm && <EntityForm title="New User" onSubmit={handleAddUser} />}
      {showCategoryForm && <EntityForm title="New Category" onSubmit={handleAddCategory} />}
      {showCSVImport && <CSVImport onImport={() => { setShowCSVImport(false); fetchAll(); toast.success('CSV imported successfully') }} />}
      <div ref={expenseFormRef}>
        {showExpenseForm && (
          <ExpenseForm
            key={editingExpense?._id || 'new'}
            users={users}
            categories={categories}
            onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
            expense={editingExpense}
          />
        )}
      </div>

      <StatsCards expenses={filtered} />

      <Filters
        users={users}
        categories={categories}
        selectedUser={selectedUser}
        selectedCategory={selectedCategory}
        onUserChange={setSelectedUser}
        onCategoryChange={setSelectedCategory}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
      />

      <ExpenseChart expenses={filtered} />
      <CategoryChart expenses={filtered} />
      <ExpenseTable
        expenses={filtered}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </main>
  )
}