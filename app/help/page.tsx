import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Help Center</h1>

        <p className="text-lg mb-8">Find answers to frequently asked questions about using Personal Job CoPilot.</p>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How do I get started with Job Match AI Coach?</AccordionTrigger>
            <AccordionContent>
              To get started, create an account, upload your resume, and enter a job description you're interested in.
              Our AI will analyze both and provide personalized feedback and recommendations.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>Is my data secure?</AccordionTrigger>
            <AccordionContent>
              Yes, we take data security seriously. Your resume and personal information are encrypted and stored
              securely. We do not share your information with third parties without your consent.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>How accurate is the AI analysis?</AccordionTrigger>
            <AccordionContent>
              Our AI uses advanced natural language processing to provide accurate analysis, but it's designed to be a
              tool to assist you, not replace human judgment. We recommend using the AI's suggestions as a starting
              point for your own revisions.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>Can I use Job Match AI Coach for multiple job applications?</AccordionTrigger>
            <AccordionContent>
              Yes, you can use our service for as many job applications as you'd like. We recommend tailoring your
              resume for each position to maximize your match score.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>How do I update my account information?</AccordionTrigger>
            <AccordionContent>
              You can update your account information by going to your profile settings. From there, you can change your
              email, password, and other account details.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-12 p-6 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Need more help?</h2>
          <p className="mb-4">
            If you couldn't find the answer to your question, feel free to contact our support team.
          </p>
          <Link href="#" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}
