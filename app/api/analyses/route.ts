import { NextResponse } from "next/server"
import type { StoredAnalysis } from "@/types/analysis"

// This is a mock database - in a real app, you'd use a proper database
let analyses: StoredAnalysis[] = []

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  const userAnalyses = analyses.filter((a) => a.userId === userId)
  return NextResponse.json(userAnalyses)
}

export async function POST(request: Request) {
  const analysis: StoredAnalysis = await request.json()

  if (!analysis.userId || !analysis.id) {
    return NextResponse.json({ error: "Invalid analysis data" }, { status: 400 })
  }

  // Update or create
  const index = analyses.findIndex((a) => a.id === analysis.id)
  if (index >= 0) {
    analyses[index] = analysis
  } else {
    analyses.push(analysis)
  }

  return NextResponse.json(analysis)
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Analysis ID is required" }, { status: 400 })
  }

  analyses = analyses.filter((a) => a.id !== id)
  return NextResponse.json({ success: true })
}
