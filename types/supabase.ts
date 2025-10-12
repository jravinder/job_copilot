export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          created_at: string
          updated_at: string
          last_login: string | null
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
        }
      }
      analyses: {
        Row: {
          id: string
          user_id: string
          resume_text: string
          job_description: string
          company_name: string
          notes: string | null
          analysis_result: Json
          created_at: string
          updated_at: string
          status: "pending" | "completed" | "failed"
          position: string | null
          match_score: number | null
        }
        Insert: {
          id?: string
          user_id: string
          resume_text: string
          job_description: string
          company_name: string
          notes?: string | null
          analysis_result?: Json
          created_at?: string
          updated_at?: string
          status?: "pending" | "completed" | "failed"
          position?: string | null
          match_score?: number | null
        }
        Update: {
          id?: string
          user_id?: string
          resume_text?: string
          job_description?: string
          company_name?: string
          notes?: string | null
          analysis_result?: Json
          created_at?: string
          updated_at?: string
          status?: "pending" | "completed" | "failed"
          position?: string | null
          match_score?: number | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
