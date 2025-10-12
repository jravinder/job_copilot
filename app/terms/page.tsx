import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

        <div className="prose max-w-none">
          <p className="text-lg mb-4">
            By using Job Match AI Coach, you agree to these Terms of Service. Please read them carefully.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part of
            the terms, you may not access the service.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">2. Use of Service</h2>
          <p>
            Our service is designed to help job seekers improve their application materials. You agree to use the
            service only for its intended purpose and in compliance with all applicable laws.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">3. User Accounts</h2>
          <p>
            When you create an account with us, you must provide accurate and complete information. You are responsible
            for safeguarding the password and for all activities that occur under your account.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">4. Content Ownership</h2>
          <p>
            You retain all rights to your content. By uploading content to our service, you grant us a license to use,
            store, and process that content for the purpose of providing our service to you.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">5. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. We will provide notice of significant changes by
            posting the new Terms on our website.
          </p>
        </div>
      </div>
    </div>
  )
}
