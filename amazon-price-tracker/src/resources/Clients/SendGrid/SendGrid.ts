import sgMail from '@sendgrid/mail';

export class SendGrid {
  constructor() {
    sgMail.setApiKey(String(process.env.SENDGRID_API_KEY));
  }

  async sendMail({
    to,
    body,
    cc = [],
    subject,
    from,
  }: {
    to: Array<string>;
    subject: string;
    body: string;
    cc?: Array<string>;
    from?: string;
  }) {
    if (!from) {
      from = String(process.env.DEFAULT_INTEGRATION_EMAIL);
    }
    await sgMail.send({
      to,
      from,
      subject,
      html: body,
      cc,
    });
  }
}
