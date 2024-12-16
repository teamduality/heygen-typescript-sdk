# Heygen SDK

A TypeScript SDK for the Heygen API that provides a clean, typed interface for all Heygen services with 100% test coverage.

## Key Features

- ✅ Full TypeScript support with comprehensive types
- ✅ Consistent error handling across all services
- ✅ Automatic handling of API versions (v1/v2)
- ✅ Clean, promise-based API
- ✅ 100% test coverage
- ✅ Comprehensive error handling
- ✅ File upload support

## Installation

```bash
npm install @teamduality/heygen-sdk
```

## Usage

```typescript
import { HeygenSDK } from '@teamduality/heygen-sdk'

const sdk = new HeygenSDK('your-api-key')

// Core services
await sdk.avatars.list()                    // List available avatars
await sdk.streaming.create({ ... })         // Create streaming session
await sdk.voices.list()                     // List available voices
await sdk.templates.list()                  // List available templates

// Video Generation
await sdk.videos.generation.create({        // Standard video
  video_inputs: [...],
  dimensions: { width: 1920, height: 1080 }
})

await sdk.videos.generation.createWebM({     // WebM with transparent background
  input_text: 'Hello World',
  voice_id: 'voice-id',
  avatar_pose_id: 'pose-id',
  avatar_style: 'normal'
})

// Advanced services
await sdk.brand.listVoices()                // List brand voices
await sdk.assets.upload(file, contentType)  // Upload assets
await sdk.ai.talkingPhoto.list()           // List talking photos
```

## Services

The SDK provides access to all HeyGen API services:

### Video Services

- `videos.generation`
  - Create standard videos
  - Create WebM videos with transparent background
  - Delete videos
  - Get video status
- `videos.management` - List and manage existing videos
- `videos.translation` - Translate videos to different languages

### Avatar & Voice Services

- `avatars` - Digital avatar management
- `voices` - Voice management
- `brand` - Brand voice management

### Streaming Services

- `streaming` - Real-time avatar streaming

### Content Services

- `templates` - Template management
- `assets` - Asset upload and management
- `ai.talkingPhoto` - Talking photo management

### User Services

- `user` - User information and quota management

## Features Not Implemented

The following API features are not yet implemented in this SDK:

### Photo Avatar APIs

- Generate photo avatar photos
- Generate photo avatar looks
- Create and manage photo avatar groups
- Train photo avatar groups
- Add motion and sound effects
- Photo avatar details and upscaling

### Webhook Management

- Configure webhooks
- Manage webhook endpoints
- Handle webhook events

## Error Handling

The SDK provides detailed error handling with HeyGen-specific error codes:

```typescript
try {
  await sdk.videos.generation.create({ ... })
} catch (error) {
  if (error instanceof APIError) {
    console.error(`API Error (Code ${error.code}):`, error.message)
    console.error('HTTP Status:', error.statusCode)
    console.error('Response:', error.response)
  }
}
```

Common error codes:

- 40118: Cannot use as a template
- 40012400128: Invalid querying parameter
- 400123: Exceed rate limit
- 40102: Unauthorized
- 40056: Failed to generate audio

Streaming-specific error codes:

- 10001-10005: Session state errors
- 10006: Session not found
- 10007: Concurrent limit reached
- 10012: Avatar not found
- 10013: Avatar not allowed
- 10014: Session full
- 10015: Trial API limit reached

## File Uploads

Support for various content types:

```typescript
// Image upload
const imageFile = readFileSync('image.jpg')
await sdk.assets.upload(imageFile, 'image/jpeg')

// Video upload
const videoFile = readFileSync('video.mp4')
await sdk.assets.upload(videoFile, 'video/mp4')

// Audio upload
const audioFile = readFileSync('audio.mp3')
await sdk.assets.upload(audioFile, 'audio/mpeg')
```

## Testing

The SDK has 100% test coverage:

```bash
# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage
```

Coverage includes:

- ✅ All service methods
- ✅ Error handling
- ✅ File uploads
- ✅ API version handling
- ✅ Response parsing

## API Versions

The SDK handles API versions (v1/v2) internally:

```typescript
// V2 endpoint
await sdk.avatars.list()

// V1 endpoint
await sdk.streaming.create({ ... })

// Both handled automatically
```

## Contributing

We welcome contributions! Please ensure:

1. All tests pass
2. Coverage remains at 100%
3. Code follows existing patterns
4. Documentation is updated

## License

MIT © [Team Duality](https://github.com/teamduality)
