import { test, expect } from '@playwright/test'

// The chip cloud is deliberately hidden below 860px, so the pointer-driven
// half of this only makes sense on the desktop project
test.describe('work filter in the URL', () => {
  test('pressing a chip writes it to the URL, back steps it off', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'the chip cloud is hidden on small screens')

    await page.goto('/work/')
    await expect(page).toHaveURL(/\/work\/$/)

    const chip = page.locator('button[aria-pressed]').first()
    // textContent, not innerText: the chips are uppercased in CSS and
    // innerText would hand back the rendered casing, not the tech name
    const name = ((await chip.textContent()) ?? '').trim()
    await chip.click()

    await expect(page).toHaveURL(
      `/work/?tech=${encodeURIComponent(name)}`
    )
    const filtered = await page.getByRole('listitem').count()

    await page.goBack()
    await expect(page).toHaveURL(/\/work\/$/)
    await expect(chip).toHaveAttribute('aria-pressed', 'false')
    expect(await page.getByRole('listitem').count()).toBeGreaterThan(filtered)

    await page.goForward()
    await expect(chip).toHaveAttribute('aria-pressed', 'true')
    expect(await page.getByRole('listitem').count()).toBe(filtered)
  })

  test('a shared link opens already filtered', async ({ page, isMobile }) => {
    test.skip(isMobile, 'the chip cloud is hidden on small screens')

    await page.goto('/work/')
    const name = (
      (await page.locator('button[aria-pressed]').first().textContent()) ?? ''
    ).trim()
    const all = await page.getByRole('listitem').count()

    await page.goto(`/work/?tech=${encodeURIComponent(name)}`)
    const chip = page.locator('button[aria-pressed]').first()
    await expect(chip).toHaveAttribute('aria-pressed', 'true')
    expect(await page.getByRole('listitem').count()).toBeLessThan(all)
  })

  test('a bogus tech in the URL falls back to the full list', async ({
    page,
  }) => {
    await page.goto('/work/')
    const all = await page.getByRole('listitem').count()

    await page.goto('/work/?tech=Fortran')
    expect(await page.getByRole('listitem').count()).toBe(all)
  })
})
