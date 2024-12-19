import { config } from 'dotenv'
import { HeygenSDK } from '@teamduality/heygen-typescript-sdk'
import fs from 'fs'
config()

const apiKey = process.env.HEYGEN_API_KEY
async function main() {
  if (!apiKey) {
    throw new Error('HEYGEN_API_KEY is required')
  }

  const sdk = new HeygenSDK(apiKey)
  // Read the image file
  const imageFile = fs.readFileSync('./src/lumber_family.jpg')

  // Upload the image
  const uploadedAsset = await sdk.assets.upload(imageFile, 'image/jpeg')
  console.log('Uploaded asset:', uploadedAsset)
}

main().catch(console.error)
