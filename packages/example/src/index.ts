import { config } from 'dotenv'
import { HeygenSDK } from '@teamduality/heygen-sdk'

config()

const apiKey = process.env.HEYGEN_API_KEY
async function main() {
  if (!apiKey) {
    throw new Error('HEYGEN_API_KEY is required')
  }

  const sdk = new HeygenSDK(apiKey)

  const avatars = await sdk.listAvatars()
  console.log('Avatars:', avatars)

  const voices = await sdk.listVoices()
  console.log('Voices:', voices)
}

main().catch(console.error)
