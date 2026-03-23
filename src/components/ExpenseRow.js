'use client'

import { useState } from 'react'
import ConfirmModal from './ConfirmModal'
import styles from '@/styles/ExpenseTable.module.css'

export default function ExpenseRow({ expense, onDelete, onEdit }) {
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <>
      {showConfirm && (
        <ConfirmModal
          message={`Delete "${expense.description}"? This cannot be undone.`}
          onConfirm={() => {
            onDelete(expense._id)
            setShowConfirm(false)
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      <tr className={styles.row}>
        <td className={styles.td}>{new Date(expense.date).toLocaleDateString('en-GB')}</td>
        <td className={styles.td}>{expense.description}</td>
        <td className={styles.td}>
          <span
            className={styles.badge}
            style={{
              background: expense.categoryId?.color + '22',
              color: expense.categoryId?.color
            }}
          >
            {expense.categoryId?.name}
          </span>
        </td>
        <td className={styles.td}>
          <span className={styles.user}>
            <span
              className={styles.userDot}
              style={{ background: expense.userId?.color }}
            />
            {expense.userId?.name}
          </span>
        </td>
        <td className={`${styles.td} ${styles.amount}`}>
          €{expense.amount.toFixed(2)}
        </td>
        <td className={styles.td}>
          <div className={styles.actions}>
            <button className={styles.editBtn} onClick={() => onEdit(expense)}>Edit</button>
            <button className={styles.deleteBtn} onClick={() => setShowConfirm(true)}>Delete</button>
          </div>
        </td>
      </tr>
    </>
  )
}