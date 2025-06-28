import { defineConfig } from 'vite'
import path from 'node:path'

export default defineConfig({
    resolve: {
        alias: {
            '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
            '~font-awesome': path.resolve(__dirname, 'node_modules/@fortawesome/fontawesome-free'),
        }
    },

})