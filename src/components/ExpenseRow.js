import styles from '@/styles/ExpensesTable.module.css'

export default function ExpenseRow({ expense, onDelete, onEdit }) {
  return (
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
          <button className={styles.deleteBtn} onClick={() => onDelete(expense._id)}>Delete</button>
        </div>
      </td>
    </tr>
  )
}