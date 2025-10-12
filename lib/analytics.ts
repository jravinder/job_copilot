import { track } from "@vercel/analytics"

export const trackEvent = (name: string, properties?: Record<string, string | number | boolean>) => {
  track(name, properties)
}

// Predefined events
export const events = {
  RESUME_UPLOAD: "resume_upload",
  JOB_ANALYSIS: "job_analysis",
  CHAT_MESSAGE: "chat_message",
  COVER_LETTER_GENERATE: "cover_letter_generate",
  NETWORKING_TIPS: "networking_tips",
  INTERVIEW_PREP: "interview_prep",
  SKILL_GAP_ANALYSIS: "skill_gap_analysis",
} as const

export type AnalyticsEvent = (typeof events)[keyof typeof events]
