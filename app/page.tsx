"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  CheckCircle,
  Zap,
  Trophy,
  Target,
  FileText,
  Search,
  Sparkles,
  Shield,
  MessageSquare,
} from "lucide-react"
import { motion } from "framer-motion"

// Key benefits focused on immediate job search success
const keyBenefits = [
  {
    title: "Match Your Perfect Job",
    description: "AI-powered job matching that finds opportunities aligned with your skills and experience.",
    icon: Target,
  },
  {
    title: "Stand Out Instantly",
    description: "Customize your applications in minutes with tailored resumes and cover letters.",
    icon: Sparkles,
  },
  {
    title: "Interview With Confidence",
    description: "Get prepared with job-specific interview questions and winning answers.",
    icon: MessageSquare,
  },
  {
    title: "Apply Securely",
    description: "Your applications stay private and secure - you control where they go.",
    icon: Shield,
  },
]

const features = [
  {
    title: "Smart Job Matching",
    description: "Get instant feedback on how well you match each job and what you can improve.",
    icon: Target,
  },
  {
    title: "Quick Application Tools",
    description: "Generate customized resumes and cover letters in minutes, not hours.",
    icon: Zap,
  },
  {
    title: "Interview Preparation",
    description: "Practice with AI that knows the job requirements and your background.",
    icon: MessageSquare,
  },
  {
    title: "Job Search Companion",
    description: "Track applications, deadlines, and follow-ups all in one place.",
    icon: Search,
  },
]

const stats = [
  { value: "2x", label: "More Interviews" },
  { value: "80%", label: "Less Time Applying" },
  { value: "93%", label: "Match Accuracy" },
  { value: "24/7", label: "AI Support" },
]

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-sm fixed w-full z-50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 font-bold text-xl">
              <span className="text-primary">Personal Job CoPilot</span>
            </div>
            <nav className="flex gap-4 sm:gap-6">
              <Link href="/features" className="text-sm font-medium hover:text-primary transition-colors">
                Features
              </Link>
              <Link href="/how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
                How It Works
              </Link>
              <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
                Pricing
              </Link>
              <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
                Login
              </Link>
              <Link href="/signup" className="text-sm font-medium hover:text-primary transition-colors">
                Sign Up
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full pt-24 pb-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-background to-accent/5" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            <div className="grid gap-6 lg:grid-cols-[1fr,400px] lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
                    <Zap className="mr-1 h-4 w-4" />
                    Your AI Job Search Partner
                  </div>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl lg:text-6xl/none">
                    Land Your Next Job{" "}
                    <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient">
                      Faster & Easier
                    </span>
                  </h1>
                  <p className="max-w-[600px] text-gray-600 md:text-xl dark:text-gray-400">
                    Stop spending hours on applications. Get personalized AI help to match jobs, customize applications,
                    and ace interviews - all while staying true to yourself.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/login">
                    <Button size="lg" className="relative group">
                      <span className="relative z-10">Find Your Next Job</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-100 group-hover:opacity-0 transition-opacity rounded-md" />
                      <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity rounded-md" />
                      <ArrowRight className="relative z-10 h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="group">
                    See Success Stories
                    <div className="relative ml-2 h-4 w-4 transition-transform group-hover:scale-110">
                      <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                      <div className="relative rounded-full bg-primary/40 h-full w-full" />
                    </div>
                  </Button>
                </div>
                <div className="flex items-center gap-4 mt-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold text-primary">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Demo Card */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-xl blur-md opacity-30 animate-pulse" />
                <div className="relative bg-card rounded-xl shadow-xl overflow-hidden border">
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
                        AI
                      </div>
                      <div>
                        <div className="font-semibold">Job Match Analysis</div>
                        <div className="text-sm text-muted-foreground">Analyzing your application...</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {[
                        {
                          icon: <CheckCircle className="h-5 w-5 text-primary" />,
                          text: "95% match with Senior Developer role",
                        },
                        {
                          icon: <Target className="h-5 w-5 text-primary" />,
                          text: "Key skills identified: React, TypeScript",
                        },
                        {
                          icon: <Sparkles className="h-5 w-5 text-primary" />,
                          text: "Customizing your application...",
                        },
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.5,
                            delay: index * 0.2,
                            ease: [0.4, 0, 0.2, 1],
                          }}
                          className="flex items-center gap-2 text-sm p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                        >
                          {item.icon}
                          {item.text}
                        </motion.div>
                      ))}
                    </div>
                    <div className="pt-4">
                      <div className="text-sm font-medium mb-2">Application Strength</div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full w-[95%] bg-gradient-to-r from-primary to-secondary animate-[progressBar_2s_ease-in-out]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-muted/50">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Land Your Next Job in{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  3 Simple Steps
                </span>
              </h2>
              <p className="text-gray-600 md:text-xl max-w-[800px] mx-auto">
                No more spending hours on applications. Our AI helps you apply smarter and faster.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  step: 1,
                  title: "Upload Your Resume",
                  description: "Share your resume and let our AI analyze your strengths.",
                  icon: FileText,
                },
                {
                  step: 2,
                  title: "Match & Apply",
                  description: "Get instant job matches and customize applications in minutes.",
                  icon: Target,
                },
                {
                  step: 3,
                  title: "Interview & Succeed",
                  description: "Prepare with AI and land your next role.",
                  icon: Trophy,
                },
              ].map((step, index) => (
                <div key={index} className="relative group">
                  <div className="absolute -inset-px bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity rounded-xl blur" />
                  <div className="relative bg-white rounded-xl border p-6 hover:shadow-xl transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold mb-4">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-muted/50 to-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Real People,{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Real Jobs
                </span>
              </h2>
              <p className="text-gray-600 md:text-xl max-w-[800px] mx-auto">
                See how others landed their dream jobs with Personal Job CoPilot.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  quote:
                    "From application to offer in just 2 weeks! The AI helped me perfectly match my experience to the job requirements.",
                  author: "David Chen",
                  role: "Senior Developer at Tech Co",
                  time: "2 weeks to offer",
                },
                {
                  quote:
                    "The interview prep was spot-on. Every question the AI helped me prepare for came up in the actual interview.",
                  author: "Sarah Miller",
                  role: "Product Manager at StartupX",
                  time: "3 interviews, 1 offer",
                },
                {
                  quote:
                    "Applied to 5 jobs with customized applications in one afternoon. Got 3 interviews and 2 offers!",
                  author: "James Wilson",
                  role: "Data Scientist at DataCorp",
                  time: "5 applications, 2 offers",
                },
              ].map((story, index) => (
                <div
                  key={index}
                  className="relative group rounded-xl border p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
                >
                  <div className="absolute -inset-px bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity rounded-xl blur" />
                  <div className="relative">
                    <p className="text-lg mb-4 italic text-gray-600">{story.quote}</p>
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold">
                        {story.author[0]}
                      </div>
                      <div>
                        <div className="font-semibold">{story.author}</div>
                        <div className="text-sm text-muted-foreground">{story.role}</div>
                        <div className="text-xs text-primary mt-1">{story.time}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-background to-secondary/10" />
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-2xl mx-auto text-center space-y-8">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Land{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Your Next Job?
                </span>
              </h2>
              <p className="text-gray-600 md:text-xl">
                Join thousands who've already found their perfect job match. Start for free today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/login">
                  <Button size="lg" className="relative group w-full sm:w-auto">
                    <span className="relative z-10">Start Your Job Search</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-100 group-hover:opacity-0 transition-opacity rounded-md" />
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity rounded-md" />
                    <ArrowRight className="relative z-10 h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t bg-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center">
            <p className="text-xs text-gray-600">
              © {new Date().getFullYear()} Personal Job CoPilot. All rights reserved.
            </p>
            <nav className="sm:ml-auto flex gap-4 sm:gap-6">
              <Link href="#" className="text-xs hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-xs hover:text-primary transition-colors">
                Privacy
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
