/// <reference lib="DOM" />
import 'dotenv/config';
import puppeteer from 'puppeteer';

const delay = delayInms => {
  return new Promise(resolve => setTimeout(resolve, delayInms));
};

// login to cron-job.org and register a cron job to call webhook.site
(async () => {
  const loginUrl = 'https://console.cron-job.org/login';

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(loginUrl);

  await page.type(
    'input[name="email"]',
    String(process.env.CRON_JOB_ORG_EMAIL),
  );
  await page.type(
    'input[name="password"]',
    String(process.env.CRON_JOB_ORG_PASSWORD),
  );
  await page.click('input[type="checkbox"][value="remember"]');

  await Promise.all([
    page.waitForNavigation(),
    page.click('button[type="submit"]'),
  ]);

  await page.evaluate(() => {
    document.querySelectorAll('button[type="button"]').forEach(el => {
      if (el.children[0]?.textContent === 'Create cronjob') {
        el.setAttribute('id', 'create-cronjob');
      }
    });
  });

  await page.click('#create-cronjob');
  await page.waitForSelector(
    '.MuiFormControl-root.MuiTextField-root.MuiFormControl-fullWidth',
  );

  await page.evaluate(() => {
    const fields = ['title', 'url'];
    const buttons = ['create'];
    document
      .querySelectorAll(
        '.MuiFormControl-root.MuiTextField-root.MuiFormControl-fullWidth',
      )
      .forEach(el => {
        const field = fields.find(f =>
          String(el.children[0]?.textContent?.toLowerCase()).includes(f),
        );
        if (field) {
          el.children[1]?.children[0]?.setAttribute('id', field.toLowerCase());
        }
      });

    document.querySelectorAll('button[type="button"]').forEach(el => {
      const button = buttons.find(
        b => el.textContent?.toLowerCase().includes(b),
      );
      if (button) {
        el.setAttribute('id', button.toLowerCase());
      }
    });
  });

  await page.type('#title', 'New Cron Job');

  await page.focus('#url');
  await page.keyboard.down('Control');
  await page.keyboard.press('A');
  await page.keyboard.up('Control');
  await page.keyboard.press('Backspace');
  await page.keyboard.type(String(process.env.DESTINY_URL));

  await page.click(
    '.MuiInputBase-root.MuiInput-root.MuiInput-underline.MuiInputBase-formControl.MuiInput-formControl:has(input[value="15"])',
  );
  await page.click('li[data-value="2"]');

  await delay(1000);

  await page.click('#create');

  await browser.close();
})();
