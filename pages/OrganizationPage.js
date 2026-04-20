// pages/OrganizationPage.js
const { expect } = require('@playwright/test');

class OrganizationPage {
  constructor(page) {
    this.page = page;

    // ----- Header -----
    this.heading             = page.getByRole('heading', { name: 'Organization Management', level: 1 });
    this.subheading          = page.getByRole('paragraph').filter({ hasText: 'Manage your organization settings and configuration' });
    this.backToDashboardLink = page.getByRole('link', { name: '← Back to Dashboard' });

    // ----- Organization Details form -----
    // Name is read-only (displayed as text, not an input)
    this.organizationNameValue = page.getByText('Organization Details', { exact: false }).locator('..').getByText(/^[A-Za-z0-9]/).first();
    this.sectorCombobox        = page.getByRole('combobox', { name: 'Industry Sector' });
    this.saveChangesButton     = page.getByRole('button', { name: 'Save Changes' });

    // ----- Logo -----
    this.logoSelectButton = page.getByRole('button', { name: 'Select logo' });
    this.uploadButton     = page.getByRole('button', { name: 'Upload' });
    this.removeButton     = page.getByRole('button', { name: 'Remove' });
  }

  async goto() {
    await this.page.goto('/admin/organization');
    await this.page.waitForLoadState('networkidle');
  }

  async selectSector(sectorName) {
    await this.sectorCombobox.click();
    await this.page.getByRole('option', { name: sectorName }).click();
  }

  async saveChanges() {
    await this.saveChangesButton.click();
  }
}

module.exports = { OrganizationPage };
