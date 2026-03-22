import connectDB from '@/lib/mongodb'
import Expense from '@/models/Expense'
import User from '@/models/User'
import Category from '@/models/Category'
import { NextResponse } from 'next/server'
import Papa from 'papaparse'

function randomColor() {
  const colors = ['#6c63ff', '#ff6584', '#43b89c', '#f9a825', '#e91e63', '#00bcd4', '#8bc34a', '#ff5722']
  return colors[Math.floor(Math.random() * colors.length)]
}

async function upsertUser(name) {
  const trimmed = name.trim()
  const user = await User.findOneAndUpdate(
    { name: trimmed },
    { $setOnInsert: { name: trimmed, color: randomColor() } },
    { upsert: true, new: true }
  )
  return user._id
}

async function upsertCategory(name) {
  const trimmed = name.trim()
  const category = await Category.findOneAndUpdate(
    { name: trimmed },
    { $setOnInsert: { name: trimmed, color: randomColor() } },
    { upsert: true, new: true }
  )
  return category._id
}

export async function POST(request) {
  await connectDB()

  const formData = await request.formData()
  const file = formData.get('file')
  const text = await file.text()

  const { data } = Papa.parse(text, { skipEmptyLines: true })

  // Skip header row if first cell looks like a label
  const isHeader = isNaN(parseFloat(data[0]?.[1]))
  const rows = isHeader ? data.slice(1) : data

  try {
    const expenses = await Promise.all(rows.map(async (row) => {
      const [description, amount, date, userName, categoryName] = row
      const userId = await upsertUser(userName)
      const categoryId = await upsertCategory(categoryName)
      return {
        description: description.trim(),
        amount: parseFloat(amount),
        date: new Date(date.trim()),
        userId,
        categoryId
      }
    }))

    await Expense.insertMany(expenses)
    return NextResponse.json({ inserted: expenses.length }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}