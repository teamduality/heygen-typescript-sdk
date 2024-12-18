# HeyGen SDK Example

> Example implementation of the [@teamduality/heygen-typescript-sdk](../sdk) package.

## 🚀 Getting Started

1. Clone the repository and install dependencies:

```bash
pnpm install
```

2. Copy the environment variables:

```bash
cp .env.example .env
```

3. Add your HeyGen API key to `.env`:

```env
HEYGEN_API_KEY=your-api-key-here
```

4. Run the example:

```bash
pnpm dev
```

## 📝 Example Code

```typescript
import { HeygenSDK } from '@teamduality/heygen-typescript-sdk'

async function main() {
  const sdk = new HeygenSDK(process.env.HEYGEN_API_KEY)

  // List available avatars
  const avatars = await sdk.listAvatars()
  console.log('Avatars:', avatars)

  // List available voices
  const voices = await sdk.listVoices()
  console.log('Voices:', voices)
}
```

## 🔧 Available Scripts

- `pnpm dev` - Run the example
- `pnpm build` - Build the TypeScript code

## 📖 Documentation

For more examples and detailed API documentation, visit [HeyGen's official docs](https://docs.heygen.com).
