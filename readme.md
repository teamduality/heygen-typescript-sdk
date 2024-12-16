# HeyGen SDK Monorepo

> Unofficial TypeScript SDK and examples for the HeyGen API, providing a simple interface for AI video generation.

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Test Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)](packages/sdk/coverage)

## 📦 Packages

This monorepo contains the following packages:

- [@teamduality/heygen-sdk](./packages/sdk/README.md) - Core SDK package for interacting with HeyGen's API
- [@teamduality/heygen-sdk-example](./packages/example) - Example implementation and usage patterns

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Build the SDK
pnpm --filter @teamduality/heygen-sdk build

# Run tests
pnpm --filter @teamduality/heygen-sdk test

# Run tests with coverage
pnpm --filter @teamduality/heygen-sdk test:coverage

# Run the example
pnpm --filter @teamduality/heygen-sdk-example dev
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

For SDK documentation, see the [SDK README](./packages/sdk/README.md).

## 🤝 Contributing

We welcome contributions! Please see our [contributing guidelines](CONTRIBUTING.md) for details.

## 📄 License

MIT © [Team Duality](https://github.com/teamduality)
