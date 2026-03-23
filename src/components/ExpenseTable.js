'use client'

import { useState } from 'react'
import ExpenseRow from './ExpenseRow'
import { exportToCSV } from '@/lib/csvHelpers'
import styles from '@/styles/ExpenseTable.module.css'

export default function ExpenseTable({ expenses, onDelete, onEdit }) {
  const [sortKey, setSortKey] = useState('date')
  const [sortDir, setSortDir] = useState('desc')

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  function getSortIcon(key) {
    if (sortKey !== key) return ' ↕'
    return sortDir === 'asc' ? ' ↑' : ' ↓'
  }

  const sorted = [...expenses].sort((a, b) => {
    let valA, valB
    switch (sortKey) {
      case 'date':
        valA = new Date(a.date)
        valB = new Date(b.date)
        break
      case 'amount':
        valA = a.amount
        valB = b.amount
        break
      case 'description':
        valA = a.description.toLowerCase()
        valB = b.description.toLowerCase()
        break
      case 'category':
        valA = a.categoryId?.name?.toLowerCase() || ''
        valB = b.categoryId?.name?.toLowerCase() || ''
        break
      case 'user':
        valA = a.userId?.name?.toLowerCase() || ''
        valB = b.userId?.name?.toLowerCase() || ''
        break
      default:
        return 0
    }
    if (valA < valB) return sortDir === 'asc' ? -1 : 1
    if (valA > valB) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'description', label: 'Description' },
    { key: 'category', label: 'Category' },
    { key: 'user', label: 'User' },
    { key: 'amount', label: 'Amount' },
    { key: null, label: 'Actions' },
  ]

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Expenses</h2>
        <button
          className={styles.exportBtn}
          onClick={() => exportToCSV(expenses)}
          disabled={expenses.length === 0}
        >
          Export CSV
        </button>
      </div>
      {expenses.length === 0 ? (
        <p className={styles.empty}>No expenses found.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.headerRow}>
                {columns.map(col => (
                  <th
                    key={col.label}
                    className={`${styles.th} ${col.key ? styles.sortable : ''}`}
                    onClick={() => col.key && handleSort(col.key)}
                  >
                    {col.label}{col.key && getSortIcon(col.key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map(exp => (
                <ExpenseRow
                  key={exp._id}
                  expense={exp}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}