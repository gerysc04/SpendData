import styles from '@/styles/StatsCards.module.css'

export default function StatsCards({ expenses }) {
  const total = expenses.reduce((s, e) => s + e.amount, 0)
  const avg = expenses.length ? (total / expenses.length).toFixed(2) : 0
  const biggest = expenses.length ? Math.max(...expenses.map(e => e.amount)) : 0

  const stats = [
    { label: 'Total Spent', value: `€${total.toFixed(2)}` },
    { label: 'Expenses', value: expenses.length },
    { label: 'Avg per Expense', value: `€${avg}` },
    { label: 'Largest Expense', value: `€${biggest.toFixed(2)}` },
  ]

  return (
    <div className={styles.grid}>
      {stats.map(stat => (
        <div key={stat.label} className={styles.card}>
          <p className={styles.label}>{stat.label}</p>
          <p className={styles.value}>{stat.value}</p>
        </div>
      ))}
    </div>
  )
}