# Heygen SDK

A TypeScript SDK for the Heygen API that provides a clean, typed interface for all Heygen services.

## Key Features

- Full TypeScript support with comprehensive types
- Consistent error handling across all services
- Automatic handling of API versions (v1/v2)
- Clean, promise-based API

## Roadmap

The following features are planned for future releases:

- Photo Avatar APIs
  - Generate photo avatar photos
  - Generate photo avatar looks
  - Create and manage photo avatar groups
  - Train photo avatar groups
  - Add motion and sound effects
  - Photo avatar details and upscaling

## Installation

```bash
npm install @heygen/sdk
```

## Usage

```typescript
import { HeygenSDK } from '@heygen/sdk'

const sdk = new HeygenSDK('your-api-key')

// Services handle API versions internally
await sdk.avatars.list()                    // Uses v2
await sdk.streaming.create({ ... })         // Uses v1
await sdk.videos.generation.create({ ... }) // Uses v2

// Error handling is consistent across all versions
try {
  const result = await sdk.avatars.list()
  console.log(result.avatars)
} catch (error) {
  if (error instanceof APIError) {
    console.error('API Error:', error.message)
    console.error('Status:', error.statusCode)
  }
}
```

## Architecture

The SDK is organized into service classes that each handle a specific part of the Heygen API:

- `AvatarsService` - Avatar management
- `StreamingService` - Real-time streaming
- `VideoAPI`
  - `generation` - Video generation
  - `management` - Video management
  - `translation` - Video translation
- `VoicesService` - Voice management
- `TemplatesService` - Template management

Each service internally handles:

- API version differences (v1/v2)
- Response formatting
- Error handling
- Type safety

This means you can focus on using the API without worrying about:

- Which API version to use
- How to structure requests
- How to handle errors
- Response formats

## Error Handling

The SDK throws typed errors for all API issues:

```typescript
try {
  await sdk.videos.generation.create({ ... })
} catch (error) {
  if (error instanceof APIError) {
    // Handle API-specific errors
    console.error(error.statusCode, error.message)
  } else {
    // Handle network or other errors
    console.error(error)
  }
}
```

## Advanced Usage

You can also use individual services directly if needed:

```typescript
import { VideoGenerationService } from '@heygen/sdk'

const videoService = new VideoGenerationService('your-api-key')
await videoService.create({ ... })
```

### Asset Upload

```typescript
import { HeygenSDK } from '@heygen/sdk'
import { readFileSync } from 'fs'

const sdk = new HeygenSDK('your-api-key')

// Upload an image
const imageFile = readFileSync('path/to/image.jpg')
const imageAsset = await sdk.assets.upload(imageFile, 'image/jpeg')
console.log('Uploaded image asset ID:', imageAsset.id)

// Upload a video
const videoFile = readFileSync('path/to/video.mp4')
const videoAsset = await sdk.assets.upload(videoFile, 'video/mp4')
console.log('Uploaded video asset ID:', videoAsset.id)

// Browser example using Fetch
const file = await fetch('https://example.com/image.jpg').then((r) => r.blob())
const asset = await sdk.assets.upload(file, 'image/jpeg')
```

Supported content types:

- Images: `image/jpeg`, `image/png`
- Videos: `video/mp4`, `video/webm`
- Audio: `audio/mpeg`
