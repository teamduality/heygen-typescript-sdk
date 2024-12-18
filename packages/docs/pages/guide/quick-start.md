# Quick Start

<Callout type="info">
  This guide covers our TypeScript SDK. For the official HeyGen API documentation, visit their [Quick Start Guide](https://docs.heygen.com/docs/quick-start).
</Callout>

## Prerequisites

1. Create a [HeyGen account](https://app.heygen.com/login)
2. Get your API key from the [API settings](https://app.heygen.com/settings) page

> Note: While on the Free Trial, your videos will be watermarked.

## Installation

```bash
pnpm add @teamduality/heygen-sdk
```

## Basic Usage

```typescript
import { HeygenSDK } from '@teamduality/heygen-sdk'

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

// Check video status
const status = await sdk.videos.getStatus(video.video_id)

// When status.status === 'completed', download the video
if (status.status === 'completed') {
  const videoUrl = status.video_url
  // Video URL is valid for 7 days
}
```

## Creating Videos

Our SDK supports all video creation features:

```typescript
// Create with background color
const videoWithBg = await sdk.videos.create({
  background: '#008000',
  clips: [
    /* ... */
  ]
})

// Create with transparent background (WebM)
const transparentVideo = await sdk.videos.create({
  background: 'transparent',
  clips: [
    /* ... */
  ],
  format: 'webm'
})

// Create with custom dimensions
const customVideo = await sdk.videos.create({
  background: '#ffffff',
  clips: [
    /* ... */
  ],
  dimension: {
    width: 1280,
    height: 720
  }
})
```

## Error Handling

The SDK provides typed error handling:

```typescript
try {
  const video = await sdk.videos.create({
    /* ... */
  })
} catch (error) {
  if (error.code === 40119) {
    console.error('Video is too long. Please upgrade your plan.')
  }
}
```

## Next Steps

- Check out the [Core SDK Reference](/sdk/core) for detailed API documentation
- Learn about [Interactive Avatars](/sdk/streaming)

For more examples and detailed API documentation, visit [HeyGen's official docs](https://docs.heygen.com).
