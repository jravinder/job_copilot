"use server"

import { Groq } from "groq-sdk"

export interface BulletPoints {
  resume: {
    skills: string[]
    experience: string[]
    education: string[]
    highlights: string[]
  }
  jobDescription: {
    requirements: string[]
    responsibilities: string[]
    benefits: string[]
    keyPoints: string[]
  }
}

export async function extractBulletPoints(data: {
  resumeText: string
  jobDescription: string
}): Promise<BulletPoints> {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY environment variable is not configured")
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    })

    // Set a timeout for the API call
    const timeoutPromise = new Promise(
      (_, reject) => setTimeout(() => reject(new Error("Request timed out")), 15000), // 15 second timeout
    )

    const completionPromise = groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert at analyzing resumes and job descriptions.
      Extract the most important points and categorize them clearly.
      Be concise and specific.
      Focus on actionable information.
      Limit to 3-5 bullet points per category.
      
      Format as JSON with these categories:
      - resume.skills: Technical and soft skills
      - resume.experience: Key work experiences
      - resume.education: Educational background
      - resume.highlights: Notable achievements
      - jobDescription.requirements: Must-have qualifications
      - jobDescription.responsibilities: Key job duties
      - jobDescription.benefits: Offered benefits
      - jobDescription.keyPoints: Important details about role/company`,
        },
        {
          role: "user",
          content: `Resume:
          ${data.resumeText.slice(0, 2000)} // Limit input length

          Job Description:
          ${data.jobDescription.slice(0, 2000)} // Limit input length`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      max_tokens: 1000, // Reduced token limit
      top_p: 0.9,
    })

    // Race between the API call and the timeout
    const completion = (await Promise.race([completionPromise, timeoutPromise])) as Awaited<typeof completionPromise>

    const response = completion.choices[0]?.message?.content

    if (!response) {
      throw new Error("No response from AI service")
    }

    // Parse and validate the response
    const parsedResponse = JSON.parse(response.slice(response.indexOf("{"), response.lastIndexOf("}") + 1))

    // Ensure all arrays exist with a default empty array
    const result: BulletPoints = {
      resume: {
        skills: ensureArray(parsedResponse.resume?.skills),
        experience: ensureArray(parsedResponse.resume?.experience),
        education: ensureArray(parsedResponse.resume?.education),
        highlights: ensureArray(parsedResponse.resume?.highlights),
      },
      jobDescription: {
        requirements: ensureArray(parsedResponse.jobDescription?.requirements),
        responsibilities: ensureArray(parsedResponse.jobDescription?.responsibilities),
        benefits: ensureArray(parsedResponse.jobDescription?.benefits),
        keyPoints: ensureArray(parsedResponse.jobDescription?.keyPoints),
      },
    }

    return result
  } catch (error) {
    console.error("Error in extractBulletPoints:", error)

    // Provide more specific error messages
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"

    if (errorMessage.includes("timeout")) {
      throw new Error("The analysis took too long. Please try again.")
    }

    if (errorMessage.includes("GROQ_API_KEY")) {
      throw new Error("API key configuration issue. Please check your environment variables.")
    }

    throw new Error(`Failed to analyze content: ${errorMessage}`)
  }
}

// Helper function to ensure we always have an array
function ensureArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string")
  }
  return []
}
