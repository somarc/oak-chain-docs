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
      ['link', { rel: 'icon', type: 'image/svg+xml', href: '/oak-chain.svg' }],
      ['meta', { name: 'theme-color', content: '#1a1a2e' }],
      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { property: 'og:title', content: 'Oak Chain' }],
      ['meta', { property: 'og:description', content: 'Distributed Content Repository - Ethereum meets Oak' }],
    ],

    themeConfig: {
      logo: '/oak-chain.svg',
      
      nav: [
        { text: 'Home', link: '/' },
        { text: 'Guide', link: '/guide/' },
        { text: 'Architecture', link: '/architecture' },
        { text: 'Operators', link: '/operators/' },
      ],

      sidebar: {
        '/': [
          {
            text: 'Introduction',
            items: [
              { text: 'What is Oak Chain?', link: '/' },
              { text: 'Architecture', link: '/architecture' },
              { text: 'Quick Start', link: '/guide/' },
            ]
          },
          {
            text: 'Core Concepts',
            items: [
              { text: 'Consensus Model', link: '/guide/consensus' },
              { text: 'Economic Tiers', link: '/guide/economics' },
              { text: 'Content Paths', link: '/guide/paths' },
              { text: 'Binary Storage', link: '/guide/binaries' },
              { text: 'Real-Time Streaming', link: '/guide/streaming' },
            ]
          },
          {
            text: 'For Operators',
            items: [
              { text: 'Running a Validator', link: '/operators/' },
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
