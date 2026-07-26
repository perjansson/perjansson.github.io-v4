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

test.describe('view transitions', () => {
  test('a page-to-page navigation runs one, and it settles promptly', async ({
    page,
  }) => {
    await page.goto('/')

    const supported = await page.evaluate(
      () => typeof document.startViewTransition === 'function'
    )
    test.skip(!supported, 'browser has no View Transition API')

    await page.evaluate(() => {
      const log: Array<{ event: string; ms: number }> = []
      // @ts-expect-error test-only hook
      window.__vt = log
      const original = document.startViewTransition.bind(document)
      document.startViewTransition = (callback) => {
        const started = performance.now()
        const transition = original(callback)
        transition.finished.then(() =>
          log.push({
            event: 'finished',
            ms: Math.round(performance.now() - started),
          })
        )
        return transition
      }
    })

    await page
      .getByRole('navigation', { name: 'Main' })
      .getByRole('link', { name: /work/i })
      .click()
    await expect(page).toHaveURL(/\/work\/$/)

    // The transition resolves on the route change. If it ever regresses to
    // waiting out the internal safety timeout instead, this catches it.
    await expect
      .poll(() => page.evaluate(() => (window as never as { __vt: unknown[] }).__vt.length))
      .toBe(1)
    const ms = await page.evaluate(
      () => (window as never as { __vt: { ms: number }[] }).__vt[0].ms
    )
    expect(ms).toBeLessThan(1000)

    // And the page it transitioned to actually rendered
    expect(await page.getByRole('listitem').count()).toBeGreaterThan(0)
  })

  test('pressing a filter chip does not flash the whole page', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'the chip cloud is hidden on small screens')
    await page.goto('/work/')

    await page.evaluate(() => {
      // @ts-expect-error test-only hook
      window.__count = 0
      const original = document.startViewTransition.bind(document)
      document.startViewTransition = (callback) => {
        // @ts-expect-error test-only hook
        window.__count++
        return original(callback)
      }
    })

    await page.locator('button[aria-pressed]').first().click()
    await expect(page).toHaveURL(/\?tech=/)
    expect(
      await page.evaluate(() => (window as never as { __count: number }).__count)
    ).toBe(0)
  })
})

test.describe('the logo is a wheel you can spin', () => {
  test('dragging turns it and it keeps turning after letting go', async ({
    page,
  }) => {
    await page.goto('/')
    const logo = page.getByRole('img', { name: 'Per Jansson' })
    const box = (await logo.boundingBox())!
    const cx = box.x + box.width / 2
    const cy = box.y + box.height / 2
    const radius = box.width * 0.42

    const turn = () =>
      page.evaluate(() => {
        const element = document.querySelector<HTMLElement>(
          '[aria-label="Per Jansson"] > div'
        )
        return element?.style.transform ?? ''
      })

    expect(await turn()).toBe('rotate(0deg)')

    await page.mouse.move(cx, cy - radius)
    await page.mouse.down()
    for (let angle = -90; angle <= 0; angle += 15) {
      const radians = (angle * Math.PI) / 180
      await page.mouse.move(
        cx + radius * Math.cos(radians),
        cy + radius * Math.sin(radians)
      )
    }
    const dragged = await turn()
    expect(dragged).not.toBe('rotate(0deg)')

    await page.mouse.up()
    await expect.poll(turn).not.toBe(dragged)
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
