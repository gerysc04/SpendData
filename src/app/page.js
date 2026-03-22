'use client'

import { useState, useEffect, useRef } from 'react'
import { fetchExpenses, fetchUsers, fetchCategories, createExpense, createUser, createCategory, deleteExpense, updateExpense } from '@/lib/api'
import Header from '@/components/Header'
import StatsCards from '@/components/StatsCards'
import ExpenseChart from '@/components/ExpenseChart'
import CategoryChart from '@/components/CategoryChart'
import Filters from '@/components/Filters'
import ExpenseTable from '@/components/ExpenseTable'
import ExpenseForm from '@/components/ExpenseForm'
import EntityForm from '@/components/EntityForm'

export default function Home() {
  const [expenses, setExpenses] = useState([])
  const [users, setUsers] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedUser, setSelectedUser] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [showUserForm, setShowUserForm] = useState(false)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
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
    await createExpense(data)
    setShowExpenseForm(false)
    fetchAll()
  }

  async function handleUpdateExpense(data) {
    await updateExpense(editingExpense._id, data)
    setEditingExpense(null)
    setShowExpenseForm(false)
    fetchAll()
  }

  async function handleDelete(id) {
    await deleteExpense(id)
    fetchAll()
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
    await createUser(data)
    setShowUserForm(false)
    fetchAll()
  }

  async function handleAddCategory(data) {
    await createCategory(data)
    setShowCategoryForm(false)
    fetchAll()
  }

  const filtered = expenses.filter(exp => {
    const matchUser = selectedUser === 'all' || exp.userId?._id === selectedUser
    const matchCat = selectedCategory === 'all' || exp.categoryId?._id === selectedCategory
    return matchUser && matchCat
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
      />

      {showUserForm && <EntityForm title="New User" onSubmit={handleAddUser} />}
      {showCategoryForm && <EntityForm title="New Category" onSubmit={handleAddCategory} />}
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