import { test, expect, Page } from '@playwright/test';

// Helper to highlight error message element (for all fields)
async function highlightError(page: Page, testId: string) {
  await page.evaluate((id) => {
    const el = document.querySelector(`[data-testid="${id}"]`);
    if (el) {
      el.style.display = 'block';
      el.style.width = '100%';
      el.style.boxSizing = 'border-box';
      el.style.border = '2px solid red';
      el.style.backgroundColor = 'rgba(255, 0, 0, 0.15)';
      el.style.transition = 'all 0.35s';
    }
  }, testId);
  await page.waitForTimeout(2000); // Pause to make the highlight visible
}

test('Required fields display errors on empty form submission', async ({ page }) => {
  let page1: Page;

  await test.step('Navigate to Ketryx website', async () => {
    await page.goto('https://www.ketryx.com/');
  });

  await test.step('Accept cookie consent popup if present', async () => {
    // Accept cookie consent only if it is visible
    try {
      const cookieBtn = page.getByTestId('uc-accept-all-button');
      // Wait up to 5 seconds for the cookie popup, but do not fail if not found
      if (await cookieBtn.isVisible({ timeout: 5000 })) {
        await cookieBtn.click();
      } else {
        console.log('Cookie consent popup not visible, continuing...');
      }
    } catch (e) {
      // In CI, sometimes the popup doesn't appear at all
      console.log('Cookie consent popup not found, skipping.');
    }
  });

  await test.step('Click on the Careers link', async () => {
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

  await test.step('Click on the Apply button', async () => {
    const applyBtn = page1.getByRole('button', { name: 'Apply' });
    await applyBtn.waitFor({ state: 'visible' });
    await applyBtn.click();
  });

  await test.step('Click on the Submit application button', async () => {
    const submitBtn = page1.getByRole('button', { name: 'Submit application' });
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.waitFor({ state: 'visible' });
    await submitBtn.click();
  });

  // Main error verifications for core fields
  await test.step('Validate and highlight "First Name is required" error', async () => {
    await expect(page1.getByTestId('first_name-error')).toHaveText(/First Name is required/i, { timeout: 3000 });
    await highlightError(page1, 'first_name-error');
  });

  await test.step('Validate and highlight "Last Name is required" error', async () => {
    await expect(page1.getByTestId('last_name-error')).toHaveText(/Last Name is required/i, { timeout: 3000 });
    await highlightError(page1, 'last_name-error');
  });

  await test.step('Validate and highlight "Email is required" error', async () => {
    await expect(page1.getByTestId('email-error')).toHaveText(/Email is required/i, { timeout: 3000 });
    await highlightError(page1, 'email-error');
  });

  await test.step('Validate and highlight "Test automation experience is required" error', async () => {
    const locator = page1.getByTestId('question_10597302008-error');
    await locator.scrollIntoViewIfNeeded();
    await expect(page1.getByTestId('question_10597302008-error')).toBeVisible();
    await highlightError(page1, 'question_10597302008-error');
  });

  await test.step('Validate and highlight "Typescript/Javascript experience is required" error', async () => {
    await expect(page1.getByTestId('question_10597303008-error')).toBeVisible();
    await highlightError(page1, 'question_10597303008-error');
  });

  await test.step('Validate and highlight "EU citizenship or RWR+ card is required" error', async () => {
    await expect(page1.getByTestId('question_10597304008-error')).toBeVisible();
    await highlightError(page1, 'question_10597304008-error');
  });

  await test.step('Validate and highlight "Current location is required" error', async () => {
    const locator = page1.getByTestId('question_11703855008-error');
    await locator.scrollIntoViewIfNeeded();
    await expect(page1.getByTestId('question_11703855008-error')).toBeVisible();
    await highlightError(page1, 'question_11703855008-error');
  });

  await test.step('Validate "Where did you learn of the position is required" error', async () => {
    const idSelector = '#question_11522906008-error';
    await expect(page1.locator(idSelector)).toBeVisible();
  });

  await test.step('Validate "Submit application" button is visible', async () => {
    await expect(page1.getByRole('button', { name: 'Submit application' })).toBeVisible();
  });

  // Pause a bit at the end so all highlights are visible
  await test.step('Pause to view highlights', async () => {
    await page1.waitForTimeout(3000);
  });
});
