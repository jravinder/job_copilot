import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">About Personal Job CoPilot</h1>

        <div className="prose max-w-none">
          <p className="text-lg mb-4">
            Personal Job CoPilot is an innovative platform designed to help job seekers optimize their applications and
            improve their chances of landing their dream jobs.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Our Mission</h2>
          <p>
            Our mission is to democratize access to high-quality job application assistance and career coaching through
            the power of artificial intelligence.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">How It Works</h2>
          <p>
            Job Match AI Coach uses advanced natural language processing to analyze your resume alongside job
            descriptions, providing personalized feedback and actionable insights to improve your application materials.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Our Team</h2>
          <p>
            We are a team of AI specialists, career coaches, and HR professionals dedicated to helping job seekers
            navigate the complex job market with confidence.
          </p>
        </div>
      </div>
    </div>
  )
}
