"use client"

import { useEffect } from "react"

import { supabase } from "./supabase"
import type { User } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

type Tables = Database["public"]["Tables"]

/**
 * Generic type for table rows
 */
type TableRow<T extends keyof Tables> = Tables[T]["Row"]

/**
 * Generic type for insertable data
 */
type InsertData<T extends keyof Tables> = Tables[T]["Insert"]

/**
 * Generic type for updatable data
 */
type UpdateData<T extends keyof Tables> = Tables[T]["Update"]

/**
 * Helper class for Supabase queries
 */
export class SupabaseHelper {
  /**
   * Check if a user exists and is verified
   */
  static async checkUser(email: string) {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("email", email).single()

      if (error) {
        throw error
      }

      return {
        exists: !!data,
        user: data,
      }
    } catch (error) {
      console.error("Error checking user:", error)
      return {
        exists: false,
        user: null,
      }
    }
  }

  /**
   * Get user profile by ID
   */
  static async getUserProfile(userId: string): Promise<TableRow<"users"> | null> {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error("Error getting user profile:", error)
      return null
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(userId: string, updates: UpdateData<"users">) {
    try {
      const { data, error } = await supabase.from("users").update(updates).eq("id", userId).select().single()

      if (error) {
        throw error
      }

      return { success: true, data }
    } catch (error) {
      console.error("Error updating user profile:", error)
      return { success: false, error }
    }
  }

  /**
   * Get analyses for a user
   */
  static async getUserAnalyses(userId: string): Promise<TableRow<"analyses">[]> {
    try {
      const { data, error } = await supabase
        .from("analyses")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error("Error getting user analyses:", error)
      return []
    }
  }

  /**
   * Create a new analysis
   */
  static async createAnalysis(data: InsertData<"analyses">) {
    try {
      const { data: analysis, error } = await supabase.from("analyses").insert(data).select().single()

      if (error) {
        throw error
      }

      return { success: true, data: analysis }
    } catch (error) {
      console.error("Error creating analysis:", error)
      return { success: false, error }
    }
  }

  /**
   * Update an analysis
   */
  static async updateAnalysis(id: string, updates: UpdateData<"analyses">) {
    try {
      const { data, error } = await supabase.from("analyses").update(updates).eq("id", id).select().single()

      if (error) {
        throw error
      }

      return { success: true, data }
    } catch (error) {
      console.error("Error updating analysis:", error)
      return { success: false, error }
    }
  }

  /**
   * Delete an analysis
   */
  static async deleteAnalysis(id: string) {
    try {
      const { error } = await supabase.from("analyses").delete().eq("id", id)

      if (error) {
        throw error
      }

      return { success: true }
    } catch (error) {
      console.error("Error deleting analysis:", error)
      return { success: false, error }
    }
  }

  /**
   * Get a single analysis by ID
   */
  static async getAnalysis(id: string): Promise<TableRow<"analyses"> | null> {
    try {
      const { data, error } = await supabase.from("analyses").select("*").eq("id", id).single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error("Error getting analysis:", error)
      return null
    }
  }

  /**
   * Helper method for auth state
   */
  static async getAuthUser(): Promise<User | null> {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error) {
        throw error
      }

      return user
    } catch (error) {
      console.error("Error getting auth user:", error)
      return null
    }
  }

  /**
   * Generic query builder with type safety
   */
  static query<T extends keyof Tables>(table: T) {
    return supabase.from(table)
  }
}

/**
 * Custom hook for real-time subscriptions
 */
export function useSupabaseSubscription<T extends keyof Tables>(
  table: T,
  callback: (payload: TableRow<T>) => void,
  filter?: { column: string; value: any },
) {
  useEffect(() => {
    const query = supabase
      .channel("table_db_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: table,
          ...(filter ? { filter: `${filter.column}=eq.${filter.value}` } : {}),
        },
        (payload) => {
          callback(payload.new as TableRow<T>)
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(query)
    }
  }, [table, callback, filter])
}

// Export commonly used types
export type { TableRow, InsertData, UpdateData }
