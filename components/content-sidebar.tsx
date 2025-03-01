"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sidebar, SidebarContent, SidebarHeader, SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit2, Save, X, Loader2 } from "lucide-react"
import type { BulletPoints } from "@/app/actions/extract-bullets"
import { extractBulletPoints } from "@/app/actions/extract-bullets"

interface ContentSidebarProps {
  resumeText: string
  jobDescription: string
  onUpdateResume: (text: string) => void
  onUpdateJobDescription: (text: string) => void
}

export function ContentSidebar({
  resumeText,
  jobDescription,
  onUpdateResume,
  onUpdateJobDescription,
}: ContentSidebarProps) {
  // Use the sidebar context
  const { state } = useSidebar()

  const [editingResume, setEditingResume] = useState(false)
  const [editingJob, setEditingJob] = useState(false)
  const [tempResume, setTempResume] = useState(resumeText || "")
  const [tempJob, setTempJob] = useState(jobDescription || "")
  const [bulletPoints, setBulletPoints] = useState<BulletPoints | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const loadBulletPoints = useCallback(async () => {
    if (!resumeText?.trim() || !jobDescription?.trim()) return

    setIsLoading(true)
    setBulletPoints(null) // Clear previous results

    try {
      // Add retry logic
      const maxRetries = 2
      let retryCount = 0
      let points: BulletPoints | null = null

      while (retryCount < maxRetries) {
        try {
          points = await extractBulletPoints({ resumeText, jobDescription })
          break // If successful, exit the retry loop
        } catch (retryError) {
          retryCount++
          if (retryCount === maxRetries) throw retryError
          // Wait before retrying (exponential backoff)
          await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, retryCount)))
        }
      }

      if (points) {
        // Check if we got any actual data
        const hasData =
          Object.values(points.resume).some((arr) => arr.length > 0) ||
          Object.values(points.jobDescription).some((arr) => arr.length > 0)

        if (!hasData) {
          throw new Error("No bullet points could be extracted")
        }

        setBulletPoints(points)
      }
    } catch (error) {
      console.error("Error extracting bullet points:", error)
      // Show error state but keep the structure
      setBulletPoints({
        resume: {
          skills: [],
          experience: [],
          education: [],
          highlights: [],
        },
        jobDescription: {
          requirements: [],
          responsibilities: [],
          benefits: [],
          keyPoints: [],
        },
      })
    } finally {
      setIsLoading(false)
    }
  }, [resumeText, jobDescription])

  // Add a retry button component
  const RetryButton = () => (
    <Button size="sm" variant="outline" onClick={loadBulletPoints} disabled={isLoading} className="mt-2">
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Retrying...
        </>
      ) : (
        "Retry Analysis"
      )}
    </Button>
  )

  // Update the BulletPointSection component to include better styling and interactivity
  const BulletPointSection = ({
    title,
    points,
    color = "primary",
  }: {
    title: string | React.ReactNode
    points: string[]
    color?: string
  }) => (
    <div className="mb-6">
      {typeof title === "string" ? (
        <h3 className="text-sm font-semibold mb-3 text-primary/90">{title}</h3>
      ) : (
        <h3 className="text-sm font-semibold mb-3">{title}</h3>
      )}
      {Array.isArray(points) && points.length > 0 ? (
        <ul className="space-y-2">
          {points.map((point, index) => (
            <li key={index} className="group flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
              <span className="flex-shrink-0 size-1.5 rounded-full bg-primary/20 mt-2 group-hover:bg-primary/40 transition-colors" />
              <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">{point}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-sm text-muted-foreground bg-muted/50 rounded-md p-4">
          <div className="mb-2">No {typeof title === "string" ? title.toLowerCase() : "items"} found</div>
          <RetryButton />
        </div>
      )}
    </div>
  )

  const handleSaveResume = () => {
    onUpdateResume(tempResume)
    setEditingResume(false)
  }

  const handleSaveJob = () => {
    onUpdateJobDescription(tempJob)
    setEditingJob(false)
  }

  useEffect(() => {
    if (resumeText?.trim() && jobDescription?.trim()) {
      loadBulletPoints()
    }
  }, [loadBulletPoints, resumeText, jobDescription])

  return (
    <Sidebar className="border-r w-[300px] flex-shrink-0">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Application Content</h2>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={loadBulletPoints} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Loader2 className="h-4 w-4 mr-2" />
                  Analyze Content
                </>
              )}
            </Button>
            <SidebarTrigger />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <Tabs defaultValue="resume" className="w-full">
          <TabsList className="w-full grid grid-cols-2 p-1 bg-muted/50">
            <TabsTrigger
              value="resume"
              className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm"
            >
              Resume {isLoading && <Loader2 className="h-3 w-3 ml-2 animate-spin" />}
            </TabsTrigger>
            <TabsTrigger
              value="job"
              className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm"
            >
              Job Description {isLoading && <Loader2 className="h-3 w-3 ml-2 animate-spin" />}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resume" className="mt-0">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Resume Content</h3>
                {editingResume ? (
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setEditingResume(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                    <Button size="sm" onClick={handleSaveResume}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                ) : (
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button size="sm" variant="ghost" onClick={() => setEditingResume(true)}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[400px] sm:w-[540px]" aria-describedby="sheet-description">
                      <SheetHeader>
                        <SheetTitle>Edit Application Content</SheetTitle>
                        <p id="sheet-description" className="text-sm text-muted-foreground">
                          Make changes to your resume and job description content.
                        </p>
                      </SheetHeader>
                      {editingResume ? (
                        <Textarea
                          value={tempResume}
                          onChange={(e) => setTempResume(e.target.value)}
                          className="min-h-[300px]"
                        />
                      ) : null}
                      <div className="flex justify-end mt-4">
                        <Button size="sm" onClick={handleSaveResume}>
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                )}
              </div>

              <ScrollArea className="h-[calc(100vh-12rem)]">
                {!editingResume ? (
                  <div className="space-y-4">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    ) : bulletPoints ? (
                      <>
                        <BulletPointSection
                          title={
                            <div className="flex items-center gap-2">
                              <span className="size-2 rounded-full bg-blue-500/20" />
                              Skills
                            </div>
                          }
                          points={bulletPoints.resume.skills}
                        />
                        <BulletPointSection
                          title={
                            <div className="flex items-center gap-2">
                              <span className="size-2 rounded-full bg-green-500/20" />
                              Experience
                            </div>
                          }
                          points={bulletPoints.resume.experience}
                        />
                        <BulletPointSection
                          title={
                            <div className="flex items-center gap-2">
                              <span className="size-2 rounded-full bg-purple-500/20" />
                              Education
                            </div>
                          }
                          points={bulletPoints.resume.education}
                        />
                        <BulletPointSection
                          title={
                            <div className="flex items-center gap-2">
                              <span className="size-2 rounded-full bg-amber-500/20" />
                              Highlights
                            </div>
                          }
                          points={bulletPoints.resume.highlights}
                        />
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">
                          Failed to extract bullet points. Click below to try again.
                        </p>
                        <Button onClick={loadBulletPoints} disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <Loader2 className="h-4 w-4 mr-2" />
                              Analyze Content
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                ) : null}
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="job" className="mt-0">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Job Description</h3>
                {editingJob ? (
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setEditingJob(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                    <Button size="sm" onClick={handleSaveJob}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                ) : (
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button size="sm" variant="ghost" onClick={() => setEditingJob(true)}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[400px] sm:w-[540px]" aria-describedby="sheet-description">
                      <SheetHeader>
                        <SheetTitle>Edit Application Content</SheetTitle>
                        <p id="sheet-description" className="text-sm text-muted-foreground">
                          Make changes to your resume and job description content.
                        </p>
                      </SheetHeader>
                      {editingJob ? (
                        <Textarea
                          value={tempJob}
                          onChange={(e) => setTempJob(e.target.value)}
                          className="min-h-[300px]"
                        />
                      ) : null}
                      <div className="flex justify-end mt-4">
                        <Button size="sm" onClick={handleSaveJob}>
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                )}
              </div>

              <ScrollArea className="h-[calc(100vh-12rem)]">
                {!editingJob ? (
                  <div className="space-y-4">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    ) : (
                      bulletPoints && (
                        <>
                          <BulletPointSection
                            title={
                              <div className="flex items-center gap-2">
                                <span className="size-2 rounded-full bg-red-500/20" />
                                Requirements
                              </div>
                            }
                            points={bulletPoints.jobDescription.requirements}
                          />
                          <BulletPointSection
                            title={
                              <div className="flex items-center gap-2">
                                <span className="size-2 rounded-full bg-indigo-500/20" />
                                Responsibilities
                              </div>
                            }
                            points={bulletPoints.jobDescription.responsibilities}
                          />
                          <BulletPointSection
                            title={
                              <div className="flex items-center gap-2">
                                <span className="size-2 rounded-full bg-teal-500/20" />
                                Benefits
                              </div>
                            }
                            points={bulletPoints.jobDescription.benefits}
                          />
                          <BulletPointSection
                            title={
                              <div className="flex items-center gap-2">
                                <span className="size-2 rounded-full bg-orange-500/20" />
                                Key Points
                              </div>
                            }
                            points={bulletPoints.jobDescription.keyPoints}
                          />
                        </>
                      )
                    )}
                  </div>
                ) : null}
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </SidebarContent>
    </Sidebar>
  )
}

