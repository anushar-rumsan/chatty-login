import MailosaurClient from 'mailosaur';

export class MailosaurService {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  getServerId(email) {
    return email.split('@')[1].split('.')[0];
  }

  async getOTPFromEmail(emailAddress, requestTime) {
    const serverId = this.getServerId(emailAddress);
    const mailosaur = new MailosaurClient(this.apiKey);

    await new Promise(resolve => setTimeout(resolve, 5000));

    const email = await mailosaur.messages.get(serverId, {
      sentTo: emailAddress,
      receivedAfter: requestTime
    }, { timeout: 60000 });

    const content = email.html?.body || email.text?.body || '';
    const match = content.match(/class="otp-code"[^>]*>(\d{6})</);
    if (!match) throw new Error('OTP not found');
    return match[1];
  }
}