"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  Zap,
  Trophy,
  Target,
  Brain,
  FileText,
  FileEdit,
  ListChecks,
  Mail,
  LineChart,
  Users2,
  GraduationCap,
  Rocket,
  LinkIcon,
} from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    title: "Smart Resume Analysis",
    description: "Get instant AI-powered feedback on your resume with specific suggestions for improvement.",
    icon: Brain,
  },
  {
    title: "Real-Time Match Score",
    description: "See exactly how well you match each job with our dynamic scoring system.",
    icon: Target,
  },
  {
    title: "Interview Success Kit",
    description: "Get personalized interview prep, custom questions, and winning response strategies.",
    icon: Trophy,
  },
  {
    title: "AI Cover Letter Writer",
    description: "Generate tailored cover letters that highlight your most relevant experience.",
    icon: Zap,
  },
  {
    title: "Network Intelligence",
    description: "Get smart networking suggestions and LinkedIn optimization tips.",
    icon: Users,
  },
  {
    title: "Company Insights",
    description: "Access detailed company analysis and culture fit predictions.",
    icon: Star,
  },
]

const stats = [
  { value: "85%", label: "Success Rate" },
  { value: "2.5x", label: "Interview Rate" },
  { value: "75%", label: "Time Saved" },
  { value: "92%", label: "User Satisfaction" },
]

const MUIColors = {
  primary: {
    main: "#6200EE",
  },
}

// Add new sections data
const howItWorks = [
  {
    step: 1,
    title: "Upload Resume & Paste Job Description",
    description: "Simply upload your resume and paste any job description you're interested in.",
    icon: FileText,
  },
  {
    step: 2,
    title: "AI Analyzes Your Fit & Identifies Skill Gaps",
    description: "Our AI engine analyzes your qualifications and identifies areas for improvement.",
    icon: Brain,
  },
  {
    step: 3,
    title: "Get Personalized Resume Edits & Cover Letter Suggestions",
    description: "Receive tailored suggestions to optimize your resume and create compelling cover letters.",
    icon: FileEdit,
  },
  {
    step: 4,
    title: "Receive AI-Powered Networking & Interview Prep",
    description: "Get personalized interview questions and networking strategies.",
    icon: Users,
  },
]

const whyChooseUs = [
  {
    title: "AI-Powered Resume Matching",
    description: "Instantly analyzes fit with a job description using advanced AI algorithms.",
    icon: Target,
  },
  {
    title: "Personalized Action Plan",
    description: "Tailored resume tips, networking advice, and skill-building steps.",
    icon: ListChecks,
  },
  {
    title: "Intelligent Cover Letter & Email Drafting",
    description: "Saves time and makes applications stand out with AI-generated content.",
    icon: Mail,
  },
  {
    title: "Company Insights & Hiring Trends",
    description: "Get insider knowledge to strengthen applications and stay ahead.",
    icon: LineChart,
  },
]

const whyItMatters = [
  {
    title: "Universal Career Guidance",
    description: "Helps job seekers from all backgrounds get professional career guidance.",
    icon: Users2,
  },
  {
    title: "Smarter Applications",
    description: "Makes job applications faster & smarter with AI-powered insights.",
    icon: Zap,
  },
  {
    title: "Professional Growth",
    description: "Bridges skill gaps & empowers professionals to grow in their careers.",
    icon: GraduationCap,
  },
]

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-sm fixed w-full z-50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 font-bold text-xl">
              <span className="text-primary">Job CoPilot</span>
            </div>
            <nav className="flex gap-4 sm:gap-6">
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
                    Powered by Advanced AI
                  </div>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl lg:text-6xl/none bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient">
                    Land Your Dream Job with AI-Powered Insights
                  </h1>
                  <p className="max-w-[600px] text-gray-600 md:text-xl dark:text-gray-400">
                    Transform your job search with personalized AI coaching. Get instant resume analysis, match scores,
                    and tailored strategies to stand out.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/login">
                    <Button size="lg" className="relative group">
                      <span className="relative z-10">Get Started Free</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-100 group-hover:opacity-0 transition-opacity rounded-md" />
                      <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity rounded-md" />
                      <ArrowRight className="relative z-10 h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="group">
                    Watch Demo
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
                        <div className="font-semibold">Job CoPilot AI Coach</div>
                        <div className="text-sm text-muted-foreground">Analyzing your profile...</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {[
                        {
                          icon: <CheckCircle className="h-5 w-5" style={{ color: MUIColors.primary.main }} />,
                          text: "Strong match with Frontend Developer roles",
                        },
                        {
                          icon: <CheckCircle className="h-5 w-5" style={{ color: MUIColors.primary.main }} />,
                          text: "React & TypeScript expertise detected",
                        },
                        {
                          icon: <CheckCircle className="h-5 w-5" style={{ color: MUIColors.primary.main }} />,
                          text: "85% match with current job market demands",
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
                      <div className="text-sm font-medium mb-2">Match Score</div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full w-[85%] bg-gradient-to-r from-primary to-secondary animate-[progressBar_2s_ease-in-out]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Job CoPilot Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-muted/50">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Why Choose{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Job CoPilot?
                </span>
              </h2>
              <p className="text-gray-600 md:text-xl max-w-[800px] mx-auto">
                Unlike traditional job boards, Job CoPilot doesn't just list jobs—it guides you through the entire
                hiring process with AI-powered insights.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {whyChooseUs.map((item, index) => (
                <div
                  key={index}
                  className="relative group rounded-xl border p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-muted/50 to-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                How It Works —{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Your AI Job Search Assistant
                </span>
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {howItWorks.map((step, index) => (
                <div key={index} className="relative group">
                  <div className="absolute -inset-px bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity rounded-xl blur" />
                  <div className="relative bg-background rounded-xl border p-6 hover:shadow-xl transition-all duration-300">
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

        {/* Why This Matters Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-muted/50">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Why This{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Matters
                </span>
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {whyItMatters.map((item, index) => (
                <div
                  key={index}
                  className="relative group rounded-xl border p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* New CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-background to-secondary/10" />
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-2xl mx-auto text-center space-y-8">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Land Your Next Job{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Faster?
                </span>
              </h2>
              <p className="text-gray-600 md:text-xl">🚀 Upload your resume & let AI supercharge your job search!</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/login">
                  <Button size="lg" className="relative group w-full sm:w-auto">
                    <span className="relative z-10">Try Job CoPilot Now</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-100 group-hover:opacity-0 transition-opacity rounded-md" />
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity rounded-md" />
                    <ArrowRight className="relative z-10 h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-muted/50">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Everything You Need to{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Stand Out
                </span>
              </h2>
              <p className="text-gray-600 md:text-xl max-w-[800px] mx-auto">
                Our AI-powered platform provides all the tools you need to craft the perfect application and land your
                dream job.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="relative group rounded-xl border p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How Job CoPilot Works Under the Hood */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-muted/50 to-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                How Job CoPilot Works{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Under the Hood
                </span>
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Rocket,
                  title: "Built with Vercel v0",
                  description: "Fast & responsive web experience",
                },
                {
                  icon: Brain,
                  title: "AI-Powered Insights",
                  description: "Llama 3.3 analyzes resumes & job descriptions",
                },
                {
                  icon: LinkIcon,
                  title: "Smart Job Matching",
                  description: "LinkedIn & market insights for tailored job recommendations",
                },
                {
                  icon: LineChart,
                  title: "Personalized Coaching",
                  description: "Resume fixes, interview prep, networking tips",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="relative group rounded-xl border p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link href="/login">
                <Button size="lg" className="relative group">
                  <span className="relative z-10">📌 Try Job CoPilot Now</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-100 group-hover:opacity-0 transition-opacity rounded-md" />
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity rounded-md" />
                  <ArrowRight className="relative z-10 h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-background to-secondary/10" />
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-2xl mx-auto text-center space-y-8">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Transform Your{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Job Search?
                </span>
              </h2>
              <p className="text-gray-600 md:text-xl">
                Join thousands of professionals who have already discovered the power of AI-driven job searching.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/login">
                  <Button size="lg" className="relative group w-full sm:w-auto">
                    <span className="relative z-10">Get Started Free</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-100 group-hover:opacity-0 transition-opacity rounded-md" />
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity rounded-md" />
                    <ArrowRight className="relative z-10 h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  View Pricing
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t bg-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center">
            <p className="text-xs text-gray-600">© {new Date().getFullYear()} Job CoPilot. All rights reserved.</p>
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

