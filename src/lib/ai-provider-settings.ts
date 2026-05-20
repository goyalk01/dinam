import { useCallback, useEffect, useState } from "react"

export const AI_PROVIDER_BASE_URL_STORAGE_KEY = "dinam-ai-provider-base-url"
export const AI_PROVIDER_API_KEY_STORAGE_KEY = "dinam-ai-api-key"
export const AI_PROVIDER_MODEL_STORAGE_KEY = "dinam-ai-model"

/** Default model id when none is stored (typical for OpenAI-style hosts; override for Ollama, etc.). */
export const DEFAULT_AI_MODEL = "gpt-4o-mini"

function normalizeBaseUrl(raw: string): string {
  return raw.trim().replace(/\/+$/, "")
}

export function readAiProviderBaseUrl(): string {
  const stored = localStorage.getItem(AI_PROVIDER_BASE_URL_STORAGE_KEY)
  return stored != null ? normalizeBaseUrl(stored) : ""
}

export function readAiProviderApiKey(): string {
  return localStorage.getItem(AI_PROVIDER_API_KEY_STORAGE_KEY) ?? ""
}

export function readAiProviderModel(): string {
  const m = localStorage.getItem(AI_PROVIDER_MODEL_STORAGE_KEY)?.trim()
  return m && m.length > 0 ? m : DEFAULT_AI_MODEL
}

export function writeAiProviderBaseUrl(url: string): void {
  const normalized = normalizeBaseUrl(url)
  if (normalized === "") {
    localStorage.removeItem(AI_PROVIDER_BASE_URL_STORAGE_KEY)
  } else {
    localStorage.setItem(AI_PROVIDER_BASE_URL_STORAGE_KEY, normalized)
  }
}

export function writeAiProviderApiKey(key: string): void {
  if (key === "") {
    localStorage.removeItem(AI_PROVIDER_API_KEY_STORAGE_KEY)
  } else {
    localStorage.setItem(AI_PROVIDER_API_KEY_STORAGE_KEY, key)
  }
}

export function writeAiProviderModel(model: string): void {
  const t = model.trim()
  if (t === "" || t === DEFAULT_AI_MODEL) {
    localStorage.removeItem(AI_PROVIDER_MODEL_STORAGE_KEY)
  } else {
    localStorage.setItem(AI_PROVIDER_MODEL_STORAGE_KEY, t)
  }
}

/** True if the string is empty or parses as an absolute http(s) URL. */
export function isAiProviderBaseUrlValid(raw: string): boolean {
  const s = normalizeBaseUrl(raw)
  if (s === "") {
    return true
  }
  try {
    const u = new URL(s)
    return u.protocol === "https:" || u.protocol === "http:"
  } catch {
    return false
  }
}

export function useAiProviderSettings() {
  const [baseUrl, setBaseUrlState] = useState(readAiProviderBaseUrl)
  const [apiKey, setApiKeyState] = useState(readAiProviderApiKey)
  const [model, setModelState] = useState(readAiProviderModel)

  const setBaseUrl = useCallback((value: string) => {
    writeAiProviderBaseUrl(value)
    setBaseUrlState(readAiProviderBaseUrl())
  }, [])

  const setApiKey = useCallback((value: string) => {
    writeAiProviderApiKey(value)
    setApiKeyState(readAiProviderApiKey())
  }, [])

  const setModel = useCallback((value: string) => {
    writeAiProviderModel(value)
    setModelState(readAiProviderModel())
  }, [])

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.storageArea !== localStorage) {
        return
      }
      if (event.key === AI_PROVIDER_BASE_URL_STORAGE_KEY) {
        setBaseUrlState(
          event.newValue != null ? normalizeBaseUrl(event.newValue) : ""
        )
      }
      if (event.key === AI_PROVIDER_API_KEY_STORAGE_KEY) {
        setApiKeyState(event.newValue ?? "")
      }
      if (event.key === AI_PROVIDER_MODEL_STORAGE_KEY) {
        setModelState(readAiProviderModel())
      }
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  return {
    baseUrl,
    setBaseUrl,
    apiKey,
    setApiKey,
    model,
    setModel,
  }
}
