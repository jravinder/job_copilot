"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Briefcase,
  FileText,
  MessageSquare,
  ArrowLeft,
  Download,
  Copy,
  CheckCircle,
  AlertCircle,
  Info,
  User,
  Mail,
  Linkedin,
  FileCheck,
  ExternalLink,
} from "lucide-react"
import type { AIAnalysisResult } from "@/types/analysis"

interface ResumeData {
  resumeText: string
  jobDescription: string
  companyName?: string
  position?: string
  analysis?: AIAnalysisResult | null
}

export default function ResultsPage() {
  const router = useRouter()
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [copyStatus, setCopyStatus] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    const storedData = localStorage.getItem("resumeData")
    if (!storedData) {
      router.push("/upload")
      return
    }

    try {
      const parsed = JSON.parse(storedData)
      if (!parsed.resumeText || !parsed.jobDescription || !parsed.analysis) {
        router.push("/upload")
        return
      }
      setResumeData(parsed)
    } catch {
      router.push("/upload")
    }
  }, [router])

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus({ ...copyStatus, [section]: "Copied!" })
      setTimeout(() => setCopyStatus({ ...copyStatus, [section]: "" }), 2000)
    })
  }

  const downloadAsText = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  if (!resumeData?.analysis) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-yellow-500" />
          <h1 className="mt-4 text-xl font-bold">No Analysis Data</h1>
          <p className="mt-2 text-gray-600">Please complete the analysis first.</p>
          <Button className="mt-4" onClick={() => router.push("/upload")}>
            Start Over
          </Button>
        </div>
      </div>
    )
  }

  const { analysis } = resumeData
  const position = resumeData.position || "Position"
  const companyName = resumeData.companyName || "Company"

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-30 shadow-sm">
        <div className="flex h-16 items-center justify-between px-6 max-w-[1920px] mx-auto">
          <div className="flex items-center gap-3">
            <Briefcase className="h-5 w-5 text-blue-600" />
            <div>
              <h1 className="font-semibold">{position}</h1>
              <p className="text-sm text-muted-foreground">{companyName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/chat">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/analysis">
                <FileText className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1920px] mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Match Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  Match Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center py-4">
                  <div className={`text-5xl font-bold ${getScoreColor(analysis.matchScore)} mb-2`}>
                    {analysis.matchScore}%
                  </div>
                  <Progress value={analysis.matchScore} className="w-full h-2 mb-4" />
                  <p className="text-sm text-center text-muted-foreground">
                    {analysis.matchScore >= 80
                      ? "Excellent match!"
                      : analysis.matchScore >= 60
                        ? "Good match"
                        : "Needs improvement"}
                  </p>
                </div>

                <div className="space-y-4 mt-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Matching Skills ({analysis.matchingSkills.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.matchingSkills.map((skill, i) => (
                        <Badge key={i} variant="outline" className="bg-green-50 text-green-700">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      Skills to Develop ({analysis.missingSkills.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.missingSkills.map((skill, i) => (
                        <Badge key={i} variant="outline" className="bg-amber-50 text-amber-700">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interview Readiness */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Interview Readiness
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Readiness</span>
                    <span className={`font-bold ${getScoreColor(analysis.interviewReadiness)}`}>
                      {analysis.interviewReadiness}%
                    </span>
                  </div>
                  <Progress value={analysis.interviewReadiness} className="h-2" />
                </div>

                <div className="space-y-3 text-sm">
                  {[
                    { title: "Company Research", content: analysis.companyInsights.recentNews },
                    { title: "Culture Fit", content: analysis.companyInsights.culture },
                    { title: "Growth Areas", content: analysis.companyInsights.growthAreas },
                    { title: "Interview Focus", content: analysis.companyInsights.interviewFocus },
                  ].map((item, i) => (
                    <div key={i} className="p-3 bg-blue-50 rounded-md border border-blue-100">
                      <h4 className="font-medium text-blue-800 mb-1">{item.title}</h4>
                      <p className="text-blue-700 text-xs">{item.content || "No insights available"}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <Tabs defaultValue="overview" className="w-full">
                  <div className="border-b p-4">
                    <TabsList className="grid grid-cols-4 w-full">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
                      <TabsTrigger value="email">Email</TabsTrigger>
                      <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="overview" className="p-6 m-0">
                    <h3 className="text-lg font-semibold mb-4">Application Recommendations</h3>
                    <div className="space-y-3">
                      {analysis.resumeSuggestions.map((suggestion, i) => (
                        <div key={i} className="p-4 border rounded-md hover:bg-slate-50">
                          <div className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-sm font-medium">
                              {i + 1}
                            </div>
                            <p className="text-sm">{suggestion}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-md">
                      <div className="flex gap-3">
                        <Info className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-green-800">Next Steps</h4>
                          <p className="text-sm text-green-700 mt-1">
                            Review the suggestions and update your materials using the templates provided.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="cover-letter" className="p-6 m-0">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <FileCheck className="h-5 w-5 text-blue-600" />
                        Cover Letter
                      </h3>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(analysis.coverLetter, "coverLetter")}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          {copyStatus.coverLetter || "Copy"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadAsText(analysis.coverLetter, `cover-letter-${companyName}.txt`)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>

                    <div className="p-6 border rounded-md bg-white prose max-w-none">
                      {analysis.coverLetter.split("\n\n").map((p, i) => (
                        <p key={i} className="mb-4">
                          {p}
                        </p>
                      ))}
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-md">
                      <h4 className="font-medium text-blue-800 mb-2">Tips</h4>
                      <ul className="text-sm text-blue-700 space-y-1 list-disc pl-4">
                        <li>Personalize with specific examples</li>
                        <li>Address to hiring manager by name</li>
                        <li>Keep to one page</li>
                        <li>Proofread carefully</li>
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="email" className="p-6 m-0">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Mail className="h-5 w-5 text-blue-600" />
                        Cold Email
                      </h3>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(analysis.coldEmail, "coldEmail")}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          {copyStatus.coldEmail || "Copy"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadAsText(analysis.coldEmail, `email-${companyName}.txt`)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>

                    <div className="p-6 border rounded-md bg-white prose max-w-none">
                      {analysis.coldEmail.split("\n\n").map((p, i) => (
                        <p key={i} className="mb-4">
                          {p}
                        </p>
                      ))}
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-md">
                      <h4 className="font-medium text-blue-800 mb-2">Email Tips</h4>
                      <ul className="text-sm text-blue-700 space-y-1 list-disc pl-4">
                        <li>Use clear subject line</li>
                        <li>Keep brief and focused</li>
                        <li>Personalize for recipient</li>
                        <li>Follow up after 1-2 weeks</li>
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="linkedin" className="p-6 m-0">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Linkedin className="h-5 w-5 text-blue-600" />
                      LinkedIn Optimization
                    </h3>

                    <div className="space-y-3">
                      {analysis.linkedinSuggestions.map((suggestion, i) => (
                        <div key={i} className="p-4 border rounded-md hover:bg-slate-50">
                          <div className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-sm font-medium">
                              {i + 1}
                            </div>
                            <p className="text-sm">{suggestion}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-md">
                      <h4 className="font-medium text-amber-800 mb-2">Best Practices</h4>
                      <ul className="text-sm text-amber-700 space-y-1 list-disc pl-4">
                        <li>Use professional photo</li>
                        <li>Create compelling headline</li>
                        <li>Highlight unique value</li>
                        <li>Get skill endorsements</li>
                      </ul>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-3 bg-white"
                        onClick={() => window.open("https://linkedin.com", "_blank")}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open LinkedIn
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-4 px-6 bg-white mt-6">
        <div className="max-w-[1920px] mx-auto flex justify-between items-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Job Match AI Coach</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
