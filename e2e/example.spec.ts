import { expect, test } from '@playwright/test'

test('desktop loads with title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/NEON_DESKTOP/)
})

test('desktop displays system header', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('NEON_DESKTOP.sys')).toBeVisible()
})

test('desktop shows app icons', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('ABOUT.exe')).toBeVisible()
  await expect(page.getByText('TASTE.links')).toBeVisible()
  await expect(page.getByText('PROJECTS.log')).toBeVisible()
  await expect(page.getByText('DEADDROP.msg')).toBeVisible()
})
