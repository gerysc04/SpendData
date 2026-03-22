import ExpenseRow from './ExpenseRow'
import { exportToCSV } from '@/lib/csvHelpers'
import styles from '@/styles/ExpenseTable.module.css'

export default function ExpenseTable({ expenses, onDelete, onEdit }) {
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
                {['Date', 'Description', 'Category', 'User', 'Amount', 'Actions'].map(h => (
                  <th key={h} className={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {expenses.map(exp => (
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