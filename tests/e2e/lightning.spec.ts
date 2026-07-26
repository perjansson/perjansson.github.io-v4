import { test, expect } from '@playwright/test'

test.describe('theme on first visit', () => {
  test('follows the system setting when nothing is stored', async ({
    browser,
  }) => {
    const dark = await browser.newContext({ colorScheme: 'dark' })
    const darkPage = await dark.newPage()
    await darkPage.goto('/')
    await expect(darkPage.locator('html')).toHaveAttribute('data-theme', 'dark')
    await dark.close()

    const light = await browser.newContext({ colorScheme: 'light' })
    const lightPage = await light.newPage()
    await lightPage.goto('/')
    await expect(lightPage.locator('html')).not.toHaveAttribute(
      'data-theme',
      'dark'
    )
    await light.close()
  })

  test('a stored choice still beats the system setting', async ({
    browser,
  }) => {
    const context = await browser.newContext({ colorScheme: 'dark' })
    const page = await context.newPage()
    await page.goto('/')
    await page.getByRole('button', { name: /switch to light theme/i }).click()
    await page.reload()
    await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'dark')
    await context.close()
  })
})

test.describe('404', () => {
  test('is the site, not the browser default', async ({ page }) => {
    await page.goto('/no-such-page/')
    await expect(
      page.getByRole('heading', { name: /not on today's card/i })
    ).toBeVisible()
    await page.getByRole('link', { name: 'Every project' }).click()
    await expect(page).toHaveURL(/\/work\/$/)
  })
})

test.describe('work page headline numbers', () => {
  test('counts projects, years and clients, and narrows when filtered', async ({
    page,
    isMobile,
  }) => {
    await page.goto('/work/')
    const count = page.locator('[aria-live="polite"]')
    await expect(count).toHaveText(/\d+ projects · \d+ years · \d+ clients/)

    test.skip(isMobile, 'the chip cloud is hidden on small screens')
    await page.locator('button[aria-pressed]').first().click()
    await expect(count).toHaveText(/^\d+ of \d+ projects$/)
  })
})
