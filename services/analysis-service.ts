import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/supabase"
import type { AIAnalysisResult } from "@/types/analysis"

type Analysis = Database["public"]["Tables"]["analyses"]["Row"]
type InsertAnalysis = Database["public"]["Tables"]["analyses"]["Insert"]
type UpdateAnalysis = Database["public"]["Tables"]["analyses"]["Update"]

export async function createAnalysis(data: {
  userId: string
  resumeText: string
  jobDescription: string
  companyName: string
  notes?: string
}): Promise<Analysis> {
  const { data: analysis, error } = await supabase
    .from("analyses")
    .insert({
      user_id: data.userId,
      resume_text: data.resumeText,
      job_description: data.jobDescription,
      company_name: data.companyName,
      notes: data.notes,
      status: "pending",
    })
    .select()
    .single()

  if (error) throw error
  return analysis
}

export async function updateAnalysisResult(id: string, result: AIAnalysisResult): Promise<Analysis> {
  const { data: analysis, error } = await supabase
    .from("analyses")
    .update({
      analysis_result: result,
      status: "completed",
      position: result.position,
      match_score: result.score,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return analysis
}

export async function getUserAnalyses(userId: string): Promise<Analysis[]> {
  const { data: analyses, error } = await supabase
    .from("analyses")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return analyses
}

export async function getAnalysis(id: string): Promise<Analysis> {
  const { data: analysis, error } = await supabase.from("analyses").select("*").eq("id", id).single()

  if (error) throw error
  return analysis
}

export async function deleteAnalysis(id: string): Promise<void> {
  const { error } = await supabase.from("analyses").delete().eq("id", id)

  if (error) throw error
}
