import axios from 'axios';

export class SMTP {
  async sendMail({
    to,
    body,
    subject,
    from = `Updated Prices <${String(process.env.DEFAULT_INTEGRATION_EMAIL)}>`,
  }: {
    to: Array<string>;
    subject: string;
    body: string;
    from?: string;
  }) {
    try {
      await axios.post('https://api.smtp2go.com/v3/email/send', {
        api_key: String(process.env.SMTP_API_KEY),
        sender: from,
        to: to,
        subject: subject,
        html_body: body,
      });
    } catch (err) {
      console.log(err);
    }
  }
}
