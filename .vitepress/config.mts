import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(
  defineConfig({
    title: "Oak Chain",
    description: "Distributed Content Repository - Ethereum meets Oak",
    
    base: '/oak-chain-docs/',
    cleanUrls: true,
    appearance: 'dark',
    ignoreDeadLinks: true,
    
    head: [
      ['link', { rel: 'icon', type: 'image/jpeg', href: '/oak-chain-logo.jpeg' }],
      ['link', { rel: 'apple-touch-icon', href: '/oak-chain-logo.jpeg' }],
      ['meta', { name: 'theme-color', content: '#1a1a2e' }],
      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { property: 'og:title', content: 'Oak Chain' }],
      ['meta', { property: 'og:description', content: 'Distributed Content Repository - Ethereum meets Oak' }],
      ['meta', { property: 'og:image', content: '/oak-chain-docs/oak-chain-logo.jpeg' }],
      ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
      ['meta', { name: 'twitter:image', content: '/oak-chain-docs/oak-chain-logo.jpeg' }],
    ],

    themeConfig: {
      logo: '/oak-chain.svg',
      
      nav: [
        { text: 'Home', link: '/' },
        { text: 'The Thesis', link: '/thesis' },
        { text: 'Bull Case', link: '/bull-case' },
        { text: 'How It Works', link: '/how-it-works' },
        { text: 'Architecture', link: '/architecture' },
        { text: 'Composition', link: '/project-composition' },
        { text: 'Guide', link: '/guide/' },
        { text: 'Primary Signals', link: '/guide/primary-signals' },
        { text: 'Operators', link: '/operators/' },
        { text: 'FAQ', link: '/faq' },
      ],

      sidebar: {
        '/': [
          {
            text: 'Why Oak Chain',
            items: [
              { text: 'The Thesis', link: '/thesis' },
              { text: 'Bull Case', link: '/bull-case' },
              { text: 'FAQ', link: '/faq' },
            ]
          },
          {
            text: 'Understanding',
            items: [
              { text: 'How It Works', link: '/how-it-works' },
              { text: 'Architecture', link: '/architecture' },
              { text: 'Project Composition', link: '/project-composition' },
              { text: 'Quick Start', link: '/guide/' },
            ]
          },
          {
            text: 'Core Concepts',
            items: [
              { text: 'Consensus Model', link: '/guide/consensus' },
              { text: 'Primary Signals', link: '/guide/primary-signals' },
              { text: 'Economic Tiers', link: '/guide/economics' },
              { text: 'Content Paths', link: '/guide/paths' },
              { text: 'Content Consumption', link: '/guide/content-consumption' },
              { text: 'Binary Storage', link: '/guide/binaries' },
              { text: 'Real-Time Streaming', link: '/guide/streaming' },
              { text: 'Segment Store GC', link: '/segment-gc' },
            ]
          },
          {
            text: 'Developer Guide',
            items: [
              { text: 'API Reference', link: '/guide/api' },
              { text: 'Authentication', link: '/guide/auth' },
              { text: 'Testnet Guide', link: '/guide/testnet' },
            ]
          },
          {
            text: 'For Operators',
            items: [
              { text: 'Running a Validator', link: '/operators/' },
            ]
          },
          {
            text: 'Resources',
            items: [
              { text: 'Changelog', link: '/changelog' },
              { text: 'Contributing', link: '/contributing' },
            ]
          },
        ],
      },

      socialLinks: [
        { icon: 'github', link: 'https://github.com/somarc/oak-chain-docs' }
      ],

      footer: {
        message: 'Apache 2.0 Licensed',
        copyright: 'Ethereum owns smart contracts. Oak owns enterprise content.'
      },

      search: {
        provider: 'local'
      },

      editLink: {
        pattern: 'https://github.com/somarc/oak-chain-docs/edit/main/:path',
        text: 'Edit this page'
      },

      outline: {
        level: [2, 3],
        label: 'On this page'
      }
    },

    mermaid: {
      theme: 'dark',
      themeVariables: {
        primaryColor: '#627EEA',
        primaryTextColor: '#fff',
        primaryBorderColor: '#8C8DFC',
        lineColor: '#627EEA',
        secondaryColor: '#1a1a2e',
        tertiaryColor: '#16213e',
        background: '#0f0f23',
        mainBkg: '#1a1a2e',
        nodeBorder: '#627EEA',
      }
    },

    markdown: {
      lineNumbers: true,
      theme: {
        light: 'github-light',
        dark: 'github-dark'
      }
    }
  })
)
