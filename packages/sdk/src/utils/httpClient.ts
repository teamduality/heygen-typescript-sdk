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

export async function httpClientV1<T>(
  url: string,
  method: 'GET' | 'POST' | 'DELETE',
  { apiKey, ...params }: Record<string, unknown>
): Promise<T> {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': apiKey as string
    },
    body: Object.keys(params).length ? JSON.stringify(params) : undefined
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

export async function httpClientV2<T>(
  url: string,
  method: 'GET' | 'POST' | 'DELETE',
  { apiKey, ...params }: Record<string, unknown>
): Promise<T> {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': apiKey as string
    },
    body: Object.keys(params).length ? JSON.stringify(params) : undefined
  }

  const response = await fetch(url, options)
  const json = (await response.json()) as V2Response<T>

  if (!response.ok) {
    throw new APIError(
      `HTTP error! status: ${response.status}`,
      response.status,
      json
    )
  }

  if (json.error) {
    throw new APIError(json.error)
  }

  return json.data
}
