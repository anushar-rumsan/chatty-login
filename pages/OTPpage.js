export class OTPPage {
  constructor(page) {
    this.page = page;
    this.verifyButton = page.locator('button:has-text("Verify OTP")');
  }

  async typeOTP(otp) {
    await this.page.waitForSelector('#otp-0');
    for (let i = 0; i < otp.length; i++) {
      await this.page.fill(`#otp-${i}`, otp[i]);
    }
  }

  async submit() {
    await this.verifyButton.click();
  }

  async waitForDashboard() {
    await this.page.waitForURL(/admin/);
  }
}