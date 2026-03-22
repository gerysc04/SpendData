import ExpenseRow from './ExpenseRow'
import styles from '@/styles/ExpensesTable.module.css'

export default function ExpensesTable({ expenses, onDelete, onEdit }) {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Expenses</h2>
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