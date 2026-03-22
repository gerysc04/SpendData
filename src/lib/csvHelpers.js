export function exportToCSV(expenses) {
  const headers = ['description', 'amount', 'date', 'user', 'category']
  const rows = expenses.map(exp => [
    exp.description,
    exp.amount,
    new Date(exp.date).toISOString().split('T')[0],
    exp.userId?.name || '',
    exp.categoryId?.name || ''
  ])

  const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `spenddata-export-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}