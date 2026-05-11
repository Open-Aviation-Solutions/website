import { test, expect } from '@playwright/test';

const components: { page: string; tag: string }[] = [
  { page: '/open-aviation-components/climb-performance/', tag: 'climb-performance' },
  { page: '/open-aviation-components/flight-path-overview/', tag: 'flight-path-overview' },
  { page: '/open-aviation-components/four-forces/', tag: 'four-forces' },
  { page: '/open-aviation-components/pitch-roll-yaw/', tag: 'pitch-roll-yaw' },
];

for (const { page: path, tag } of components) {
  test(`${tag} is registered and present on ${path}`, async ({ page }) => {
    await page.goto(path);

    const registered = await page.evaluate(
      (t) => customElements.get(t) !== undefined,
      tag,
    );
    expect(registered, `<${tag}> was not registered — script failed to load`).toBe(true);

    await expect(page.locator(tag)).toBeVisible();
  });
}
