import connectDB from '@/lib/mongodb'
import Expense from '@/models/Expense'
import { NextResponse } from 'next/server'

export async function PATCH(request, { params }) {
  await connectDB()
  const { id } = await params
  const body = await request.json()
  const expense = await Expense.findByIdAndUpdate(
    id,
    body,
    { new: true }
  ).populate('userId', 'name color').populate('categoryId', 'name color')
  return NextResponse.json(expense)
}

export async function DELETE(_, { params }) {
  await connectDB()
  const { id } = await params
  await Expense.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}