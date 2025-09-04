// tests/app.spec.js
import { test, expect } from '@playwright/test';

test.use({ baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:5173' });

test('로그인', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('아이디').fill('soonwook');
  await page.getByLabel('비밀번호').fill('1234');
  await page.getByRole('button', { name: '로그인' }).click();

  await page.waitForURL('**/my-store*', { timeout: 15000 });
  await expect(page).toHaveURL(/\/my-store(?:$|[?#])/);
  await expect(page.getByTestId('my-store-root')).toBeVisible();
});


