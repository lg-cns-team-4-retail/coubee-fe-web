// tests/app.spec.js
import { test, expect } from '@playwright/test';

test.use({ baseURL: 'http://localhost:5173' });

test('로그인', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('/login');
  await page.getByLabel('아이디').fill('moonjiugi917');
  await page.getByLabel('비밀번호').fill('1234');
  await page.getByRole('button', { name: '로그인' }).click();
  await page.waitForURL('**/my-store*', { timeout: 15000 });
  await page.waitForTimeout(5000);
  await expect(page.getByTestId('myStorePageLoaded')).toBeVisible({ timeout: 10000 });
});

test('상품 등록', async ({ page }) => {
  test.setTimeout(60000);

  // 로그인
  await page.goto('/login');
  await page.getByLabel('아이디').fill('moonjiugi917');
  await page.getByLabel('비밀번호').fill('1234');
  await page.getByRole('button', { name: '로그인' }).click();
  await page.waitForURL('**/my-store*', { timeout: 15000 });
  await expect(page.getByTestId('myStorePageLoaded')).toBeVisible({ timeout: 10000 });

  // 상세 이동
  await page.goto('/view-store/2020');
  await page.waitForURL('**/view-store/2020*', { timeout: 15000 });
  await expect(page.getByTestId('viewStorePageLoaded')).toBeVisible({ timeout: 10000 });

  // 등록 모달 열기
  await page.getByTestId('itemRegistButton').click();
  const modal = page.getByTestId('itemRegistModalLoaded');
  await expect(modal).toBeVisible({ timeout: 10000 });

  // 폼 입력
  const NAME = `하울정식 ${Date.now()}`;
  await page.locator('#productName').fill(NAME);
  await page.locator('#description').fill('맛있는 하울 정식 도시락입니다.');
  await page.locator('#originPrice').fill('15000');
  await page.locator('#salePrice').fill('12000');
  await page.locator('#stock').fill('10');

  const testImage = page.locator('input[type="file"]'); 
  expect(await testImage.count()).toBeGreaterThanOrEqual(1); 
  await testImage.first().setInputFiles('tests/test_image.jpg'); 
  await expect(page.getByRole('button', { name: '적용하기' })).toBeVisible({ timeout: 10000 });
  page.getByRole('button', { name: '적용하기' }).click();
  await expect(page.getByTestId('imageUploaded')).toBeVisible({ timeout: 15000 });

  
  // 제출
  const submitBtn = (await page.getByTestId('itemRegistSubmitButton').count())
    ? page.getByTestId('itemRegistSubmitButton')
    : page.getByRole('button', { name: /등록|저장|완료/ });
  
  submitBtn.click()


  // 모달 닫힘 및 목록 반영 확인
  await expect(modal).toBeHidden({ timeout: 15000 });
});
