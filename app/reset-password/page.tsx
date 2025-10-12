"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail } from "lucide-react"
import { RootLayout } from "@/components/layout/root-layout"
import { supabase } from "@/lib/supabase"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setMessage("")

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password/confirm`,
      })

      if (error) {
        throw error
      }

      setStatus("success")
      setMessage(`Password reset instructions have been sent to ${email}. Please check your inbox and spam folders.`)
    } catch (error) {
      console.error("Reset password error:", error)
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "Failed to send reset instructions. Please try again.")
    } finally {
      setStatus("success") // Always show success to prevent email enumeration
    }
  }

  return (
    <RootLayout showHeader={false} showFooter={false}>
      <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <Link href="/" className="flex items-center gap-2">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-xl font-bold">
                  Personal Job CoPilot
                </span>
              </Link>
            </div>
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <CardDescription>Enter your email to receive reset instructions</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {status === "success" && (
                <Alert>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <AlertDescription>{message}</AlertDescription>
                  </div>
                </Alert>
              )}
              {status === "error" && (
                <Alert variant="destructive">
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={status === "loading" || status === "success"}
                />
              </div>
              {status === "success" && (
                <div className="text-sm text-muted-foreground mt-2">
                  <p>
                    The reset link will expire in 1 hour. If you don't see the email, please check your spam folder.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              {status !== "success" ? (
                <Button type="submit" className="w-full" disabled={status === "loading"}>
                  {status === "loading" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Instructions...
                    </>
                  ) : (
                    "Send Reset Instructions"
                  )}
                </Button>
              ) : (
                <Button type="button" className="w-full" onClick={() => setStatus("idle")}>
                  Send Again
                </Button>
              )}
              <div className="text-sm text-center text-muted-foreground">
                Remember your password?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </RootLayout>
  )
}
