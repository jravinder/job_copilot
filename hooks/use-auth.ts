"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  name: string
  email?: string
  username?: string
}

export function useAuth(requireAuth = true) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem("user")

    if (!userData && requireAuth) {
      router.push("/login")
      return
    }

    if (userData) {
      setUser(JSON.parse(userData))
    }

    setLoading(false)
  }, [router, requireAuth])

  const logout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  return {
    user,
    loading,
    logout,
    isAuthenticated: !!user,
  }
}
