import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import inject from '@rollup/plugin-inject'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    define: {
      'process.env.REACT_APP_SERVER': JSON.stringify(env.REACT_APP_SERVER),
      'process.env.REACT_APP_SERVICE_IDENTITY_SERVER': JSON.stringify(env.REACT_APP_SERVICE_IDENTITY_SERVER),
      'process.env.REACT_APP_EXTERNAL_SYSTEM_PASSWORD': JSON.stringify(env.REACT_APP_EXTERNAL_SYSTEM_PASSWORD),
      'process.env.REACT_APP_EXTERNAL_SYSTEM_USERNAME': JSON.stringify(env.REACT_APP_EXTERNAL_SYSTEM_USERNAME),
      'process.env.REACT_APP_GOOGLE_MAP_API_KEY': JSON.stringify(env.REACT_APP_GOOGLE_MAP_API_KEY),
      'process.env.REACT_APP_EXTERNAL_SYSTEM_URL': JSON.stringify(env.REACT_APP_EXTERNAL_SYSTEM_URL),
      'process.env': env,
    },
    resolve: {
      alias: {
        jquery: 'jquery/dist/jquery.js', // Use the full version path,
        '@modules': path.resolve(__dirname, './src/modules'),
        '@helpers': path.resolve(__dirname, './src/helpers'),
        '@common-components': path.resolve(__dirname, './src/common-components')
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
      open: false // Automatically open the default browser when starting the server
    }
  }
})
