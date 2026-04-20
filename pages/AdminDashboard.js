// pages/AdminDashboard.js
const { expect } = require('@playwright/test');

class AdminDashboardPage {
  constructor(page) {
    this.page = page;

    // ----- Section Headers -----
    this.workspaceManagementHeader = page.getByText('Workspace Management', { exact: true });
    this.billingHeader             = page.getByText('Billing & Subscription', { exact: true });
    this.organizationHeader        = page.getByText('Organization Management', { exact: true });
    this.aiManagementHeader        = page.getByText('AI Management', { exact: true });

    // ----- Stat paragraphs -----
    // Actual paragraph texts: "2 Active Workspaces", "1 Organization", "2 Models Active", "Pro Plan Active"
    this.activeWorkspacesParagraph = page.getByRole('paragraph').filter({ hasText: /Active Workspaces/ });
    this.organizationsParagraph    = page.getByRole('paragraph').filter({ hasText: /\d+ Organization/ });
    this.aiModelsParagraph         = page.getByRole('paragraph').filter({ hasText: /Models Active/ });
    this.proPlanParagraph          = page.getByRole('paragraph').filter({ hasText: 'Pro Plan Active' });

    // ----- "Coming Soon" badges & their cards -----
    // Billing & Subscription and AI Management are the sections marked Coming Soon.
    // The card container is 3 levels up from each section title.
    this.billingCard = page
      .getByText('Billing & Subscription', { exact: true })
      .locator('../../..');
    this.billingComingSoon = this.billingCard.getByText('Coming Soon');
    this.aiManagementCard = page
      .getByText('AI Management', { exact: true })
      .locator('../../..');
    this.aiComingSoon = this.aiManagementCard.getByText('Coming Soon');

    // ----- Quick Actions -----
    // "Create Workspace" is a section label (not a button).
    // The only interactive element is the "+ New Workspace" button.
    // "View Analytics" (Coming Soon) and "View Reports" are text labels, not buttons.
    this.createWorkspaceLabel = page.getByText('Create Workspace', { exact: true });
    this.newWorkspaceButton   = page.getByRole('button', { name: '+ New Workspace' });
    this.viewAnalyticsLabel   = page.getByText('View Analytics', { exact: true });
    this.viewReportsLabel     = page.getByText('View Reports', { exact: true });

    // ----- Workspace Creation Modal -----
    this.modal                       = page.getByRole('dialog');
    this.workspaceNameInput          = page.getByRole('textbox', { name: 'Workspace Name' });
    this.sectorCombobox              = page.getByRole('combobox', { name: 'Sector' });
    this.descriptionInput            = page.getByRole('textbox', { name: 'Description (Optional)' });
    this.createWorkspaceSubmitButton = page.getByRole('button', { name: 'Create Workspace' });
    this.cancelButton                = page.getByRole('button', { name: 'Cancel' });
    this.closeButton                 = page.getByRole('button', { name: 'Close' });
  }

  async goto() {
    await this.page.goto('/admin');
    await this.page.waitForLoadState('networkidle');
  }

  // ----- Card navigation -----
  async clickWorkspaceManagement() {
    await this.workspaceManagementHeader.click();
  }

  async clickOrganizationManagement() {
    await this.organizationHeader.click();
  }

  // ----- Quick Actions -----
  async clickNewWorkspace() {
    await this.newWorkspaceButton.click();
  }

  // ----- Workspace Creation -----
  async openCreateWorkspaceModal() {
    await this.clickNewWorkspace();
    await expect(this.modal).toBeVisible();
  }

  async fillWorkspaceName(name) {
    await this.workspaceNameInput.fill(name);
  }

  async submitWorkspaceCreation() {
    await this.createWorkspaceSubmitButton.click();
  }

  async cancelWorkspaceCreation() {
    await this.cancelButton.click();
    await expect(this.modal).not.toBeVisible();
  }

  async createWorkspace(workspaceName) {
    await this.openCreateWorkspaceModal();
    await this.fillWorkspaceName(workspaceName);
    await this.submitWorkspaceCreation();
  }

  // ----- Data Extraction -----
  async getActiveWorkspacesCount() {
    const text = await this.activeWorkspacesParagraph.textContent();
    return parseInt(text);
  }

  async getOrganizationsCount() {
    const text = await this.organizationsParagraph.textContent();
    return parseInt(text);
  }

  async getAIModelsCount() {
    const text = await this.aiModelsParagraph.textContent();
    return parseInt(text);
  }

  async isProPlanActive() {
    return this.proPlanParagraph.isVisible();
  }

  // ----- Coming Soon checks -----
  async isBillingComingSoon() {
    return this.billingComingSoon.isVisible().catch(() => false);
  }

  async isAIManagementComingSoon() {
    return this.aiComingSoon.isVisible().catch(() => false);
  }
}

module.exports = { AdminDashboardPage, DashboardPage: AdminDashboardPage };