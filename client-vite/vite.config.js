import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import inject from '@rollup/plugin-inject'
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    define: {
      'process.env.REACT_APP_SERVER': JSON.stringify(env.REACT_APP_SERVER),
      'process.env.REACT_APP_SERVICE_IDENTITY_SERVER': JSON.stringify(env.REACT_APP_SERVICE_IDENTITY_SERVER)
    },
    resolve: {
      alias: {
        jquery: 'jquery/dist/jquery.js' // Use the full version path
      }
    },
    plugins: [
      inject({
        // => that should be first under plugins array
        $: 'jquery',
        jQuery: 'jquery'
      }),
      react()
    ],

    server: {
      port: 3000,
      open: true // Automatically open the default browser when starting the server
    }
  }
})
