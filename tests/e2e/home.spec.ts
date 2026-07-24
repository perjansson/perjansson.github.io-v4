import { test, expect } from '@playwright/test'

test.describe('front page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('has title, logo and tagline', async ({ page }) => {
    await expect(page).toHaveTitle(/Per Jansson - Curious Software Craftsman/)
    await expect(page.getByRole('img', { name: 'Per Jansson' })).toBeVisible()
    await expect(page.getByText('Curious.')).toBeVisible()
  })

  test('shows four navigation cards', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: 'Main' })
    await expect(nav.getByRole('link')).toHaveCount(4)
    await expect(nav.getByText('The Story')).toBeVisible()
    await expect(nav.getByText('Work', { exact: true })).toBeVisible()
    await expect(nav.getByText('Craft')).toBeVisible()
    await expect(nav.getByText('Contact')).toBeVisible()
  })

  test('work card navigates to the work page', async ({ page }) => {
    await page
      .getByRole('navigation', { name: 'Main' })
      .getByRole('link', { name: /work/i })
      .click()
    await expect(page).toHaveURL(/\/work\/$/)
  })

  test('burger menu opens and navigates', async ({ page }) => {
    await page.getByRole('button', { name: 'Open menu' }).click()
    await expect(page.getByRole('button', { name: 'Close menu' })).toBeVisible()
    await page.getByRole('link', { name: 'Story', exact: true }).click()
    await expect(page).toHaveURL(/\/story\/$/)
  })
})

test.describe('theme', () => {
  test('light by default, toggles to dark and persists', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'dark')

    await page.getByRole('button', { name: /switch to dark theme/i }).click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  })
})

test.describe('story page', () => {
  test('shows the GitHub portrait and bio', async ({ page }) => {
    await page.goto('/story/')
    const portrait = page.getByRole('img', { name: /portrait of/i })
    await expect(portrait).toHaveAttribute(
      'src',
      /avatars\.githubusercontent\.com/
    )
    await expect(page.getByRole('heading', { name: /about me/i })).toBeVisible()
  })
})

test.describe('work page', () => {
  test('shows selected work and all work sections', async ({ page }) => {
    await page.goto('/work/')
    await expect(
      page.getByRole('heading', { name: /selected work/i })
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: /all work/i })
    ).toBeVisible()
    expect(await page.getByRole('listitem').count()).toBeGreaterThan(0)
  })

  test('tech chips narrow the project lists without dead ends', async ({
    page,
    isMobile,
  }) => {
    await page.goto('/work/')

    if (isMobile) {
      // The filter chips are intentionally hidden on small screens
      await expect(page.locator('button[aria-pressed]').first()).toBeHidden()
      return
    }

    const allCount = await page.getByRole('listitem').count()
    const allChipCount = await page.locator('button[aria-pressed]').count()

    // Data-independent: press whichever tech chip renders first
    const chip = page.locator('button[aria-pressed]').first()
    await chip.click()
    await expect(chip).toHaveAttribute('aria-pressed', 'true')

    const filteredCount = await page.getByRole('listitem').count()
    expect(filteredCount).toBeLessThan(allCount)

    // Remaining chips are only those that keep at least one project
    const remainingChips = page.locator('button[aria-pressed]')
    expect(await remainingChips.count()).toBeLessThanOrEqual(allChipCount)

    // Multi-select: adding a second tech narrows further but never to zero
    if ((await remainingChips.count()) > 1) {
      await remainingChips.nth(1).click()
      expect(await page.getByRole('listitem').count()).toBeGreaterThan(0)
      expect(await page.getByRole('listitem').count()).toBeLessThanOrEqual(
        filteredCount
      )
    }

    await page.getByRole('button', { name: /clear filter/i }).click()
    expect(await page.getByRole('listitem').count()).toBe(allCount)
  })

  test('navigates to a project page and back', async ({ page }) => {
    await page.goto('/work/')
    await page.getByRole('listitem').first().getByRole('link').click()
    await expect(page).toHaveURL(/\/projects\//)
    await expect(
      page.getByRole('heading', { name: /the project/i })
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: /my part in it/i })
    ).toBeVisible()

    await page.getByRole('link', { name: /all work/i }).click()
    await expect(page).toHaveURL(/\/work\/$/)
  })
})

test.describe('craft page', () => {
  test('lists tools of the trade', async ({ page }) => {
    await page.goto('/craft/')
    await expect(
      page.getByRole('heading', { name: /tools of the trade/i })
    ).toBeVisible()
    expect(await page.getByRole('listitem').count()).toBeGreaterThan(0)
  })
})

test.describe('contact page', () => {
  test('shows contact channels without retired networks', async ({ page }) => {
    await page.goto('/contact/')
    await expect(
      page.getByRole('heading', { name: /find me here/i })
    ).toBeVisible()
    const emailLink = page.locator('a[href^="mailto:"]')
    await expect(emailLink.first()).toBeVisible()

    for (const hidden of ['twitter', 'stackoverflow', 'facebook']) {
      await expect(page.getByText(hidden, { exact: false })).toHaveCount(0)
    }
  })
})
