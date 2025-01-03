import { test as setup, expect } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  const { LOGIN_URL, EMAIL, PASSWORD, CHAT_URL } = process.env;

  if (!LOGIN_URL || !EMAIL || !PASSWORD || !CHAT_URL) {
    throw new Error('One or more environment variables are not defined');
  }

  await page.goto(LOGIN_URL);
  await page.fill('input[name="email"]', EMAIL);
  await page.fill('input[name="password"]', PASSWORD);
  await page.getByText('Continúe').click();
  await page.waitForURL(CHAT_URL, { timeout: 60000 });
  await page.context().storageState({ path: authFile });
});