'use client'

import { useState } from 'react'
import styles from '@/styles/CSVImport.module.css'

export default function CSVImport({ onImport }) {
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)

    async function handleSubmit(e) {
        e.preventDefault()
        if (!file) return

        setLoading(true)
        setResult(null)
        setError(null)

        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await fetch('/api/expenses/import', {
                method: 'POST',
                body: formData
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Import failed')
            setResult(data.inserted)
            onImport()
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
            setFile(null)
        }
    }

    return (
        <div className={styles.card}>
            <h3 className={styles.title}>Import CSV</h3>
            <p className={styles.hint}>
                CSV columns in order: <code>description, amount, date, user, category</code>.
                Users and categories will be created automatically if they don't exist.
            </p>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="file"
                    accept=".csv"
                    onChange={e => setFile(e.target.files[0])}
                    className={styles.fileInput}
                />
                <button
                    type="submit"
                    disabled={!file || loading}
                    className={styles.btn}
                >
                    {loading ? 'Importing...' : 'Import'}
                </button>
            </form>
            {result !== null && (
                <p className={styles.success}>✓ Successfully imported {result} expenses</p>
            )}
            {error && (
                <p className={styles.error}>✗ {error}</p>
            )}
        </div>
    )
}