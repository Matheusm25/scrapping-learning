import axios, { AxiosInstance } from 'axios';
import * as cheerio from 'cheerio';

interface ListPrice {
  productName: string;
  price: number;
  asin: string;
}

export class ListPrices {
  private client: AxiosInstance;
  private baseUrl = 'https://www.amazon.com.br';

  constructor() {
    this.client = axios.create({});
  }

  async getListPrices(url: string): Promise<Array<ListPrice>> {
    let response = await this.client.get(
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
              productName: dom(el).find('a[id*="itemName"]').attr('title'),
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

      response = await this.client.get(
        `${this.baseUrl}${dom('input[name="showMoreUrl"]').attr('value')}`,
      );
    } while (keepGoing);

    return products;
  }
}
