'use client'

import { useState } from 'react'
import styles from '@/styles/EntityForm.module.css'

export default function EntityForm({ title, onSubmit }) {
  const [form, setForm] = useState({ name: '', color: '#6c63ff' })

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(form)
    setForm({ name: '', color: '#6c63ff' })
  }

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          required
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className={styles.input}
        />
        <input
          type="color"
          value={form.color}
          onChange={e => setForm({ ...form, color: e.target.value })}
          className={styles.colorPicker}
        />
        <button type="submit" className={styles.btn}>Create</button>
      </form>
    </div>
  )
}