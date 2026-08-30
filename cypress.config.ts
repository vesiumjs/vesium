import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    specPattern: ['cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}', 'packages/**/__tests__/**/*.cy.ts'],
    baseUrl: 'http://localhost:4173',
    supportFile: 'cypress/support/e2e.ts',
    viewportWidth: 1280,
    viewportHeight: 800,
    defaultCommandTimeout: 10000,
    video: false,
    retries: {
      runMode: 1,
      openMode: 0,
    },
  },
  allowCypressEnv: false,
});
