import { defineConfig } from 'cypress';
import { execFileSync } from 'node:child_process';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8000',
    defaultCommandTimeout: 30000,
    setupNodeEvents(on) {
      on('task', {
        cleanupServer({
          name,
          kubernetes,
        }: {
          name: string;
          kubernetes: boolean;
        }) {
          if (kubernetes) {
            execFileSync('kubectl', ['delete', 'deployment', name]);
          } else {
            execFileSync('docker', ['rm', name]);
            execFileSync('docker', ['volume', 'rm', name]);
          }

          return null;
        },
      });
    },
  },
  video: false,
});
