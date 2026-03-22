'use client'

import { useState, useEffect } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'

export default function Home() {
  const [expenses, setExpenses] = useState([])
  const [users, setUsers] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedUser, setSelectedUser] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [showUserForm, setShowUserForm] = useState(false)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [loading, setLoading] = useState(true)

  // Form states
  const [expenseForm, setExpenseForm] = useState({
    description: '', amount: '', date: '', userId: '', categoryId: ''
  })
  const [userForm, setUserForm] = useState({ name: '', color: '#6c63ff' })
  const [categoryForm, setCategoryForm] = useState({ name: '', color: '#ff6584' })

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    setLoading(true)
    const [exp, usr, cat] = await Promise.all([
      fetch('/api/expenses').then(r => r.json()),
      fetch('/api/users').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
    ])
    setExpenses(exp)
    setUsers(usr)
    setCategories(cat)
    setLoading(false)
  }

  async function submitExpense(e) {
    e.preventDefault()
    await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...expenseForm,
        amount: parseFloat(expenseForm.amount)
      })
    })
    setExpenseForm({ description: '', amount: '', date: '', userId: '', categoryId: '' })
    setShowExpenseForm(false)
    fetchAll()
  }

  async function submitUser(e) {
    e.preventDefault()
    await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userForm)
    })
    setUserForm({ name: '', color: '#6c63ff' })
    setShowUserForm(false)
    fetchAll()
  }

  async function submitCategory(e) {
    e.preventDefault()
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryForm)
    })
    setCategoryForm({ name: '', color: '#ff6584' })
    setShowCategoryForm(false)
    fetchAll()
  }

  // Filter expenses
  const filtered = expenses.filter(exp => {
    const matchUser = selectedUser === 'all' || exp.userId?._id === selectedUser
    const matchCat = selectedCategory === 'all' || exp.categoryId?._id === selectedCategory
    return matchUser && matchCat
  })

  // Build chart data — group by date
  const chartData = filtered.reduce((acc, exp) => {
    const date = new Date(exp.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
    const existing = acc.find(d => d.date === date)
    if (existing) {
      existing.total = +(existing.total + exp.amount).toFixed(2)
    } else {
      acc.push({ date, total: exp.amount })
    }
    return acc
  }, []).sort((a, b) => new Date(a.date) - new Date(b.date))

  // Summary stats
  const total = filtered.reduce((s, e) => s + e.amount, 0)
  const avg = filtered.length ? (total / filtered.length).toFixed(2) : 0
  const biggest = filtered.length ? Math.max(...filtered.map(e => e.amount)) : 0

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)' }}>
            Spend<span style={{ color: 'var(--accent)' }}>Data</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Enterprise expense intelligence</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={() => setShowUserForm(!showUserForm)} style={btnSecondary}>+ User</button>
          <button onClick={() => setShowCategoryForm(!showCategoryForm)} style={btnSecondary}>+ Category</button>
          <button onClick={() => setShowExpenseForm(!showExpenseForm)} style={btnPrimary}>+ Expense</button>
        </div>
      </div>

      {/* Forms */}
      {showUserForm && (
        <div style={card}>
          <h3 style={cardTitle}>New User</h3>
          <form onSubmit={submitUser} style={formRow}>
            <input required placeholder="Name" value={userForm.name}
              onChange={e => setUserForm({ ...userForm, name: e.target.value })} style={input} />
            <input type="color" value={userForm.color}
              onChange={e => setUserForm({ ...userForm, color: e.target.value })} style={{ ...input, width: '60px', padding: '0.25rem', cursor: 'pointer' }} />
            <button type="submit" style={btnPrimary}>Create</button>
          </form>
        </div>
      )}

      {showCategoryForm && (
        <div style={card}>
          <h3 style={cardTitle}>New Category</h3>
          <form onSubmit={submitCategory} style={formRow}>
            <input required placeholder="Category name" value={categoryForm.name}
              onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })} style={input} />
            <input type="color" value={categoryForm.color}
              onChange={e => setCategoryForm({ ...categoryForm, color: e.target.value })} style={{ ...input, width: '60px', padding: '0.25rem', cursor: 'pointer' }} />
            <button type="submit" style={btnPrimary}>Create</button>
          </form>
        </div>
      )}

      {showExpenseForm && (
        <div style={card}>
          <h3 style={cardTitle}>New Expense</h3>
          <form onSubmit={submitExpense} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
            <input required placeholder="Description" value={expenseForm.description}
              onChange={e => setExpenseForm({ ...expenseForm, description: e.target.value })} style={input} />
            <input required type="number" placeholder="Amount (€)" value={expenseForm.amount}
              onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })} style={input} />
            <input required type="date" value={expenseForm.date}
              onChange={e => setExpenseForm({ ...expenseForm, date: e.target.value })} style={input} />
            <select required value={expenseForm.userId}
              onChange={e => setExpenseForm({ ...expenseForm, userId: e.target.value })} style={input}>
              <option value="">Select user</option>
              {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
            </select>
            <select required value={expenseForm.categoryId}
              onChange={e => setExpenseForm({ ...expenseForm, categoryId: e.target.value })} style={input}>
              <option value="">Select category</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <button type="submit" style={{ ...btnPrimary, alignSelf: 'stretch' }}>Add Expense</button>
          </form>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Spent', value: `€${total.toFixed(2)}` },
          { label: 'Expenses', value: filtered.length },
          { label: 'Avg per Expense', value: `€${avg}` },
          { label: 'Largest Expense', value: `€${biggest.toFixed(2)}` },
        ].map(stat => (
          <div key={stat.label} style={card}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{stat.label}</p>
            <p style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'Syne, sans-serif', marginTop: '0.25rem' }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} style={input}>
          <option value="all">All Users</option>
          {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
        </select>
        <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} style={input}>
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
      </div>

      {/* Chart */}
      <div style={{ ...card, marginBottom: '1.5rem' }}>
        <h2 style={cardTitle}>Spending Over Time</h2>
        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
        ) : chartData.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No expenses yet. Add some to see the chart.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="var(--accent)" strokeWidth={2} dot={{ fill: 'var(--accent)', r: 4 }} activeDot={{ r: 6 }} name="Total (€)" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Expenses Table */}
      <div style={card}>
        <h2 style={cardTitle}>Expenses</h2>
        {filtered.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No expenses found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Date', 'Description', 'Category', 'User', 'Amount'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.08em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(exp => (
                  <tr key={exp._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={td}>{new Date(exp.date).toLocaleDateString('en-GB')}</td>
                    <td style={td}>{exp.description}</td>
                    <td style={td}>
                      <span style={{ background: exp.categoryId?.color + '22', color: exp.categoryId?.color, padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.8rem' }}>
                        {exp.categoryId?.name}
                      </span>
                    </td>
                    <td style={td}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: exp.userId?.color, display: 'inline-block' }} />
                        {exp.userId?.name}
                      </span>
                    </td>
                    <td style={{ ...td, fontWeight: 600, color: 'var(--accent)' }}>€{exp.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}

// Styles
const card = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: '12px',
  padding: '1.5rem',
  marginBottom: '1rem',
}

const cardTitle = {
  fontSize: '1rem',
  fontWeight: 700,
  marginBottom: '1rem',
  color: 'var(--text)',
  letterSpacing: '-0.01em',
}

const input = {
  background: 'var(--surface-2)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  padding: '0.6rem 0.9rem',
  color: 'var(--text)',
  fontSize: '0.9rem',
  outline: 'none',
  width: '100%',
}

const btnPrimary = {
  background: 'var(--accent)',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  padding: '0.6rem 1.2rem',
  fontWeight: 600,
  cursor: 'pointer',
  fontSize: '0.9rem',
  whiteSpace: 'nowrap',
}

const btnSecondary = {
  background: 'transparent',
  color: 'var(--text)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  padding: '0.6rem 1.2rem',
  fontWeight: 600,
  cursor: 'pointer',
  fontSize: '0.9rem',
  whiteSpace: 'nowrap',
}

const formRow = {
  display: 'flex',
  gap: '0.75rem',
  alignItems: 'center',
  flexWrap: 'wrap',
}

const td = {
  padding: '0.75rem 1rem',
  color: 'var(--text)',
}