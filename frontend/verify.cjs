const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Home - Port 8788
  await page.goto('http://localhost:8788/');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: '/home/jules/verification/home.png' });

  // Palette Create
  await page.goto('http://localhost:8788/tools/palette-of-me');
  await page.waitForSelector('input[placeholder="YOUR NAME"]');
  await page.fill('input[placeholder="YOUR NAME"]', 'Lumi User');
  await page.keyboard.press('Tab'); // Trigger any blur effects
  await page.screenshot({ path: '/home/jules/verification/palette_create.png' });

  // Prism Create
  await page.goto('http://localhost:8788/tools/prism-of-me');
  await page.waitForSelector('input[placeholder="YOUR NAME"]');
  await page.fill('input[placeholder="YOUR NAME"]', 'Lumi User');
  await page.keyboard.press('Tab');
  await page.screenshot({ path: '/home/jules/verification/prism_create.png' });

  await browser.close();
})();
