import { Groq } from "groq-sdk"
import type { AnalysisResponse, AIAnalysisResult } from "@/types/analysis"

export async function analyzeResume({
  resumeText,
  jobDescription,
  companyName,
  notes,
}: {
  resumeText: string
  jobDescription: string
  companyName: string
  notes?: string
}): Promise<AnalysisResponse> {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY environment variable is not configured")
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    })

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert AI career coach and job application analyst. Your task is to analyze resumes and job descriptions.
          First, extract the job position/role from the job description.
          Then analyze the match between the resume and job requirements.

          For the cover letter (400-500 words):
          - Start with proper business letter formatting including date and addresses
          - Opening paragraph (100 words): Strong introduction mentioning the specific role and company, how you learned about the position, and a brief overview of why you're an excellent fit
          - Body paragraphs (200-250 words):
            * First body paragraph: Detail your relevant experience and key achievements
            * Second body paragraph: Connect your skills specifically to the company's needs and culture
            * Use specific numbers and metrics when possible
          - Closing paragraph (100 words): Express enthusiasm, request an interview, and provide contact information
          - Use proper spacing between paragraphs
          - End with a professional signature block

          For the cold email (250-300 words):
          - Clear, attention-grabbing subject line
          - Opening (50-75 words): Personalized introduction and connection point
          - Body (150 words):
            * Your background and relevant achievements
            * Specific reason for contacting them
            * Clear value proposition
          - Closing (50-75 words): Clear call to action and next steps
          - Professional signature block with contact details

          For the recruiter pitch (200-250 words):
          - Attention-grabbing opening hook about your unique value proposition
          - Professional journey summary with specific achievements
          - Current situation and career goals
          - Industry expertise and key skills relevant to the role
          - Specific interest in the company and role
          - Quantifiable impacts and results from past roles
          - Clear demonstration of culture fit
          - End with enthusiasm and clear interest in next steps

          You must ALWAYS respond with valid JSON that matches this exact structure:
          {
            "score": <number 0-100>,
            "position": <string: extracted job title>,
            "company": <string: company name>,
            "skills": {
              "matching": [<array of strings>],
              "missing": [<array of strings>]
            },
            "resumeSuggestions": [<array of strings>],
            "coverLetter": <string: properly formatted with line breaks>,
            "coldEmail": <string: properly formatted with line breaks>,
            "recruiterPitch": <string: conversational elevator pitch>,
            "linkedinSuggestions": [<array of strings>],
            "companyInsights": {
              "recentNews": <string>,
              "culture": <string>,
              "growthAreas": <string>,
              "interviewFocus": <string>
            },
            "interviewReadiness": <number 0-100>
          }`,
        },
        {
          role: "user",
          content: `Analyze this resume and job description:

          RESUME:
          ${resumeText}

          JOB DESCRIPTION:
          ${jobDescription}

          COMPANY:
          ${companyName}

          ADDITIONAL NOTES:
          ${notes || "None provided"}

          First extract the job position/role from the description, then provide a detailed analysis following these guidelines:
          1. Extract and include the job position/role
          2. Calculate a match score based on skills and requirements alignment
          3. Identify matching skills present in both resume and job description
          4. List important skills mentioned in job description but missing from resume
          5. Provide specific suggestions to improve the resume
          6. Generate a detailed, professional cover letter (400-500 words)
          7. Create a compelling cold email (250-300 words)
          8. Create a detailed recruiter pitch (200-250 words)
          9. Suggest LinkedIn networking strategies
          10. Provide company-specific insights
          11. Assess interview readiness

          Remember to return ONLY valid JSON matching the specified structure.`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 4000,
    })

    const response = completion.choices[0]?.message?.content

    if (!response || typeof response !== "string") {
      throw new Error("Invalid response from AI service")
    }

    try {
      // Parse the response into JSON
      const parsedResponse = JSON.parse(response.trim()) as AIAnalysisResult

      // Validate the required fields
      if (!parsedResponse.score || !parsedResponse.position || !parsedResponse.company) {
        throw new Error("Missing required fields in AI response")
      }

      // Format text content
      parsedResponse.coverLetter = parsedResponse.coverLetter
        .trim()
        .replace(/\n{3,}/g, "\n\n")
        .replace(/([.!?])\s*(?=\w)/g, "$1\n\n")

      parsedResponse.coldEmail = parsedResponse.coldEmail
        .trim()
        .replace(/\n{3,}/g, "\n\n")
        .replace(/Subject:/i, "\nSubject:")
        .replace(/Best regards,|Sincerely,|Best,/i, "\n\nBest regards,")

      parsedResponse.recruiterPitch = parsedResponse.recruiterPitch.trim().replace(/\n{3,}/g, "\n\n")

      return {
        success: true,
        data: parsedResponse,
      }
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError)
      console.error("Raw response:", response)
      throw new Error("Failed to parse AI response")
    }
  } catch (error) {
    console.error("Error in analyzeResume:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred during analysis",
    }
  }
}
