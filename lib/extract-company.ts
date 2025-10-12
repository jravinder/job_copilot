export function extractCompanyName(jobDescription: string): string {
  if (!jobDescription) return ""

  // Try to find company name using common patterns
  const patterns = [
    /(?:at|join|about|with)\s+([A-Z][a-zA-Z0-9\s&]+?(?:,?\s+Inc\.?|,?\s+LLC|,?\s+Ltd\.?|,?\s+Limited|,?\s+Corp\.?|,?\s+Corporation|,?\s+Co\.|,?\s+Company)?)\b/i,
    /(?:Company|Organization|Employer)(?:\s+Name)?(?:\s*:\s*)([A-Z][a-zA-Z0-9\s&]+?(?:,?\s+Inc\.?|,?\s+LLC|,?\s+Ltd\.?|,?\s+Limited|,?\s+Corp\.?|,?\s+Corporation|,?\s+Co\.|,?\s+Company)?)\b/i,
    /([A-Z][a-zA-Z0-9\s&]+?(?:,?\s+Inc\.?|,?\s+LLC|,?\s+Ltd\.?|,?\s+Limited|,?\s+Corp\.?|,?\s+Corporation|,?\s+Co\.|,?\s+Company))\s+is\s+(?:looking|seeking|hiring|searching)/i,
    /About\s+([A-Z][a-zA-Z0-9\s&]+?)(?:\s+We|\s*:|\s*\n|\s*\.|$)/i,
    /([A-Z][a-zA-Z0-9\s&]+?(?:,?\s+Inc\.?|,?\s+LLC|,?\s+Ltd\.?|,?\s+Limited|,?\s+Corp\.?|,?\s+Corporation|,?\s+Co\.|,?\s+Company))/i,
  ]

  for (const pattern of patterns) {
    const match = jobDescription.match(pattern)
    if (match && match[1]) {
      // Clean up the extracted company name
      let companyName = match[1].trim()

      // Remove common false positives
      if (
        companyName === "About" ||
        companyName === "The" ||
        companyName === "A" ||
        companyName === "An" ||
        companyName === "Our" ||
        companyName === "We" ||
        companyName === "I" ||
        companyName === "You" ||
        companyName === "Job" ||
        companyName === "Position" ||
        companyName === "Role" ||
        companyName === "Company" ||
        companyName.length < 2 ||
        companyName.length > 50
      ) {
        continue
      }

      // Remove trailing punctuation
      companyName = companyName.replace(/[.,;:!?]$/, "")

      return companyName
    }
  }

  // If no company name found, try to find the first proper noun
  const lines = jobDescription.split("\n")
  for (const line of lines) {
    if (line.includes("About") || line.includes("Company")) {
      const words = line.split(/\s+/)
      for (let i = 0; i < words.length; i++) {
        const word = words[i]
        if (
          word.length > 1 &&
          word[0] === word[0].toUpperCase() &&
          word[0] !== word[0].toLowerCase() &&
          !["About", "The", "A", "An", "Our", "We", "I", "You", "Company"].includes(word)
        ) {
          // Check if this might be part of a multi-word company name
          if (
            i + 1 < words.length &&
            words[i + 1][0] === words[i + 1][0].toUpperCase() &&
            words[i + 1][0] !== words[i + 1][0].toLowerCase()
          ) {
            return `${word} ${words[i + 1]}`
          }
          return word
        }
      }
    }
  }

  return ""
}
