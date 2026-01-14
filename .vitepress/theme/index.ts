import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './custom.css'
import FlowGraph from './components/FlowGraph.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Register global components
    app.component('FlowGraph', FlowGraph)
  }
} satisfies Theme
