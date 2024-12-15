# Heygen TypeScript SDK

> Unofficial TypeScript SDK for the Heygen API, providing a simple interface for video generation and management.

[![NPM Version](https://img.shields.io/npm/v/heygen-typescript-sdk.svg)](https://www.npmjs.com/package/heygen-typescript-sdk)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Features

- ✅ Simple, intuitive API for video generation
- ✅ Full TypeScript support with complete type definitions
- ✅ Promise-based async/await interface
- ✅ Comprehensive error handling
- ✅ Built-in authentication management
- ✅ Node.js support (v18+)

## Installation

```bash
npm install heygen-typescript-sdk
# or
yarn add heygen-typescript-sdk
# or
pnpm add heygen-typescript-sdk
```

## Quick Start

```typescript
import { HeygenSDK } from 'heygen-typescript-sdk'

const sdk = new HeygenSDK('your-api-key')

// Authenticate with Heygen
await sdk.authenticate()

// Make API requests
const result = await sdk.makeRequest('/endpoint', {
  // your request data
})
```

## Documentation

For detailed documentation, visit [our documentation site](https://docs.heygen.com).

## Examples

[Coming soon]

## Contributing

We welcome contributions! Please see our [contributing guidelines](CONTRIBUTING.md) for details.

## License

MIT © [Team Duality](https://github.com/teamduality)
