import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  staticImage: true,
  latex: false,
  defaultShowCopyCode: true
})

export default withNextra({
  reactStrictMode: true,
  rewrites() {
    return [
      {
        source: '/project',
        destination: '/project/how-it-works'
      },
      {
        source: '/sdk',
        destination: '/sdk/core'
      }
    ]
  }
})
