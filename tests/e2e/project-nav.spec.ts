import { test, expect } from '@playwright/test'

test.describe('project page navigation', () => {
  test('walks from the newest project to the oldest and back', async ({
    page,
  }) => {
    await page.goto('/work/')
    const projects = await page.getByRole('listitem').count()
    await page.getByRole('listitem').first().getByRole('link').click()

    const pager = page.getByRole('navigation', { name: 'Other projects' })

    // The newest project is the top of the list, so it has no newer neighbour
    await expect(pager.getByRole('link', { name: /newer/i })).toHaveCount(0)

    // Walk all the way down
    for (let step = 1; step < projects; step++) {
      const older = pager.getByRole('link', { name: /older/i })
      await expect(older).toHaveCount(1)
      await older.click()
    }

    // And the oldest has no older neighbour
    await expect(pager.getByRole('link', { name: /older/i })).toHaveCount(0)

    // One step back up brings the older link back
    await pager.getByRole('link', { name: /newer/i }).click()
    await expect(pager.getByRole('link', { name: /older/i })).toHaveCount(1)
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
