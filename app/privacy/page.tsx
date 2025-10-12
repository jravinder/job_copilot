import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

        <div className="prose max-w-none">
          <p className="text-lg mb-4">
            At Personal Job CoPilot, we take your privacy seriously. This Privacy Policy explains how we collect, use,
            and protect your personal information.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as your name, email address, resume content, and job
            descriptions you upload or enter into our system.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
          <p>
            We use your information to provide and improve our services, including analyzing your resume and job
            descriptions to provide personalized feedback and recommendations.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information against unauthorized access,
            alteration, disclosure, or destruction.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p>
            If you have any questions about our Privacy Policy, please contact us at privacy@jobmatchai.example.com.
          </p>
        </div>
      </div>
    </div>
  )
}
