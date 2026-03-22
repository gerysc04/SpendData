'use client'

import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import styles from '@/styles/ExpenseChart.module.css'

function buildTotalData(expenses) {
  return expenses.reduce((acc, exp) => {
    const date = new Date(exp.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
    const existing = acc.find(d => d.date === date)
    if (existing) {
      existing.total = +(existing.total + exp.amount).toFixed(2)
    } else {
      acc.push({ date, total: exp.amount })
    }
    return acc
  }, []).sort((a, b) => new Date(a.date) - new Date(b.date))
}

function buildGroupedData(expenses, groupKey, nameKey) {
  const groups = {}
  expenses.forEach(exp => {
    const date = new Date(exp.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
    const name = exp[groupKey]?.[nameKey] || 'Unknown'
    const color = exp[groupKey]?.color || '#6c63ff'
    if (!groups[name]) groups[name] = { color, data: {} }
    groups[name].data[date] = +(( groups[name].data[date] || 0) + exp.amount).toFixed(2)
  })

  const allDates = [...new Set(expenses.map(exp =>
    new Date(exp.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
  ))].sort((a, b) => new Date(a) - new Date(b))

  return {
    chartData: allDates.map(date => {
      const point = { date }
      Object.keys(groups).forEach(name => {
        point[name] = groups[name].data[date] || 0
      })
      return point
    }),
    groups
  }
}

export default function ExpenseChart({ expenses }) {
  const [view, setView] = useState('total')

  const totalData = buildTotalData(expenses)
  const { chartData: categoryData, groups: categoryGroups } = buildGroupedData(expenses, 'categoryId', 'name')
  const { chartData: userData, groups: userGroups } = buildGroupedData(expenses, 'userId', 'name')

  const data = view === 'total' ? totalData : view === 'category' ? categoryData : userData
  const groups = view === 'category' ? categoryGroups : view === 'user' ? userGroups : null

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.title}>Spending Over Time</h2>
        <div className={styles.toggle}>
          {['total', 'category', 'user'].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`${styles.toggleBtn} ${view === v ? styles.active : ''}`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {expenses.length === 0 ? (
        <p className={styles.empty}>No expenses yet. Add some to see the chart.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
            <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
            <Tooltip contentStyle={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
            <Legend />
            {view === 'total' ? (
              <Line type="monotone" dataKey="total" stroke="var(--accent)" strokeWidth={2} dot={{ fill: 'var(--accent)', r: 4 }} activeDot={{ r: 6 }} name="Total (€)" />
            ) : (
              Object.entries(groups).map(([name, { color }]) => (
                <Line key={name} type="monotone" dataKey={name} stroke={color} strokeWidth={2} dot={{ fill: color, r: 4 }} activeDot={{ r: 6 }} />
              ))
            )}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}