'use client'

import { useState } from 'react'
import styles from '@/styles/ExpenseForm.module.css'

export default function ExpenseForm({ users, categories, onSubmit }) {
  const [form, setForm] = useState({
    description: '',
    amount: '',
    date: '',
    userId: '',
    categoryId: ''
  })

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({ ...form, amount: parseFloat(form.amount) })
    setForm({ description: '', amount: '', date: '', userId: '', categoryId: '' })
  }

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>New Expense</h3>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          required
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          required
          type="number"
          name="amount"
          placeholder="Amount (€)"
          value={form.amount}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          required
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className={styles.input}
        />
        <select
          required
          name="userId"
          value={form.userId}
          onChange={handleChange}
          className={styles.input}
        >
          <option value="">Select user</option>
          {users.map(u => (
            <option key={u._id} value={u._id}>{u.name}</option>
          ))}
        </select>
        <select
          required
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          className={styles.input}
        >
          <option value="">Select category</option>
          {categories.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
        <button type="submit" className={styles.btn}>Add Expense</button>
      </form>
    </div>
  )
}