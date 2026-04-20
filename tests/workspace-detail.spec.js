// tests/workspace-detail.spec.js
const { test, expect } = require('@playwright/test');
const { WorkspaceDetailPage } = require('../pages/WorkspaceDetailPage');

test.use({ storageState: 'test_data/auth.json' });

test.describe('Workspace Detail – Industry Knowledge tab', () => {
  test('Industry Knowledge tab becomes selected when clicked', async ({ page }) => {
    const ws = new WorkspaceDetailPage(page);
    await ws.gotoFirstWorkspace();
    await ws.clickTab(ws.tabIndustryKnowledge);
    await expect(ws.tabIndustryKnowledge).toHaveAttribute('aria-selected', 'true');
  });

  test('Total Documents and Active Documents counts are visible', async ({ page }) => {
    const ws = new WorkspaceDetailPage(page);
    await ws.gotoFirstWorkspace();
    await ws.clickTab(ws.tabIndustryKnowledge);
    await expect(ws.totalDocumentsCount).toBeVisible();
    await expect(ws.activeDocumentsCount).toBeVisible();
  });

  test('shows empty state when no documents exist', async ({ page }) => {
    const ws = new WorkspaceDetailPage(page);
    await ws.gotoFirstWorkspace();
    await ws.clickTab(ws.tabIndustryKnowledge);
    const totalText = await ws.totalDocumentsCount.textContent();
    if (parseInt(totalText) === 0) {
      await expect(ws.noDocumentsMessage).toBeVisible();
    }
  });
});

test.describe('Workspace Detail - Integrations tab', () => {
  test('Integrations tab becomes selected when clicked', async ({ page }) => {
    const ws = new WorkspaceDetailPage(page);
    await ws.gotoFirstWorkspace();
    await ws.clickTab(ws.tabIntegrations);
    await expect(ws.tabIntegrations).toHaveAttribute('aria-selected', 'true');
  });

  test('Chat Widget Integrate button is enabled', async ({ page }) => {
    const ws = new WorkspaceDetailPage(page);
    await ws.gotoFirstWorkspace();
    await ws.clickTab(ws.tabIntegrations);
    await expect(ws.chatWidgetIntegrateButton).toBeVisible();
    await expect(ws.chatWidgetIntegrateButton).toBeEnabled();
  });

  test('Slack Integrate button is enabled', async ({ page }) => {
    const ws = new WorkspaceDetailPage(page);
    await ws.gotoFirstWorkspace();
    await ws.clickTab(ws.tabIntegrations);
    await expect(ws.slackIntegrateButton).toBeVisible();
    await expect(ws.slackIntegrateButton).toBeEnabled();
  });

  // Uncomment when WhatsApp is implemented
  // test('WhatsApp Integrate button is disabled (Coming Soon)', async ({ page }) => {
  //   const ws = new WorkspaceDetailPage(page);
  //   await ws.gotoFirstWorkspace();
  //   await ws.clickTab(ws.tabIntegrations);
  //   await expect(ws.whatsappIntegrateButton).toBeDisabled();
  // });

  // Uncomment when Messenger is implemented
  // test('Messenger Integrate button is disabled (Coming Soon)', async ({ page }) => {
  //   const ws = new WorkspaceDetailPage(page);
  //   await ws.gotoFirstWorkspace();
  //   await ws.clickTab(ws.tabIntegrations);
  //   await expect(ws.messengerIntegrateButton).toBeDisabled();
  // });
});  // ← UNCOMMENTED – this closes the Integrations describe

test.describe('Workspace Detail – MCP Marketplace tab', () => {
  test('MCP Marketplace tab becomes selected when clicked', async ({ page }) => {
    const ws = new WorkspaceDetailPage(page);
    await ws.gotoFirstWorkspace();
    await ws.clickTab(ws.tabMcpMarketplace);
    await expect(ws.tabMcpMarketplace).toHaveAttribute('aria-selected', 'true');
  });

  test('Add Server button is visible', async ({ page }) => {
    const ws = new WorkspaceDetailPage(page);
    await ws.gotoFirstWorkspace();
    await ws.clickTab(ws.tabMcpMarketplace);
    await expect(ws.addServerButton).toBeVisible();
  });

  test('shows empty state when no MCP servers are added', async ({ page }) => {
    const ws = new WorkspaceDetailPage(page);
    await ws.gotoFirstWorkspace();
    await ws.clickTab(ws.tabMcpMarketplace);
    const count = await page.getByRole('listitem').count();
    if (count === 0) {
      await expect(ws.noMcpServersMessage).toBeVisible();
    }
  });
});