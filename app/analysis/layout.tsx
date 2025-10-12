"use client"

import type React from "react"

import { SidebarProvider } from "@/components/ui/sidebar"

export default function AnalysisLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen">{children}</div>
    </SidebarProvider>
  )
}
