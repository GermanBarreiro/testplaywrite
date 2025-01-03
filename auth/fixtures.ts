import { test as base, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export * from '@playwright/test';
export const test = base.extend<{}, { workerStorageState: string }>({
  storageState: ({ workerStorageState }, use) => use(workerStorageState),

  workerStorageState: [async ({ browser }, use) => {
    const id = test.info().parallelIndex;
    const fileName = path.resolve(test.info().project.outputDir, `.auth/${id}.json`);

    if (fs.existsSync(fileName)) {
      await use(fileName);
      return;
    }

    const { LOGIN_URL, EMAIL, PASSWORD, BASE_URL } = process.env;

    if (!LOGIN_URL || !EMAIL || !PASSWORD || !BASE_URL) {
      throw new Error('One or more environment variables are not defined');
    }

    const page = await browser.newPage({ storageState: undefined });
    await page.goto(LOGIN_URL);
    await page.fill('input[name="email"]', EMAIL);
    await page.fill('input[name="password"]', PASSWORD);
    await page.getByText('Continúe').click();
    await page.waitForURL(BASE_URL + '/');
    await expect(page.locator('text=Bienvenido')).toBeVisible();
    await page.context().storageState({ path: fileName });
    await page.close();
    await use(fileName);
  }, { scope: 'worker' }],
});