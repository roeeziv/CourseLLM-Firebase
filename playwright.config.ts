import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  
  // ADD THIS LINE: Only run files ending in .spec.ts
  testMatch: '**/*.spec.ts', 
  
  // OPTIONAL: Explicitly ignore your unit test files if the above isn't enough
  // testIgnore: '**/*.test.tsx',

  timeout: 30_000,
  expect: { timeout: 5000 },
  fullyParallel: false,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:9002',
    headless: true,
    viewport: { width: 1280, height: 800 },
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    port: 9002,
    reuseExistingServer: !process.env.CI,
    // Add a generous timeout for the server to start in the cloud environment
    timeout: 120 * 1000, 
  },
});