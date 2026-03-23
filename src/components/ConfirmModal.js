'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from '@/styles/ConfirmModal.module.css'

export default function ConfirmModal({ message, onConfirm, onCancel }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return createPortal(
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
          <button className={styles.confirmBtn} onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>,
    document.body
  )
}