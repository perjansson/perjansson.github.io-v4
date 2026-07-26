import { test, expect } from '@playwright/test'

test.describe('per-project social card', () => {
  test('every project page points at its own generated PNG', async ({
    page,
    request,
  }) => {
    await page.goto('/work/')
    const first = page.getByRole('listitem').first().getByRole('link')
    const href = await first.getAttribute('href')
    await page.goto(href!)

    const src = await page
      .locator('meta[property="og:image"]')
      .getAttribute('content')
    expect(src).toContain(`${href}opengraph-image`)

    await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute(
      'content',
      '1200'
    )
    await expect(
      page.locator('meta[property="og:image:height"]')
    ).toHaveAttribute('content', '630')

    // The static server has no extension to guess from, so check the bytes
    // rather than the content type: production sets that via public/_headers
    const response = await request.get(new URL(src!).pathname)
    expect(response.status()).toBe(200)
    const body = await response.body()
    expect(body.subarray(1, 4).toString()).toBe('PNG')
  })
})
