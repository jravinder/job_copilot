"use client"

import { type ReactNode, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AppSidebar } from "./app-sidebar"
import { SidebarProvider, SidebarTrigger, SidebarRail, SidebarInset } from "@/components/ui/sidebar"

interface AppLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
  showBackButton?: boolean
  backHref?: string
  jobTitle?: string
  companyName?: string
  actions?: ReactNode
}

export function AppLayout({
  children,
  title,
  subtitle,
  showBackButton = true,
  backHref = "/",
  jobTitle,
  companyName,
  actions,
}: AppLayoutProps) {
  const searchParams = useSearchParams()
  const [resumeData, setResumeData] = useState<any>(null)
  const currentSubStep = searchParams.get("step") || ""

  useEffect(() => {
    // Get resume data from localStorage
    const storedData = localStorage.getItem("resumeData")
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        setResumeData(parsedData)
      } catch (err) {
        console.error("Error parsing stored data:", err)
      }
    }
  }, [])

  return (
    <SidebarProvider>
      <AppSidebar resumeData={resumeData} currentSubStep={currentSubStep} />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <SidebarTrigger className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
          </SidebarTrigger>

          {showBackButton && (
            <Button variant="ghost" size="icon" asChild className="mr-2">
              <Link href={backHref}>
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
          )}

          <div className="flex-1">
            <h1 className="text-lg font-semibold">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>

          {(jobTitle || companyName) && (
            <div className="hidden md:block">
              <div className="flex items-center gap-2 rounded-lg border bg-card px-3 py-1.5">
                {jobTitle && <span className="text-sm font-medium">{jobTitle}</span>}
                {jobTitle && companyName && <span className="text-muted-foreground">•</span>}
                {companyName && <span className="text-sm text-muted-foreground">{companyName}</span>}
              </div>
            </div>
          )}

          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>

        <main className="flex-1 bg-background">{children}</main>

        <footer className="border-t py-4 px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">© 2024 Personal Job CoPilot. All rights reserved.</div>
            <div className="flex gap-4">
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link href="/help" className="text-sm text-muted-foreground hover:text-foreground">
                Help
              </Link>
            </div>
          </div>
        </footer>
      </SidebarInset>
      <SidebarRail />
    </SidebarProvider>
  )
}
