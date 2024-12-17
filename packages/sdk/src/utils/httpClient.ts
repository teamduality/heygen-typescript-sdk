import type { BufferSource } from 'node:stream/web'

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
    public response?: unknown,
    public code?: number
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export async function httpClient<T, P = Record<string, unknown>>(
  url: string,
  method: 'GET' | 'POST' | 'DELETE',
  data?: P | BufferSource | Blob,
  headers?: Record<string, string>
): Promise<T> {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body:
      data instanceof Blob || data instanceof ArrayBuffer
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
        // Handle specific error codes
        switch (json.code) {
          case 40118:
            throw new APIError(
              'Cannot use as a template',
              response.status,
              json,
              json.code
            )
          case 40012400128:
            throw new APIError(
              'Invalid querying parameter',
              response.status,
              json,
              json.code
            )
          case 400123:
            throw new APIError(
              'Exceed rate limit',
              response.status,
              json,
              json.code
            )
          case 40102:
            throw new APIError('Unauthorized', response.status, json, json.code)
          case 40056:
            throw new APIError(
              'Failed to generate audio',
              response.status,
              json,
              json.code
            )
          // Streaming specific errors
          case 10001:
            throw new APIError(
              'Session state wrong: new',
              response.status,
              json,
              json.code
            )
          case 10002:
            throw new APIError(
              'Session state wrong: connecting',
              response.status,
              json,
              json.code
            )
          case 10003:
            throw new APIError(
              'Session state wrong: connected',
              response.status,
              json,
              json.code
            )
          case 10004:
            throw new APIError(
              'Session state wrong: closing',
              response.status,
              json,
              json.code
            )
          case 10005:
            throw new APIError(
              'Session state wrong: closed',
              response.status,
              json,
              json.code
            )
          case 10006:
            throw new APIError(
              'Session not found',
              response.status,
              json,
              json.code
            )
          case 10007:
            throw new APIError(
              'Concurrent limit reached',
              response.status,
              json,
              json.code
            )
          case 10012:
            throw new APIError(
              'Avatar not found',
              response.status,
              json,
              json.code
            )
          case 10013:
            throw new APIError(
              'Avatar not allowed',
              response.status,
              json,
              json.code
            )
          case 10014:
            throw new APIError('Session full', response.status, json, json.code)
          case 10015:
            throw new APIError(
              'Trial API limit reached',
              response.status,
              json,
              json.code
            )
          default:
            throw new APIError(json.message || 'Unknown error', json.code, json)
        }
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
