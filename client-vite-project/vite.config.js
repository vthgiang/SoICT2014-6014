import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    define: {
      'process.env.REACT_APP_SERVER': JSON.stringify(env.REACT_APP_SERVER)
    },
    plugins: [react()],
    server: {
      port: 3000,
      open: true // Automatically open the default browser when starting the server
    }
  }
})
