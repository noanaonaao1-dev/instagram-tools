import { test } from '@playwright/test';

test('capture screenshots', async ({ page }) => {
  // Home
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/home/jules/verification/home.png' });

  // Palette Create
  await page.goto('http://localhost:5173/tools/palette-of-me');
  await page.fill('input[placeholder="YOUR NAME"]', 'Lumi User');
  await page.screenshot({ path: '/home/jules/verification/palette_create.png' });

  // Prism Create
  await page.goto('http://localhost:5173/tools/prism-of-me');
  await page.fill('input[placeholder="YOUR NAME"]', 'Lumi User');
  await page.screenshot({ path: '/home/jules/verification/prism_create.png' });
});
