/// <reference lib="DOM" />
import puppeteer from 'puppeteer';

interface TripData {
  value: string;
  initDate: string;
  endDate: string;
  bestMonthToTravel: string;
  knowPrices: string;
  destiny: string;
}

// login to cron-job.org and register a cron job to call webhook.site
(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const [origin, destiny] = process.argv.slice(2);

  await page.goto('https://www.google.com/travel/flights');

  const selectors = {
    originInput: 'div[aria-placeholder="De onde?"] div div div div input',
    stateOptions: 'ul li[aria-selected][data-type="3"]',
    destinyInput: 'input[placeholder="Para onde?"]',
    searchButton: 'button[aria-label="Pesquisar"]',
    cards: 'tr:first-child',
  };

  await page.$eval(
    selectors.originInput,
    (el, newValue) => el.setAttribute('value', String(newValue)),
    origin,
  );
  await page.click(selectors.originInput);

  await page.waitForSelector(selectors.stateOptions);
  let firstOptionId = await page.$$eval(
    selectors.stateOptions,
    options => options[0]?.id,
  );
  await page.click(`#${firstOptionId}`);

  await page.$eval(
    selectors.destinyInput,
    (el, newValue) => el.setAttribute('value', String(newValue)),
    destiny,
  );
  await page.click(selectors.destinyInput);

  await page.waitForSelector(selectors.stateOptions);
  firstOptionId = await page.$$eval(
    selectors.stateOptions,
    options => options[0]?.id,
  );
  await page.click(`#${firstOptionId}`);

  await page.waitForSelector(selectors.searchButton);
  await page.reload();

  const tripData: TripData = await page.$$eval(selectors.cards, cards => {
    const cheapestTripCard = cards[0];
    const knowData = cards[1];

    return {
      destiny: String(
        document.querySelectorAll('h1').item(1).textContent?.split('para ')[1],
      ),
      value: String(
        cheapestTripCard?.querySelectorAll('td').item(0).textContent,
      ),
      initDate: String(
        cheapestTripCard
          ?.querySelectorAll('td')
          .item(1)
          .querySelector('div span:last-child')
          ?.textContent?.split(' — ')[0],
      ),
      endDate: String(
        cheapestTripCard
          ?.querySelectorAll('td')
          .item(1)
          .querySelector('div span:last-child')
          ?.textContent?.split(' — ')[1],
      ),
      bestMonthToTravel: String(
        knowData
          ?.querySelector('th')
          ?.textContent?.replace('Menores preços', ''),
      ),
      knowPrices: String(
        knowData
          ?.querySelector('td')
          ?.textContent?.replace('Preços comuns: ', ''),
      ),
    };
  });

  console.log(`
    A viagem de menor valor encontrado para ${tripData.destiny} custa ${tripData.value}
    Partindo dia ${tripData.initDate} e retornando dia ${tripData.endDate}
    O melhor mês para viajar é ${tripData.bestMonthToTravel} com o custo de ${tripData.knowPrices}
  `);

  await browser.close();
})();
