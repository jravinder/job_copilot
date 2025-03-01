"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, Copy, MapPin, Globe, Loader2, Bot } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PanelLeftOpen, Search } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import type { Job } from "@/services/job-search"
import { searchJobs } from "@/services/job-search"
import { ContentSidebar } from "@/components/content-sidebar"

// Add these color constants at the top of the file
const MUIColors = {
  primary: {
    main: "#1976d2",
    light: "#42a5f5",
    dark: "#1565c0",
    50: "#e3f2fd",
    100: "#bbdefb",
  },
  purple: {
    main: "#7b1fa2",
    light: "#9c27b0",
    dark: "#6a1b9a",
    50: "#f3e5f5",
    100: "#e1bee7",
  },
  amber: {
    main: "#ff8f00",
    light: "#ffa726",
    dark: "#f57c00",
    50: "#fff8e1",
    100: "#ffecb3",
  },
  error: {
    main: "#d32f2f",
    light: "#ef5350",
    dark: "#c62828",
    50: "#ffebee",
    100: "#ffcdd2",
  },
}

// Define the types for the analysis results and resume data
interface AIAnalysisResult {
  score: number
  skills: {
    matching: string[]
    missing: string[]
  }
  resumeSuggestions: string[]
  coverLetter: string
  coldEmail: string
  companyInsights: {
    recentNews: string
    culture: string
    growthAreas: string
    interviewFocus: string
  }
  linkedinSuggestions: string[]
  interviewReadiness: number
  position: string
  recruiterPitch: string
  onlineCourses: string // Add this line
}

// Add this interface near your other interfaces
interface EditableContent {
  resumeText: string
  jobDescription: string
  companyName: string
  notes?: string
}

interface ResumeData {
  resumeText: string
  jobDescription: string
  companyName: string
  analysis?: AIAnalysisResult // Optional, as it might not be immediately available
}

// Define the initial state for the analysis results
const initialAnalysisResult: AIAnalysisResult = {
  score: 0,
  skills: {
    matching: [],
    missing: [],
  },
  resumeSuggestions: [],
  coverLetter: "",
  coldEmail: "",
  companyInsights: {
    recentNews: "",
    culture: "",
    growthAreas: "",
    interviewFocus: "",
  },
  linkedinSuggestions: [],
  interviewReadiness: 0,
  position: "",
  recruiterPitch: "",
  onlineCourses: "", // Add this line
}

// Mock AI analysis results
const generateMockResults = (resumeText: string, jobDescription: string, companyName: string) => {
  // This would be replaced with actual AI analysis in a real implementation
  const score = Math.floor(Math.random() * 31) + 70 // Random score between 70-100

  const skills = {
    matching: ["JavaScript", "React", "TypeScript", "CSS", "HTML"],
    missing: ["Docker", "Kubernetes", "AWS", "GraphQL"],
  }

  const resumeSuggestions = [
    "Add more quantifiable achievements to highlight your impact",
    "Include your recent project that used React and TypeScript",
    "Highlight your experience with team collaboration tools",
  ]

  const coverLetter = `Dear Hiring Manager,

I am writing to express my interest in the [Position] role at ${companyName}. With my background in web development and experience with React, JavaScript, and TypeScript, I believe I would be a valuable addition to your team.

Throughout my career, I have focused on building responsive, user-friendly web applications. In my previous role at [Previous Company], I successfully led the development of a customer-facing portal that improved user engagement by 35%.

I am particularly drawn to ${companyName}'s mission to [company mission/values]. Your focus on [specific aspect of company] aligns perfectly with my professional interests and expertise.

I would welcome the opportunity to discuss how my skills and experience can contribute to your team's success. Thank you for considering my application.

Sincerely,
[Your Name]`

  const coldEmail = `Subject: Experienced [Your Role] Interested in [Position] at ${companyName}

Hi [Recruiter's Name],

I hope this email finds you well. I recently came across the [Position] opening at ${companyName} and was immediately drawn to the opportunity.

My background includes [X years] of experience in [relevant field], with specific expertise in [key skills that match the job]. I've successfully [brief achievement relevant to the role].

I'm particularly impressed by ${companyName}'s [mention something specific about the company that interests you]. I believe my skills in [relevant skills] would make me a great fit for your team.

Would you be available for a brief conversation to discuss how my experience aligns with what you're looking for? I've attached my resume for your review.

Thank you for your consideration. I look forward to potentially connecting.

Best regards,
[Your Name]
[Your Phone]
[Your LinkedIn]`

  const companyInsights = {
    recentNews: `${companyName} recently raised $5M in Series A funding`,
    culture: `${companyName} is known for collaborative environment and work-life balance`,
    growthAreas: "Expanding their AI and machine learning capabilities",
    interviewFocus: "Technical skills, problem-solving, and cultural fit",
  }

  const linkedinSuggestions = [
    `Connect with ${companyName}'s hiring manager, [Name], and mention your interest in the role`,
    `Follow ${companyName}'s company page to stay updated on news and job postings`,
    "Engage with recent company posts to increase visibility",
  ]

  const recruiterPitch = `Hi, I'm [Your Name], a [Your Profession] with [X years] of experience in [Relevant Field]. I'm passionate about [Specific Area of Interest] and have a proven track record of [Key Achievement]. I'm eager to learn more about opportunities at ${companyName} and how my skills can contribute to your team's success.`

  return {
    score,
    skills,
    resumeSuggestions,
    coverLetter,
    coldEmail,
    companyInsights,
    linkedinSuggestions,
    interviewReadiness: Math.floor(Math.random() * 21) + 70, // Random score between 70-90
    position: "Software Engineer",
    recruiterPitch,
    onlineCourses: "React Course on Coursera\nNode.js Course on Udemy",
  }
}

// Mock analyzeResume function
const analyzeResume = async (formData: FormData) => {
  // Simulate an API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  const resumeText = formData.get("resumeText") as string
  const jobDescription = formData.get("jobDescription") as string
  const companyName = formData.get("companyName") as string

  if (!resumeText || !jobDescription || !companyName) {
    return { success: false, error: "Missing required data" }
  }

  const mockResults = generateMockResults(resumeText, jobDescription, companyName)
  return { success: true, data: mockResults }
}

export default function ResultsPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string } | null>(null)
  const [results, setResults] = useState<AIAnalysisResult>(initialAnalysisResult)
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  // In your ResultsPage component, add these state variables
  const [isEditing, setIsEditing] = useState(false)
  const [editableContent, setEditableContent] = useState<EditableContent>({
    resumeText: "",
    jobDescription: "",
    companyName: "",
    notes: "",
  })

  const [showJobSearch, setShowJobSearch] = useState(false)
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoadingJobs, setIsLoadingJobs] = useState(false)

  // Add this function to load jobs
  const loadJobs = async () => {
    setIsLoadingJobs(true)
    try {
      const fetchedJobs = await searchJobs("hn")
      setJobs(fetchedJobs)
    } catch (error) {
      console.error("Error loading jobs:", error)
    } finally {
      setIsLoadingJobs(false)
    }
  }

  // Add this function inside your ResultsPage component
  const handleEdit = async () => {
    try {
      const formData = new FormData()
      formData.append("resumeText", editableContent.resumeText)
      formData.append("jobDescription", editableContent.jobDescription)
      formData.append("companyName", editableContent.companyName)
      if (editableContent.notes) {
        formData.append("notes", editableContent.notes)
      }

      // Store the updated content
      localStorage.setItem("resumeData", JSON.stringify(editableContent))

      // Perform new analysis
      const result = await analyzeResume(formData)

      if (result.success && result.data) {
        setResults({
          ...initialAnalysisResult,
          ...result.data,
        })
        setIsEditing(false)
      } else {
        throw new Error(result.error || "Analysis failed")
      }
    } catch (error) {
      console.error("Error updating analysis:", error)
      // You might want to show an error message to the user here
    }
  }

  // Update the useEffect to initialize editableContent
  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(userData))

    // Get resume data from localStorage
    const storedResumeData = localStorage.getItem("resumeData")
    if (storedResumeData) {
      const parsedResumeData = JSON.parse(storedResumeData)
      setResumeData(parsedResumeData)
      setEditableContent({
        resumeText: parsedResumeData.resumeText || "",
        jobDescription: parsedResumeData.jobDescription || "",
        companyName: parsedResumeData.companyName || "",
        notes: parsedResumeData.notes || "",
      })
    } else {
      router.push("/upload")
      return
    }

    // Initialize results with default values and then override with actual data
    setResults({
      ...initialAnalysisResult,
      ...(JSON.parse(storedResumeData).analysis || {}),
    })
  }, [router])

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  if (!user || !results || !resumeData) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  // Inside your ResultsPage component, update the return statement
  return (
    <>
      <ContentSidebar
        resumeText={resumeData?.resumeText || ""}
        jobDescription={resumeData?.jobDescription || ""}
        onUpdateResume={(text) => {
          if (resumeData) {
            setResumeData({
              ...resumeData,
              resumeText: text,
            })
          }
        }}
        onUpdateJobDescription={(text) => {
          if (resumeData) {
            setResumeData({
              ...resumeData,
              jobDescription: text,
            })
          }
        }}
      />

      <div className="flex-1">
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold mb-2">Analysis Results</h1>
              <p className="text-muted-foreground">
                {results.position && resumeData.companyName ? (
                  <>
                    <span className="font-medium">{results.position}</span> at{" "}
                    <span className="font-medium">{resumeData.companyName}</span>
                  </>
                ) : (
                  resumeData.companyName
                )}
              </p>
            </div>
            <div className="flex gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">
                    <PanelLeftOpen className="h-4 w-4 mr-2" />
                    Edit Content
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[400px] sm:w-[540px]">
                  <SheetHeader>
                    <SheetTitle>Edit Application Content</SheetTitle>
                  </SheetHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="resumeText">Resume</Label>
                      <Textarea
                        id="resumeText"
                        value={editableContent.resumeText}
                        onChange={(e) => setEditableContent({ ...editableContent, resumeText: e.target.value })}
                        className="min-h-[300px]"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="jobDescription">Job Description</Label>
                      <Textarea
                        id="jobDescription"
                        value={editableContent.jobDescription}
                        onChange={(e) => setEditableContent({ ...editableContent, jobDescription: e.target.value })}
                        className="min-h-[300px]"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={editableContent.companyName}
                        onChange={(e) => setEditableContent({ ...editableContent, companyName: e.target.value })}
                      />
                    </div>
                    <Button onClick={handleEdit}>Update Analysis</Button>
                  </div>
                </SheetContent>
              </Sheet>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">
                    <Search className="h-4 w-4 mr-2" />
                    Find Jobs
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[400px] sm:w-[540px]">
                  <SheetHeader>
                    <SheetTitle>Job Search</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-2 my-4">
                      <Input placeholder="Search jobs..." className="flex-1" />
                      <Button onClick={loadJobs} disabled={isLoadingJobs}>
                        {isLoadingJobs ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          "Search"
                        )}
                      </Button>
                    </div>
                    <Separator className="my-4" />
                    <ScrollArea className="flex-1">
                      <div className="grid gap-4 pr-4">
                        {jobs.map((job) => (
                          <Card key={job.id} className="relative">
                            <CardHeader>
                              <CardTitle className="text-lg">{job.title}</CardTitle>
                              <CardDescription>{job.company}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                {job.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {job.location}
                                  </span>
                                )}
                                {job.remote && (
                                  <span className="flex items-center gap-1">
                                    <Globe className="h-3 w-3" />
                                    Remote
                                  </span>
                                )}
                                <Badge variant="secondary" className="ml-auto">
                                  {job.source.toUpperCase()}
                                </Badge>
                              </div>
                              <div className="line-clamp-3 text-sm">{job.description}</div>
                              {job.skills && job.skills.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {job.skills.map((skill, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </CardContent>
                            <CardFooter>
                              <Button
                                className="w-full"
                                onClick={() => {
                                  setEditableContent({
                                    ...editableContent,
                                    jobDescription: job.description,
                                    companyName: job.company,
                                  })
                                }}
                              >
                                Analyze This Job
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </SheetContent>
              </Sheet>

              <Button
                onClick={() => {
                  // Store current job and resume data for chat
                  localStorage.setItem(
                    "chatContext",
                    JSON.stringify({
                      resumeText: resumeData.resumeText,
                      jobDescription: resumeData.jobDescription,
                      companyName: resumeData.companyName,
                      position: results.position,
                    }),
                  )
                  router.push("/chat")
                }}
              >
                <Bot className="h-4 w-4 mr-2" />
                Chat
              </Button>
            </div>
          </div>

          {/* Job Score Section - Now full width at the top */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-[1fr_2fr] gap-6">
                <div className="flex flex-col items-center justify-center text-center">
                  <h3 className="text-lg font-semibold mb-4">Match Score</h3>
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle
                        className="text-muted stroke-current"
                        strokeWidth="12"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                      />
                      {/* Score circle with dynamic color based on score */}
                      <circle
                        style={{
                          stroke:
                            results.score >= 80
                              ? MUIColors.primary.main
                              : results.score >= 60
                                ? MUIColors.amber.main
                                : MUIColors.error.main,
                          transition: "all 1000ms ease-in-out",
                        }}
                        strokeWidth="12"
                        strokeLinecap="round"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                        strokeDasharray={`${results.score * 2.51} 251`}
                        strokeDashoffset="0"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <div
                        className="text-3xl font-bold"
                        style={{
                          color:
                            results.score >= 80
                              ? MUIColors.primary.main
                              : results.score >= 60
                                ? MUIColors.amber.main
                                : MUIColors.error.main,
                        }}
                      >
                        {results.score}%
                      </div>
                      <div className="text-xs text-muted-foreground"></div>
                    </div>
                    {/* Decorative outer ring with gradient */}
                    <div
                      className="absolute inset-[-4px] rounded-full border-4 border-transparent animate-[spin_3s_linear_infinite] blur-[2px]"
                      style={{
                        background: `linear-gradient(to right, ${MUIColors.primary.main}33, ${MUIColors.amber.main}33, ${MUIColors.error.main}33)`,
                      }}
                    />
                  </div>
                  <div className="mt-4 text-sm">
                    {results.score >= 80
                      ? "Excellent match! You're a strong candidate."
                      : results.score >= 60
                        ? "Good match! With a few tweaks, you'll be a top candidate."
                        : "Moderate match. Follow our suggestions to improve your chances."}
                  </div>
                </div>

                <div className="grid gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Matching Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {results.skills.matching.map((skill, index: number) => (
                        <Badge key={index} variant="outline" className="bg-primary/10">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Missing Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {results.skills.missing.map((skill, index: number) => (
                        <Badge key={index} variant="outline" className="bg-destructive/10">
                          <XCircle className="h-3 w-3 mr-1" />
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Course Recommendations</h3>
                    <div className="p-4 rounded-md border bg-muted/50">
                      <p className="text-sm whitespace-pre-line">{results.onlineCourses}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Interview Readiness</h3>
                    <Progress value={results.interviewReadiness} className="h-2" />
                    <p className="text-sm text-muted-foreground mt-2">
                      {results.interviewReadiness}% -{" "}
                      {results.interviewReadiness >= 80 ? "Well prepared for interviews" : "Some preparation needed"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rest of the content */}
          <Tabs defaultValue="resume">
            <TabsList className="grid grid-cols-6 mb-4">
              <TabsTrigger value="resume">Resume</TabsTrigger>
              <TabsTrigger value="cover">Cover Letter</TabsTrigger>
              <TabsTrigger value="email">Cold Email</TabsTrigger>
              <TabsTrigger value="pitch">Pitch</TabsTrigger>
              <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
              <TabsTrigger value="company">Company</TabsTrigger>
            </TabsList>

            <TabsContent value="resume" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Resume Enhancement</CardTitle>
                  <CardDescription>Suggested improvements to make your resume stand out for this job</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {results.resumeSuggestions.map((suggestion: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 p-4 rounded-md bg-gradient-to-r from-primary/5 to-accent/5 border"
                    >
                      <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>{suggestion}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cover" className="mt-0">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Cover Letter Draft</CardTitle>
                    <CardDescription>Personalized cover letter template for this job application</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => copyToClipboard(results.coverLetter, "cover")}
                  >
                    {copied === "cover" ? "Copied!" : "Copy"}
                    <Copy className="h-4 w-4 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-line p-4 rounded-md border bg-muted/50">
                    {results.coverLetter.replace("[Position]", results.position)}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="email" className="mt-0">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Cold Email Template</CardTitle>
                    <CardDescription>Email template to reach out to recruiters or hiring managers</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => copyToClipboard(results.coldEmail, "email")}
                  >
                    {copied === "email" ? "Copied!" : "Copy"}
                    <Copy className="h-4 w-4 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-line p-4 rounded-md border bg-muted/50">{results.coldEmail}</div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pitch" className="mt-0">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recruiter Pitch</CardTitle>
                    <CardDescription>Your 30-second elevator pitch for speaking with recruiters</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => copyToClipboard(results.recruiterPitch, "pitch")}
                  >
                    {copied === "pitch" ? "Copied!" : "Copy"}
                    <Copy className="h-4 w-4 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-md border bg-muted/50">
                      <p className="whitespace-pre-line">{results.recruiterPitch}</p>
                    </div>
                    <div className="flex items-start gap-2 p-4 rounded-md bg-primary/10 border">
                      <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        Practice this pitch until it feels natural. Adjust the tone and content based on the specific
                        recruiter and situation. Remember to maintain good eye contact and show enthusiasm.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="linkedin" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>LinkedIn Networking Strategy</CardTitle>
                  <CardDescription>How to leverage LinkedIn to increase your chances</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {results.linkedinSuggestions.map((suggestion: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 p-3 rounded-md bg-muted">
                      <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>{suggestion}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="company" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Company Insights</CardTitle>
                  <CardDescription>Key information about the company to help you prepare</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="p-4 rounded-md border">
                      <h3 className="font-medium mb-2">Recent News</h3>
                      <p className="text-sm">{results.companyInsights.recentNews}</p>
                    </div>
                    <div className="p-4 rounded-md border">
                      <h3 className="font-medium mb-2">Company Culture</h3>
                      <p className="text-sm">{results.companyInsights.culture}</p>
                    </div>
                    <div className="p-4 rounded-md border">
                      <h3 className="font-medium mb-2">Growth Areas</h3>
                      <p className="text-sm">{results.companyInsights.growthAreas}</p>
                    </div>
                    <div className="p-4 rounded-md border">
                      <h3 className="font-medium mb-2">Interview Focus</h3>
                      <p className="text-sm">{results.companyInsights.interviewFocus}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
    </>
  )
}

