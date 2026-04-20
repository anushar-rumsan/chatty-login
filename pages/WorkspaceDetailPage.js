// pages/WorkspaceDetailPage.js
const { expect } = require('@playwright/test');

class WorkspaceDetailPage {
  constructor(page) {
    this.page = page;

    // ----- Header -----
    this.backToWorkspacesLink = page.getByRole('link', { name: 'Back to Workspaces' });
    // Use XPath to exclude the "Rumsan AI" h1 that lives inside the nav <a> tag
    this.workspaceNameHeading = page.locator('xpath=//h1[not(ancestor::a)]');
    // exact:true matches only lowercase "active" on the detail page, not "Active" on list cards
    this.statusBadge          = page.getByText('active', { exact: true });
    this.openWorkspaceLink    = page.getByRole('link', { name: 'Open Workspace' });

    // ----- Tab list -----
    this.tabGeneral           = page.getByRole('tab', { name: 'General' });
    this.tabMembers           = page.getByRole('tab', { name: 'Members' });
    this.tabLlmSettings       = page.getByRole('tab', { name: 'LLM Settings' });
    this.tabIndustryKnowledge = page.getByRole('tab', { name: 'Industry Knowledge' });
    this.tabIntegrations      = page.getByRole('tab', { name: 'Integrations' });
    this.tabMcpMarketplace    = page.getByRole('tab', { name: 'MCP Marketplace' });

    // ===== General tab =====
    // Workspace Name is disabled (cannot be edited)
    this.workspaceNameInput  = page.getByRole('textbox', { name: 'Workspace Name' });
    this.botNameInput        = page.getByRole('textbox', { name: 'Bot Name' });
    this.sectorCombobox      = page.getByRole('combobox', { name: 'Workspace Sector' });
    this.descriptionTextarea = page.getByRole('textbox', { name: 'Workspace Description' });
    this.saveChangesButton   = page.getByRole('button', { name: 'Save Changes' });
    // General Settings sub-section
    this.viewApiKeysLink     = page.getByRole('link', { name: 'View Keys' });
    this.deleteWorkspaceButton = page.getByRole('button', { name: 'Delete' });

    // ===== Members tab =====
    this.inviteMemberButton    = page.getByRole('button', { name: 'Invite Member' });
    this.membersList           = page.getByRole('tabpanel', { name: 'Members' }).locator('[class]').filter({ has: page.getByRole('paragraph') });
    // Invite modal
    this.inviteModal           = page.getByRole('dialog', { name: 'Invite New Member' });
    this.inviteEmailInput      = page.getByRole('textbox', { name: 'Email Address' });
    this.inviteRoleCombobox    = page.getByRole('combobox', { name: 'Role' });
    this.sendInvitationButton  = page.getByRole('button', { name: 'Send Invitation' });
    this.closeInviteModalButton = page.getByRole('button', { name: 'Close' });

    // ===== LLM Settings tab =====
    this.aiProviderCombobox      = page.getByRole('combobox', { name: 'AI Provider' });
    this.chatModelCombobox       = page.getByRole('combobox', { name: 'Chat Model' });
    this.embeddingModelCombobox  = page.getByRole('combobox', { name: 'Embedding Model' });
    this.temperatureSlider       = page.getByRole('slider');
    this.maxTokensInput          = page.getByRole('spinbutton', { name: 'Max Tokens' });
    this.apiKeyInput             = page.getByRole('textbox', { name: 'OpenAI API Key*' });
    this.saveConfigButton        = page.getByRole('button', { name: 'Save Configuration' });

    // ===== Industry Knowledge tab =====
    this.totalDocumentsCount  = page.getByText('Total Documents').locator('..').getByText(/^\d+$/);
    this.activeDocumentsCount = page.getByText('Active Documents').locator('..').getByText(/^\d+$/);
    this.noDocumentsMessage   = page.getByRole('paragraph').filter({ hasText: 'No documents uploaded yet' });

    // ===== Integrations tab =====
    this.chatWidgetIntegrateButton  = page.getByRole('heading', { name: 'Chat Widget' }).locator('../..').getByRole('button', { name: 'Integrate' });
    this.slackIntegrateButton       = page.getByRole('heading', { name: 'Slack' }).locator('../..').getByRole('button', { name: 'Integrate' });
    this.whatsappIntegrateButton    = page.getByRole('heading', { name: 'WhatsApp' }).locator('../..').getByRole('button', { name: 'Integrate' });
    this.messengerIntegrateButton   = page.getByRole('heading', { name: 'Messenger' }).locator('../..').getByRole('button', { name: 'Integrate' });

    // ===== MCP Marketplace tab =====
    this.addServerButton       = page.getByRole('button', { name: 'Add Server' });
    this.noMcpServersMessage   = page.getByRole('paragraph').filter({ hasText: 'No MCP servers available' });
  }

  /** Navigate to the workspace detail page via the workspaces list (no slug hardcoding) */
  async gotoFirstWorkspace() {
    await this.page.goto('/admin/workspaces');
    await this.page.waitForLoadState('networkidle');
    const firstCard = this.page.locator('a[href^="/admin/workspaces/"]').first();
    const href = await firstCard.getAttribute('href');
    await firstCard.click();
    // waitForURL is reliable for SPA navigation; networkidle alone is not
    await this.page.waitForURL(`**${href}`, { waitUntil: 'networkidle' });
  }

  async clickTab(tabLocator) {
    await tabLocator.click();
    await this.page.waitForLoadState('networkidle');
  }

  // ----- Members helpers -----
  async openInviteModal() {
    await this.inviteMemberButton.click();
    await expect(this.inviteModal).toBeVisible();
  }

  async closeInviteModal() {
    await this.closeInviteModalButton.click();
    await expect(this.inviteModal).not.toBeVisible();
  }
}

module.exports = { WorkspaceDetailPage };
