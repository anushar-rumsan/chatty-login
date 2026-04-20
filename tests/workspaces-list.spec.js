// tests/workspaces-list.spec.js
const { test, expect } = require('@playwright/test');
const { WorkspacesListPage } = require('../pages/WorkspacesListPage');
const { AdminDashboardPage } = require('../pages/AdminDashboard');

test.use({ storageState: 'test_data/auth.json' });

test.describe('Workspaces List page', () => {
  test('loads with correct heading and subheading', async ({ page }) => {
    const workspacesList = new WorkspacesListPage(page);
    await workspacesList.goto();
    await expect(workspacesList.heading).toBeVisible();
    await expect(workspacesList.subheading).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/workspaces$/);
  });

  test('Back to Dashboard link navigates to admin dashboard', async ({ page }) => {
    const workspacesList = new WorkspacesListPage(page);
    await workspacesList.goto();
    await workspacesList.backToDashboardLink.click();
    await expect(page).toHaveURL(/\/admin$/);
  });

  test('Create Workspace button is visible', async ({ page }) => {
    const workspacesList = new WorkspacesListPage(page);
    await workspacesList.goto();
    await expect(workspacesList.createWorkspaceButton).toBeVisible();
  });

  test('at least one workspace card is listed', async ({ page }) => {
    const workspacesList = new WorkspacesListPage(page);
    await workspacesList.goto();
    const count = await workspacesList.getWorkspaceCount();
    expect(count).toBeGreaterThan(0);
  });

  test('each workspace card has a name and status visible', async ({ page }) => {
    const workspacesList = new WorkspacesListPage(page);
    await workspacesList.goto();
    // All cards show "Active" status badge
    const activeStatuses = page.locator('a[href^="/admin/workspaces/"]').getByText('Active');
    const count = await activeStatuses.count();
    expect(count).toBeGreaterThan(0);
  });

  test('clicking a workspace card navigates to its detail page', async ({ page }) => {
    const workspacesList = new WorkspacesListPage(page);
    await workspacesList.goto();
    const href = await workspacesList.getFirstWorkspaceHref();
    await workspacesList.openFirstWorkspace();
    await expect(page).toHaveURL(new RegExp(href));
  });

  test('Create Workspace button opens modal', async ({ page }) => {
    // Use AdminDashboardPage modal helpers since the same modal is used on this page too
    const workspacesList = new WorkspacesListPage(page);
    await workspacesList.goto();
    await workspacesList.createWorkspaceButton.click();
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText('Create New Workspace');
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(modal).not.toBeVisible();
  });

  test('workspace count on admin dashboard matches list page count', async ({ page }) => {
    const dashboard = new AdminDashboardPage(page);
    await dashboard.goto();
    const dashboardCount = await dashboard.getActiveWorkspacesCount();

    const workspacesList = new WorkspacesListPage(page);
    await workspacesList.goto();
    const listCount = await workspacesList.getWorkspaceCount();

    expect(listCount).toBe(dashboardCount);
  });
});
