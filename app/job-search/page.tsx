"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Briefcase, MapPin, Globe, Loader2 } from "lucide-react"
import { searchJobs } from "@/app/actions/jobs"
import type { Job } from "@/app/actions/jobs"

export default function JobSearchPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string } | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const loadJobs = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await searchJobs()
      if (!result.success) {
        throw new Error(result.error || "Failed to load jobs")
      }
      setJobs(result.jobs || [])
    } catch (err) {
      setError("Failed to load jobs. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <div className="flex items-center justify-between w-full">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-primary">JobMatch</span> AI Coach
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Welcome, {user?.name}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                localStorage.removeItem("user")
                router.push("/login")
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-12">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Job Search</h1>
              <p className="text-muted-foreground">Browse recent job postings from Hacker News</p>
            </div>
            <Button onClick={loadJobs} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Refresh Jobs"
              )}
            </Button>
          </div>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">{error}</div>}

        {!jobs.length && !isLoading ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <Briefcase className="mx-auto h-8 w-8 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Jobs Loaded</h3>
                <p className="text-muted-foreground mb-4">Click the refresh button to load recent job postings</p>
                <Button onClick={loadJobs}>Load Jobs</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <Card key={job.id}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
                    <CardTitle className="text-lg">{job.company || "Company Name"}</CardTitle>
                    {job.salary && (
                      <Badge variant="secondary" className="whitespace-nowrap">
                        {job.salary}
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    {job.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </div>
                    )}
                    {job.remote && (
                      <div className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        Remote
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <div className="line-clamp-4" dangerouslySetInnerHTML={{ __html: job.description }} />
                  </div>
                  {job.skills?.length > 0 && (
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-1">
                        {job.skills.map((skill: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} JobMatch AI Coach. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

