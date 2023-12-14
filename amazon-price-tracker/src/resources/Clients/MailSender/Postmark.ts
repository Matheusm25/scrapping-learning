import axios, { AxiosInstance } from 'axios';

export class Postmark {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: 'https://api.postmarkapp.com',
      headers: {
        'X-Postmark-Server-Token': String(process.env.POSTMARK_SERVER_TOKEN),
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }

  async sendMail({
    to,
    body,
    cc = [],
    subject,
    from = String(process.env.DEFAULT_INTEGRATION_EMAIL),
  }: {
    to: Array<string>;
    subject: string;
    body: string;
    cc?: Array<string>;
    from?: string;
  }) {
    try {
      await this.client.post('/email', {
        From: from,
        To: to.join(','),
        Cc: cc.join(','),
        Subject: subject,
        HtmlBody: body,
      });
    } catch (err) {
      console.log(err);
    }
  }
}
