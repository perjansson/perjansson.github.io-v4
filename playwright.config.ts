import { defineConfig, devices } from '@playwright/test'

// In sandboxed environments a pre-installed Chromium can be pointed to via
// CHROMIUM_EXECUTABLE_PATH; in CI browsers are installed by Playwright itself.
const executablePath = process.env.CHROMIUM_EXECUTABLE_PATH

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
    // The site scrolls smoothly and animates list changes, which keeps
    // elements "not stable" long enough to time out a click on a slow CI
    // runner. Nothing under test depends on the motion.
    contextOptions: { reducedMotion: 'reduce' },
    launchOptions: executablePath
      ? { executablePath, args: ['--no-sandbox'] }
      : undefined,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'] },
    },
  ],
  webServer: {
    command: 'npx serve out -l 4173',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
  },
})
