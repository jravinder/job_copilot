"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Upload,
  FileText,
  Download,
  Save,
  Sparkles,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  X,
  Send,
  Loader2,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface AnalysisResult {
  section: "summary" | "experience" | "skills" | "education"
  missing: string[]
  atsScore: number
  suggestions: string[]
  matches: string[]
  weakItems: string[]
}

export default function ResumeEnhancerPage() {
  const [resume, setResume] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [analysis, setAnalysis] = useState<AnalysisResult[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])
  const [chatInput, setChatInput] = useState("")
  const [isChatLoading, setIsChatLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const jdInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "resume" | "jd") => {
    const file = e.target.files?.[0]
    if (!file) return

    // For now, handle text files - in production, use PDF/DOCX parser
    const text = await file.text()
    if (type === "resume") {
      setResume(text)
    } else {
      setJobDescription(text)
    }
  }

  const analyzeResume = async () => {
    if (!resume || !jobDescription) return

    setIsAnalyzing(true)

    try {
      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobDescription }),
      })

      const data = await response.json()
      setAnalysis(data.analysis)
    } catch (error) {
      console.error("[v0] Error analyzing resume:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const sendChatMessage = async () => {
    if (!chatInput.trim() || !resume || !jobDescription) return

    const userMessage = chatInput
    setChatMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setChatInput("")
    setIsChatLoading(true)

    try {
      const response = await fetch("/api/chat-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          resume,
          jobDescription,
          history: chatMessages,
        }),
      })

      const data = await response.json()
      setChatMessages((prev) => [...prev, { role: "assistant", content: data.message }])
    } catch (error) {
      console.error("[v0] Error in chat:", error)
    } finally {
      setIsChatLoading(false)
    }
  }

  const applySuggestion = (section: string, suggestion: string) => {
    // Add suggestion to resume
    setResume((prev) => {
      const sections = prev.split("\n\n")
      const sectionIndex = sections.findIndex((s) => s.toLowerCase().includes(section.toLowerCase()))
      if (sectionIndex !== -1) {
        sections[sectionIndex] += "\n" + suggestion
      }
      return sections.join("\n\n")
    })
  }

  const exportToPDF = () => {
    // In production, use jsPDF or similar
    const blob = new Blob([resume], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "resume-enhanced.txt"
    a.click()
  }

  const exportToDOCX = () => {
    // In production, use docx library
    const blob = new Blob([resume], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "resume-enhanced.txt"
    a.click()
  }

  const overallScore =
    analysis.length > 0 ? Math.round(analysis.reduce((acc, a) => acc + a.atsScore, 0) / analysis.length) : 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Personal Job CoPilot</h1>
            <Badge variant="secondary" className="ml-2">
              ATS Resume Enhancer
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportToDOCX}>
              <Save className="mr-2 h-4 w-4" />
              Save as DOCX
            </Button>
            <Button variant="outline" size="sm" onClick={exportToPDF}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 md:p-6">
        <div className="grid gap-6 lg:grid-cols-[350px_1fr]">
          {/* Left Panel - Upload Inputs */}
          <div className="space-y-4">
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Upload Documents
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Resume</label>
                  <div
                    className="cursor-pointer rounded-lg border-2 border-dashed border-muted-foreground/25 p-4 text-center hover:border-primary/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload or paste text</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.txt"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, "resume")}
                    />
                  </div>
                  <Textarea
                    placeholder="Or paste your resume here..."
                    value={resume}
                    onChange={(e) => setResume(e.target.value)}
                    className="mt-2 min-h-[150px]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Job Description</label>
                  <div
                    className="cursor-pointer rounded-lg border-2 border-dashed border-muted-foreground/25 p-4 text-center hover:border-primary/50 transition-colors"
                    onClick={() => jdInputRef.current?.click()}
                  >
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload or paste text</p>
                    <input
                      ref={jdInputRef}
                      type="file"
                      accept=".pdf,.docx,.txt"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, "jd")}
                    />
                  </div>
                  <Textarea
                    placeholder="Or paste job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="mt-2 min-h-[150px]"
                  />
                </div>

                <Button
                  onClick={analyzeResume}
                  disabled={!resume || !jobDescription || isAnalyzing}
                  className="w-full"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Analyze Resume vs JD
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* ATS Score Card */}
            {analysis.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="p-6">
                  <h3 className="mb-4 text-lg font-semibold">ATS Score</h3>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary mb-2">{overallScore}%</div>
                    <Progress value={overallScore} className="mb-4" />
                    <p className="text-sm text-muted-foreground">
                      {overallScore >= 80
                        ? "Excellent! Your resume is ATS-ready"
                        : overallScore >= 60
                          ? "Good, but needs improvement"
                          : "Needs significant optimization"}
                    </p>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Center Panel - Comparison & Editor */}
          <div className="space-y-6">
            {analysis.length === 0 ? (
              <Card className="p-12 text-center">
                <Sparkles className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Ready to Optimize Your Resume?</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Upload your resume and job description, then click "Analyze" to get ATS-ready suggestions with keyword
                  optimization and formatting improvements.
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {analysis.map((section, index) => (
                  <motion.div
                    key={section.section}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold capitalize">{section.section}</h3>
                        <Badge
                          variant={
                            section.atsScore >= 80 ? "default" : section.atsScore >= 60 ? "secondary" : "destructive"
                          }
                        >
                          {section.atsScore}% ATS Score
                        </Badge>
                      </div>

                      {/* Matches */}
                      {section.matches.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-green-600 mb-2 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Strong Matches ({section.matches.length})
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {section.matches.map((match, i) => (
                              <Badge key={i} variant="outline" className="bg-green-50 border-green-200 text-green-700">
                                {match}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Missing Keywords */}
                      {section.missing.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-yellow-600 mb-2 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Missing Keywords ({section.missing.length})
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {section.missing.map((item, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="bg-yellow-50 border-yellow-200 text-yellow-700"
                              >
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Weak Items */}
                      {section.weakItems.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-red-600 mb-2 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Weak / Irrelevant ({section.weakItems.length})
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {section.weakItems.map((item, i) => (
                              <Badge key={i} variant="outline" className="bg-red-50 border-red-200 text-red-700">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* AI Suggestions */}
                      {section.suggestions.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-primary mb-2 flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            AI Suggestions
                          </h4>
                          {section.suggestions.map((suggestion, i) => (
                            <div key={i} className="bg-primary/5 rounded-lg p-3 flex items-start justify-between gap-2">
                              <p className="text-sm flex-1">{suggestion}</p>
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => applySuggestion(section.section, suggestion)}
                                >
                                  Insert
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setResume(suggestion)
                                  }}
                                >
                                  Replace
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Resume Editor */}
            {analysis.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Enhanced Resume</h3>
                <Textarea
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  className="min-h-[400px] font-mono text-sm"
                />
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      {resume && jobDescription && (
        <>
          <Button
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
            size="icon"
          >
            <MessageSquare className="h-6 w-6" />
          </Button>

          {/* Chat Modal */}
          <AnimatePresence>
            {isChatOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 flex items-end justify-end p-6"
                onClick={() => setIsChatOpen(false)}
              >
                <motion.div
                  initial={{ x: 400, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 400, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-background rounded-lg shadow-2xl w-full max-w-md h-[600px] flex flex-col"
                >
                  <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">AI Resume Coach</h3>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setIsChatOpen(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {chatMessages.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        <p className="mb-4">Ask me anything about optimizing your resume!</p>
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-left justify-start bg-transparent"
                            onClick={() => setChatInput("Rewrite my Summary to increase ATS score")}
                          >
                            "Rewrite my Summary to increase ATS score"
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-left justify-start bg-transparent"
                            onClick={() => setChatInput("Add keywords for data analytics")}
                          >
                            "Add keywords for data analytics"
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-left justify-start bg-transparent"
                            onClick={() => setChatInput("Generate an ATS-friendly cover letter")}
                          >
                            "Generate an ATS-friendly cover letter"
                          </Button>
                        </div>
                      </div>
                    ) : (
                      chatMessages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                    {isChatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg p-3">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Ask about ATS optimization..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            sendChatMessage()
                          }
                        }}
                        className="min-h-[60px] resize-none"
                      />
                      <Button onClick={sendChatMessage} disabled={!chatInput.trim() || isChatLoading} size="icon">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}
