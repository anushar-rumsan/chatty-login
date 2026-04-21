// tests/dashboard.spec.js
const { test, expect } = require('@playwright/test');
const { AdminDashboardPage } = require('../pages/AdminDashboard');

test.use({ storageState: 'test_data/auth.json' });

// ---------------------------------------------------------------------
// 1. Dashboard loads and basic elements exist
// ---------------------------------------------------------------------
test('Dashboard loads successfully', async ({ page }) => {
  const dashboard = new AdminDashboardPage(page);
  await dashboard.goto();
  await expect(page).toHaveURL(/admin/);
});

test('All main section headers are visible', async ({ page }) => {
  const dashboard = new AdminDashboardPage(page);
  await dashboard.goto();
  await expect(dashboard.workspaceManagementHeader).toBeVisible();
  await expect(dashboard.billingHeader).toBeVisible();
  await expect(dashboard.organizationHeader).toBeVisible();
  await expect(dashboard.aiManagementHeader).toBeVisible();
});

test('Quick Actions section label and New Workspace button are present', async ({ page }) => {
  const dashboard = new AdminDashboardPage(page);
  await dashboard.goto();
  // "Create Workspace" is a section label; "+ New Workspace" is the only real button
  await expect(dashboard.createWorkspaceLabel).toBeVisible();
  await expect(dashboard.newWorkspaceButton).toBeVisible();
  // "View Analytics" and "View Reports" are text labels (Coming Soon / not interactive)
  await expect(dashboard.viewAnalyticsLabel).toBeVisible();
  await expect(dashboard.viewReportsLabel).toBeVisible();
});

// ---------------------------------------------------------------------
// 2. Data verification (counts and plan)
// ---------------------------------------------------------------------
// test('Workspace count matches screenshot (2)', async ({ page }) => {
//   const dashboard = new AdminDashboardPage(page);
//   await dashboard.goto();
//   const count = await dashboard.getActiveWorkspacesCount();
//   expect(count).toBe(2);
// });

test('Organization count should be 1', async ({ page }) => {
  const dashboard = new AdminDashboardPage(page);
  await dashboard.goto();
  const count = await dashboard.getOrganizationsCount();
  expect(count).toBe(1);
});

test('AI Models count should be 2', async ({ page }) => {
  const dashboard = new AdminDashboardPage(page);
  await dashboard.goto();
  const count = await dashboard.getAIModelsCount();
  expect(count).toBe(2);
});

test('Billing shows Pro Plan Active', async ({ page }) => {
  const dashboard = new AdminDashboardPage(page);
  await dashboard.goto();
  const isActive = await dashboard.isProPlanActive();
  expect(isActive).toBeTruthy();
});

// ---------------------------------------------------------------------
// 3. "Coming Soon" sections – Billing & Subscription and AI Management
// ---------------------------------------------------------------------
test('Billing & Subscription has "Coming Soon" badge', async ({ page }) => {
  const dashboard = new AdminDashboardPage(page);
  await dashboard.goto();
  const isComingSoon = await dashboard.isBillingComingSoon();
  expect(isComingSoon).toBeTruthy();
});

test('AI Management has "Coming Soon" badge', async ({ page }) => {
  const dashboard = new AdminDashboardPage(page);
  await dashboard.goto();
  const isComingSoon = await dashboard.isAIManagementComingSoon();
  expect(isComingSoon).toBeTruthy();
});

// ---------------------------------------------------------------------
// 4. Card navigation
// ---------------------------------------------------------------------
test('Clicking Workspace Management card navigates to workspaces page', async ({ page }) => {
  const dashboard = new AdminDashboardPage(page);
  await dashboard.goto();
  await dashboard.clickWorkspaceManagement();
  await expect(page).toHaveURL(/admin\/workspaces/);
});

test('Clicking Organization Management card navigates to organization page', async ({ page }) => {
  const dashboard = new AdminDashboardPage(page);
  await dashboard.goto();
  await dashboard.clickOrganizationManagement();
  await expect(page).toHaveURL(/admin\/organization/);
});

// ---------------------------------------------------------------------
// 5. "+ New Workspace" button opens modal
// ---------------------------------------------------------------------
test('Clicking "+ New Workspace" opens Create New Workspace modal', async ({ page }) => {
  const dashboard = new AdminDashboardPage(page);
  await dashboard.goto();
  await dashboard.clickNewWorkspace();
  await expect(dashboard.modal).toBeVisible();
  await expect(dashboard.modal).toContainText('Create New Workspace');
  await dashboard.cancelWorkspaceCreation();
});

test('Create New Workspace modal has all required fields', async ({ page }) => {
  const dashboard = new AdminDashboardPage(page);
  await dashboard.goto();
  await dashboard.openCreateWorkspaceModal();
  await expect(dashboard.workspaceNameInput).toBeVisible();
  await expect(dashboard.sectorCombobox).toBeVisible();
  await expect(dashboard.descriptionInput).toBeVisible();
  await expect(dashboard.createWorkspaceSubmitButton).toBeDisabled();
  await dashboard.cancelWorkspaceCreation();
});

// ---------------------------------------------------------------------
// 6. Workspace creation – positive scenario
// ---------------------------------------------------------------------
test('Create a new workspace with valid name', async ({ page }) => {
  const dashboard = new AdminDashboardPage(page);
  await dashboard.goto();
  const uniqueName = `TestWorkspace ${Date.now()}`;
  await dashboard.createWorkspace(uniqueName);
  await expect(dashboard.modal).not.toBeVisible();
});

// ---------------------------------------------------------------------
// 7. Workspace creation – negative scenario: empty name
// ---------------------------------------------------------------------
test('Cannot create workspace with empty name submit button is disabled', async ({ page }) => {
  const dashboard = new AdminDashboardPage(page);
  await dashboard.goto();
  await dashboard.openCreateWorkspaceModal();
  await expect(dashboard.createWorkspaceSubmitButton).toBeDisabled();
  await dashboard.cancelWorkspaceCreation();
});

// ---------------------------------------------------------------------
// 8. "Coming Soon" cards are not clickable (no pointer cursor)
// ---------------------------------------------------------------------
test('Billing & Subscription card is not clickable', async ({ page }) => {
  const dashboard = new AdminDashboardPage(page);
  await dashboard.goto();
  const cursor = await dashboard.billingCard.evaluate(el => getComputedStyle(el).cursor);
  expect(cursor).not.toBe('pointer');
});

test('AI Management card is not clickable', async ({ page }) => {
  const dashboard = new AdminDashboardPage(page);
  await dashboard.goto();
  const cursor = await dashboard.aiManagementCard.evaluate(el => getComputedStyle(el).cursor);
  expect(cursor).not.toBe('pointer');
});