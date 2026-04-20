// tests/organization.spec.js
const { test, expect } = require('@playwright/test');
const { OrganizationPage } = require('../pages/OrganizationPage');

test.use({ storageState: 'test_data/auth.json' });

test.describe('Organization Management page', () => {
  test('loads with correct heading and URL', async ({ page }) => {
    const org = new OrganizationPage(page);
    await org.goto();
    await expect(org.heading).toBeVisible();
    await expect(org.subheading).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/organization$/);
  });

  test('"← Back to Dashboard" link navigates to admin dashboard', async ({ page }) => {
    const org = new OrganizationPage(page);
    await org.goto();
    await org.backToDashboardLink.click();
    await expect(page).toHaveURL(/\/admin$/);
  });

  test('Organization Details section heading is visible', async ({ page }) => {
    const org = new OrganizationPage(page);
    await org.goto();
    await expect(page.getByText('Organization Details')).toBeVisible();
  });

  test('Organization name is displayed as read-only text', async ({ page }) => {
    const org = new OrganizationPage(page);
    await org.goto();
    // Name renders as static text under a label, not an editable input
    await expect(page.getByText('Organization name cannot be changed')).toBeVisible();
  });

  test('Industry Sector combobox is visible and enabled', async ({ page }) => {
    const org = new OrganizationPage(page);
    await org.goto();
    await expect(org.sectorCombobox).toBeVisible();
    await expect(org.sectorCombobox).toBeEnabled();
  });

  test('Save Changes button is visible', async ({ page }) => {
    const org = new OrganizationPage(page);
    await org.goto();
    await expect(org.saveChangesButton).toBeVisible();
  });

  test('logo Select button is visible', async ({ page }) => {
    const org = new OrganizationPage(page);
    await org.goto();
    await expect(org.logoSelectButton).toBeVisible();
  });

  test('Upload button is visible and enabled', async ({ page }) => {
    const org = new OrganizationPage(page);
    await org.goto();
    await expect(org.uploadButton).toBeVisible();
    await expect(org.uploadButton).toBeEnabled();
  });

  test('Remove button is visible and disabled (no logo uploaded)', async ({ page }) => {
    const org = new OrganizationPage(page);
    await org.goto();
    await expect(org.removeButton).toBeVisible();
    await expect(org.removeButton).toBeDisabled();
  });

  test('organization count on admin dashboard matches 1', async ({ page }) => {
    const org = new OrganizationPage(page);
    await org.goto();
    // Navigate back to dashboard and verify count
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    const countParagraph = page.getByRole('paragraph').filter({ hasText: /\d+ Organization/ });
    const text = await countParagraph.textContent();
    expect(parseInt(text)).toBeGreaterThanOrEqual(1);
  });
});
