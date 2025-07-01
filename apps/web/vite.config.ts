import { defineConfig } from 'vite'
import path from 'node:path'
import icons from 'unplugin-icons/vite'

export default defineConfig(({ mode }) => {
    const isDev = mode === 'development';

    return {
        resolve: {
            alias: {
                '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
                '~bootstrap-icons': path.resolve(__dirname, 'node_modules/bootstrap-icons'),
            }
        },
        server: {
            proxy: {
                '/api': {
                    target: isDev ? 'http://127.0.0.1:8080' : 'https://stockmarket-production-0db0.up.railway.app',
                    changeOrigin: true,
                }
            }
        },
        plugins: [
            icons({
                compiler: "raw",
            })
        ]
    }
})
