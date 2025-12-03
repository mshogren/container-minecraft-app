/// <reference types="vitest" />
import { defineConfig, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import { purgeCSSPlugin } from '@fullhuman/postcss-purgecss';
import { viteSingleFile } from 'vite-plugin-singlefile';

const purge = purgeCSSPlugin({
  content: ['./index.html', './src/**/*.tsx'],
});

export default defineConfig(({ mode }) => {
  return {
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/setup.ts'],
    },
    plugins: [
      react(),
      mode !== 'test' &&
        checker({
          typescript: true,
          eslint: {
            lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
          },
        }),
      viteSingleFile({
        inlinePattern: ['**/*.css'],
        useRecommendedBuildConfig: false,
      }),
    ],
    build: {
      cssCodeSplit: false,
      sourcemap: true,
    },
    css: {
      postcss: {
        plugins: mode === 'production' ? [...[purge]] : [],
      },
    },
  } as UserConfig;
});
