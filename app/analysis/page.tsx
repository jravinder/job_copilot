"use client"

import { useState, useEffect, useLayoutEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import {
  ArrowLeft,
  Loader2,
  MessageSquare,
  FileText,
  Briefcase,
  Save,
  Sparkles,
  CheckCircle,
  ArrowRight,
  AlertCircle,
  Info,
  Edit3,
  Eye,
  LightbulbIcon,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  Minimize2,
  X,
  Download,
  Copy,
  Printer,
} from "lucide-react"
import { analyzeContent } from "../actions/analyze"
import type { AIAnalysisResult } from "@/types/analysis"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

// Animation utility functions
const fadeIn = "transition-opacity duration-300 ease-in-out opacity-100"
const fadeOut = "transition-opacity duration-300 ease-in-out opacity-0 pointer-events-none"

// Debounce utility function
const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>
  return function (...args: any[]) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), ms)
  }
}

interface ResumeData {
  resumeText: string
  jobDescription: string
  companyName?: string
  position?: string
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

// Resume tips
const resumeTips = [
  "Tailor your resume to highlight skills relevant to the job description",
  "Use action verbs and quantify achievements where possible",
  "Ensure your most relevant experience is prominently featured",
  "Keep formatting consistent and professional",
  "Proofread carefully for spelling and grammar errors",
]

// Job description tips
const jobDescriptionTips = [
  "Pay attention to required skills and qualifications",
  "Note any preferred qualifications that you might possess",
  "Look for keywords that you can incorporate in your resume",
  "Understand the company culture and values mentioned",
  "Identify potential challenges or opportunities in the role",
]

export default function AnalysisPage() {
  const router = useRouter()
  const [resumeData, setResumeData] = useState<ResumeData>({
    resumeText: "",
    jobDescription: "",
    companyName: "",
    position: "",
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<{ resume: string; job: string }>({ resume: "", job: "" })
  const [activeStep, setActiveStep] = useState<"resume" | "job" | "analyze">("resume")
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [resumeSection, setResumeSection] = useState<"edit" | "preview" | "tips">("edit")
  const [jobSection, setJobSection] = useState<"edit" | "skills" | "tips">("edit")
  const [keySkills, setKeySkills] = useState<string[]>([])
  const [isTransitioning, setIsTransitioning] = useState(false)

  // New state for full-page view
  const [isFullPage, setIsFullPage] = useState(false)
  const [fullPageContent, setFullPageContent] = useState<"resume" | "job" | null>(null)

  // Refs for layout measurements
  const analysisSectionRef = useRef<HTMLDivElement>(null)
  const initialDimensionsRef = useRef<{ width: number; height: number } | null>(null)

  useEffect(() => {
    try {
      // Check if user is logged in
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

      // Extract potential key skills from job description
      extractKeySkills(parsedData.jobDescription)
    } catch (err) {
      console.error("Error initializing page:", err)
      setError("Failed to load resume data")
      router.push("/upload")
    }
  }, [router])

  // Add event listener for escape key to exit full-page mode
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isFullPage) {
          exitFullPage()
        } else if (isAnalyzing) {
          // Optionally allow canceling analysis with ESC
          // Uncomment the following lines to enable this feature
          // if (confirm("Cancel the current analysis?")) {
          //   setIsAnalyzing(false);
          //   setCurrentStep(0);
          //   setAnalysisProgress(0);
          // }
        }
      }
    }

    window.addEventListener("keydown", handleEscKey)

    // Clean up
    return () => {
      window.removeEventListener("keydown", handleEscKey)
    }
  }, [isFullPage, isAnalyzing])

  // Simple function to extract potential key skills from job description
  const extractKeySkills = (jobDescription: string) => {
    if (!jobDescription) return

    // Common technical skills to look for
    const commonSkills = [
      "JavaScript",
      "React",
      "Node.js",
      "Python",
      "Java",
      "C#",
      "SQL",
      "AWS",
      "Azure",
      "Docker",
      "Kubernetes",
      "Git",
      "CI/CD",
      "Agile",
      "TypeScript",
      "HTML",
      "CSS",
      "REST API",
      "GraphQL",
      "MongoDB",
      "Leadership",
      "Communication",
      "Project Management",
      "Team Building",
      "Problem Solving",
      "Critical Thinking",
      "Collaboration",
    ]

    // Find skills mentioned in the job description
    const foundSkills = commonSkills.filter((skill) => jobDescription.toLowerCase().includes(skill.toLowerCase()))

    // Limit to 5 skills
    setKeySkills(foundSkills.slice(0, 5))
  }

  // Improved startAnalysis function with better layout handling
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

    // Set transitioning state to prevent multiple clicks
    setIsTransitioning(true)

    // Cache the initial dimensions before any state changes
    if (analysisSectionRef.current) {
      const rect = analysisSectionRef.current.getBoundingClientRect()
      initialDimensionsRef.current = {
        width: rect.width,
        height: rect.height,
      }

      // Apply fixed dimensions during transition to prevent layout shifts
      analysisSectionRef.current.style.height = `${rect.height}px`
      analysisSectionRef.current.style.minHeight = `${rect.height}px`
      analysisSectionRef.current.classList.add("dimension-lock")
    }

    // Use requestAnimationFrame to ensure DOM updates are processed
    requestAnimationFrame(() => {
      // Set analyzing state
      setIsAnalyzing(true)

      // Use another requestAnimationFrame to ensure the state change is processed
      requestAnimationFrame(() => {
        // Force a reflow to ensure styles are applied
        if (analysisSectionRef.current) {
          void analysisSectionRef.current.offsetHeight

          // Remove dimension lock after layout is calculated
          analysisSectionRef.current.classList.remove("dimension-lock")
          analysisSectionRef.current.style.height = ""
          analysisSectionRef.current.style.minHeight = ""

          // Add analyzing class for transitions
          analysisSectionRef.current.classList.add("analyzing")
        }

        // Start with controlled animation sequence
        setCurrentStep(0)
        setAnalysisProgress(5)
        setIsTransitioning(false)

        // Run the analysis process
        runAnalysis()
      })
    })
  }

  // Separated analysis logic for better organization
  const runAnalysis = async () => {
    try {
      const { resumeText, jobDescription, notes } = resumeData

      // Configure step animation with precise timing
      const totalSteps = analysisSteps.length
      const totalAnalysisTime = 12000 // 12 seconds total expected time
      const stepInterval = totalAnalysisTime / totalSteps

      // Create a stable interval for step progression
      const progressTimer = setInterval(() => {
        setCurrentStep((current) => {
          const nextStep = current + 1
          if (nextStep >= totalSteps) {
            clearInterval(progressTimer)
            return current
          }
          return nextStep
        })

        // Update progress smoothly with easing
        setAnalysisProgress((current) => {
          // Calculate next progress value with a small buffer before 100%
          const nextProgress = Math.min(((currentStep + 1) / totalSteps) * 85, 85)
          return nextProgress
        })
      }, stepInterval)

      // Perform the actual analysis
      const result = await analyzeContent({
        resumeText,
        jobDescription,
        notes,
      })

      // Clean up timer if analysis completes early
      clearInterval(progressTimer)

      // Complete the progress animation smoothly
      setAnalysisProgress(90)
      setTimeout(() => setAnalysisProgress(100), 300)

      if (!result.success) {
        throw new Error(result.error || "Analysis failed")
      }

      if (!result.data) {
        throw new Error("No analysis data received")
      }

      console.log("Analysis result:", result.data)

      // Update localStorage with the latest analysis
      const updatedResumeData = {
        ...resumeData,
        companyName: result.data.companyName || resumeData.companyName,
        position: result.data.position || resumeData.position,
        analysis: result.data,
      }

      localStorage.setItem("resumeData", JSON.stringify(updatedResumeData))
      setResumeData(updatedResumeData)

      // Ensure smooth transition to results page
      // Add a small delay to allow animations to complete
      setTimeout(() => {
        // Remove analyzing class before navigation
        if (analysisSectionRef.current) {
          analysisSectionRef.current.classList.remove("analyzing")
        }

        // Navigate to results page
        router.push("/results")
      }, 1000)
    } catch (err) {
      console.error("Analysis error:", err)
      setError(
        err instanceof Error ? err.message : "An error occurred while processing your request. Please try again.",
      )

      // Gracefully reset UI on error
      setTimeout(() => {
        if (analysisSectionRef.current) {
          analysisSectionRef.current.classList.remove("analyzing")
        }
        setIsAnalyzing(false)
        setCurrentStep(0)
        setAnalysisProgress(0)
      }, 500)
    }
  }

  const saveResumeChanges = () => {
    // Save the updated resume text to localStorage
    localStorage.setItem(
      "resumeData",
      JSON.stringify({
        ...resumeData,
      }),
    )
    setSaveStatus((prev) => ({ ...prev, resume: "Saved!" }))
    setTimeout(() => setSaveStatus((prev) => ({ ...prev, resume: "" })), 2000)
  }

  const saveJobChanges = () => {
    // Save the updated job description to localStorage
    localStorage.setItem(
      "resumeData",
      JSON.stringify({
        ...resumeData,
      }),
    )
    setSaveStatus((prev) => ({ ...prev, job: "Saved!" }))
    setTimeout(() => setSaveStatus((prev) => ({ ...prev, job: "" })), 2000)

    // Re-extract key skills when job description changes
    extractKeySkills(resumeData.jobDescription)
  }

  // Extract position and company name properly
  const position = resumeData.position || "Position Title"
  const companyName = resumeData.companyName || "Company"

  // Format resume for preview
  const formatResumePreview = (text: string) => {
    if (!text) return []

    // Split by double newlines to get sections
    return text.split(/\n\n+/).map((section, index) => {
      // Check if this is a section header (all caps or ends with a colon)
      const isSectionHeader = /^[A-Z\s]+$/.test(section.trim()) || section.trim().endsWith(":")

      if (isSectionHeader) {
        return (
          <h3 key={index} className="font-bold mt-4 mb-2 text-blue-800">
            {section}
          </h3>
        )
      } else {
        // Replace single newlines with breaks
        const lines = section.split(/\n/).map((line, lineIndex) => (
          <span key={lineIndex}>
            {line}
            {lineIndex < section.split(/\n/).length - 1 && <br />}
          </span>
        ))
        return (
          <p key={index} className="mb-3">
            {lines}
          </p>
        )
      }
    })
  }

  // Navigation functions for resume sections
  const goToNextResumeSection = () => {
    if (resumeSection === "edit") setResumeSection("preview")
    else if (resumeSection === "preview") setResumeSection("tips")
  }

  const goToPrevResumeSection = () => {
    if (resumeSection === "tips") setResumeSection("preview")
    else if (resumeSection === "preview") setResumeSection("edit")
  }

  // Navigation functions for job sections
  const goToNextJobSection = () => {
    if (jobSection === "edit") setJobSection("skills")
    else if (jobSection === "skills") setJobSection("tips")
  }

  const goToPrevJobSection = () => {
    if (jobSection === "tips") setJobSection("skills")
    else if (jobSection === "skills") setJobSection("edit")
  }

  // Function to enter full-page mode
  const enterFullPage = (content: "resume" | "job") => {
    setIsFullPage(true)
    setFullPageContent(content)
    // Add class to body to prevent scrolling
    document.body.classList.add("overflow-hidden")
  }

  // Function to exit full-page mode
  const exitFullPage = () => {
    setIsFullPage(false)
    setFullPageContent(null)
    // Remove class from body to allow scrolling
    document.body.classList.remove("overflow-hidden")
  }

  // Function to copy content to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Content copied to clipboard!")
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err)
      })
  }

  // Function to print content
  const printContent = () => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      const content = fullPageContent === "resume" ? resumeData.resumeText : resumeData.jobDescription
      const title = fullPageContent === "resume" ? "Resume" : "Job Description"
      const formattedContent = content.replace(/\n/g, "<br>")

      printWindow.document.write(`
        <html>
          <head>
            <title>${title} - ${position} at ${companyName}</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
              h1 { color: #1e40af; }
              .content { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <h1>${title} - ${position} at ${companyName}</h1>
            <div class="content">${formattedContent}</div>
          </body>
        </html>
      `)

      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
    }
  }

  // Function to download content as text file
  const downloadContent = () => {
    const content = fullPageContent === "resume" ? resumeData.resumeText : resumeData.jobDescription
    const title = fullPageContent === "resume" ? "Resume" : "Job Description"
    const filename = `${title.toLowerCase().replace(" ", "-")}-${position.toLowerCase().replace(" ", "-")}.txt`

    const element = document.createElement("a")
    const file = new Blob([content], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = filename
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  // Add resize handler to prevent layout shifts on window resize
  useEffect(() => {
    const handleResize = debounce(() => {
      // Only apply special handling during analysis
      if (isAnalyzing) {
        if (analysisSectionRef.current) {
          // Temporarily add a class to maintain dimensions during resize
          analysisSectionRef.current.classList.add("resize-lock")

          // Remove class after resize is complete
          setTimeout(() => {
            if (analysisSectionRef.current) {
              analysisSectionRef.current.classList.remove("resize-lock")
            }
          }, 100)
        }
      }
    }, 100)

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [isAnalyzing])

  // Use useLayoutEffect for critical layout calculations
  useLayoutEffect(() => {
    if (isAnalyzing && analysisSectionRef.current) {
      // Force layout calculation before any animations
      void analysisSectionRef.current.offsetHeight

      // Apply analyzing class after layout is calculated
      requestAnimationFrame(() => {
        if (analysisSectionRef.current) {
          analysisSectionRef.current.classList.add("analyzing")
        }
      })
    } else if (!isAnalyzing && analysisSectionRef.current) {
      // Remove analyzing class when not analyzing
      analysisSectionRef.current.classList.remove("analyzing")
    }
  }, [isAnalyzing])

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Top navigation bar */}
      <header className="border-b bg-white sticky top-0 z-30 shadow-sm">
        <div className="flex h-16 items-center px-4 md:px-6 max-w-[1920px] mx-auto">
          <div className="flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Demo User</span>
            </div>
            <Button variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Blue header bar */}
      <div className="bg-blue-600 text-white sticky top-16 z-20 shadow-md">
        <div className="flex items-center justify-between px-4 py-4 md:px-6 max-w-[1920px] mx-auto">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" asChild>
              <Link href="/dashboard" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
            <Button variant="secondary" size="sm" asChild>
              <Link href="/chat" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Chat
              </Link>
            </Button>
            <Button variant="secondary" size="sm" asChild>
              <Link href="/results" className="gap-2">
                <Briefcase className="h-4 w-4" />
                Results
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Job title section */}
      <div className="bg-white border-b sticky top-[112px] z-10">
        <div className="px-4 py-4 md:px-6 max-w-[1920px] mx-auto">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <h2 className="text-lg font-medium">
              {position} at {companyName}
            </h2>
          </div>
          <p className="text-slate-600 mt-1">Review and edit your application materials</p>
        </div>
      </div>

      {/* Timeline section */}
      <div className="border-b bg-white py-4 px-4 md:px-6 sticky top-[176px] z-10">
        <div className="max-w-[1920px] mx-auto">
          <div className="relative">
            {/* Timeline track - ensure consistent width */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0"></div>

            {/* Timeline steps - fix alignment with flex and exact spacing */}
            <div className="relative z-10 flex justify-between max-w-md mx-auto">
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => !isAnalyzing && !isTransitioning && setActiveStep("resume")}
                  className="flex flex-col items-center"
                  aria-label="Go to step 1: Resume"
                  aria-current={activeStep === "resume" ? "step" : undefined}
                  disabled={isAnalyzing || isTransitioning}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 border-2 ${
                      activeStep === "resume"
                        ? "bg-blue-600 border-blue-600 text-white"
                        : activeStep === "job" || activeStep === "analyze"
                          ? "bg-green-500 border-green-500 text-white"
                          : "bg-white border-slate-300 text-slate-500"
                    }`}
                  >
                    {activeStep === "job" || activeStep === "analyze" ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span className="text-base font-semibold">1</span>
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${activeStep === "resume" ? "text-blue-600" : "text-slate-600"}`}
                  >
                    Resume
                  </span>
                </button>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => !isAnalyzing && !isTransitioning && setActiveStep("job")}
                  className="flex flex-col items-center"
                  aria-label="Go to step 2: Job Description"
                  aria-current={activeStep === "job" ? "step" : undefined}
                  disabled={isAnalyzing || isTransitioning}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 border-2 ${
                      activeStep === "job"
                        ? "bg-blue-600 border-blue-600 text-white"
                        : activeStep === "analyze"
                          ? "bg-green-500 border-green-500 text-white"
                          : "bg-white border-slate-300 text-slate-500"
                    }`}
                  >
                    {activeStep === "analyze" ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span className="text-base font-semibold">2</span>
                    )}
                  </div>
                  <span className={`text-sm font-medium ${activeStep === "job" ? "text-blue-600" : "text-slate-600"}`}>
                    Job Description
                  </span>
                </button>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => !isAnalyzing && !isTransitioning && setActiveStep("analyze")}
                  className="flex flex-col items-center"
                  aria-label="Go to step 3: Analysis"
                  aria-current={activeStep === "analyze" ? "step" : undefined}
                  disabled={isAnalyzing || isTransitioning}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 border-2 ${
                      activeStep === "analyze"
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-white border-slate-300 text-slate-500"
                    }`}
                  >
                    <span className="text-base font-semibold">3</span>
                  </div>
                  <span
                    className={`text-sm font-medium ${activeStep === "analyze" ? "text-blue-600" : "text-slate-600"}`}
                  >
                    Analysis
                  </span>
                </button>
              </div>
            </div>

            {/* Progress indicators - ensure consistent width and positioning */}
            <div className="absolute top-1/2 left-0 right-0 flex -translate-y-1/2 z-0 max-w-md mx-auto">
              {/* Progress line 1-2 */}
              <div
                className={`h-1 flex-1 ${
                  activeStep === "job" || activeStep === "analyze" ? "bg-blue-600" : "bg-slate-200"
                }`}
              ></div>

              {/* Progress line 2-3 */}
              <div className={`h-1 flex-1 ${activeStep === "analyze" ? "bg-blue-600" : "bg-slate-200"}`}></div>
            </div>
          </div>

          {/* Step description */}
          <div className="mt-4 text-center">
            <p className="text-sm text-slate-600">
              {activeStep === "resume" && "Step 1: Review and optimize your resume for this job application"}
              {activeStep === "job" && "Step 2: Review the job description and identify key requirements"}
              {activeStep === "analyze" && "Step 3: Analyze your application materials with AI"}
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex px-0 md:px-4 lg:px-6 py-4 md:py-6 max-w-[1920px] mx-auto w-full">
        {/* Sidebar */}
        <div className="w-64 bg-white border rounded-lg shadow-sm mr-6 p-4 hidden lg:block sticky self-start top-[256px] max-h-[calc(100vh-256px)] overflow-auto">
          <h2 className="text-lg font-semibold mb-4">Analysis Steps</h2>
          <nav className="space-y-2">
            <button
              onClick={() => !isAnalyzing && !isTransitioning && setActiveStep("resume")}
              className={`flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors w-full text-left ${
                activeStep === "resume" ? "bg-muted/50" : ""
              }`}
              disabled={isAnalyzing || isTransitioning}
            >
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Resume</span>
              <div
                className={`ml-auto w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                  activeStep === "resume" ? "bg-blue-600 text-white" : "bg-slate-200"
                }`}
              >
                1
              </div>
            </button>
            <button
              onClick={() => !isAnalyzing && !isTransitioning && setActiveStep("job")}
              className={`flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors w-full text-left ${
                activeStep === "job" ? "bg-muted/50" : ""
              }`}
              disabled={isAnalyzing || isTransitioning}
            >
              <Briefcase className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Job Description</span>
              <div
                className={`ml-auto w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                  activeStep === "job" ? "bg-blue-600 text-white" : "bg-slate-200"
                }`}
              >
                2
              </div>
            </button>
            <button
              onClick={() => !isAnalyzing && !isTransitioning && setActiveStep("analyze")}
              className={`flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors w-full text-left ${
                activeStep === "analyze" ? "bg-muted/50" : ""
              }`}
              disabled={isAnalyzing || isTransitioning}
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Start Analysis</span>
              <div
                className={`ml-auto w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                  activeStep === "analyze" ? "bg-blue-600 text-white" : "bg-slate-200"
                }`}
              >
                3
              </div>
            </button>
          </nav>

          <div className="pt-6 mt-4 border-t">
            <div className="font-medium mb-2">Application Info</div>
            <div className="text-sm space-y-2">
              <div className="flex items-start gap-2">
                <Briefcase className="h-4 w-4 text-slate-500 mt-0.5" />
                <div>
                  <div className="font-medium">{position}</div>
                  <div className="text-slate-500">{companyName}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-slate-500 mt-0.5" />
                <div>
                  <div className="font-medium">Resume</div>
                  <div className="text-slate-500">
                    {resumeData.resumeText ? `${resumeData.resumeText.length} characters` : "Not uploaded"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="mt-6 pt-6 border-t">
            <div className="font-medium mb-2">Your Progress</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Step 1: Resume</span>
                {activeStep === "resume" ? (
                  <span className="text-blue-600 font-medium">In Progress</span>
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Step 2: Job Description</span>
                {activeStep === "job" ? (
                  <span className="text-blue-600 font-medium">In Progress</span>
                ) : activeStep === "analyze" ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <span className="text-slate-400">Pending</span>
                )}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Step 3: Analysis</span>
                {activeStep === "analyze" ? (
                  <span className="text-blue-600 font-medium">In Progress</span>
                ) : (
                  <span className="text-slate-400">Pending</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main content area - take up full width on mobile, less on desktop */}
        <div className="flex-1 md:px-0">
          {error && (
            <div className="mb-4">
              <Alert variant="destructive">
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
            </div>
          )}

          {/* Resume Step */}
          {activeStep === "resume" && (
            <Card
              className="overflow-hidden border shadow-sm hover:shadow-md transition-all bg-white mb-6"
              id="resume-section"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-slate-50">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <CardTitle>Resume Content</CardTitle>
                    <CardDescription>Review and optimize your resume for this job application</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={saveResumeChanges}>
                    <Save className="h-4 w-4" />
                    {saveStatus.resume || "Save Changes"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => enterFullPage("resume")}
                  >
                    <Maximize2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Full Screen</span>
                  </Button>
                </div>
              </CardHeader>

              {/* New Navigation Bar for Resume Sections */}
              <div className="bg-slate-100 border-y">
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center">
                    <div className="flex space-x-1">
                      <Button
                        variant={resumeSection === "edit" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setResumeSection("edit")}
                        className={`rounded-md ${resumeSection === "edit" ? "bg-blue-600" : "hover:bg-slate-200"}`}
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant={resumeSection === "preview" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setResumeSection("preview")}
                        className={`rounded-md ${resumeSection === "preview" ? "bg-blue-600" : "hover:bg-slate-200"}`}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button
                        variant={resumeSection === "tips" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setResumeSection("tips")}
                        className={`rounded-md ${resumeSection === "tips" ? "bg-blue-600" : "hover:bg-slate-200"}`}
                      >
                        <LightbulbIcon className="h-4 w-4 mr-2" />
                        Tips
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPrevResumeSection}
                      disabled={resumeSection === "edit"}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="sr-only">Previous</span>
                    </Button>
                    <div className="text-xs font-medium text-slate-500">
                      {resumeSection === "edit" ? "1" : resumeSection === "preview" ? "2" : "3"} of 3
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNextResumeSection}
                      disabled={resumeSection === "tips"}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                      <span className="sr-only">Next</span>
                    </Button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1 bg-slate-200">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{
                      width: resumeSection === "edit" ? "33.33%" : resumeSection === "preview" ? "66.66%" : "100%",
                    }}
                  ></div>
                </div>
              </div>

              <CardContent className="p-0">
                {/* Edit Section */}
                {resumeSection === "edit" && (
                  <div className="p-4">
                    <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-100 text-sm flex items-start gap-2">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-blue-800 font-medium">
                          Optimize your resume for {position} at {companyName}
                        </p>
                        <p className="text-blue-700 mt-1">
                          Tailor your resume to highlight skills and experiences that match the job requirements. Use
                          industry-specific keywords to improve your chances of getting noticed.
                        </p>
                      </div>
                    </div>

                    <Textarea
                      value={resumeData.resumeText}
                      onChange={(e) => {
                        setResumeData({
                          ...resumeData,
                          resumeText: e.target.value,
                        })
                      }}
                      className="min-h-[500px] mb-4 font-mono text-sm"
                      placeholder="Paste your resume content here..."
                    />
                  </div>
                )}

                {/* Preview Section */}
                {resumeSection === "preview" && (
                  <div className="p-4">
                    <div className="mb-4 p-3 bg-slate-50 rounded-md border text-sm">
                      <p className="font-medium">Resume Preview</p>
                      <p className="text-slate-500 text-xs mt-1">
                        This is how your resume content will appear when formatted
                      </p>
                    </div>

                    <div className="p-6 border rounded-md bg-white min-h-[500px]">
                      {formatResumePreview(resumeData.resumeText)}
                    </div>
                  </div>
                )}

                {/* Tips Section */}
                {resumeSection === "tips" && (
                  <div className="p-4">
                    <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-100">
                      <h3 className="font-medium text-blue-800 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-blue-600" />
                        Resume Optimization Tips
                      </h3>
                      <p className="text-blue-700 text-sm mt-1">
                        Follow these tips to make your resume stand out for {position} at {companyName}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {resumeTips.map((tip, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-4 border rounded-md bg-white hover:bg-slate-50 transition-colors shadow-sm"
                        >
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                            {index + 1}
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium text-slate-800">{tip}</p>
                            <p className="text-sm text-slate-500">
                              {
                                [
                                  "Highlight relevant skills that match the job requirements.",
                                  "Use numbers and metrics to demonstrate your impact.",
                                  "Place your most impressive achievements at the top of each section.",
                                  "Use a clean, professional template with consistent spacing.",
                                  "Have someone else review your resume for errors and clarity.",
                                ][index]
                              }
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-md">
                      <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-green-800">Pro Tip</h4>
                          <p className="text-sm text-green-700 mt-1">
                            After applying these tips, use the "Full Screen" button to review your resume in a
                            distraction-free environment to ensure it looks professional and cohesive.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between bg-slate-50 p-4 border-t">
                <Button variant="outline" onClick={() => router.push("/dashboard")}>
                  Cancel
                </Button>
                <Button onClick={() => setActiveStep("job")} disabled={isAnalyzing || isTransitioning}>
                  Continue to Job Description
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Job Description Step */}
          {activeStep === "job" && (
            <Card
              className="overflow-hidden border shadow-sm hover:shadow-md transition-all bg-white mb-6"
              id="job-section"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-slate-50">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  <div>
                    <CardTitle>Job Description</CardTitle>
                    <CardDescription>Review the job requirements and identify key skills needed</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={saveJobChanges}>
                    <Save className="h-4 w-4" />
                    {saveStatus.job || "Save Changes"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => enterFullPage("job")}
                  >
                    <Maximize2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Full Screen</span>
                  </Button>
                </div>
              </CardHeader>

              {/* New Navigation Bar for Job Description Sections */}
              <div className="bg-slate-100 border-y">
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center">
                    <div className="flex space-x-1">
                      <Button
                        variant={jobSection === "edit" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setJobSection("edit")}
                        className={`rounded-md ${jobSection === "edit" ? "bg-blue-600" : "hover:bg-slate-200"}`}
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant={jobSection === "skills" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setJobSection("skills")}
                        className={`rounded-md ${jobSection === "skills" ? "bg-blue-600" : "hover:bg-slate-200"}`}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Key Skills
                      </Button>
                      <Button
                        variant={jobSection === "tips" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setJobSection("tips")}
                        className={`rounded-md ${jobSection === "tips" ? "bg-blue-600" : "hover:bg-slate-200"}`}
                      >
                        <LightbulbIcon className="h-4 w-4 mr-2" />
                        Tips
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPrevJobSection}
                      disabled={jobSection === "edit"}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="sr-only">Previous</span>
                    </Button>
                    <div className="text-xs font-medium text-slate-500">
                      {jobSection === "edit" ? "1" : jobSection === "skills" ? "2" : "3"} of 3
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNextJobSection}
                      disabled={jobSection === "tips"}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                      <span className="sr-only">Next</span>
                    </Button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1 bg-slate-200">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{
                      width: jobSection === "edit" ? "33.33%" : jobSection === "skills" ? "66.66%" : "100%",
                    }}
                  ></div>
                </div>
              </div>

              <CardContent className="p-0">
                {/* Edit Section */}
                {jobSection === "edit" && (
                  <div className="p-4">
                    <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-100 text-sm flex items-start gap-2">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-blue-800 font-medium">
                          Understanding the job requirements for {position} at {companyName}
                        </p>
                        <p className="text-blue-700 mt-1">
                          Paste the complete job description here. Our AI will analyze the requirements and help you
                          identify key skills and qualifications needed for this position.
                        </p>
                      </div>
                    </div>

                    <Textarea
                      value={resumeData.jobDescription}
                      onChange={(e) => {
                        setResumeData({
                          ...resumeData,
                          jobDescription: e.target.value,
                        })
                      }}
                      className="min-h-[500px] mb-4 font-mono text-sm"
                      placeholder="Paste the job description here..."
                    />
                  </div>
                )}

                {/* Skills Section */}
                {jobSection === "skills" && (
                  <div className="p-4">
                    <div className="mb-4 p-3 bg-slate-50 rounded-md border text-sm">
                      <p className="font-medium">Potential Key Skills</p>
                      <p className="text-slate-500 text-xs mt-1">
                        Based on our initial scan of the job description, these skills may be important
                      </p>
                    </div>

                    {keySkills.length > 0 ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                          {keySkills.map((skill, index) => (
                            <div
                              key={index}
                              className="p-4 border rounded-md bg-white shadow-sm hover:shadow-md transition-all"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                                  <CheckCircle className="h-4 w-4" />
                                </div>
                                <span className="font-medium text-slate-800">{skill}</span>
                              </div>
                              <p className="text-sm text-slate-500 pl-10">
                                {
                                  [
                                    "This skill appears to be a core requirement for the role.",
                                    "Highlighting your experience with this skill could set you apart.",
                                    "Consider providing specific examples of using this skill.",
                                    "This technical skill is frequently mentioned in the job description.",
                                    "Employers often value this skill for this type of position.",
                                  ][index % 5]
                                }
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
                          <h3 className="text-sm font-medium mb-3 flex items-center gap-2 text-blue-700">
                            <Sparkles className="h-4 w-4 text-blue-600" />
                            How to showcase these skills effectively
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-2">
                              <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                                1
                              </div>
                              <p className="text-sm text-blue-700">
                                <span className="font-medium">Highlight in your resume</span>: Make these skills
                                prominent in your skills section and work experience.
                              </p>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                                2
                              </div>
                              <p className="text-sm text-blue-700">
                                <span className="font-medium">Provide examples</span>: Include specific instances where
                                you've applied these skills successfully.
                              </p>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                                3
                              </div>
                              <p className="text-sm text-blue-700">
                                <span className="font-medium">Quantify achievements</span>: Use numbers to demonstrate
                                your impact when using these skills.
                              </p>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                                4
                              </div>
                              <p className="text-sm text-blue-700">
                                <span className="font-medium">Use keywords</span>: Incorporate these exact terms in your
                                application materials.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 border rounded-md bg-white text-center shadow-sm">
                        <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-600 font-medium mb-2">No key skills detected yet</p>
                        <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
                          Add a job description in the Edit tab to automatically identify potential key skills required
                          for this position.
                        </p>
                        <Button variant="outline" size="sm" onClick={() => setJobSection("edit")}>
                          Go to Edit Tab
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Tips Section */}
                {jobSection === "tips" && (
                  <div className="p-4">
                    <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-100">
                      <h3 className="font-medium text-blue-800 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-blue-600" />
                        Job Description Analysis Tips
                      </h3>
                      <p className="text-blue-700 text-sm mt-1">
                        Follow these tips to better understand the job requirements and align your application
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                      {jobDescriptionTips.map((tip, index) => (
                        <div
                          key={index}
                          className="flex flex-col h-full p-4 border rounded-md bg-white hover:bg-slate-50 transition-colors shadow-sm"
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                              {index + 1}
                            </div>
                            <h4 className="font-medium text-slate-800">{tip}</h4>
                          </div>
                          <p className="text-sm text-slate-500 pl-11 flex-grow">
                            {
                              [
                                "Required skills are non-negotiable, while preferred skills give you a competitive edge.",
                                "Look for skills mentioned multiple times or emphasized in the description.",
                                "Use the exact terminology from the job description in your resume and cover letter.",
                                "Research the company's mission and values to understand their workplace culture.",
                                "Identify challenges mentioned in the role to prepare for interview questions about them.",
                              ][index]
                            }
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-md">
                      <div className="flex items-start gap-3">
                        <LightbulbIcon className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-amber-800">Reading Between the Lines</h4>
                          <p className="text-sm text-amber-700 mt-1">
                            Job descriptions often contain hidden clues about company priorities and team dynamics. Look
                            for phrases like "fast-paced environment" (high pressure), "self-starter" (minimal
                            supervision), or "wear many hats" (varied responsibilities).
                          </p>
                          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-100/50 p-2 rounded">
                              <span className="font-medium">"Team player"</span> → Collaborative culture
                            </div>
                            <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-100/50 p-2 rounded">
                              <span className="font-medium">"Detail-oriented"</span> → Precision is valued
                            </div>
                            <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-100/50 p-2 rounded">
                              <span className="font-medium">"Flexible schedule"</span> → Possible overtime
                            </div>
                            <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-100/50 p-2 rounded">
                              <span className="font-medium">"Competitive salary"</span> → Negotiable pay
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between bg-slate-50 p-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setActiveStep("resume")}
                  disabled={isAnalyzing || isTransitioning}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Resume
                </Button>
                <Button onClick={() => setActiveStep("analyze")} disabled={isAnalyzing || isTransitioning}>
                  Continue to Analysis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Analysis Step */}
          {activeStep === "analyze" && (
            <Card
              className="overflow-hidden border shadow-sm hover:shadow-md transition-all bg-white mb-6"
              id="analysis-section"
              ref={analysisSectionRef}
            >
              <CardHeader className="bg-slate-50 border-b">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <div>
                    <CardTitle>Analysis Status</CardTitle>
                    <CardDescription>
                      {isAnalyzing
                        ? "AI is analyzing your application materials"
                        : "Ready to analyze your job application materials"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {/* Progress bar - always visible but only active during analysis */}
                <div className="w-full mb-6">
                  <Progress
                    value={isAnalyzing ? analysisProgress : 0}
                    className="h-2 w-full transition-all duration-300 ease-in-out"
                  />
                </div>

                {isAnalyzing ? (
                  <div className="space-y-6 flex flex-col items-center">
                    <div className="w-full max-w-md mx-auto">
                      <div className="flex items-center gap-4 mb-6 justify-center">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <span className="font-medium">{analysisSteps[currentStep]}</span>
                      </div>

                      <div className="space-y-4 w-full">
                        {analysisSteps.map((step, index) => (
                          <div
                            key={index}
                            className={cn(
                              "flex items-center gap-2 text-sm transition-colors duration-300 w-full",
                              index < currentStep
                                ? "text-green-600"
                                : index === currentStep
                                  ? "text-primary"
                                  : "text-muted-foreground",
                            )}
                          >
                            {index < currentStep ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : index === currentStep ? (
                              <div className="h-4 w-4 rounded-full animate-pulse bg-primary" />
                            ) : (
                              <div className="h-4 w-4 rounded-full bg-muted" />
                            )}
                            <span className={index < currentStep ? "font-medium" : ""}>{step}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 pt-6 border-t text-center w-full">
                        <div className="text-sm text-muted-foreground">
                          <p className="mb-2">Analysis in progress. This typically takes 30-60 seconds.</p>
                          <p>Please don't close this window during analysis.</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 w-full flex justify-center">
                      <Button variant="outline" onClick={() => setActiveStep("job")} disabled={true} className="mr-2">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Job Description
                      </Button>
                      <Button disabled={true} className="min-w-[140px]">
                        <span className="flex items-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </span>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="p-4 bg-slate-50 rounded-lg border">
                        <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                          Resume
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-3">
                          {resumeData.resumeText
                            ? resumeData.resumeText.substring(0, 100) + "..."
                            : "No resume content found"}
                        </p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-lg border">
                        <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-blue-600" />
                          Job Description
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-3">
                          {resumeData.jobDescription
                            ? resumeData.jobDescription.substring(0, 100) + "..."
                            : "No job description found"}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <h3 className="text-sm font-medium mb-2 flex items-center gap-2 text-blue-700">
                        <Sparkles className="h-4 w-4 text-blue-600" />
                        What happens during analysis?
                      </h3>
                      <ul className="text-xs text-blue-700 space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="h-4 w-4 flex items-center justify-center">1.</span>
                          <span>We extract key information from your resume and the job description</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="h-4 w-4 flex items-center justify-center">2.</span>
                          <span>We identify matching and missing skills</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="h-4 w-4 flex items-center justify-center">3.</span>
                          <span>
                            We generate personalized recommendations to improve your application for {position} at{" "}
                            {companyName}
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="h-4 w-4 flex items-center justify-center">4.</span>
                          <span>We create tailored content like cover letters and recruiter pitches</span>
                        </li>
                      </ul>
                    </div>

                    <p className="text-muted-foreground">
                      Click analyze to start the AI-powered analysis of your application materials. This process
                      typically takes 30-60 seconds.
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between bg-slate-50 p-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setActiveStep("job")}
                  disabled={isAnalyzing || isTransitioning}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Job Description
                </Button>
                <Button
                  onClick={startAnalysis}
                  disabled={!resumeData?.resumeText || !resumeData?.jobDescription || isAnalyzing || isTransitioning}
                  className="min-w-[140px]"
                >
                  {isAnalyzing ? (
                    <span className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </span>
                  ) : (
                    <span>Start Analysis</span>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>

      {/* Full-page overlay for Resume and Job Description */}
      {isFullPage && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          {/* Full-page header */}
          <div className="bg-slate-50 border-b p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              {fullPageContent === "resume" ? (
                <FileText className="h-5 w-5 text-blue-600" />
              ) : (
                <Briefcase className="h-5 w-5 text-blue-600" />
              )}
              <h2 className="text-xl font-semibold">
                {fullPageContent === "resume" ? "Resume" : "Job Description"} - {position} at {companyName}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={downloadContent} className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Download</span>
              </Button>
              <Button variant="outline" size="sm" onClick={printContent} className="flex items-center gap-1">
                <Printer className="h-4 w-4" />
                <span className="hidden sm:inline">Print</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  copyToClipboard(fullPageContent === "resume" ? resumeData.resumeText : resumeData.jobDescription)
                }
                className="flex items-center gap-1"
              >
                <Copy className="h-4 w-4" />
                <span className="hidden sm:inline">Copy</span>
              </Button>
              <Button variant="outline" size="sm" onClick={exitFullPage} className="flex items-center gap-1">
                <Minimize2 className="h-4 w-4" />
                <span className="hidden sm:inline">Exit Full Screen</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={exitFullPage} className="md:hidden">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Full-page content */}
          <div className="flex-1 overflow-auto p-6 md:p-8">
            <div className="max-w-5xl mx-auto w-full">
              {fullPageContent === "resume" ? (
                <div className="bg-white rounded-lg border p-8 shadow-sm">
                  <h2 className="text-2xl font-bold mb-6 text-blue-800">{position} - Resume</h2>
                  <div className="prose max-w-none">{formatResumePreview(resumeData.resumeText)}</div>
                </div>
              ) : (
                <div className="bg-white rounded-lg border p-8 shadow-sm">
                  <h2 className="text-2xl font-bold mb-6 text-blue-800">{position} - Job Description</h2>
                  <div className="prose max-w-none whitespace-pre-wrap">{resumeData.jobDescription}</div>

                  {keySkills.length > 0 && (
                    <div className="mt-8 pt-8 border-t">
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        Key Skills Identified
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {keySkills.map((skill, index) => (
                          <div
                            key={index}
                            className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Full-page footer */}
          <div className="bg-slate-50 border-t p-4 flex justify-between items-center shadow-sm">
            <Button variant="outline" onClick={exitFullPage}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Analysis
            </Button>
            <div className="text-sm text-slate-500">
              Press <kbd className="px-2 py-1 bg-slate-100 border rounded text-xs">ESC</kbd> to exit full screen
            </div>
          </div>
        </div>
      )}

      <footer className="border-t py-4 px-4 md:px-6 bg-white mt-auto">
        <div className="max-w-[1920px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Personal Job CoPilot. All rights reserved.
          </p>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="/terms" className="text-xs hover:underline underline-offset-4">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-xs hover:underline underline-offset-4">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
