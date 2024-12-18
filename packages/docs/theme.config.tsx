import React from 'react'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useMounted } from 'nextra/hooks'
import { type DocsThemeConfig, useConfig } from 'nextra-theme-docs'
import { useRouter } from 'next/router'

const siteHost = 'heygen.teamduality.dev'
const siteUrl = `https://${siteHost}`
// const siteSocialUrl = `${siteUrl}/social.png`; // TODO
const siteDesc = `HeyGen TypeScript SDK`
const siteTitle = 'Duality - HeyGen TypeScript SDK'

const config: DocsThemeConfig = {
  logo: function Logo() {
    const mounted = useMounted()
    const theme = useTheme()
    const isDarkMode = theme.resolvedTheme === 'dark'

    return mounted ? (
      <Image
        src={isDarkMode ? '/duality-darkmode.svg' : '/duality-lightmode.svg'}
        alt="Team Duality"
        width={100}
        height={100}
      />
    ) : (
      <span>Team Duality</span>
    )
  },
  project: {
    link: 'https://github.com/teamduality/heygen-typescript-sdk'
  },
  editLink: {
    text: 'Edit this page on GitHub →'
  },
  feedback: {
    content: 'Question? Give us feedback →'
  },
  docsRepositoryBase:
    'https://github.com/teamduality/heygen-typescript-sdk/tree/main/packages/docs',
  footer: {
    component: () => (
      <div className="flex w-4/5 mx-auto flex-col items-center py-4">
        <p className="text-xs">
          MIT {new Date().getFullYear()} © Team Duality
        </p>
      </div>
    )
  },
  head: function useHead() {
    const config = useConfig()
    const { asPath } = useRouter()
    const isIndex = asPath === '/'
    const title =
      config?.title && !isIndex ? `${config.title} - ${siteTitle}` : siteTitle

    return (
      <>
        <meta httpEquiv="Content-Language" content="en" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index,follow" />

        <meta name="description" content={siteDesc} />
        <meta property="og:description" content={siteDesc} />
        <meta name="twitter:description" content={siteDesc} />

        <meta property="og:site_name" content={siteTitle} />
        <meta name="apple-mobile-web-app-title" content={siteTitle} />

        <meta property="twitter:domain" content={siteHost} />
        <meta name="twitter:site:domain" content={siteHost} />

        <meta name="twitter:url" content={siteUrl} />

        <meta property="og:title" content={title} />
        <meta name="twitter:title" content={title} />
        <title>{title}</title>

        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <style>
          {`
ul ul.nx-mt-6,
ul ul._mt-6 {
  margin-top: 0;
}

ul.contains-task-list {
  margin-top: 1rem;
  margin-left: 1rem;
}

ul li._my-2,
ul li.task-list-item {
  margin-top: 0.65rem;
  margin-bottom: 0.65rem;
}

img {
  display: inline-block !important;
}

aside ul li button {
  font-weight: 700;
}
`}
        </style>
      </>
    )
  },
  sidebar: {
    toggleButton: true
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s – HeyGen TypeScript SDK'
    }
  }
}

export default config
