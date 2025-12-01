import { defineConfig } from 'eslint/config';
import cypressPlugin from 'eslint-plugin-cypress';

export default defineConfig([cypressPlugin.configs.recommended]);
