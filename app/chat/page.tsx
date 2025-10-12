"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MessageSquare, Briefcase, Send, Sparkles, Bot, User } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RootLayout } from "@/components/layout/root-layout"
import { useAuth } from "@/hooks/use-auth"
import { chatWithAI } from "../actions/chat"
import type { AIAnalysisResult } from "@/types/analysis"

interface ResumeData {
  resumeText: string
  jobDescription: string
  companyName?: string
  position?: string
  notes?: string
  analysis?: AIAnalysisResult | null
  timestamp?: string
}

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function ChatPage() {
  const { user, loading, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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

      // Set the data
      setResumeData(parsedData)

      // Initialize with a welcome message
      if (messages.length === 0) {
        const position = parsedData.position || "this position"
        const company = parsedData.companyName || "this company"

        setMessages([
          {
            role: "assistant",
            content: `Hello! I'm your AI job application assistant. I've analyzed your resume and the job description for ${position} at ${company}. How can I help you today? You can ask me about:
            
• How to improve your resume for this role
• Tips for the interview process
• Information about the company
• How to address specific requirements in the job description
• Help with crafting responses to potential interview questions`,
            timestamp: new Date(),
          },
        ])
      }
    } catch (err) {
      console.error("Error initializing page:", err)
      setError("Failed to load resume data")
      router.push("/upload")
    }
  }, [router, messages.length])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !resumeData) return

    // Add user message
    const userMessage: Message = {
      role: "user",
      content: newMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")
    setIsLoading(true)
    setError(null)

    try {
      // Get all previous messages for context
      const messageHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      // Add the new user message
      messageHistory.push({
        role: "user",
        content: newMessage,
      })

      // Call the AI
      const response = await chatWithAI({
        messages: messageHistory,
        resumeText: resumeData.resumeText,
        jobDescription: resumeData.jobDescription,
        companyName: resumeData.companyName,
        position: resumeData.position,
      })

      if (!response.success) {
        throw new Error(response.error || "Failed to get response")
      }

      // Add AI response
      const assistantMessage: Message = {
        role: "assistant",
        content: response.data || "I'm sorry, I couldn't generate a response. Please try again.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      console.error("Chat error:", err)
      setError(
        err instanceof Error ? err.message : "An error occurred while processing your request. Please try again.",
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Extract position and company name properly
  const position = resumeData?.position || "Software Engineer"
  const companyName = resumeData?.companyName || "Company"

  if (loading) {
    return (
      <RootLayout>
        <div className="flex min-h-screen items-center justify-center">Loading...</div>
      </RootLayout>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top navigation bar */}
      <header className="border-b bg-background">
        <div className="flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-semibold">Personal Job CoPilot</span>
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
      <div className="bg-blue-600 text-white">
        <div className="flex items-center justify-between px-4 py-4 md:px-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            <h1 className="text-xl font-semibold">Personal Job CoPilot</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" asChild>
              <Link href="/dashboard" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
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
      <div className="bg-slate-50 border-b">
        <div className="px-4 py-4 md:px-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <h2 className="text-lg font-medium">
              {position} at {companyName}
            </h2>
          </div>
          <p className="text-slate-600 mt-1">Chat with AI about your job application</p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === "user" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {message.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    <span className="text-sm font-medium">{message.role === "assistant" ? "AI Assistant" : "You"}</span>
                  </div>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 min-h-[60px]"
              disabled={isLoading}
            />
            <Button onClick={handleSendMessage} disabled={!newMessage.trim() || isLoading} className="self-end">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </div>

      <footer className="border-t py-4 px-4 md:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
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
