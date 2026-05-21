import { test, expect } from '@playwright/test';

const components: { page: string; tag: string }[] = [
  { page: '/open-aviation-components/aerofoil-dynamics/', tag: 'aerofoil-dynamics' },
  { page: '/open-aviation-components/climb-performance/', tag: 'climb-performance' },
  { page: '/open-aviation-components/briefing-overview/', tag: 'briefing-overview' },
  { page: '/open-aviation-components/four-forces/', tag: 'four-forces' },
  { page: '/open-aviation-components/pitch-roll-yaw/', tag: 'pitch-roll-yaw' },
];

for (const { page: path, tag } of components) {
  test(`${tag} is registered and present on ${path}`, async ({ page }) => {
    await page.goto(path);

    // waitForFunction works across navigations, handling Vite's HMR full-reload
    // that fires after the first page is compiled in the dev server.
    await page.waitForFunction(
      (t) => customElements.get(t) !== undefined,
      tag,
    );

    await expect(page.locator(tag)).toBeVisible();
  });
}
