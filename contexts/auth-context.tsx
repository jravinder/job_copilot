"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          throw error
        }

        if (data?.session?.user) {
          setUser(data.session.user)
        }
      } catch (err) {
        console.error("Session check error:", err)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
      setLoading(false)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const signUp = async (
    email: string,
    password: string,
    name: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true)
      setError(null)

      // First, check if user already exists
      const checkResponse = await fetch("/api/auth/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const checkData = await checkResponse.json()

      if (checkData.exists) {
        return {
          success: false,
          error: "This email is already registered. Please try logging in.",
        }
      }

      // Proceed with signup
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: `${window.location.origin}/verify`,
        },
      })

      if (error) {
        throw error
      }

      if (!data?.user) {
        throw new Error("No user data received")
      }

      // Check if email confirmation is required
      if (data.user.identities?.length === 0) {
        return {
          success: false,
          error: "This email is already registered. Please try logging in.",
        }
      }

      return { success: true }
    } catch (error) {
      console.error("Signup error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Registration failed. Please try again.",
      }
    } finally {
      setLoading(false)
    }
  }

  // Update the signIn function to handle specific error cases
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)

      // First check if user exists in Supabase
      const checkResponse = await fetch("/api/auth/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const checkData = await checkResponse.json()

      if (!checkData.exists) {
        throw new Error("No account found with this email. Please sign up.")
      }

      if (!checkData.verified) {
        throw new Error("Please verify your email before logging in.")
      }

      // Attempt to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      })

      if (error) {
        // Handle specific error cases
        if (error.message.includes("Invalid login credentials")) {
          throw new Error("Invalid email or password. Please try again or reset your password.")
        }
        throw error
      }

      if (!data?.user) {
        throw new Error("No user data received")
      }

      // Store user data
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.full_name || email,
        }),
      )

      setUser(data.user)
      router.push("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      setError(error instanceof Error ? error.message : "Failed to sign in")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      localStorage.removeItem("user")
      setUser(null)
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
      setError(error instanceof Error ? error.message : "Failed to sign out")
    }
  }

  // Update the resetPassword function to be more robust
  const resetPassword = async (email: string) => {
    try {
      setLoading(true)
      setError(null)

      // First check if user exists
      const checkResponse = await fetch("/api/auth/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const checkData = await checkResponse.json()

      // Even if user doesn't exist, we'll still "send" the reset email
      // This prevents email enumeration attacks

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password/confirm`,
      })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error("Reset password error:", error)
      setError(error instanceof Error ? error.message : "Failed to send reset instructions")
      throw error
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signUp,
        signIn,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
