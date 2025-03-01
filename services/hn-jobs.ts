interface HNJob {
  id: string
  title: string
  company: string
  location: string
  description: string
  salary?: string
  remote?: boolean
  url?: string
  posted: Date
  skills: string[]
}

// Function to extract job details from HN comment text
function parseJobPost(text: string): Partial<HNJob> {
  const job: Partial<HNJob> = {
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
      .replace(/Location:.*$/m, "")
      .replace(/Remote:.*$/m, "")
      .replace(/Salary:.*$/m, "")
      .replace(/Tech Stack:.*$/m, "")
      .trim()
  } catch (error) {
    console.error("Error parsing job post:", error)
  }

  return job
}

// Add caching
let cachedJobs: any[] | null = null
let lastFetchTime = 0
const CACHE_DURATION = 1000 * 60 * 30 // 30 minutes

export async function getHNJobs(): Promise<any[]> {
  // Return cached results if available and fresh
  if (cachedJobs && Date.now() - lastFetchTime < CACHE_DURATION) {
    return cachedJobs
  }

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

    const jobs = (await Promise.all(jobPromises)).filter(Boolean)

    // Update cache
    cachedJobs = jobs
    lastFetchTime = Date.now()

    return jobs
  } catch (error) {
    console.error("Error fetching HN jobs:", error)
    return cachedJobs || [] // Return cached jobs if available, empty array if not
  }
}

