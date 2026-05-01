import { expect, test } from '@playwright/test';

test.describe('Landing pública', () => {
  test('renderea hero institucional', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Pulso/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Tu salud/);
    await expect(page.getByRole('link', { name: /Crear mi Pulso ID/i })).toBeVisible();
  });

  test('navega a /registro desde CTA', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Crear mi Pulso ID/i }).click();
    await expect(page).toHaveURL(/\/registro/);
    await expect(page.getByRole('heading', { name: /Crear cuenta/i })).toBeVisible();
  });

  test('navega a /demo desde CTA secundario', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Demo institucional/i }).click();
    await expect(page).toHaveURL(/\/demo/);
  });

  test('renderea sección de módulos con 6 cards', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Pulso ID')).toBeVisible();
    await expect(page.getByText('Pulso Emergency')).toBeVisible();
    await expect(page.getByText('Pulso Mica')).toBeVisible();
    await expect(page.getByText('Pulso Connect')).toBeVisible();
  });
});

test.describe('Páginas auth', () => {
  test('/ingresar muestra form con cuentas demo', async ({ page }) => {
    await page.goto('/ingresar');
    await expect(page.getByRole('heading', { name: 'Ingresar', level: 2 })).toBeVisible();
    await expect(page.getByText('admin@pulso.demo')).toBeVisible();
    await expect(page.getByRole('link', { name: /Crear Pulso ID/i })).toBeVisible();
  });

  test('/registro tiene todos los campos obligatorios', async ({ page }) => {
    await page.goto('/registro');
    await expect(page.locator('input[name="dni"]')).toBeVisible();
    await expect(page.locator('input[name="fechaNacimiento"]')).toBeVisible();
    await expect(page.locator('select[name="provincia"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test('/recuperar-contrasena renderea form', async ({ page }) => {
    await page.goto('/recuperar-contrasena');
    await expect(page.getByRole('heading', { name: 'Recuperar contraseña' })).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('/portal-profesional/ingresar carga sin redirect loop', async ({ page }) => {
    const res = await page.goto('/portal-profesional/ingresar');
    expect(res?.status()).toBeLessThan(400);
    await expect(page.getByText('Portal Profesional')).toBeVisible();
  });
});

test.describe('Panel ciudadano', () => {
  test('redirige a /ingresar sin sesión', async ({ page }) => {
    await page.goto('/panel');
    await expect(page).toHaveURL(/\/ingresar/);
  });
});
