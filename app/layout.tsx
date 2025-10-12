import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Personal Job CoPilot - Find Your Next Job Faster",
  description: "AI-powered job search assistant that helps you find and land your next job faster.",
  keywords: "job search, AI assistant, resume builder, interview prep, career help",
  openGraph: {
    title: "Personal Job CoPilot - Find Your Next Job Faster",
    description: "AI-powered job search assistant that helps you find and land your next job faster.",
    type: "website",
    locale: "en_US",
    url: "https://personaljobcopilot.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Personal Job CoPilot - Find Your Next Job Faster",
    description: "AI-powered job search assistant that helps you find and land your next job faster.",
  },
  icons: {
    icon: "/favicon.ico",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
