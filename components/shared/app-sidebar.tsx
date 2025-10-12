"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowLeft, ArrowRight, FileText, Briefcase, CheckCircle, ChevronRight, HelpCircle } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface AppSidebarProps {
  resumeData?: {
    resumeText: string
    jobDescription: string
    companyName?: string
    position?: string
  }
  currentStep?: string
  currentSubStep?: string
}

export function AppSidebar({ resumeData, currentStep = "", currentSubStep = "" }: AppSidebarProps) {
  const pathname = usePathname()

  // Determine which context we're in based on the pathname
  const isJobMatcherFlow =
    pathname.includes("/upload") || pathname.includes("/analysis") || pathname.includes("/results")

  // Define the job matcher workflow steps
  const jobMatcherSteps = [
    {
      id: "upload",
      label: "Upload Materials",
      href: "/upload",
      icon: FileText,
      description: "Upload your resume and job description",
    },
    {
      id: "analysis",
      label: "Review & Optimize",
      href: "/analysis",
      icon: Briefcase,
      description: "Review and optimize your application materials",
      subSteps: [
        {
          id: "resume",
          label: "Resume Analysis",
          href: "/analysis?step=resume",
        },
        {
          id: "job",
          label: "Job Description Analysis",
          href: "/analysis?step=job",
        },
        {
          id: "keywords",
          label: "Keywords & Skills",
          href: "/analysis?step=keywords",
        },
        {
          id: "ats",
          label: "ATS Optimization",
          href: "/analysis?step=ats",
        },
      ],
    },
    {
      id: "results",
      label: "View Results",
      href: "/results",
      icon: CheckCircle,
      description: "View your personalized job match analysis",
    },
  ]

  // Check if a step is active
  const isStepActive = (stepId: string) => {
    if (stepId === "upload" && pathname === "/upload") return true
    if (stepId === "analysis" && pathname === "/analysis") return true
    if (stepId === "results" && pathname === "/results") return true
    return false
  }

  // Check if a step is completed
  const isStepCompleted = (stepId: string) => {
    if (stepId === "upload" && (pathname === "/analysis" || pathname === "/results")) return true
    if (stepId === "analysis" && pathname === "/results") return true
    return false
  }

  // Check if a sub-step is active
  const isSubStepActive = (subStepId: string) => {
    return currentSubStep === subStepId
  }

  // Calculate overall progress
  const calculateProgress = () => {
    if (pathname === "/upload") return 33
    if (pathname === "/analysis") return 66
    if (pathname === "/results") return 100
    return 0
  }

  return (
    <Sidebar>
      <SidebarHeader className="py-4">
        <div className="flex items-center px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold">
              PJ
            </div>
            <span className="font-bold text-lg">Job CoPilot</span>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {isJobMatcherFlow ? (
          <>
            {/* Job Matcher Workflow Context */}
            <SidebarGroup>
              <SidebarGroupLabel>Job Application</SidebarGroupLabel>
              <SidebarGroupContent>
                {resumeData?.position && resumeData?.companyName && (
                  <div className="px-4 py-2 mb-2 bg-muted/50 rounded-md">
                    <h3 className="font-medium text-sm">{resumeData.position}</h3>
                    <p className="text-xs text-muted-foreground">{resumeData.companyName}</p>
                  </div>
                )}

                <div className="px-4 mb-4">
                  <Progress value={calculateProgress()} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{calculateProgress()}% complete</p>
                </div>

                <SidebarMenu>
                  {jobMatcherSteps.map((step) => (
                    <SidebarMenuItem key={step.id}>
                      <SidebarMenuButton asChild isActive={isStepActive(step.id)} tooltip={step.description}>
                        <Link href={step.href} className="relative">
                          {isStepCompleted(step.id) ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <step.icon className="h-4 w-4" />
                          )}
                          <span>{step.label}</span>
                          {step.subSteps && isStepActive(step.id) && <ChevronRight className="h-4 w-4 ml-auto" />}
                        </Link>
                      </SidebarMenuButton>

                      {/* Show sub-steps only for the active step */}
                      {step.subSteps && isStepActive(step.id) && (
                        <div className="pl-8 mt-1 space-y-1">
                          {step.subSteps.map((subStep) => (
                            <Button
                              key={subStep.id}
                              variant="ghost"
                              size="sm"
                              asChild
                              className={`w-full justify-start text-sm h-8 ${
                                isSubStepActive(subStep.id)
                                  ? "bg-accent text-accent-foreground font-medium"
                                  : "text-muted-foreground"
                              }`}
                            >
                              <Link href={subStep.href}>{subStep.label}</Link>
                            </Button>
                          ))}
                        </div>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarSeparator />

            {/* Quick Actions */}
            <SidebarGroup>
              <SidebarGroupLabel>Actions</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/dashboard">
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {pathname === "/upload" && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="/analysis">
                          <span>Continue to Review</span>
                          <ArrowRight className="h-4 w-4 ml-auto" />
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}

                  {pathname === "/analysis" && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="/results">
                          <span>View Results</span>
                          <ArrowRight className="h-4 w-4 ml-auto" />
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        ) : (
          // Dashboard or other contexts - show minimal context-specific options
          <SidebarGroup>
            <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/upload">
                      <FileText className="h-4 w-4" />
                      <span>Start New Job Match</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <div className="px-4 py-2">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link href="/help">
              <HelpCircle className="h-4 w-4 mr-2" />
              <span>Help & Support</span>
            </Link>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
