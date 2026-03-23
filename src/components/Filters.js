'use client'

import styles from '@/styles/Filters.module.css'

export default function Filters({ users, categories, selectedUser, selectedCategory, onUserChange, onCategoryChange, dateFrom, dateTo, onDateFromChange, onDateToChange }) {
  return (
    <div className={styles.filters}>
      <select
        value={selectedUser}
        onChange={e => onUserChange(e.target.value)}
        className={styles.select}
      >
        <option value="all">All Users</option>
        {users.map(u => (
          <option key={u._id} value={u._id}>{u.name}</option>
        ))}
      </select>
      <select
        value={selectedCategory}
        onChange={e => onCategoryChange(e.target.value)}
        className={styles.select}
      >
        <option value="all">All Categories</option>
        {categories.map(c => (
          <option key={c._id} value={c._id}>{c.name}</option>
        ))}
      </select>
      <div className={styles.dateRange}>
        <input
          type="date"
          value={dateFrom}
          onChange={e => onDateFromChange(e.target.value)}
          className={styles.select}
          placeholder="From"
        />
        <span className={styles.dateSeparator}>→</span>
        <input
          type="date"
          value={dateTo}
          onChange={e => onDateToChange(e.target.value)}
          className={styles.select}
          placeholder="To"
        />
      </div>
      {(dateFrom || dateTo) && (
        <button
          className={styles.clearBtn}
          onClick={() => { onDateFromChange(''); onDateToChange('') }}
        >
          Clear dates
        </button>
      )}
    </div>
  )
}