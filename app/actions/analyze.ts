"use server"

import { Groq } from "groq-sdk"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import type { AnalysisResponse, AIAnalysisResult } from "@/types/analysis"

function getGroqClient() {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY environment variable is not configured")
  }

  return new Groq({
    apiKey: process.env.GROQ_API_KEY,
  })
}

function extractJsonFromResponse(response: string): AIAnalysisResult {
  try {
    // Remove markdown code block syntax if present
    let cleaned = response.replace(/```json\s*/g, "").replace(/```\s*/g, "")

    // Find the first '{' and last '}'
    const startIndex = cleaned.indexOf("{")
    const endIndex = cleaned.lastIndexOf("}")

    if (startIndex === -1 || endIndex === -1) {
      throw new Error("No JSON object found in response")
    }

    // Extract just the JSON part
    cleaned = cleaned.slice(startIndex, endIndex + 1)

    // Parse the JSON
    const parsed = JSON.parse(cleaned)

    // Validate required fields
    if (
      typeof parsed.score !== "number" ||
      typeof parsed.position !== "string" ||
      typeof parsed.company !== "string" ||
      !Array.isArray(parsed.skills?.matching) ||
      !Array.isArray(parsed.skills?.missing) ||
      !Array.isArray(parsed.resumeSuggestions) ||
      typeof parsed.coverLetter !== "string" ||
      typeof parsed.coldEmail !== "string" ||
      typeof parsed.recruiterPitch !== "string" ||
      !Array.isArray(parsed.linkedinSuggestions) ||
      typeof parsed.companyInsights?.recentNews !== "string" ||
      typeof parsed.companyInsights?.culture !== "string" ||
      typeof parsed.companyInsights?.growthAreas !== "string" ||
      typeof parsed.companyInsights?.interviewFocus !== "string" ||
      typeof parsed.interviewReadiness !== "number"
    ) {
      throw new Error("Invalid response structure from AI")
    }

    return parsed
  } catch (error) {
    console.error("Error parsing AI response:", error)
    throw new Error("Failed to parse AI response")
  }
}

export async function analyzeContent(data: {
  resumeText: string
  jobDescription: string
  companyName: string
  notes?: string
}): Promise<AnalysisResponse> {
  try {
    const groq = getGroqClient()

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert AI career coach and job application analyst. Your task is to analyze resumes against job descriptions and provide structured insights.

          **Step 1: Extract Key Job Details**  
          - Identify the job position and company from the job description. If the company is missing, return "Unknown".

          **Step 2: Match Resume with Job Requirements**  
          - Compare the resume’s skills and experience with the job description.
          - Identify **matching** and **missing** skills.
          - Provide a fit **score (0-100%)**.

          **Step 3: Generate Application Assistance**  
          - Suggest **specific and detailed resume improvements** to increase the match score.
          - Draft a **detailed personalized cover letter** based on the job.
          - Provide a **cold email template** to contact the hiring manager.
          - Generate a **short recruiter pitch** for networking.
          - Generate a **detailed recruiter pitch** for initial screen.
          - Provide  **recommended coursera or other coureses** for missing skills and user input

          - Recommend **LinkedIn networking strategies** (who to connect with).

          **Step 4: Provide Company Insights**  
          - Summarize **recent company news** relevant to job applicants.
          - Describe **company culture** (based on industry & public data).
          - Highlight **growth areas** the company is investing in.
          - Identify **likely interview focus areas** based on job responsibilities.

          **Step 5: Evaluate Interview Readiness**  
          - Assign an **interview readiness score (0-100%)** based on resume alignment with job expectations.

          **Response Format (Strict JSON - No Extra Text or Markdown)**:
          {
            "score": number (0-100),
            "position": string (job title),
            "company": string (company name or "Unknown"),
            "hiringManager": string (hiring manager or "Unknown"),
            "skills": {
              "matching": string[],
              "missing": string[]
            },
            "resumeSuggestions": string[],
            "coverLetter": string,
            "coldEmail": string,
            "recruiterPitch": string,
            "detailedRecruiterPitch": string,
            "onlineCourses": string,
            "linkedinSuggestions": string[],
            "companyInsights": {
              "recentNews": string,
              "culture": string,
              "growthAreas": string,
              "interviewFocus": string
            },
            "interviewReadiness": number (0-100)
          }`,
        },
        {
          role: "user",
          content: `Analyze the following resume against the job description:

          **RESUME**:
          ${data.resumeText}

          **JOB DESCRIPTION**:
          ${data.jobDescription}

          **ADDITIONAL NOTES**:
          ${data.notes || "None provided"}
          `,
        },
      ],
      model: "llama3-70b-8192",
      temperature: 0.5, // Lower temperature for structured responses
      max_tokens: 3500, // Keeping response concise
    })

    const response = completion.choices[0]?.message?.content

    if (!response) {
      throw new Error("No response received from AI service")
    }

    // Parse and validate the response
    const analysis = extractJsonFromResponse(response)

    // Store in cookies for persistence
    cookies().set("lastAnalysis", JSON.stringify(analysis), {
      maxAge: 60 * 60 * 24, // 24 hours
    })

    revalidatePath("/results")

    return {
      success: true,
      data: analysis,
    }
  } catch (error) {
    console.error("Error in analyzeContent:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred during analysis",
    }
  }
}

