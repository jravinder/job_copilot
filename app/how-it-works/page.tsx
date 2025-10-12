import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Brain, FileEdit, Users } from "lucide-react"
import { RootLayout } from "@/components/layout/root-layout"

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

export default function HowItWorksPage() {
  return (
    <RootLayout>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          {/* Hero Section */}
          <section className="w-full pt-24 pb-12 md:py-24 lg:py-32 xl:py-48">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    How{" "}
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      Job CoPilot
                    </span>{" "}
                    Works
                  </h1>
                  <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                    Your AI-powered job search assistant that helps you land your dream job in four simple steps.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Steps Section */}
          <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
            <div className="container mx-auto px-4 md:px-6">
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {howItWorks.map((step, index) => (
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

          {/* Product Screenshots */}
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container mx-auto px-4 md:px-6">
              <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  See How{" "}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    It Works
                  </span>
                </h2>
                <p className="text-gray-500 md:text-xl max-w-[800px] mx-auto">
                  Our AI-powered platform analyzes your resume, matches it with job requirements, and provides
                  actionable insights in three simple steps.
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-3">
                {/* Step 1 */}
                <div className="relative group">
                  <div className="absolute -inset-px bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity rounded-xl blur" />
                  <div className="relative bg-white rounded-xl border p-6 hover:shadow-xl transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold mb-4">
                      1
                    </div>
                    <h3 className="text-xl font-bold mb-2">Start New Analysis</h3>
                    <p className="text-muted-foreground mb-4">
                      Upload your resume and paste the job description you're interested in.
                    </p>
                    <div className="aspect-[4/3] rounded-lg overflow-hidden border bg-muted/50">
                      <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/step_1-xDoLi5U9FuX6bcllKX92OcypjIKm43.png"
                        alt="Dashboard interface"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative group">
                  <div className="absolute -inset-px bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity rounded-xl blur" />
                  <div className="relative bg-white rounded-xl border p-6 hover:shadow-xl transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold mb-4">
                      2
                    </div>
                    <h3 className="text-xl font-bold mb-2">Review Content</h3>
                    <p className="text-muted-foreground mb-4">
                      Our AI analyzes your resume against the job requirements in real-time.
                    </p>
                    <div className="aspect-[4/3] rounded-lg overflow-hidden border bg-muted/50">
                      <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/step_2-5fo0HJCVoGZqQN1gJd8J2GORZebXGE.png"
                        alt="Analysis interface"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative group">
                  <div className="absolute -inset-px bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity rounded-xl blur" />
                  <div className="relative bg-white rounded-xl border p-6 hover:shadow-xl transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold mb-4">
                      3
                    </div>
                    <h3 className="text-xl font-bold mb-2">Get Insights</h3>
                    <p className="text-muted-foreground mb-4">
                      Receive detailed analysis, suggestions, and tailored recommendations.
                    </p>
                    <div className="aspect-[4/3] rounded-lg overflow-hidden border bg-muted/50">
                      <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/step_3-Ss0AVYM8QMK5sm0MKqDmB5mN1falpL.png"
                        alt="Results interface"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Get Started?</h2>
                  <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Join thousands of job seekers who have already discovered the power of AI-driven job searching.
                  </p>
                </div>
                <div className="space-x-4">
                  <Link href="/signup">
                    <Button size="lg" className="relative group">
                      Try Job CoPilot Free
                    </Button>
                  </Link>
                  <Link href="/pricing">
                    <Button size="lg" variant="outline">
                      View Pricing
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="w-full border-t bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center">
              <p className="text-xs text-gray-500">© {new Date().getFullYear()} Job CoPilot. All rights reserved.</p>
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
    </RootLayout>
  )
}
