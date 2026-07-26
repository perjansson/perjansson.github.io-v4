import { test, expect } from '@playwright/test'

const pagerOf = (page: import('@playwright/test').Page) =>
  page.getByRole('navigation', { name: 'Other projects' })

test.describe('project page navigation', () => {
  // Checks the ends and one step, rather than walking every project: with the
  // real content that is 22 mobile navigations and smooth scrolling makes each
  // pager link unstable long enough to blow the test timeout.
  test('the newest project has no newer neighbour and the oldest no older', async ({
    page,
  }) => {
    await page.goto('/work/')
    const items = page.getByRole('listitem')
    const count = await items.count()

    await items.first().getByRole('link').click()
    await expect(pagerOf(page).getByRole('link', { name: /newer/i })).toHaveCount(
      0
    )
    await expect(pagerOf(page).getByRole('link', { name: /older/i })).toHaveCount(
      1
    )

    await page.goto('/work/')
    await items.nth(count - 1).getByRole('link').click()
    await expect(pagerOf(page).getByRole('link', { name: /older/i })).toHaveCount(
      0
    )
    await expect(pagerOf(page).getByRole('link', { name: /newer/i })).toHaveCount(
      1
    )
  })

  test('stepping older and back lands on the project it came from', async ({
    page,
  }) => {
    await page.goto('/work/')
    await page.getByRole('listitem').first().getByRole('link').click()
    await expect(page).toHaveURL(/\/projects\//)
    const start = new URL(page.url()).pathname

    await pagerOf(page).getByRole('link', { name: /older/i }).click()
    await expect(page).not.toHaveURL(start)

    await pagerOf(page).getByRole('link', { name: /newer/i }).click()
    await expect(page).toHaveURL(start)
  })

  test('a tech chip opens the work list filtered to it', async ({ page }) => {
    await page.goto('/work/')
    await page.getByRole('listitem').first().getByRole('link').click()

    const chip = page
      .getByRole('heading', { name: /on the plate/i })
      .locator('xpath=following-sibling::div[1]')
      .getByRole('link')
      .first()
    const name = ((await chip.textContent()) ?? '').trim()
    await chip.click()

    await expect(page).toHaveURL(`/work/?tech=${encodeURIComponent(name)}`)
    await expect(
      page.getByRole('listitem').first().getByRole('link')
    ).toBeVisible()
  })
})
