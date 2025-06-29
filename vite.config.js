import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import vitePluginRequire from "vite-plugin-require";
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    global: 'window',
    'process.env': {},
    'process.browser': true,
  },

  plugins: [
    vue(),
    vitePluginRequire.default(),

    nodePolyfills({
      // Provide a list of Node.js globals to polyfill
      globals: {
        global: true,
        process: true,
        buffer: true,
        der: true,
        constants: true,
      },

    }),
    
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      web3: 'web3/dist/web3.min.js',
    },
  },

  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis', // Replace global with globalThis
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          // process: true,
          // buffer: true
        }),
        NodeModulesPolyfillPlugin()
      ]
    },
  },
  
  // build: {
  //   commonjsOptions: {
  //     strictRequires: ['node_modules/aws-sdk/**/*.js'],
  //   },
  // },
})