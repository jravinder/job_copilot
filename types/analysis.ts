export interface JobAnalysis {
  id: string
  userId: string
  timestamp: string
  position: string
  company: string
  score: number
  skills: {
    matching: string[]
    missing: string[]
  }
  resumeSuggestions: string[]
  coverLetter: string
  coldEmail: string
  linkedinSuggestions: string[]
  companyInsights: {
    recentNews: string
    culture: string
    growthAreas: string
    interviewFocus: string
  }
  interviewReadiness: number
  version: number
  status: "completed" | "pending" | "failed"
  metadata: {
    source?: string
    jobUrl?: string
    lastModified: string
    createdAt: string
  }
}

export interface AnalysisInput {
  resumeText: string
  jobDescription: string
  companyName: string
  notes?: string
}

export interface StoredAnalysis extends JobAnalysis {
  input: AnalysisInput
}

export interface AIAnalysisResult {
  companyName: string
  hiringManager: string
  matchScore: number
  matchingSkills: string[]
  missingSkills: string[]
  resumeSuggestions: string[]
  coverLetter: string
  coldEmail: string
  linkedinSuggestions: string[]
  companyInsights: {
    recentNews: string
    culture: string
    growthAreas: string
    interviewFocus: string
  }
  interviewReadiness: number
  position?: string
}

export interface AnalysisResponse {
  success: boolean
  data?: AIAnalysisResult
  error?: string
}
