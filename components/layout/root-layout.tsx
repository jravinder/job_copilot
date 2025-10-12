"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { UserCircle } from "lucide-react"
import Link from "next/link"

interface RootLayoutProps {
  children: React.ReactNode
  className?: string
  isAuthenticated?: boolean
  userName?: string
  onLogout?: () => void
}

export function RootLayout({ children, className, isAuthenticated = false, userName = "", onLogout }: RootLayoutProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <div className={cn("flex min-h-screen flex-col", className)}>
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <div className="bg-blue-600 text-white p-1.5 rounded-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M20 7h-3a2 2 0 0 1-2-2V2" />
                    <path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z" />
                    <path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8" />
                  </svg>
                </div>
                <span className="font-semibold">Personal Job CoPilot</span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 mr-2">
                    <UserCircle className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{userName}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={onLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/register">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </header>
        {children}
      </div>
    </ThemeProvider>
  )
}
