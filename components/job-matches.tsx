"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Loader2, MapPin, Globe } from "lucide-react"
import type { JobMatch } from "@/app/actions/jobs"
import { searchJobs, matchJobWithDescription } from "@/app/actions/jobs"

interface JobMatchesProps {
  jobDescription: string
}

export function JobMatches({ jobDescription }: JobMatchesProps) {
  const [matches, setMatches] = useState<JobMatch[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadMatches = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // First, fetch all jobs
      const result = await searchJobs()

      if (!result.success || !result.jobs) {
        throw new Error(result.error || "Failed to fetch jobs")
      }

      // Then, analyze each job
      const matchPromises = result.jobs.map((job) => matchJobWithDescription(job, jobDescription))
      const jobMatches = (await Promise.all(matchPromises)).filter(Boolean) as JobMatch[]

      // Sort by match score
      jobMatches.sort((a, b) => b.matchScore - a.matchScore)

      setMatches(jobMatches)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load job matches")
      console.error("Error loading matches:", err)
    } finally {
      setIsLoading(false)
    }
  }, [jobDescription])

  useEffect(() => {
    loadMatches()
  }, [loadMatches])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Similar Job Matches</h2>
        <Button onClick={loadMatches} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            "Refresh"
          )}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="p-4 text-sm bg-destructive/10 text-destructive rounded-md">{error}</div>
      ) : matches.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No matching jobs found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {matches.map((job) => (
            <Card key={job.id} className="relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  background: `linear-gradient(90deg, hsl(var(--primary)) ${job.matchScore}%, transparent ${
                    job.matchScore
                  }%)`,
                }}
              />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{job.title}</CardTitle>
                    <CardDescription>{job.company}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-lg font-bold">
                    {job.matchScore}% Match
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {job.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </span>
                    )}
                    {job.remote && (
                      <span className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        Remote
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Matching Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {job.matchingSkills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="bg-primary/10">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-1">Missing Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {job.missingSkills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="bg-destructive/10">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Match Score</h4>
                    <Progress value={job.matchScore} className="h-2" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">
                  View Full Description
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

