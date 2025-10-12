"use client"

import type React from "react"
import { Suspense, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { RootLayout } from "@/components/layout/root-layout"
import { supabase } from "@/lib/supabase"

function ResetPasswordConfirmContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [passwordError, setPasswordError] = useState("")

  useEffect(() => {
    const error = searchParams.get("error")
    const errorDescription = searchParams.get("error_description")

    if (error || errorDescription) {
      setStatus("error")
      setMessage(
        errorDescription?.replace(/\+/g, " ") ||
          "The password reset link is invalid or has expired. Please request a new password reset link.",
      )
    }

    const hash = window.location.hash
    if (hash && hash.includes("error=")) {
      const hashParams = new URLSearchParams(hash.substring(1))
      const hashErrorDescription = hashParams.get("error_description")

      if (hashErrorDescription) {
        setStatus("error")
        setMessage(
          hashErrorDescription.replace(/\+/g, " ") ||
            "The password reset link is invalid or has expired. Please request a new password reset link.",
        )
      }
    }
  }, [searchParams])

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters"
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter"
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter"
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number"
    }
    return ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setMessage("")
    setPasswordError("")

    const passwordValidationError = validatePassword(password)
    if (passwordValidationError) {
      setPasswordError(passwordValidationError)
      setStatus("idle")
      return
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match")
      setStatus("idle")
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) throw error

      setStatus("success")
      setMessage("Your password has been successfully reset. You can now log in with your new password.")
    } catch (error) {
      setStatus("error")
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to reset password. The link may be invalid or expired. Please request a new password reset.",
      )
    }
  }

  const handleRequestNewLink = () => {
    router.push("/reset-password")
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
            <CardDescription>
              {status === "error" ? "There was a problem with your reset link" : "Enter your new password below"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {status === "error" && (
              <div className="flex flex-col items-center justify-center p-6">
                <XCircle className="h-12 w-12 text-destructive mb-4" />
                <h3 className="text-xl font-semibold mb-2">Reset Link Expired</h3>
                <p className="text-center text-muted-foreground mb-4">{message}</p>
                <Button onClick={handleRequestNewLink}>Request New Reset Link</Button>
              </div>
            )}

            {status === "success" && (
              <div className="flex flex-col items-center justify-center p-6">
                <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Password Reset Successful</h3>
                <p className="text-center text-muted-foreground mb-4">{message}</p>
                <Button onClick={() => router.push("/login")}>Go to Login</Button>
              </div>
            )}

            {(status === "idle" || status === "loading") && status !== "error" && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={status === "loading"}
                  />
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 8 characters and include uppercase, lowercase, and numbers.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={status === "loading"}
                  />
                </div>
                {passwordError && (
                  <Alert variant="destructive">
                    <AlertDescription>{passwordError}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full" disabled={status === "loading"}>
                  {status === "loading" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resetting Password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            {status !== "error" && status !== "success" && (
              <div className="text-sm text-center text-muted-foreground">
                Remember your password?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Back to login
                </Link>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </RootLayout>
  )
}

export default function ResetPasswordConfirmPage() {
  return (
    <Suspense
      fallback={
        <RootLayout showHeader={false} showFooter={false}>
          <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Card className="w-full max-w-md">
              <CardContent className="flex flex-col items-center justify-center p-8">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-center text-muted-foreground">Loading...</p>
              </CardContent>
            </Card>
          </div>
        </RootLayout>
      }
    >
      <ResetPasswordConfirmContent />
    </Suspense>
  )
}
