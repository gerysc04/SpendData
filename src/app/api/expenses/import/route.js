import connectDB from '@/lib/mongodb'
import Expense from '@/models/Expense'
import { NextResponse } from 'next/server'
import Papa from 'papaparse'

export async function POST(request) {
  await connectDB()
  const formData = await request.formData()
  const file = formData.get('file')
  const text = await file.text()

  const { data } = Papa.parse(text, { header: true, skipEmptyLines: true })

  const expenses = data.map(row => ({
    description: row.description,
    amount: parseFloat(row.amount),
    date: new Date(row.date),
    userId: row.userId,
    categoryId: row.categoryId,
  }))

  await Expense.insertMany(expenses)
  return NextResponse.json({ inserted: expenses.length }, { status: 201 })
}