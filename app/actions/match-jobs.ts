"use server"

import { Groq } from "groq-sdk"
import type { Job } from "@/services/job-search"

export interface JobMatch extends Job {
  matchScore: number
  matchingSkills: string[]
  missingSkills: string[]
}

export interface MatchResponse {
  success: boolean
  matches?: JobMatch[]
  total?: number
  error?: string
}

function getGroqClient() {
  if (typeof process.env.GROQ_API_KEY !== "string" || !process.env.GROQ_API_KEY.trim()) {
    throw new Error("GROQ_API_KEY environment variable is not configured")
  }

  return new Groq({
    apiKey: process.env.GROQ_API_KEY,
  })
}

export async function matchJobsWithDescription(
  jobs: Job[],
  jobDescription: string,
  page = 1,
  pageSize = 5,
): Promise<MatchResponse> {
  try {
    const startIdx = (page - 1) * pageSize
    const endIdx = startIdx + pageSize
    const jobsToProcess = jobs.slice(startIdx, endIdx)

    const groq = getGroqClient()

    const matchPromises = jobsToProcess.map(async (job) => {
      try {
        const completion = await groq.chat.completions.create({
          messages: [
            {
              role: "system",
              content: `You are an expert at analyzing job descriptions and finding matches.
              Compare the target job description with the current job posting.
              Calculate a match score and identify matching and missing skills.
              Return ONLY a JSON object with this structure:
              {
                "matchScore": number (0-100),
                "matchingSkills": string[],
                "missingSkills": string[]
              }`,
            },
            {
              role: "user",
              content: `Compare these job descriptions and identify matches and gaps:

              TARGET JOB:
              ${jobDescription}

              CURRENT JOB POSTING:
              ${job.description}

              Return the JSON analysis.`,
            },
          ],
          model: "llama-3.3-70b-versatile",
          temperature: 0.3,
          max_tokens: 1000,
        })

        const response = completion.choices[0]?.message?.content

        if (!response) {
          throw new Error("No response from Groq")
        }

        // Extract JSON from response
        let cleaned = response.replace(/```json\s*/g, "").replace(/```\s*/g, "")
        const startIndex = cleaned.indexOf("{")
        const endIndex = cleaned.lastIndexOf("}")

        if (startIndex === -1 || endIndex === -1) {
          throw new Error("No JSON object found in response")
        }

        cleaned = cleaned.slice(startIndex, endIndex + 1)
        const analysis = JSON.parse(cleaned)

        return {
          ...job,
          matchScore: analysis.matchScore,
          matchingSkills: analysis.matchingSkills,
          missingSkills: analysis.missingSkills,
        }
      } catch (jobError) {
        console.error(`Error processing job ${job.id}:`, jobError)
        return null
      }
    })

    const matches = (await Promise.all(matchPromises)).filter(Boolean) as JobMatch[]
    matches.sort((a, b) => b.matchScore - a.matchScore)

    return {
      success: true,
      matches,
      total: jobs.length,
    }
  } catch (error) {
    console.error("Error matching jobs:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred while matching jobs",
    }
  }
}
