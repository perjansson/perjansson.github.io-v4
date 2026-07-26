import { test, expect } from '@playwright/test'

import { ARTICLES } from '../../src/lib/writingData'

test.describe('cv page', () => {
  test('is built from the same content as the rest of the site', async ({
    page,
  }) => {
    await page.goto('/work/')
    const projects = await page.getByRole('listitem').count()

    await page.goto('/cv/')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Per Jansson'
    )

    for (const section of ['Profile', 'Skills', 'Experience', 'Writing']) {
      await expect(
        page.getByRole('heading', { level: 2, name: section, exact: true })
      ).toBeVisible()
    }

    // One h3 per project, and the writing list matches the writing page
    await expect(page.locator('h3')).toHaveCount(projects)
    await expect(page.getByRole('listitem').filter({ has: page.locator('a[href*="medium.com/@perjansson/"]') })).toHaveCount(
      ARTICLES.length
    )
  })

  test('hides the site chrome when printing', async ({ page }) => {
    await page.goto('/cv/')
    const print = page.getByRole('button', { name: /print/i })
    await expect(print).toBeVisible()

    await page.emulateMedia({ media: 'print' })
    await expect(print).toBeHidden()
    await expect(
      page.getByRole('link', { name: '← perjansson.me' })
    ).toBeHidden()
  })
})
