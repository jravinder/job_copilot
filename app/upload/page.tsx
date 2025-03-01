"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function UploadPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<{ name: string } | null>(null)
  const [resumeText, setResumeText] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [notes, setNotes] = useState("")
  const [hasExistingData, setHasExistingData] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(userData))

    // Load any existing data
    const resumeData = localStorage.getItem("resumeData")
    if (resumeData) {
      const data = JSON.parse(resumeData)
      setResumeText(data.resumeText || "")
      setJobDescription(data.jobDescription || "")
      setCompanyName(data.companyName || "")
      setNotes(data.notes || "")
      setHasExistingData(true)
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!resumeText.trim() || !jobDescription.trim() || !companyName.trim()) {
      setError("Please provide your resume, the job description, and company name")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Store the form data
      const formData = {
        resumeText,
        jobDescription,
        companyName,
        notes,
        timestamp: new Date().toISOString(),
      }

      localStorage.setItem("resumeData", JSON.stringify(formData))
      router.push("/analysis")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while saving your data")
    } finally {
      setIsLoading(false)
    }
  }

  const clearForm = () => {
    setResumeText("")
    setJobDescription("")
    setCompanyName("")
    setNotes("")
    setHasExistingData(false)
    localStorage.removeItem("resumeData")
  }

  if (!user) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <div className="flex items-center justify-between w-full">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-primary">JobMatch</span> AI Coach
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Welcome, {user.name}</span>
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
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            New Analysis
          </h1>
          <p className="text-gray-600">Paste your resume and the job description to get personalized insights.</p>
        </div>

        {hasExistingData && (
          <Alert className="mb-6">
            <AlertDescription className="flex items-center justify-between">
              <span>Using content from your previous analysis. Want to start fresh?</span>
              <Button variant="outline" size="sm" onClick={clearForm}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Form
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <Card className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Upload Information</CardTitle>
              <CardDescription>
                Provide your resume content and the job description you want to analyze.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && <div className="p-3 text-sm bg-red-50 text-red-500 rounded-md">{error}</div>}

              <div className="space-y-2">
                <Label htmlFor="resume">Your Resume</Label>
                <div className="relative">
                  <Textarea
                    id="resume"
                    placeholder="Paste your resume text here..."
                    className="min-h-[200px]"
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Copy and paste the content of your resume, including all sections.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobDescription">Job Description</Label>
                <Textarea
                  id="jobDescription"
                  placeholder="Paste the job description here..."
                  className="min-h-[200px]"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Copy and paste the full job description, including requirements and responsibilities.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="Enter the company name..."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter the company name to get personalized insights and templates.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional notes or context..."
                  className="min-h-[100px]"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Provide any extra information that might be helpful for the analysis.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={clearForm} disabled={!hasExistingData}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Form
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Continue to Analysis"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
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

