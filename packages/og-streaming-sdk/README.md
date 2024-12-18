# @teamduality/og-streaming-sdk

A TypeScript SDK for HeyGen's Interactive Avatar streaming service. Based on [HeyGen's StreamingAvatarSDK](https://github.com/HeyGen-Official/StreamingAvatarSDK), modified to use @teamduality/heygen-sdk.

## Installation

```bash
npm install @teamduality/og-streaming-sdk
```

## Usage

```typescript
import { StreamingAvatar, AvatarQuality } from '@teamduality/og-streaming-sdk'

const avatar = new StreamingAvatar({
  token: 'YOUR_ACCESS_TOKEN'
})

// Create and start avatar session
const session = await avatar.createStartAvatar({
  quality: 'low',
  avatarName: 'AVATAR_ID',
  voice: {
    rate: 1.5,
    emotion: 'Excited'
  }
})

// Make avatar speak
await avatar.speak({
  text: 'Hello world!',
  taskType: 'talk'
})

// Clean up
await avatar.stopAvatar()
```

## Features

- Real-time avatar streaming
- Voice chat support
- Text-to-speech capabilities
- Multiple avatar quality options
- Emotion and voice rate controls

## Documentation

For detailed API documentation and examples, please refer to [HeyGen's Interactive Avatar documentation](https://docs.heygen.com/docs/interactive-avatar).
