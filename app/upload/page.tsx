"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Briefcase, Building, Upload, ArrowLeft } from "lucide-react"
import { RootLayout } from "@/components/layout/root-layout"
import { useAuth } from "@/hooks/use-auth"

export default function UploadPage() {
  const { user, loading, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const [resumeText, setResumeText] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [position, setPosition] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!resumeText.trim() || !jobDescription.trim()) {
      alert("Please provide both resume and job description")
      return
    }

    setIsUploading(true)

    try {
      // Store the data in localStorage
      localStorage.setItem(
        "resumeData",
        JSON.stringify({
          resumeText,
          jobDescription,
          companyName,
          position,
          timestamp: new Date().toISOString(),
        }),
      )

      // Navigate to the analysis page
      router.push("/analysis")
    } catch (error) {
      console.error("Error saving data:", error)
      alert("There was an error saving your data. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  if (loading) {
    return (
      <RootLayout>
        <div className="flex min-h-screen items-center justify-center">Loading...</div>
      </RootLayout>
    )
  }

  return (
    <RootLayout isAuthenticated={isAuthenticated} userName={user?.name || ""} onLogout={logout}>
      {/* Header with navigation - styled exactly like results page */}
      <div className="bg-blue-600 text-white py-4 mb-6">
        <div className="container">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              <h1 className="text-xl font-semibold">Personal Job CoPilot</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" asChild>
                <Link href="/dashboard" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="container py-6">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Resume
                </CardTitle>
                <CardDescription>Paste the content of your resume</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <Textarea
                    placeholder="Paste your resume text here..."
                    className="min-h-[300px]"
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Job Description
                  </CardTitle>
                  <CardDescription>Paste the job description you're applying for</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <Textarea
                      placeholder="Paste the job description here..."
                      className="min-h-[200px]"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-primary" />
                    Additional Information
                  </CardTitle>
                  <CardDescription>Optional details about the position</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="company">Company Name</Label>
                      <Input
                        id="company"
                        placeholder="e.g., Acme Corporation"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="position">Position Title</Label>
                      <Input
                        id="position"
                        placeholder="e.g., Senior Software Engineer"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <Button variant="outline" asChild>
              <Link href="/dashboard">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? "Uploading..." : "Continue to Analysis"}
            </Button>
          </div>
        </form>
      </main>
    </RootLayout>
  )
}
