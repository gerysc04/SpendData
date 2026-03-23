import connectDB from '@/lib/mongodb'
import Expense from '@/models/Expense'
import '@/models/User'
import '@/models/Category'
import { NextResponse } from 'next/server'

export async function GET() {
  await connectDB()
  const expenses = await Expense.find()
    .populate('userId', 'name color')
    .populate('categoryId', 'name color')
    .sort({ date: 1 })
  return NextResponse.json(expenses)
}

export async function POST(request) {
  await connectDB()
  const body = await request.json()
  const expense = await Expense.create(body)
  return NextResponse.json(expense, { status: 201 })
}