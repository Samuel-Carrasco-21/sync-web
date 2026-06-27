import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tanstackRouter({
      routesDirectory: './src/routes',
      generatedRouteTree: './src/routeTree.gen.ts',
      routeFileIgnorePrefix: '-',
      quoteStyle: 'single',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    allowedHosts: ['.localhost', '.local', '.ngrok.io', '.dpdns.org', '.vercel.app'],
  },
})
