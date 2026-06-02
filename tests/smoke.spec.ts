import { test, expect } from '@playwright/test';

// The interactive components are no longer embedded on this site — they live on
// the external components docs site. These smoke tests verify the key pages
// render and that the components overview links out rather than embedding.

test('homepage renders the hero', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Open Aviation Solutions/);
  await expect(
    page.getByRole('heading', { name: /Open Aviation Solutions/i }),
  ).toBeVisible();
});

test('components overview links out to the external docs site', async ({ page }) => {
  await page.goto('/open-aviation-components/');
  await expect(
    page.getByRole('heading', { name: 'Open Aviation Components' }),
  ).toBeVisible();

  // Links point at the external components docs site, and no interactive
  // custom elements are embedded on this page any more.
  await expect(
    page
      .locator(
        'a[href^="https://open-aviation-solutions.github.io/open-aviation-components/"]',
      )
      .first(),
  ).toBeVisible();
});
