import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"
import { RootLayout } from "@/components/layout/root-layout"

const plans = [
  {
    name: "Free",
    description: "Perfect for trying out Job CoPilot",
    price: "$0",
    duration: "forever",
    features: [
      "3 job applications per month",
      "Basic resume analysis",
      "Simple cover letter generation",
      "Limited company insights",
      "Email support",
    ],
  },
  {
    name: "Pro",
    description: "Best for active job seekers",
    price: "$19",
    duration: "per month",
    features: [
      "Unlimited job applications",
      "Advanced AI analysis",
      "Custom cover letter generation",
      "Full company insights",
      "Interview preparation",
      "LinkedIn optimization",
      "Priority support",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For teams and organizations",
    price: "Custom",
    duration: "per organization",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Custom AI training",
      "API access",
      "Dedicated support",
      "Custom integrations",
      "Analytics dashboard",
    ],
  },
]

export default function PricingPage() {
  return (
    <RootLayout>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          {/* Pricing Hero */}
          <section className="w-full pt-24 pb-12 md:py-24 lg:py-32 xl:py-48">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Simple, Transparent{" "}
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      Pricing
                    </span>
                  </h1>
                  <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                    Choose the perfect plan for your job search journey. No hidden fees, cancel anytime.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Plans */}
          <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
            <div className="container mx-auto px-4 md:px-6">
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {plans.map((plan) => (
                  <Card
                    key={plan.name}
                    className={`relative flex flex-col p-6 bg-white ${
                      plan.popular
                        ? "border-primary shadow-lg scale-105 lg:scale-110"
                        : "border-gray-200 hover:border-primary/50"
                    } transition-all duration-200`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-0 right-0 mx-auto w-fit px-4 py-1 rounded-full bg-primary text-white text-sm font-medium">
                        Most Popular
                      </div>
                    )}

                    <div className="mb-4">
                      <h3 className="text-2xl font-bold">{plan.name}</h3>
                      <p className="text-gray-500 mt-1">{plan.description}</p>
                    </div>

                    <div className="mb-6">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-gray-500">/{plan.duration}</span>
                    </div>

                    <ul className="space-y-3 mb-6 flex-1">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-primary flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button className={plan.popular ? "" : "bg-gray-900 hover:bg-gray-800"} size="lg" asChild>
                      <Link href="/signup">{plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}</Link>
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container mx-auto px-4 md:px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
                <p className="text-gray-500 mt-2">Have questions? We're here to help.</p>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    q: "Can I cancel my subscription?",
                    a: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.",
                  },
                  {
                    q: "What payment methods do you accept?",
                    a: "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.",
                  },
                  {
                    q: "Is there a free trial?",
                    a: "Yes, our Free plan lets you try core features without any time limit. You can upgrade anytime.",
                  },
                  {
                    q: "Do you offer refunds?",
                    a: "Yes, we offer a 30-day money-back guarantee if you're not satisfied with your Pro subscription.",
                  },
                  {
                    q: "What support do you provide?",
                    a: "We offer email support for Free users and priority support with live chat for Pro users. Enterprise gets dedicated support.",
                  },
                  {
                    q: "Can I switch plans?",
                    a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
                  },
                ].map((faq, index) => (
                  <div key={index} className="p-6 bg-white rounded-lg border hover:border-primary/50 transition-colors">
                    <h3 className="font-bold mb-2">{faq.q}</h3>
                    <p className="text-gray-600">{faq.a}</p>
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
                    Start Your Job Search Journey Today
                  </h2>
                  <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Try Job CoPilot free and experience the power of AI-driven job searching.
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
