import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    main: {
        plugins: [externalizeDepsPlugin()]
    },
    preload: {
        plugins: [externalizeDepsPlugin()]
    },
    renderer: {
        plugins: [react()],
        build: {
            rollupOptions: {
                input: {
                    background: './src/renderer/background.html',
                    keyboard: './src/renderer/keyboard.html',
                    settings: './src/renderer/settings.html'
                }
            }
        }
    }
});
