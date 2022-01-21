/// <reference types="vitest" />
import { defineConfig, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import purgecss from '@fullhuman/postcss-purgecss';
import { viteSingleFile } from './vite-plugin-singlefile';

const purge = purgecss({
  content: ['./index.html', './src/**/*.tsx'],
});

export default defineConfig(({ mode }) => {
  return {
    test: {
      globals: true,
      environment: 'jsdom',
    },
    plugins: [
      react(),
      checker({
        typescript: true,
        eslint: {
          files: ['./src'],
          extensions: ['.ts', '.tsx'],
        },
      }),
      viteSingleFile(),
    ],
    build: {
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          manualChunks: () => 'everything.js',
        },
      },
      sourcemap: true,
    },
    css: {
      postcss: {
        plugins: mode === 'production' ? [...[purge]] : [],
      },
    },
  } as UserConfig;
});
