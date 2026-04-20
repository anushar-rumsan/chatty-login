export class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('#email');
    this.loginButton = page.locator('button:has-text("Login")');
  }

  async goto() {
    await this.page.goto('https://chatty-stage-app.rumsan.us/auth/login');
    await this.page.waitForLoadState('networkidle');
  }

  async requestOTP(email) {
    await this.emailInput.fill(email);
    const requestTime = new Date();
    await this.loginButton.click();
    await this.page.waitForURL(/verify-otp/);
    return requestTime;
  }
}