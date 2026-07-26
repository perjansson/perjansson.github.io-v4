import { test, expect } from '@playwright/test'

test.describe('skip link', () => {
  test('first tab reveals it and it jumps focus to the frame', async ({
    page,
  }) => {
    await page.goto('/')

    const skip = page.getByRole('link', { name: 'Skip to content' })
    await expect(skip).not.toBeInViewport()

    await page.keyboard.press('Tab')
    await expect(skip).toBeFocused()
    await expect(skip).toBeInViewport()

    await page.keyboard.press('Enter')
    await expect(page.locator('main#content')).toBeFocused()
  })
})

test.describe('burger menu keyboard behaviour', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('closed menu is inert and parked off-canvas', async ({ page }) => {
    await expect(page.locator('nav#main-menu')).toHaveAttribute('inert', '')
    await expect(
      page.getByRole('button', { name: 'Close menu' })
    ).not.toBeInViewport()
  })

  test('escape closes the menu and returns focus to the burger', async ({
    page,
  }) => {
    const burger = page.getByRole('button', { name: 'Open menu' })
    await burger.click()

    // Opening moves focus into the panel
    await expect(page.getByRole('button', { name: 'Close menu' })).toBeFocused()

    await page.keyboard.press('Escape')
    await expect(page.locator('nav#main-menu')).toHaveAttribute('inert', '')
    await expect(burger).toBeFocused()
  })

  test('tab cycles inside the open panel instead of escaping behind it', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Open menu' }).click()

    const menu = page.locator('nav#main-menu')
    const stops = menu.locator('a[href], button')
    const count = await stops.count()
    expect(count).toBeGreaterThan(1)

    // Walk the whole ring and land back on the close button
    for (let i = 0; i < count; i++) {
      await page.keyboard.press('Tab')
    }
    await expect(page.getByRole('button', { name: 'Close menu' })).toBeFocused()

    // And backwards off the first stop wraps to the last
    await page.keyboard.press('Shift+Tab')
    await expect(stops.nth(count - 1)).toBeFocused()
  })
})
