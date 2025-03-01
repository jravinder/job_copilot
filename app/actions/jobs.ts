"use server"

import { Groq } from "groq-sdk"

export interface Job {
  id: string
  title: string
  company: string
  location: string
  description: string
  url?: string
  posted: Date
  remote?: boolean
  salary?: string
  skills?: string[]
}

export interface JobMatch extends Job {
  matchScore: number
  matchingSkills: string[]
  missingSkills: string[]
}

export interface JobSearchResponse {
  success: boolean
  jobs?: Job[]
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

// Function to extract job details from HN comment text
function parseJobPost(text: string): Partial<Job> {
  const job: Partial<Job> = {
    skills: [],
  }

  // Extract common patterns from job posts
  const patterns = {
    location: /Location: ([^\n]+)/i,
    remote: /Remote: ([^\n]+)/i,
    salary: /Salary: ([^\n]+)/i,
    skills: /Tech Stack:|Technologies:|Skills:([^\n]+)/i,
  }

  try {
    // Extract company name (usually at the start or in the first line)
    const companyMatch = text.match(/^([^|]+)\|/)
    if (companyMatch) {
      job.company = companyMatch[1].trim()
    }

    // Extract location
    const locationMatch = text.match(patterns.location)
    if (locationMatch) {
      job.location = locationMatch[1].trim()
    }

    // Check if remote
    const remoteMatch = text.match(patterns.remote)
    if (remoteMatch) {
      job.remote = remoteMatch[1].toLowerCase().includes("yes")
    }

    // Extract salary if available
    const salaryMatch = text.match(patterns.salary)
    if (salaryMatch) {
      job.salary = salaryMatch[1].trim()
    }

    // Extract skills
    const skillsMatch = text.match(patterns.skills)
    if (skillsMatch && skillsMatch[1]) {
      job.skills = skillsMatch[1]
        .split(/[,|]/)
        .map((skill) => skill.trim())
        .filter(Boolean)
    }

    // The rest is the description
    job.description = text
  } catch (error) {
    console.error("Error parsing job post:", error)
  }

  return job
}

export async function searchJobs(): Promise<JobSearchResponse> {
  try {
    // Fetch only the latest thread ID
    const response = await fetch(
      "https://hacker-news.firebaseio.com/v0/user/whoishiring/submitted.json?limitToFirst=1",
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      },
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const submissions = await response.json()
    if (!submissions || !submissions.length) {
      throw new Error("No submissions found")
    }

    const threadId = submissions[0]

    // Fetch thread details
    const threadResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${threadId}.json`)
    if (!threadResponse.ok) {
      throw new Error(`HTTP error! status: ${threadResponse.status}`)
    }

    const thread = await threadResponse.json()
    if (!thread || !thread.kids || !thread.kids.length) {
      throw new Error("No job posts found")
    }

    // Only fetch first 20 job posts to reduce API calls
    const jobPromises = thread.kids.slice(0, 20).map(async (commentId: number) => {
      try {
        const commentResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${commentId}.json`)
        if (!commentResponse.ok) {
          return null
        }

        const comment = await commentResponse.json()
        if (comment?.text) {
          return {
            id: comment.id.toString(),
            title: "Position Available",
            description: comment.text,
            posted: new Date(comment.time * 1000),
            // Basic parsing of the comment text
            ...parseJobPost(comment.text),
          }
        }
      } catch (error) {
        console.error(`Error fetching job ${commentId}:`, error)
      }
      return null
    })

    const jobs = (await Promise.all(jobPromises)).filter(Boolean) as Job[]

    return {
      success: true,
      jobs,
    }
  } catch (error) {
    console.error("Error fetching HN jobs:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch jobs",
    }
  }
}

export async function matchJobWithDescription(job: Job, jobDescription: string): Promise<JobMatch | null> {
  try {
    const groq = getGroqClient()

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
  } catch (error) {
    console.error(`Error matching job ${job.id}:`, error)
    return null
  }
}

