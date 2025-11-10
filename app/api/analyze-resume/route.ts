import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { resume, jobDescription } = await req.json()

    if (!resume || !jobDescription) {
      return NextResponse.json({ error: "Resume and job description are required" }, { status: 400 })
    }

    // Extract keywords from job description
    const jdKeywords = extractKeywords(jobDescription)
    const resumeText = resume.toLowerCase()

    // Analyze each section
    const analysis = [
      analyzeSection("summary", resume, jdKeywords, resumeText),
      analyzeSection("experience", resume, jdKeywords, resumeText),
      analyzeSection("skills", resume, jdKeywords, resumeText),
      analyzeSection("education", resume, jdKeywords, resumeText),
    ]

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("[v0] Error in analyze-resume API:", error)
    return NextResponse.json({ error: "Failed to analyze resume" }, { status: 500 })
  }
}

function extractKeywords(text: string): string[] {
  // Simple keyword extraction - in production, use NLP or AI
  const commonWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "from",
    "as",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "should",
    "could",
    "may",
    "might",
    "must",
    "can",
    "this",
    "that",
    "these",
    "those",
  ])

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !commonWords.has(w))

  const wordFreq = new Map<string, number>()
  words.forEach((w) => wordFreq.set(w, (wordFreq.get(w) || 0) + 1))

  return Array.from(wordFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map((e) => e[0])
}

function analyzeSection(
  section: string,
  resume: string,
  jdKeywords: string[],
  resumeText: string,
): {
  section: string
  missing: string[]
  atsScore: number
  suggestions: string[]
  matches: string[]
  weakItems: string[]
} {
  const matches: string[] = []
  const missing: string[] = []

  jdKeywords.forEach((keyword) => {
    if (resumeText.includes(keyword.toLowerCase())) {
      matches.push(keyword)
    } else {
      missing.push(keyword)
    }
  })

  const atsScore = Math.round((matches.length / jdKeywords.length) * 100)

  // Generate suggestions based on missing keywords
  const suggestions = missing.slice(0, 3).map((keyword) => {
    if (section === "summary") {
      return `Consider adding: "Experienced professional with expertise in ${keyword} and proven track record of success."`
    } else if (section === "experience") {
      return `Add bullet point: "Leveraged ${keyword} to drive measurable results and improve team efficiency."`
    } else if (section === "skills") {
      return `Add skill: ${keyword}`
    } else {
      return `Consider mentioning ${keyword} in your ${section} section.`
    }
  })

  return {
    section,
    missing: missing.slice(0, 5),
    atsScore,
    suggestions,
    matches: matches.slice(0, 8),
    weakItems: [], // In production, identify weak/irrelevant content
  }
}
