'use client'

import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { buildTotalData, buildGroupedData } from '@/lib/chartHelpers'
import styles from '@/styles/ExpenseChart.module.css'

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