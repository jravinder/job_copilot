"use client"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, Plus, LayoutDashboard } from "lucide-react"
import { RootLayout } from "@/components/layout/root-layout"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const { user, loading, logout, isAuthenticated } = useAuth()

  if (loading) {
    return (
      <RootLayout>
        <div className="flex min-h-screen items-center justify-center">Loading...</div>
      </RootLayout>
    )
  }

  return (
    <RootLayout isAuthenticated={isAuthenticated} userName={user?.name || ""} onLogout={logout}>
      <div className="flex flex-col min-h-screen">
        <main className="container py-6">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-blue-600 text-white p-2 rounded-full">
                  <LayoutDashboard className="h-5 w-5" />
                </div>
                <h1 className="text-xl font-semibold text-blue-600">Dashboard</h1>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/upload" className="gap-2">
                  <Upload className="h-4 w-4" />
                  New Application
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/analysis">
              <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-xl">New Analysis</CardTitle>
                  <Plus className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <CardDescription className="min-h-[60px]">
                    Upload your resume and a job description to get a new analysis.
                  </CardDescription>
                  <div className="mt-4 flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xl">Recent Analyses</CardTitle>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription className="min-h-[60px]">
                  You haven&apos;t performed any analyses yet. Start by creating a new one.
                </CardDescription>
                <div className="mt-4 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xl">Your Profile</CardTitle>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription className="min-h-[60px]">
                  Complete your profile to get more personalized job recommendations.
                </CardDescription>
                <div className="mt-4 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground">
                    {user?.name?.charAt(0)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Personal Job CoPilot. All rights reserved.
          </p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link href="/terms" className="text-xs hover:underline underline-offset-4">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-xs hover:underline underline-offset-4">
              Privacy
            </Link>
          </nav>
        </footer>
      </div>
    </RootLayout>
  )
}
