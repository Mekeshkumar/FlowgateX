import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@components': path.resolve(__dirname, './src/components'),
            '@features': path.resolve(__dirname, './src/features'),
            '@pages': path.resolve(__dirname, './src/pages'),
            '@hooks': path.resolve(__dirname, './src/hooks'),
            '@context': path.resolve(__dirname, './src/context'),
            '@store': path.resolve(__dirname, './src/store'),
            '@services': path.resolve(__dirname, './src/services'),
            '@utils': path.resolve(__dirname, './src/utils'),
            '@assets': path.resolve(__dirname, './src/assets'),
            '@config': path.resolve(__dirname, './src/config'),
            '@styles': path.resolve(__dirname, './src/styles'),
        },
    },
    server: {
        port: 3000,
        strictPort: true, // Exit if port 3000 is not available
        open: true,
        host: true, // Listen on all addresses
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
    },
});
