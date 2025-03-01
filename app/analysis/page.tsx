"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"
import { analyzeContent } from "../actions/analyze"
import type { AIAnalysisResult } from "@/types/analysis"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ResumeData {
  resumeText: string
  jobDescription: string
  notes?: string
  analysis?: AIAnalysisResult | null
  timestamp?: string
}

// Initialize with empty arrays and objects to prevent undefined errors
const initialAnalysisResult: AIAnalysisResult = {
  companyName: "",
  hiringManager: "",
  matchScore: 0,
  matchingSkills: [],
  missingSkills: [],
  resumeSuggestions: [],
  coverLetter: "",
  coldEmail: "",
  linkedinSuggestions: [],
  companyInsights: {
    recentNews: "",
    culture: "",
    growthAreas: "",
    interviewFocus: "",
  },
  interviewReadiness: 0,
}

// Analysis steps for the loading state
const analysisSteps = [
  "Reading resume content...",
  "Analyzing job requirements...",
  "Identifying skill matches...",
  "Generating recommendations...",
  "Preparing detailed insights...",
]

export default function AnalysisPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; id: string } | null>(null)
  const [resumeData, setResumeData] = useState<ResumeData>({
    resumeText: "",
    jobDescription: "",
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Check if user is logged in
      const userData = localStorage.getItem("user")
      if (!userData) {
        router.push("/login")
        return
      }
      setUser(JSON.parse(userData))

      // Get resume data from localStorage
      const storedResumeData = localStorage.getItem("resumeData")
      if (!storedResumeData) {
        router.push("/upload")
        return
      }

      const parsedData = JSON.parse(storedResumeData)

      // Validate required fields
      if (!parsedData.resumeText?.trim() || !parsedData.jobDescription?.trim()) {
        router.push("/upload")
        return
      }

      // Set the data only if all required fields are present
      setResumeData({
        ...parsedData,
        analysis: parsedData.analysis || initialAnalysisResult,
      })
    } catch (err) {
      console.error("Error initializing page:", err)
      setError("Failed to load resume data")
      router.push("/upload")
    }
  }, [router])

  const startAnalysis = async () => {
    // Clear any existing errors
    setError(null)

    // Validate required data
    if (!resumeData) {
      setError("No resume data found. Please upload your resume and job description first.")
      return
    }

    const { resumeText, jobDescription } = resumeData

    if (!resumeText?.trim() || !jobDescription?.trim()) {
      setError("Please ensure both resume and job description are provided")
      return
    }

    setIsAnalyzing(true)
    setCurrentStep(0)

    try {
      // Start step animation
      const stepInterval = setInterval(() => {
        setCurrentStep((current) => {
          if (current >= analysisSteps.length - 1) {
            return current
          }
          return current + 1
        })
      }, 2000)

      const result = await analyzeContent({
        resumeText,
        jobDescription,
        notes: resumeData.notes,
      })

      clearInterval(stepInterval)

      if (!result.success) {
        throw new Error(result.error || "Analysis failed")
      }

      if (!result.data) {
        throw new Error("No analysis data received")
      }

      // Update localStorage with the latest analysis
      localStorage.setItem(
        "resumeData",
        JSON.stringify({
          ...resumeData,
          analysis: result.data,
        }),
      )

      router.push("/results")
    } catch (err) {
      console.error("Analysis error:", err)
      setError(
        err instanceof Error ? err.message : "An error occurred while processing your request. Please try again.",
      )
    } finally {
      setIsAnalyzing(false)
      setCurrentStep(0)
    }
  }

  if (!user) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  if (!resumeData?.resumeText || !resumeData?.jobDescription) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Missing Data</CardTitle>
            <CardDescription>Please upload your resume and job description first.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/upload")} className="w-full">
              Go to Upload Page
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <div className="flex items-center justify-between w-full">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-primary">Job CoPilot</span> AI Coach
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

      <main className="flex-1 p-12">
        <div className="mb-8 max-w-[1800px] mx-auto">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mb-2">Resume Analysis</h1>
          <p className="text-muted-foreground">Review your inputs and start the analysis</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              {error}
              {error.includes("environment variable") && (
                <div className="mt-2 text-sm">
                  Please ensure the GROQ_API_KEY environment variable is properly configured in your Vercel project
                  settings.
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 lg:grid-cols-2 max-w-[1800px] mx-auto">
          {/* Resume Content Card */}
          <Card>
            <CardHeader>
              <CardTitle>Resume Content</CardTitle>
              <CardDescription>Your uploaded resume text</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap">
                <Textarea
                  value={resumeData.resumeText}
                  onChange={(e) => {
                    setResumeData({
                      ...resumeData,
                      resumeText: e.target.value,
                    })
                  }}
                  className="min-h-[400px] mb-4"
                  placeholder="No resume content found"
                />
              </div>
            </CardContent>
          </Card>

          {/* Job Description Card */}
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
              <CardDescription>The position you're applying for</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap">
                <Textarea
                  value={resumeData.jobDescription}
                  onChange={(e) => {
                    setResumeData({
                      ...resumeData,
                      jobDescription: e.target.value,
                    })
                  }}
                  className="min-h-[400px]"
                  placeholder="No job description found"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Status */}
        <Card className="mt-6 max-w-[1800px] mx-auto">
          <CardHeader>
            <CardTitle>Analysis Status</CardTitle>
            <CardDescription>
              {isAnalyzing
                ? "AI is analyzing your application materials"
                : "Ready to analyze your job application materials"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isAnalyzing ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span className="font-medium">{analysisSteps[currentStep]}</span>
                </div>
                <div className="space-y-2">
                  {analysisSteps.map((step, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2 text-sm ${
                        index <= currentStep ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      <div
                        className={`h-2 w-2 rounded-full ${
                          index < currentStep
                            ? "bg-primary"
                            : index === currentStep
                              ? "animate-pulse bg-primary"
                              : "bg-muted"
                        }`}
                      />
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {error ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">{error}</div>
                    <div className="flex gap-4">
                      <Button onClick={startAnalysis} className="w-full sm:w-auto">
                        Retry Analysis
                      </Button>
                      <Button variant="outline" onClick={() => setError(null)} className="w-full sm:w-auto">
                        Clear Error
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-muted-foreground">
                      Click analyze to start the AI-powered analysis of your application materials. This process
                      typically takes 30-60 seconds.
                    </p>
                    <Button
                      onClick={startAnalysis}
                      disabled={!resumeData?.resumeText || !resumeData?.jobDescription}
                      className="w-full sm:w-auto"
                    >
                      Start Analysis
                    </Button>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (resumeData) {
                localStorage.setItem("resumeData", JSON.stringify(resumeData))
                startAnalysis()
              }
            }}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Update & Analyze"
            )}
          </Button>
        </CardFooter>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Job CoPilot AI Coach. All rights reserved.
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

