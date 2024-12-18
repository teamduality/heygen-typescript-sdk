# Team Duality Monorepo

This monorepo contains packages for integrating with HeyGen's Interactive Avatar services.

## Packages

### @teamduality/heygen-sdk

The core TypeScript SDK for interacting with HeyGen's API. This package provides a simple interface for AI video generation and serves as the foundation for our streaming avatar integration.

### @teamduality/og-streaming-sdk

A TypeScript SDK for HeyGen's Interactive Avatar streaming service, based on [HeyGen's StreamingAvatarSDK](https://github.com/HeyGen-Official/StreamingAvatarSDK). This package has been modified to use @teamduality/heygen-sdk for API interactions.

### @teamduality/og-next-demo

A Next.js demo application showcasing the Interactive Avatar integration, based on [HeyGen's InteractiveAvatarNextJSDemo](https://github.com/HeyGen-Official/InteractiveAvatarNextJSDemo). This demo uses our modified streaming SDK and @teamduality/heygen-sdk.

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Build packages:

```bash
pnpm build
```

## Development

This repository uses pnpm workspaces. To work on a specific package:

```bash
# Navigate to package directory
cd packages/heygen-sdk
# or
cd packages/og-streaming-sdk
# or
cd packages/og-next-demo

# Install dependencies
pnpm install

# Build
pnpm build

# Run tests (if available)
pnpm test
```

## 💻 Development

This project uses:

- pnpm for package management
- TypeScript for type safety
- ESM modules
- Vitest for testing
- 100% test coverage

### Services Implemented

- ✅ Avatar Management (Digital Avatars)
- ✅ Video Generation
  - Standard videos
  - WebM videos with transparent background
  - Video status and management
- ✅ Video Translation
- ✅ Voice Management
- ✅ Template Management
- ✅ User Management
- ✅ Brand Voice Management
- ✅ Asset Management
- ✅ Talking Photo Management
- ✅ Streaming

### Not Yet Implemented

- 📝 Photo Avatar APIs
  - Photo avatar generation
  - Photo avatar looks
  - Photo avatar groups
  - Training and effects
- 📝 Webhook Management
  - Configuration
  - Event handling

### Testing

All services are thoroughly tested with:

- Unit tests for each service
- Error handling coverage
- API version handling (v1/v2)
- Response type safety

## 📖 Documentation

For detailed API documentation, visit [HeyGen's official docs](https://docs.heygen.com).

For SDK documentation, see the [SDK README](./packages/sdk/readme.md).

## 🤝 Contributing

We welcome contributions! Please see our [contributing guidelines](CONTRIBUTING.md) for details.

## 📄 License

MIT © [Team Duality](https://github.com/teamduality)
