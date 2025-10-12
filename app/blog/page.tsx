import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Blog</h1>

        <div className="grid gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-2">How to Optimize Your Resume for ATS Systems</h2>
              <p className="text-gray-600 mb-4">Published on March {i + 7}, 2024</p>
              <p className="mb-4">
                In today's competitive job market, getting past Applicant Tracking Systems (ATS) is the first hurdle.
                Learn how to format your resume to ensure it gets seen by human recruiters.
              </p>
              <Link href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                Read more →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
