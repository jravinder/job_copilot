"use server"

import { Groq } from "groq-sdk"

interface ChatResponse {
  success: boolean
  data?: string
  error?: string
}

function getGroqClient() {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY environment variable is not configured")
  }

  return new Groq({
    apiKey: process.env.GROQ_API_KEY,
  })
}

export async function chatWithAI({
  messages,
  resumeText,
  jobDescription,
  companyName,
  position,
}: {
  messages: { role: string; content: string }[]
  resumeText: string
  jobDescription: string
  companyName: string
  position: string
}): Promise<ChatResponse> {
  try {
    const groq = getGroqClient()

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert AI career coach and job application assistant. You are helping a user prepare for a job application. You have access to their resume and the job description. Use this information to answer their questions. Be concise and helpful.

          Resume:
          ${resumeText}

          Job Description:
          ${jobDescription}

          Company: ${companyName}
          Position: ${position}
          `,
        },
        ...messages,
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 2000,
    })

    const response = completion.choices[0]?.message?.content

    if (!response) {
      throw new Error("No response from AI service")
    }

    return {
      success: true,
      data: response,
    }
  } catch (error) {
    console.error("Error in chatWithAI:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred during chat",
    }
  }
}
