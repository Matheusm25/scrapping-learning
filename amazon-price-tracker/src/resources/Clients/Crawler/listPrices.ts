import axios from 'axios';
import * as cheerio from 'cheerio';

interface ListPrice {
  name: string;
  price: number;
  asin: string;
  url: string;
}

export class ListPrices {
  private baseUrl = 'https://www.amazon.com.br';

  async getListPrices(url: string): Promise<Array<ListPrice>> {
    let response = await axios.get(
      `${this.baseUrl}${url.replace(this.baseUrl, '')}`,
    );
    const products: Array<ListPrice> = [];
    let keepGoing = true;

    console.countReset('get page');
    do {
      console.count('get page');
      if (response.data.includes('endOfListMarker')) {
        keepGoing = false;
      }

      const dom = cheerio.load(response.data);

      products.push(
        ...(dom('li[data-reposition-action-params]')
          .map((_, el) => {
            const additionalData = JSON.parse(
              String(dom(el).attr('data-reposition-action-params')),
            );
            return {
              name: dom(el).find('a[id*="itemName"]').attr('title'),
              url: `${this.baseUrl}${dom(el)
                .find('a[id*="itemName"]')
                .attr('href')
                ?.split('?')[0]}`,
              asin: additionalData.itemExternalId
                .replace('ASIN:', '')
                .split('|')[0],
              price: Number(
                `${dom(el)
                  .find('span.a-price-whole')
                  .text()
                  .replace(/\D/g, '')}.${dom(el)
                  .find('span.a-price-fraction')
                  .text()
                  .replace(/\D/g, '')}`,
              ),
            };
          })
          .toArray() as Array<ListPrice>),
      );

      response = await axios.get(
        `${this.baseUrl}${dom('input[name="showMoreUrl"]').attr('value')}`,
      );
    } while (keepGoing);

    return products;
  }
}
