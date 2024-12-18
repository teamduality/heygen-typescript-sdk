# @teamduality/og-next-demo

A Next.js demo application showcasing HeyGen's Interactive Avatar integration. Based on [HeyGen's InteractiveAvatarNextJSDemo](https://github.com/HeyGen-Official/InteractiveAvatarNextJSDemo), modified to use @teamduality/og-streaming-sdk and @teamduality/heygen-typescript-sdk.

## Getting Started

1. Clone and install dependencies:

```bash
npm install
```

2. Create a `.env` file:

```bash
HEYGEN_API_KEY=your_api_key_here
```

3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the demo.

## Features

- Interactive avatar streaming
- Voice chat capabilities
- Text-to-speech demo
- Multiple avatar selection
- Language selection
- Knowledge base integration

## Implementation Details

This demo uses:

- Next.js 13+ with App Router
- @teamduality/og-streaming-sdk for avatar interactions
- @teamduality/heygen-typescript-sdk for API communication
- NextUI for the user interface

## Documentation

For more information about HeyGen's Interactive Avatar API, visit:

- [Interactive Avatar Documentation](https://docs.heygen.com/docs/interactive-avatar)
- [HeyGen API Reference](https://docs.heygen.com/reference/streaming-create)
