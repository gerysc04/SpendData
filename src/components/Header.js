'use client'

import styles from '@/styles/Header.module.css'

export default function Header({ onAddExpense, onAddUser, onAddCategory, onImportCSV }) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <h1 className={styles.logo}>
          Spend<span className={styles.accent}>Data</span>
        </h1>
        <p className={styles.tagline}>Enterprise expense intelligence</p>
      </div>
      <div className={styles.actions}>
        <button className={styles.btnSecondary} onClick={onAddUser}>+ User</button>
        <button className={styles.btnSecondary} onClick={onAddCategory}>+ Category</button>
        <button className={styles.btnSecondary} onClick={onImportCSV}>+ Import CSV</button>
        <button className={styles.btnPrimary} onClick={onAddExpense}>+ Expense</button>
      </div>
    </header>
  )
}