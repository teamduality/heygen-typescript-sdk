import { HeygenSDK } from '@teamduality/heygen-sdk'

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY

export async function POST() {
  try {
    if (!HEYGEN_API_KEY) {
      throw new Error('API key is missing from .env')
    }
    const sdk = new HeygenSDK(HEYGEN_API_KEY)

    const data = await sdk.streaming.createSessionToken()

    return new Response(data.token, {
      status: 200
    })
  } catch (error) {
    console.error('Error retrieving access token:', error)

    return new Response('Failed to retrieve access token', {
      status: 500
    })
  }
}
