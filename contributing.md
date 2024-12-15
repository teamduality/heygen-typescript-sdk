# Contributing

Suggestions and pull requests are very welcome. 😊

## Prerequisites

- `node >= 18`
- `pnpm >= 8`
- `OPENAI_API_KEY` exported from `.env`
- `HEYGEN_API_KEY` exported from `.env`

## Development

```sh
git clone https://github.com/teamduality/heygen-typescript-sdk.git
cd heygen-typescript-sdk
pnpm i
```

## Testing

You can run the test suite via:

```sh
pnpm test
```

Or just the [Vitest](https://vitest.dev) unit tests via:

```sh
pnpm test:unit
```

Note that this test suite does not run any of the evals.

## Docs

The docs folder is a normal [Next.js](https://nextjs.org) pages app built using [Nextra](https://nextra.site) and deployed to [Vercel](https://vercel.com).

You can run the docs dev server to preview your changes:

```sh
cd docs
pnpm dev
```
