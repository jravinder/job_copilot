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
  source: string
}

export type JobSource = "hn" | "linkedin" | "twitter"

export async function searchJobs(source: JobSource = "hn", query?: string): Promise<Job[]> {
  // Placeholder implementation.  Real implementation would fetch jobs from the specified source.
  return []
}
