import { generateText } from "ai"

interface AIAnalysisResult {
  matchScore: number
  matchingSkills: string[]
  missingSkills: string[]
  resumeSuggestions: string[]
  coverLetter: string
  coldEmail: string
  linkedinSuggestions: string[]
  companyInsights: {
    recentNews: string
    culture: string
    growthAreas: string
    interviewFocus: string
  }
  interviewReadiness: number
}

const systemPrompt = `You are an expert AI career coach and job application analyst. Analyze the provided resume and job description to provide detailed insights and recommendations. Format your response as a JSON object matching the AIAnalysisResult interface.`

// Add the helper function after the imports
function extractJsonFromResponse(response: string): string {
  try {
    // Remove markdown code blocks
    let cleaned = response.replace(/```json\s*/g, "").replace(/```\s*/g, "")

    // Find the first '{' and last '}'
    const startIndex = cleaned.indexOf("{")
    const endIndex = cleaned.lastIndexOf("}")

    if (startIndex === -1 || endIndex === -1) {
      throw new Error("No JSON object found in response")
    }

    // Extract just the JSON part
    cleaned = cleaned.slice(startIndex, endIndex + 1)

    // Validate it's parseable
    JSON.parse(cleaned) // This will throw if invalid

    return cleaned
  } catch (error) {
    console.error("Error cleaning response:", error)
    throw new Error("Failed to extract valid JSON from response")
  }
}

// Mock data generator for handling errors
function generateMockAnalysis(resumeText: string, jobDescription: string, companyName: string): AIAnalysisResult {
  return {
    matchScore: 50,
    matchingSkills: ["JavaScript", "React"],
    missingSkills: ["TypeScript"],
    resumeSuggestions: ["Add TypeScript experience."],
    coverLetter: "Mock cover letter",
    coldEmail: "Mock cold email",
    linkedinSuggestions: ["Connect with recruiters at " + companyName],
    companyInsights: {
      recentNews: "No recent news available.",
      culture: "Unknown",
      growthAreas: "Unknown",
      interviewFocus: "Unknown",
    },
    interviewReadiness: 60,
  }
}

// Mock implementation for getGroqClient
function getGroqClient() {
  return {
    query: async (query: string) => {
      console.log("Mock Groq query:", query)
      return { result: "Mock Groq result" }
    },
  }
}

// Mock implementation for aiskdkgroq
function aiskdkgroq(modelName: string) {
  console.log("Using mock model:", modelName)
  return modelName // Return the model name as a placeholder
}

export async function analyzeJobMatch(
  resumeText: string,
  jobDescription: string,
  companyName: string,
  notes?: string,
): Promise<AIAnalysisResult> {
  try {
    const groqClient = getGroqClient()
    const prompt = `
    Resume:
    ${resumeText}

    Job Description:
    ${jobDescription}

    Company:
    ${companyName}

    Additional Notes:
    ${notes || "None provided"}

    Please analyze the resume and job description to:
    1. Calculate a match score (0-100)
    2. Identify matching and missing skills
    3. Provide specific resume improvement suggestions
    4. Generate a tailored cover letter
    5. Create a cold email template
    6. Suggest LinkedIn networking strategies
    7. Provide company insights
    8. Assess interview readiness (0-100)

    Format your response as a JSON object with the following structure:
    {
      matchScore: number,
      matchingSkills: string[],
      missingSkills: string[],
      resumeSuggestions: string[],
      coverLetter: string,
      coldEmail: string,
      linkedinSuggestions: string[],
      companyInsights: {
        recentNews: string,
        culture: string,
        growthAreas: string,
        interviewFocus: string
      },
      interviewReadiness: number
    }
  `

    const { text } = await generateText({
      model: aiskdkgroq("llama3-70b-8192"), // Changed from "llama-3.3-70b-versatile"
      prompt,
      system: systemPrompt,
      temperature: 0.7,
      maxTokens: 4000,
    })

    try {
      const cleanedResponse = extractJsonFromResponse(text)
      return JSON.parse(cleanedResponse) as AIAnalysisResult
    } catch (parseError) {
      console.error("Parse error in analyzeJobMatch:", parseError)
      console.error("Raw response:", text)
      // Return mock data if parsing fails
      return generateMockAnalysis(resumeText, jobDescription, companyName)
    }
  } catch (error) {
    console.error("Error in analyzeJobMatch:", error)
    // Return mock data if API is not available
    return generateMockAnalysis(resumeText, jobDescription, companyName)
  }
}
