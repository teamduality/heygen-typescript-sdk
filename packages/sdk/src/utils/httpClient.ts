import fetch from 'node-fetch'
import type { RequestInit } from 'node-fetch'

export interface V1Response<T> {
  code: number
  message: string
  data: T
}

export interface V2Response<T> {
  error: string | null
  data: T
}

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: unknown
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export async function httpClient<T, P = Record<string, unknown>>(
  url: string,
  method: 'GET' | 'POST' | 'DELETE',
  data?: P | Buffer | Blob,
  headers?: Record<string, string>
): Promise<T> {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body:
      data instanceof Buffer || data instanceof Blob
        ? data
        : data
        ? JSON.stringify(data)
        : undefined
  }

  const response = await fetch(url, options)
  const json = (await response.json()) as V1Response<T>

  if (!response.ok) {
    throw new APIError(
      `HTTP error! status: ${response.status}`,
      response.status,
      json
    )
  }

  if (json.code !== 100) {
    throw new APIError(json.message || 'Unknown error', json.code, json)
  }

  return json.data
}

// Export aliases for versioned clients
export const httpClientV1 = httpClient
export const httpClientV2 = httpClient
