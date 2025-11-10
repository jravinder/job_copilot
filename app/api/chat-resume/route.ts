import { NextResponse } from "next/server"
import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { message, resume, jobDescription, history } = await req.json()

    const systemPrompt = `You are Personal Job CoPilot — an expert resume coach specialized in ATS optimization.

Your tasks:
1. Help candidates improve their resumes to match specific job descriptions
2. Identify missing, weak, or irrelevant keywords and suggest ATS-friendly replacements
3. Provide concise, actionable advice that can be immediately applied
4. Follow ATS best practices:
   - Use plain text formatting (no tables, columns, or fancy symbols)
   - Maximize relevant keyword density from the job description
   - Keep sentences concise and action-oriented
   - Avoid fluff and subjective adjectives
   - Use strong action verbs

Resume:
${resume}

Job Description:
${jobDescription}

Provide brief, practical suggestions that the candidate can copy-paste or apply immediately.`

    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...history.map((h: { role: string; content: string }) => ({
        role: h.role as "user" | "assistant",
        content: h.content,
      })),
      { role: "user" as const, content: message },
    ]

    const completion = await groq.chat.completions.create({
      messages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1000,
    })

    const assistantMessage = completion.choices[0]?.message?.content || "I'm here to help optimize your resume!"

    return NextResponse.json({ message: assistantMessage })
  } catch (error) {
    console.error("[v0] Error in chat-resume API:", error)
    return NextResponse.json({ error: "Failed to process chat message" }, { status: 500 })
  }
}
