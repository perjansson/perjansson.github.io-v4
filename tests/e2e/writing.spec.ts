import { test, expect } from '@playwright/test'

import { ARTICLES } from '../../src/lib/writingData'

test.describe('writing page', () => {
  test('lists every article, each pointing at its Medium post', async ({
    page,
  }) => {
    await page.goto('/writing/')
    await expect(page.getByRole('heading', { name: /articles/i })).toBeVisible()

    const items = page.getByRole('listitem')
    await expect(items).toHaveCount(ARTICLES.length)

    for (const article of ARTICLES) {
      await expect(
        page.locator(`a[href$="${article.slug}"]`)
      ).toHaveCount(1)
    }
  })

  test('is reachable from the burger menu', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Open menu' }).click()
    await page
      .getByRole('navigation', { name: 'Menu' })
      .getByRole('link', { name: 'Writing', exact: true })
      .click()
    await expect(page).toHaveURL(/\/writing\/$/)
  })
})
