"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

interface AuthHeaderProps {
  userName: string
  onLogout: () => void
}

export function AuthHeader({ userName, onLogout }: AuthHeaderProps) {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between w-full">
          <Link href="/" className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-xl font-bold">
              Personal Job CoPilot
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Welcome, {userName}</span>
            <Button variant="outline" size="sm" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
