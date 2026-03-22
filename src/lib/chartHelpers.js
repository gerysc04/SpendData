export function buildTotalData(expenses) {
  return expenses.reduce((acc, exp) => {
    const date = new Date(exp.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
    const existing = acc.find(d => d.date === date)
    if (existing) {
      existing.total = +(existing.total + exp.amount).toFixed(2)
    } else {
      acc.push({ date, total: exp.amount })
    }
    return acc
  }, []).sort((a, b) => new Date(a.date) - new Date(b.date))
}

export function buildGroupedData(expenses, groupKey, nameKey) {
  const groups = {}
  expenses.forEach(exp => {
    const date = new Date(exp.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
    const name = exp[groupKey]?.[nameKey] || 'Unknown'
    const color = exp[groupKey]?.color || '#6c63ff'
    if (!groups[name]) groups[name] = { color, data: {} }
    groups[name].data[date] = +((groups[name].data[date] || 0) + exp.amount).toFixed(2)
  })

  const allDates = [...new Set(expenses.map(exp =>
    new Date(exp.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
  ))].sort((a, b) => new Date(a) - new Date(b))

  return {
    chartData: allDates.map(date => {
      const point = { date }
      Object.keys(groups).forEach(name => {
        point[name] = groups[name].data[date] || 0
      })
      return point
    }),
    groups
  }
}