import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Brain, Star, Users, Zap, Trophy, Target, ListChecks, Mail, LineChart } from "lucide-react"
import { RootLayout } from "@/components/layout/root-layout"

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

export default function FeaturesPage() {
  return (
    <RootLayout>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          {/* Features Hero */}
          <section className="w-full pt-24 pb-12 md:py-24 lg:py-32 xl:py-48">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Powerful Features to{" "}
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      Land Your Dream Job
                    </span>
                  </h1>
                  <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                    Discover how our AI-powered tools can help you create winning job applications and stand out from
                    the competition.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Main Features Grid */}
          <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
            <div className="container mx-auto px-4 md:px-6">
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="relative group rounded-xl border p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
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

          {/* Why Choose Us Section */}
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container mx-auto px-4 md:px-6">
              <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Why Choose{" "}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Job CoPilot?
                  </span>
                </h2>
                <p className="text-gray-500 md:text-xl max-w-[800px] mx-auto">
                  Unlike traditional job boards, Job CoPilot doesn't just list jobs—it guides you through the entire
                  hiring process with AI-powered insights.
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {whyChooseUs.map((item, index) => (
                  <div
                    key={index}
                    className="relative group rounded-xl border p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
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

          {/* CTA Section */}
          <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Ready to Transform Your Job Search?
                  </h2>
                  <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Join thousands of professionals who have already discovered the power of AI-driven job searching.
                  </p>
                </div>
                <div className="space-x-4">
                  <Link href="/signup">
                    <Button size="lg" className="relative group">
                      Get Started Free
                    </Button>
                  </Link>
                  <Link href="/how-it-works">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </RootLayout>
  )
}
