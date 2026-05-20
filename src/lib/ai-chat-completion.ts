export type ChatToolCall = {
  id: string
  type: "function"
  function: {
    name: string
    arguments: string
  }
}

export type ChatCompletionAssistantMessage = {
  role: "assistant"
  content: string | null
  tool_calls?: ChatToolCall[]
}

export type ChatCompletionResponse = {
  choices?: {
    message: ChatCompletionAssistantMessage
    finish_reason?: string
  }[]
  error?: { message?: string }
}

export async function requestChatCompletion(params: {
  baseUrl: string
  apiKey: string
  model: string
  messages: Record<string, unknown>[]
  tools: Record<string, unknown>[]
}): Promise<ChatCompletionResponse> {
  const root = params.baseUrl.replace(/\/+$/, "")
  const url = `${root}/chat/completions`
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${params.apiKey}`,
    },
    body: JSON.stringify({
      model: params.model,
      messages: params.messages,
      tools: params.tools,
      tool_choice: "auto",
      temperature: 0.4,
    }),
  })

  const json: unknown = await res.json().catch(() => ({}))
  const body = json as ChatCompletionResponse

  if (!res.ok) {
    const msg =
      body.error?.message ??
      (typeof json === "object" &&
      json !== null &&
      "message" in json &&
      typeof (json as { message?: unknown }).message === "string"
        ? (json as { message: string }).message
        : `HTTP ${res.status}`)
    throw new Error(msg)
  }

  return body
}
