import { test, expect } from '@playwright/test';

test.use({ headless: false }); // 👈 forces headed mode

test('Validate required fields on job application form', async ({ page }) => {
  let page1;

  await test.step('Navigating to URL', async () => {
    await page.goto('https://www.ketryx.com/');
  });

  await test.step('Accept Privacy popup', async () => {
    await page.getByTestId('uc-accept-all-button').click();
  });

  await test.step('Click on the Careers Link', async () => {
    await page.getByRole('link', { name: 'Careers' }).click();
  });

  await test.step('Click on the Join us button', async () => {
    await page.getByRole('link', { name: 'Join us' }).click();
  });

  await test.step('Select Software Quality Engineer position', async () => {
    const page1Promise = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'Software Quality Engineer' }).click();
    page1 = await page1Promise;
    await page1.waitForLoadState('domcontentloaded');
  });

  await test.step('Click on the Submit application button', async () => {
    const submitBtn = page1.getByRole('button', { name: 'Submit application' });
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.waitFor({ state: 'visible' });
    await submitBtn.click();
  });

  await test.step('Capture screenshot and validate error message', async () => {
    await page1.waitForTimeout(1000); // Help Safari catch up
    // await page1.screenshot({ path: 'safari-after-submit.png', fullPage: true }); // Screenshot added
    await expect(page1.getByTestId('first_name-error')).toHaveText(/First Name is required/i, { timeout: 7000 });
  });
});
