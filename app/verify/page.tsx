"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { RootLayout } from "@/components/layout/root-layout"
import { supabase } from "@/lib/supabase"

function VerifyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function verifyEmail() {
      try {
        const checkStatus = searchParams.get("status")
        const userEmail = searchParams.get("email")

        if (checkStatus === "check-email") {
          setStatus("loading")
          setMessage(`Please check your email (${userEmail}) for a verification link.`)
          return
        }

        const hash = window.location.hash

        if (hash && hash.includes("access_token")) {
          const params = new URLSearchParams(hash.substring(1))
          const accessToken = params.get("access_token")
          const refreshToken = params.get("refresh_token")
          const type = params.get("type")

          if (accessToken && type === "signup") {
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken!,
            })

            if (sessionError) throw sessionError

            setStatus("success")
            setMessage("Email verified successfully! You can now sign in.")
            return
          }
        }

        const type = searchParams.get("type")

        if (userEmail && type === "signup") {
          setStatus("success")
          setMessage("Email verified successfully! You can now sign in.")
        } else if (!checkStatus) {
          throw new Error("Invalid verification link")
        }
      } catch (error) {
        setStatus("error")
        setMessage(
          error instanceof Error ? error.message : "Unable to verify your email. The link may be invalid or expired.",
        )
      }
    }

    verifyEmail()
  }, [searchParams])

  const handleResendVerification = async () => {
    try {
      const userEmail = searchParams.get("email")
      if (!userEmail) {
        throw new Error("No email address found")
      }

      setStatus("loading")
      setMessage("Resending verification email...")

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          resend: true,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to resend verification email")
      }

      setStatus("loading")
      setMessage("Verification email has been resent. Please check your inbox.")
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "Failed to resend verification email")
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
            <CardTitle className="text-2xl font-bold text-center">Email Verification</CardTitle>
            <CardDescription className="text-center">
              {status === "loading" && "Verifying your email address..."}
              {status === "success" && "Your email has been verified!"}
              {status === "error" && "Verification Failed"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center p-6">
              {status === "loading" && (
                <>
                  <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                  <p className="text-center text-muted-foreground">
                    {message || "Please wait while we verify your email address..."}
                  </p>
                </>
              )}
              {status === "success" && (
                <>
                  <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Email Verified!</h3>
                  <p className="text-center text-muted-foreground">
                    Your email has been successfully verified. You can now sign in to your account.
                  </p>
                </>
              )}
              {status === "error" && (
                <>
                  <XCircle className="h-12 w-12 text-destructive mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Verification Failed</h3>
                  <p className="text-center text-muted-foreground mb-4">
                    {message || "We couldn't verify your email. The link may be expired or invalid."}
                  </p>
                  <Button onClick={handleResendVerification} variant="outline">
                    Resend Verification Email
                  </Button>
                </>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            {status === "success" && <Button onClick={() => router.push("/login")}>Sign In</Button>}
            {status === "error" && (
              <Button variant="outline" onClick={() => router.push("/signup")}>
                Back to Sign Up
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </RootLayout>
  )
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <RootLayout showHeader={false} showFooter={false}>
          <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Card className="w-full max-w-md">
              <CardContent className="flex flex-col items-center justify-center p-8">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-center text-muted-foreground">Loading verification...</p>
              </CardContent>
            </Card>
          </div>
        </RootLayout>
      }
    >
      <VerifyContent />
    </Suspense>
  )
}
