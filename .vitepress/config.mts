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
      ['meta', { property: 'og:image', content: '/oak-chain-docs/og-image.png' }],
    ],

    themeConfig: {
      logo: '/oak-chain.svg',
      
      nav: [
        { text: 'Home', link: '/' },
        { text: 'Guide', link: '/guide/' },
        { text: 'Architecture', link: '/architecture' },
        { text: 'ADRs', link: '/adr/' },
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
              { text: 'Configuration', link: '/operators/configuration' },
              { text: 'Monitoring', link: '/operators/monitoring' },
            ]
          },
          {
            text: 'Architecture Decisions',
            collapsed: true,
            items: [
              { text: 'Overview', link: '/adr/' },
            ]
          }
        ],
        '/adr/': [
          {
            text: 'ADRs',
            items: [
              { text: '← Back', link: '/' },
              { text: 'Overview', link: '/adr/' },
            ]
          },
          {
            text: 'Consensus',
            items: [
              { text: '003: Aeron Consensus', link: '/adr/003-aeron-consensus' },
              { text: '005: HTTP Segment Transfer', link: '/adr/005-http-segment-transfer' },
            ]
          },
          {
            text: 'Economics',
            items: [
              { text: '004: Economic Finality Tiers', link: '/adr/004-economic-tiers' },
              { text: '046: Cluster Payment Model', link: '/adr/046-cluster-payment' },
            ]
          },
          {
            text: 'Storage',
            items: [
              { text: '014: Oak Strategic Anchor', link: '/adr/014-oak-anchor' },
              { text: '015: IPFS Binary Storage', link: '/adr/015-ipfs-storage' },
            ]
          },
        ]
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
