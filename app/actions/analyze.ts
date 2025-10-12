"use server"

import type { AIAnalysisResult } from "@/types/analysis"
import { extractCompanyName } from "@/lib/extract-company"

export async function analyzeContent({
  resumeText,
  jobDescription,
  notes,
}: {
  resumeText: string
  jobDescription: string
  notes?: string
}) {
  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Extract company name from job description
    const companyName = extractCompanyName(jobDescription)

    // Extract position from job description (simple implementation)
    const positionMatch = jobDescription.match(
      /(?:for|position|role|job title|hiring)(?:\s+a)?(?:\s+an)?(?:\s+experienced)?\s+([A-Z][a-z]+(?: [A-Z][a-z]+){0,3}(?:\s+Developer|\s+Engineer|\s+Designer|\s+Manager|\s+Specialist|\s+Analyst|\s+Consultant|\s+Director|\s+Architect)?)/i,
    )
    const position = positionMatch ? positionMatch[1] : "Software Engineer"

    // Extract skills from resume (simple implementation)
    const skillsRegex = /(?:skills|technologies|proficient in|experience with|knowledge of)(?::|,)?\s+([^.]+)/i
    const skillsMatch = resumeText.match(skillsRegex)
    const skills = skillsMatch
      ? skillsMatch[1]
          .split(/[,|&]/)
          .map((s) => s.trim())
          .filter((s) => s.length > 2 && s.length < 20)
      : ["JavaScript", "React", "TypeScript", "CSS", "HTML"]

    // Extract missing skills from job description that aren't in resume
    const jobSkillsRegex =
      /(?:requirements|qualifications|skills needed|we require|must have|should have)(?::|,)?\s+([^.]+)/i
    const jobSkillsMatch = jobDescription.match(jobSkillsRegex)
    const jobSkills = jobSkillsMatch
      ? jobSkillsMatch[1]
          .split(/[,|&]/)
          .map((s) => s.trim())
          .filter((s) => s.length > 2 && s.length < 20)
      : ["Docker", "Kubernetes", "AWS", "GraphQL"]

    const missingSkills = jobSkills
      .filter((skill) => !resumeText.toLowerCase().includes(skill.toLowerCase()))
      .slice(0, 4)

    // Generate resume suggestions based on job description and resume
    const resumeSuggestions = [
      `Add more details about your experience with ${skills[0] || "relevant technologies"}`,
      `Highlight any projects that demonstrate your ${missingSkills[0] || "technical"} skills`,
      `Quantify your achievements with specific metrics and results`,
    ]

    // Analysis result using actual input data
    const analysisResult: AIAnalysisResult = {
      companyName: companyName || "Unknown Company",
      hiringManager: "Hiring Manager",
      matchScore: Math.floor(Math.random() * 31) + 70, // Random score between 70-100
      matchingSkills: skills.slice(0, 5),
      missingSkills: missingSkills,
      resumeSuggestions: resumeSuggestions,
      coverLetter: `Dear Hiring Manager,

I am writing to express my interest in the ${position} role at ${companyName || "your company"}. With my background in ${skills.slice(0, 3).join(", ")}, I believe I would be a valuable addition to your team.

Throughout my career, I have focused on building responsive, user-friendly web applications. ${resumeText.split(".")[0]}.

I am particularly drawn to ${companyName || "your company"}'s mission to [company mission/values]. Your focus on [specific aspect of company] aligns perfectly with my professional interests and expertise.

I would welcome the opportunity to discuss how my skills and experience can contribute to your team's success. Thank you for considering my application.

Sincerely,
[Your Name]`,
      coldEmail: `Subject: Experienced ${position} Interested in Opportunities at ${companyName || "your company"}

Hi [Recruiter's Name],

I hope this email finds you well. I recently came across the ${position} opening at ${companyName || "your company"} and was immediately drawn to the opportunity.

My background includes experience in ${skills.join(", ")}, which aligns well with your requirements. ${resumeText.split(".")[0]}.

I'm particularly impressed by ${companyName || "your company"}'s [mention something specific about the company that interests you]. I believe my skills in ${skills.slice(0, 2).join(" and ")} would make me a great fit for your team.

Would you be available for a brief conversation to discuss how my experience aligns with what you're looking for? I've attached my resume for your review.

Thank you for your consideration. I look forward to potentially connecting.

Best regards,
[Your Name]
[Your Phone]
[Your LinkedIn]`,
      linkedinSuggestions: [
        `Connect with ${companyName || "the company"}'s hiring manager and mention your interest in the role`,
        `Follow ${companyName || "the company"}'s company page to stay updated on news and job postings`,
        "Engage with recent company posts to increase visibility",
      ],
      companyInsights: {
        recentNews: `${companyName || "The company"} recently expanded their ${position} team`,
        culture: `${companyName || "The company"} is known for collaborative environment and work-life balance`,
        growthAreas:
          jobDescription.includes("AI") || jobDescription.includes("machine learning")
            ? "Expanding their AI and machine learning capabilities"
            : "Focusing on digital transformation and innovation",
        interviewFocus: "Technical skills, problem-solving, and cultural fit",
      },
      interviewReadiness: Math.floor(Math.random() * 21) + 70, // Random score between 70-90
      position: position,
    }

    return {
      success: true,
      data: {
        ...analysisResult,
        // Ensure these properties are explicitly set
        matchScore: analysisResult.matchScore,
        matchingSkills: analysisResult.matchingSkills,
        missingSkills: analysisResult.missingSkills,
        companyName: companyName || "Unknown Company",
        position: position,
      },
    }
  } catch (error) {
    console.error("Analysis error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred during analysis",
    }
  }
}
