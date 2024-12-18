# @teamduality/heygen-typescript-sdk

A TypeScript SDK for the HeyGen API, providing a simple interface for AI video generation and avatar management.

## Installation

```bash
pnpm add @teamduality/heygen-typescript-sdk
```

## Usage

```typescript
import { HeygenSDK } from '@teamduality/heygen-typescript-sdk'

// Initialize the SDK with your API key
const sdk = new HeygenSDK('your_api_key')

// Create a video
const video = await sdk.videos.create({
  background: '#ffffff',
  clips: [
    {
      avatar_id: 'your_avatar_id',
      input_text: 'Hello world!',
      voice_id: 'your_voice_id'
    }
  ]
})

// Get video status
const status = await sdk.videos.getStatus(video.video_id)

// Get avatar list
const avatars = await sdk.avatars.list()

// Create a streaming session
const session = await sdk.streaming.create({
  avatar_id: 'your_avatar_id',
  quality: 'medium'
})
```

## Features

### Video Generation

- Create videos with multiple clips
- Support for avatars and talking photos
- Background customization
- Video status tracking
- WebM videos with transparent background

### Avatar Management

- List available avatars
- Create custom avatars
- Modify avatar settings

### Voice Management

- List available voices
- Create custom voices
- Voice cloning

### Streaming

- Real-time avatar streaming
- Interactive sessions
- Voice and text input

### And More

- Template management
- User management
- Brand voice management
- Asset management
- Talking photo management

## API Documentation

For detailed API documentation, visit [HeyGen's official docs](https://docs.heygen.com).

## TypeScript Support

This SDK is written in TypeScript and provides full type definitions for all API responses and requests.

## Contributing

We welcome contributions! Please see our [contributing guidelines](../../CONTRIBUTING.md) for details.

## License

MIT © [Team Duality](https://github.com/teamduality)
