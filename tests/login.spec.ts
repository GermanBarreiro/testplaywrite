import { chromium } from 'playwright';

(async () => {
  // Inicia el navegador
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navega a la página de inicio de sesión
  await page.goto('https://smart-support.avangenio.net/login');

  // Verifica que el título de la página sea correcto
  const title = await page.title();
  console.log(`Page title: ${title}`);
  if (title !== 'Bienvenido') {
    console.error('El título de la página no es el esperado');
  }

  // Introduce el correo electrónico
  await page.fill('input[name="email"]', 'example@mail.com');

  // Introduce la contraseña
  await page.fill('input[name="password"]', 'yourpassword');

  // Haz clic en el botón de iniciar sesión
  await page.click('text=Iniciar sesión');

  // Espera a que la navegación termine
  await page.waitForNavigation();

  // Verifica que la URL cambie después del inicio de sesión
  const currentUrl = page.url();
  console.log(`Current URL: ${currentUrl}`);
  if (currentUrl === 'https://smart-support.avangenio.net/login') {
    console.error('El inicio de sesión falló, la URL no cambió');
  }

  // Cierra el navegador
  await browser.close();
})();