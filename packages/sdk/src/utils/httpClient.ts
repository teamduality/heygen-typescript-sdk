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

  try {
    const text = await response.text()
    const json = JSON.parse(text)

    if (!response.ok) {
      // Handle V2 error format
      if ('error' in json) {
        throw new APIError(json.error || 'Unknown error', response.status, json)
      }
      // Handle V1 error format
      if ('code' in json) {
        throw new APIError(json.message || 'Unknown error', json.code, json)
      }
      // Fallback error
      throw new APIError('Unknown error', response.status, json)
    }

    // Handle V2 success format
    if ('error' in json) {
      return json.data
    }
    // Handle V1 success format
    if (json.code === 100) {
      return json.data
    }
    // Handle V1 error in success response
    throw new APIError(json.message || 'Unknown error', json.code, json)
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    // Handle non-JSON responses
    if (!response.ok) {
      throw new APIError(
        `Request failed with status ${response.status}`,
        response.status
      )
    }
    throw error
  }
}

// Export aliases for versioned clients
export const httpClientV1 = httpClient
export const httpClientV2 = httpClient
