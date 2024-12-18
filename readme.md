# HeyGen TypeScript SDK (Unofficial)

> A comprehensive suite of TypeScript SDKs for integrating with HeyGen's AI video generation and interactive avatar services.

🚚 **[View Documentation](https://heygen.teamduality.dev)**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Test Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)](packages/sdk/coverage)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Prettier](https://img.shields.io/badge/prettier-enabled-brightgreen.svg)](https://prettier.io/)

## ✨ Features

- 🎯 **Type Safety** - Full TypeScript support with comprehensive types
- 🔄 **API Versioning** - Automatic handling of API versions (v1/v2)
- 🧪 **Testing** - 100% test coverage across all packages
- 📦 **Modular** - Use only what you need
- 🚀 **Performance** - Optimized for production use

## 📦 Packages

### @teamduality/heygen-typescript-sdk

The core TypeScript SDK for interacting with HeyGen's API. This package provides a simple interface for AI video generation and serves as the foundation for our streaming avatar integration.

### @teamduality/og-streaming-sdk

A TypeScript SDK for HeyGen's Interactive Avatar streaming service, based on [HeyGen's StreamingAvatarSDK](https://github.com/HeyGen-Official/StreamingAvatarSDK). This package has been modified to use @teamduality/heygen-typescript-sdk for API interactions.

### @teamduality/og-next-demo

A Next.js demo application showcasing the Interactive Avatar integration, based on [HeyGen's InteractiveAvatarNextJSDemo](https://github.com/HeyGen-Official/InteractiveAvatarNextJSDemo). This demo uses our modified streaming SDK and @teamduality/heygen-typescript-sdk.

## 🚀 Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Build packages:

```bash
pnpm build
```

## 💻 Development

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

## ✅ Services Implemented

- 🎭 Avatar Management (Digital Avatars)
- 🎬 Video Generation
  - Standard videos
  - WebM videos with transparent background
  - Video status and management
- 🌍 Video Translation
- 🗣️ Voice Management
- 📝 Template Management
- 👤 User Management
- 🎙️ Brand Voice Management
- 📁 Asset Management
- 📸 Talking Photo Management
- 🔄 Streaming

## 📝 Not Yet Implemented

- Photo Avatar APIs
  - Photo avatar generation
  - Photo avatar looks
  - Photo avatar groups
  - Training and effects
- Webhook Management
  - Configuration
  - Event handling

## 🧪 Testing

All services are thoroughly tested with:

- Unit tests for each service
- Error handling coverage
- API version handling (v1/v2)
- Response type safety

## 📖 Documentation

Visit our [documentation site](https://heygen.teamduality.dev) for:

- Detailed API reference
- Integration guides
- Code examples
- TypeScript type definitions

For HeyGen's official API documentation, visit [their docs](https://docs.heygen.com).

## 🤝 Contributing

We welcome contributions! Please see our [contributing guidelines](CONTRIBUTING.md) for details.

## 📄 License

MIT © [Team Duality](https://github.com/teamduality)

To stay up to date or learn more, follow [@scottsilvi](https://x.com/scottsilvi) on X.
