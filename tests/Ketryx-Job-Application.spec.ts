import { test, expect } from '@playwright/test';

test.use({ headless: false }); // 👈 forces headed mode

test('Validate required fields on job application form', async ({ page }) => {
  await page.goto('https://www.ketryx.com/');
  await page.getByTestId('uc-accept-all-button').click();
  await page.getByRole('link', { name: 'Careers' }).click();
  await page.getByRole('link', { name: 'Join us' }).click();

  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Software Quality Engineer' }).click();
  const page1 = await page1Promise;

  await page1.waitForLoadState('domcontentloaded');

  // Ensure the Submit button is visible and clickable
  const submitBtn = page1.getByRole('button', { name: 'Submit application' });
  await submitBtn.scrollIntoViewIfNeeded(); // Helps with Firefox & WebKit
  await submitBtn.waitFor({ state: 'visible' });
  await submitBtn.click();

  // Wait for validation errors to appear
  await expect(page1.getByTestId('first_name-error')).toHaveText(/First Name is required/i);
});
