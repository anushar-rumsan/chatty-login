// pages/WorkspacesListPage.js
const { expect } = require('@playwright/test');

class WorkspacesListPage {
  constructor(page) {
    this.page = page;

    // ----- Header -----
    this.heading              = page.getByRole('heading', { name: 'Workspace Management', level: 1 });
    this.subheading           = page.getByRole('paragraph').filter({ hasText: 'Manage your AI workspaces' });
    this.backToDashboardLink  = page.getByRole('link', { name: '← Back to Dashboard' });
    this.createWorkspaceButton = page.getByRole('button', { name: 'Create Workspace' });

    // ----- Workspace cards -----
    // Each workspace is an <a href="/admin/workspaces/:slug">
    this.workspaceCards = page.locator('a[href^="/admin/workspaces/"]');
  }

  async goto() {
    await this.page.goto('/admin/workspaces');
    await this.page.waitForLoadState('networkidle');
  }

  /** Returns the href of the first workspace card */
  async getFirstWorkspaceHref() {
    return await this.workspaceCards.first().getAttribute('href');
  }

  /** Clicks the first workspace card and waits for navigation */
  async openFirstWorkspace() {
    await this.workspaceCards.first().click();
    await this.page.waitForLoadState('networkidle');
  }

  /** Returns the count of workspace cards listed */
  async getWorkspaceCount() {
    return await this.workspaceCards.count();
  }
}

module.exports = { WorkspacesListPage };
