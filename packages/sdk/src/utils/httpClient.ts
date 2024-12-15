import fetch from 'node-fetch'
import type { RequestInit } from 'node-fetch'

export async function httpClient(
  url: string,
  method: 'GET' | 'POST' | 'DELETE',
  { apiKey, ...body }: Record<string, any>
): Promise<any> {
  console.log('url', url)
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': apiKey
    },
    body: Object.keys(body).length ? JSON.stringify(body) : undefined
  }
  const response = await fetch(url, options)

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}
