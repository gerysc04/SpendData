export async function fetchExpenses() {
  return fetch('/api/expenses').then(r => r.json())
}

export async function fetchUsers() {
  return fetch('/api/users').then(r => r.json())
}

export async function fetchCategories() {
  return fetch('/api/categories').then(r => r.json())
}

export async function createExpense(data) {
  return fetch('/api/expenses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json())
}

export async function createUser(data) {
  return fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json())
}

export async function createCategory(data) {
  return fetch('/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json())
}

export async function deleteExpense(id) {
  return fetch(`/api/expenses/${id}`, { method: 'DELETE' }).then(r => r.json())
}

export async function updateExpense(id, data) {
  return fetch(`/api/expenses/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json())
}