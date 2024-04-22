import vue from '@vitejs/plugin-vue'

import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'


export default defineConfig({
  plugins: [
    vue(), nodePolyfills({
      include: ['path', 'stream', 'util'], exclude: ['http'], globals: {
        Buffer: true, global: true, process: true,
      }, overrides: {
        fs: 'memfs',
      }, protocolImports: true,
    })],
})

