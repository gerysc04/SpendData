'use client'

import {
  PieChart, Pie, Cell, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts'
import styles from '@/styles/CategoryChart.module.css'

export default function CategoryChart({ expenses }) {
  const data = expenses.reduce((acc, exp) => {
    const name = exp.categoryId?.name || 'Unknown'
    const color = exp.categoryId?.color || '#6c63ff'
    const existing = acc.find(d => d.name === name)
    if (existing) {
      existing.value = +(existing.value + exp.amount).toFixed(2)
    } else {
      acc.push({ name, value: exp.amount, color })
    }
    return acc
  }, [])

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Spending by Category</h2>
      {expenses.length === 0 ? (
        <p className={styles.empty}>No expenses yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--text)'
              }}
              formatter={(value) => `€${value.toFixed(2)}`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}