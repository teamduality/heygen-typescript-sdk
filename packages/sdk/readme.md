# Heygen SDK

A TypeScript SDK for the Heygen API that provides a clean, typed interface for all Heygen services.

## Key Features

- Full TypeScript support with comprehensive types
- Consistent error handling across all services
- Automatic handling of API versions (v1/v2)
- Clean, promise-based API

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
