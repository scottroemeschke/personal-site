import { defineConfig, devices } from '@playwright/test'

// Allow tests to use an existing dev server (e.g., for Sentry integration tests)
const baseURL =
  process.env.PLAYWRIGHT_BASE_URL ||
  (process.env.CI ? 'http://localhost:4173' : 'http://localhost:5173')
const useExistingServer = process.env.PLAYWRIGHT_SKIP_WEBSERVER === 'true'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  // Skip webServer if we're using an existing server (e.g., dev server for Sentry tests)
  ...(useExistingServer
    ? {}
    : {
        webServer: {
          command: process.env.CI ? 'pnpm preview --port 4173' : 'pnpm dev',
          url: process.env.CI ? 'http://localhost:4173' : 'http://localhost:5173',
          reuseExistingServer: !process.env.CI,
        },
      }),
})
