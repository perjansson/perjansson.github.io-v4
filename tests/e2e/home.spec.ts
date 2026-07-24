import { test, expect } from '@playwright/test'

test.describe('home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('has title and hero statement', async ({ page }) => {
    await expect(page).toHaveTitle(/Per Jansson - Fullstack Web Developer/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Curious.'
    )
  })

  test('shows the story section with portrait', async ({ page }) => {
    const story = page.locator('#story')
    await story.scrollIntoViewIfNeeded()
    await expect(story.getByRole('heading', { level: 2 })).toBeVisible()
    await expect(story.getByRole('img')).toBeVisible()
  })

  test('lists projects as a menu', async ({ page }) => {
    const work = page.locator('#work')
    await work.scrollIntoViewIfNeeded()
    const items = work.getByRole('listitem')
    await expect(items.first()).toBeVisible()
    expect(await items.count()).toBeGreaterThan(0)
  })

  test('shows contact channels', async ({ page }) => {
    const contact = page.locator('#contact')
    await contact.scrollIntoViewIfNeeded()
    await expect(
      contact.getByRole('link', { name: /say hello/i })
    ).toBeVisible()
  })
})

test.describe('project page', () => {
  test('navigating from the menu opens the project story', async ({ page }) => {
    await page.goto('/')
    const work = page.locator('#work')
    await work.scrollIntoViewIfNeeded()

    const firstProject = work.getByRole('listitem').first().getByRole('link')
    const projectName = await firstProject
      .getByRole('heading', { level: 3 })
      .innerText()
    await firstProject.click()

    await expect(page).toHaveURL(/\/projects\//)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page).toHaveTitle(new RegExp(projectName))

    await expect(
      page.getByRole('heading', { name: /the project/i })
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: /my part in it/i })
    ).toBeVisible()
  })

  test('back link returns to the work menu', async ({ page }) => {
    await page.goto('/projects/sample-project-1/')
    await page.getByRole('link', { name: /back to all work/i }).click()
    await expect(page).toHaveURL(/\/#work$/)
  })
})
