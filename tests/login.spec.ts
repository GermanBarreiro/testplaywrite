import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

// Cargar las variables de entorno
dotenv.config();

// Verificar que todas las variables de entorno necesarias estén definidas
const { LOGIN_URL, CHAT_URL, EMAIL, PASSWORD } = process.env;

if (!LOGIN_URL) throw new Error('LOGIN_URL is not defined');
if (!CHAT_URL) throw new Error('CHAT_URL is not defined');
if (!EMAIL) throw new Error('EMAIL is not defined');
if (!PASSWORD) throw new Error('PASSWORD is not defined');

test.describe('User Authentication Flow', () => {
  test('Successful login', async ({ page }) => {
    await page.goto(LOGIN_URL);
    await page.waitForLoadState('networkidle'); // Espera a que la red esté inactiva
    await page.fill('input[name="email"]', EMAIL);
    await page.fill('input[name="password"]', PASSWORD);
    await expect(page.getByRole('button', { name: 'Continúe', exact: true })).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: 'Continúe', exact: true }).click();
    await expect(page).toHaveURL(CHAT_URL, { timeout: 20000 });
  });

  test('Failed login with incorrect password', async ({ page }) => {
    await page.goto(LOGIN_URL);
    await page.waitForLoadState('networkidle');
    await page.fill('input[name="email"]', EMAIL);
    await page.fill('input[name="password"]', 'wrongpassword');
    await expect(page.getByRole('button', { name: 'Continúe', exact: true })).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: 'Continúe', exact: true }).click();
    // Verificar que el mensaje de error sea visible
    await expect(page.locator('text=Credenciales inválidas')).toBeVisible({ timeout: 10000 });
  });

  test('Failed login with incorrect email', async ({ page }) => {
    await page.goto(LOGIN_URL);
    await page.waitForLoadState('networkidle');
    await page.fill('input[name="email"]', 'wronguser@mail.com');
    await page.fill('input[name="password"]', PASSWORD);
    await expect(page.getByRole('button', { name: 'Continúe', exact: true })).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: 'Continúe', exact: true }).click();
    // Verificar que el mensaje de error sea visible
    await expect(page.locator('text=Credenciales inválidas')).toBeVisible({ timeout: 10000 });
  });
});