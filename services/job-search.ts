import type { Job } from "@/app/actions/jobs"
import { searchJobs as searchJobsAction } from "@/app/actions/jobs"

export type JobSource = "hn" | "linkedin" | "twitter"

export async function searchJobs(source: JobSource = "hn", query?: string): Promise<Job[]> {
  switch (source) {
    case "hn":
      const result = await searchJobsAction()
      return result.success && result.jobs ? result.jobs : []

    case "linkedin":
      // TODO: Implement LinkedIn API integration
      return []

    case "twitter":
      // TODO: Implement Twitter API integration
      return []

    default:
      return []
  }
}

