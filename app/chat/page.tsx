"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Bot, SendHorizontal, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChat } from "ai/react"
import { useToast } from "@/components/ui/use-toast"

interface ChatContext {
  resumeText: string
  jobDescription: string
  companyName: string
  position: string
}

export default function ChatPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [chatContext, setChatContext] = useState<ChatContext | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Update the useChat hook initialization with modified system message handling
  const { messages, input, handleInputChange, handleSubmit, setInput, isLoading } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "context",
        role: "assistant", // Changed from 'system' to 'assistant'
        content: chatContext
          ? `I am an AI career coach helping with job applications. I have access to the following context:
           Position: ${chatContext.position}
           Company: ${chatContext.companyName}
           Resume: ${chatContext.resumeText}
           Job Description: ${chatContext.jobDescription}
           
           I will be concise and professional in my responses, using this context to provide specific, relevant advice.
           
           How can I help you today?`
          : "I am an AI career coach helping with job applications. I will be concise and professional in my responses. How can I help you today?",
      },
    ],
    onError: (error) => {
      console.error("Chat error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message. Please try again.",
        variant: "destructive",
      })
    },
  })

  useEffect(() => {
    // Check if user is logged in and get context data
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    try {
      // Get chat context from localStorage
      const storedContext = localStorage.getItem("chatContext")
      if (!storedContext) {
        throw new Error("No chat context found")
      }

      const parsedContext = JSON.parse(storedContext)
      if (!parsedContext.resumeText || !parsedContext.jobDescription) {
        throw new Error("Incomplete chat context")
      }

      setChatContext(parsedContext)
    } catch (error) {
      console.error("Error loading chat context:", error)
      toast({
        title: "Error",
        description: "Failed to load chat context. Redirecting to upload page...",
        variant: "destructive",
      })
      router.push("/upload")
    }
  }, [router, toast])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [])

  const suggestions = [
    "How can I improve my resume for this position?",
    "What skills should I highlight in my interview?",
    "Can you help me prepare for technical questions?",
    "What should I know about the company culture?",
    "How can I stand out from other candidates?",
  ]

  const handleSuggestionClick = async (suggestion: string) => {
    try {
      setInput(suggestion)
      const fakeEvent = new Event("submit") as any
      await handleSubmit(fakeEvent)
    } catch (error) {
      console.error("Error sending suggestion:", error)
      toast({
        title: "Error",
        description: "Failed to send suggestion. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!chatContext) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Loading chat context...</h2>
          <p className="text-sm text-muted-foreground">Please wait while we prepare your chat session.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Button variant="ghost" onClick={() => router.push("/results")}>
              ← Back to Results
            </Button>
          </div>
          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <h1 className="text-sm font-bold">AI Career Coach</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <div className="container flex flex-1 flex-col">
          <Card className="mt-4 flex flex-1 flex-col">
            {messages.length <= 1 && (
              <div className="p-4 border-b">
                <p className="text-sm text-muted-foreground mb-3">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleSuggestionClick(suggestion)}
                      disabled={isLoading}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message, index) => {
                  // Skip system messages
                  if (message.role === "system") return null

                  return (
                    <div
                      key={index}
                      className={`flex items-start gap-3 ${
                        message.role === "assistant" ? "flex-row" : "flex-row-reverse"
                      }`}
                    >
                      <div className={`rounded-full p-2 ${message.role === "assistant" ? "bg-primary" : "bg-muted"}`}>
                        {message.role === "assistant" ? (
                          <Bot className="h-4 w-4 text-primary-foreground" />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                      </div>
                      <div
                        className={`rounded-lg px-4 py-2 max-w-[80%] ${
                          message.role === "assistant" ? "bg-muted" : "bg-primary text-primary-foreground"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  )
                })}
                {isLoading && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Bot className="h-4 w-4 animate-pulse" />
                    <p className="text-sm">Thinking...</p>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="px-4 py-2 bg-muted/50 border-t text-xs text-muted-foreground">
              Using context for: {chatContext.position} at {chatContext.companyName}
            </div>

            <form onSubmit={handleSubmit} className="border-t p-4">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Ask me anything about the job application..."
                  value={input}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                  <SendHorizontal className="h-4 w-4" />
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
}

