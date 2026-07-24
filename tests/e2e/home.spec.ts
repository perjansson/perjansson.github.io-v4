import { test, expect } from '@playwright/test'

test.describe('front page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('has title, logo and tagline', async ({ page }) => {
    await expect(page).toHaveTitle(/Per Jansson - Fullstack Web Developer/)
    await expect(page.getByRole('img', { name: 'Jansson' })).toBeVisible()
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

test.describe('story page', () => {
  test('shows the portrait and bio', async ({ page }) => {
    await page.goto('/story/')
    await expect(page.getByRole('img', { name: /portrait of/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /about me/i })).toBeVisible()
  })
})

test.describe('work page', () => {
  test('lists projects with periods', async ({ page }) => {
    await page.goto('/work/')
    const items = page.getByRole('listitem')
    expect(await items.count()).toBeGreaterThan(0)
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
  test('shows contact channels', async ({ page }) => {
    await page.goto('/contact/')
    await expect(
      page.getByRole('heading', { name: /find me here/i })
    ).toBeVisible()
    const emailLink = page.locator('a[href^="mailto:"]')
    await expect(emailLink.first()).toBeVisible()
  })
})
