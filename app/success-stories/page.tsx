import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function SuccessStoriesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Success Stories</h1>

        <p className="text-lg mb-8">Read how Job Match AI Coach has helped job seekers land their dream jobs.</p>

        <div className="grid gap-10">
          {[
            {
              name: "Sarah Johnson",
              role: "UX Designer at Tech Co",
              image: "/placeholder.svg?height=80&width=80",
              story:
                "After 3 months of job searching with no callbacks, I used Job Match AI Coach to optimize my resume. Within 2 weeks, I had 5 interviews and landed my dream job at Tech Co.",
            },
            {
              name: "Michael Chen",
              role: "Data Scientist at Analytics Inc",
              image: "/placeholder.svg?height=80&width=80",
              story:
                "The skills analysis feature helped me identify gaps in my resume that were causing me to miss out on opportunities. After addressing these gaps, I received an offer for a position that paid 30% more than my previous role.",
            },
            {
              name: "Jessica Williams",
              role: "Marketing Manager at Brand Co",
              image: "/placeholder.svg?height=80&width=80",
              story:
                "The personalized cover letter suggestions were game-changing. I went from generic templates to compelling stories that showcased my experience. My interview-to-application ratio improved dramatically.",
            },
          ].map((testimonial, i) => (
            <div key={i} className="border rounded-lg p-6 shadow-sm">
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={testimonial.image} alt={testimonial.name} />
                  <AvatarFallback>
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">{testimonial.name}</h2>
                  <p className="text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="italic">"{testimonial.story}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
