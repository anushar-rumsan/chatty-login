import { test as setup } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { LoginPage } from '../pages/LoginPage.js';
import { OTPPage } from '../pages/OTPPage.js';
import { MailosaurService } from '../services/MailosaurService.js';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const authFile = 'test_data/auth.json';

setup('authenticate', async ({ page }) => {
  const testEmail = process.env.MAILOSAUR_TEST_EMAIL;
  const apiKey = process.env.MAILOSAUR_API_KEY;

  if (!apiKey || !testEmail) {
    throw new Error('Missing MAILOSAUR_API_KEY or MAILOSAUR_TEST_EMAIL in .env');
  }

  const loginPage = new LoginPage(page);
  const otpPage = new OTPPage(page);
  const mailosaur = new MailosaurService(apiKey);

  await loginPage.goto();
  const requestTime = await loginPage.requestOTP(testEmail);
  console.log('⏰ OTP requested at:', requestTime.toLocaleTimeString());

  const otp = await mailosaur.getOTPFromEmail(testEmail, requestTime);
  console.log('🔐 Found OTP:', otp);

  await otpPage.typeOTP(otp);
  await otpPage.submit();
  await otpPage.waitForDashboard();
  console.log('✅ Login successful!');

  await page.context().storageState({ path: authFile });
  console.log(`💾 Session saved to ${authFile}`);
});