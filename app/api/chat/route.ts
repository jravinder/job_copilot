import { StreamingTextResponse, type Message } from "ai"

// We need to disable the default body parser to handle streams
export const runtime = "edge"

// Helper function to format messages for GROQ
function formatMessagesForGroq(messages: Message[]) {
  return messages.map((message) => ({
    role: message.role === "system" ? "assistant" : message.role, // GROQ doesn't support 'system' role
    content: message.content,
  }))
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Ensure messages array exists and has at least one message
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response("Missing or invalid messages", { status: 400 })
    }

    // Format messages for GROQ
    const formattedMessages = formatMessagesForGroq(messages)

    // Make the request to GROQ API
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 4096,
        stream: true,
      }),
    })

    // Check if the response is ok
    if (!response.ok) {
      const error = await response.json()
      console.error("GROQ API error:", error)
      throw new Error(`GROQ API error: ${JSON.stringify(error)}`)
    }

    // Ensure we have a readable stream
    if (!response.body) {
      throw new Error("No response body received from GROQ")
    }

    // Return the streaming response
    return new StreamingTextResponse(response.body)
  } catch (error) {
    console.error("Error in chat API:", error)
    return new Response(
      JSON.stringify({
        error: "An error occurred processing your request",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

