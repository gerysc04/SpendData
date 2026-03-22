import connectDB from '@/lib/mongodb'
import Category from '@/models/Category'
import { NextResponse } from 'next/server'

export async function GET() {
  await connectDB()
  const categories = await Category.find()
  return NextResponse.json(categories)
}

export async function POST(request) {
  await connectDB()
  const body = await request.json()
  const category = await Category.create(body)
  return NextResponse.json(category, { status: 201 })
}