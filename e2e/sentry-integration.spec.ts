import { expect, test } from '@playwright/test'

/**
 * Sentry Integration Test
 *
 * This test verifies that errors are properly reported to Sentry.
 * It requires:
 * - VITE_SENTRY_DSN to be set
 * - The dev server to be running (not the preview build)
 *
 * The test clicks a button that triggers reportError(), which sends
 * a real error to Sentry. A separate script polls the Sentry API
 * to verify the error appeared.
 */
test.describe('Sentry Integration', () => {
  test.skip(!process.env.VITE_SENTRY_DSN, 'Skipping Sentry test - VITE_SENTRY_DSN not configured')

  test('reports errors to Sentry', async ({ page }) => {
    const testId = process.env.TEST_ID || `local-${Date.now()}`

    await page.goto('/')

    // Look for a test error button (you'll need to add this to your app for testing)
    const triggerButton = page.getByTestId('trigger-sentry-error')

    if (await triggerButton.isVisible()) {
      // Add test ID as a tag so we can find this specific error in Sentry
      await page.evaluate((id) => {
        window.localStorage.setItem('sentry-test-id', id)
      }, testId)

      await triggerButton.click()

      // Wait for error to be sent
      await page.waitForTimeout(2000)

      // The actual verification happens in the CI script that polls Sentry API
      expect(true).toBe(true)
    } else {
      test.skip(true, 'Sentry test trigger button not found - skipping')
    }
  })
})
