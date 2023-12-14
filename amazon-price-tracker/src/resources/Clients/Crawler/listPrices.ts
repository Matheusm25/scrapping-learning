import axios, { AxiosInstance } from 'axios';
import * as cheerio from 'cheerio';

interface ListPrice {
  productName: string;
  price: number;
}

export class ListPrices {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({});
  }

  async getListPrices(url: string): Promise<Array<ListPrice>> {
    const response = await this.client.get(url);
    const dom = cheerio.load(response.data);
    const products = dom('li[data-reposition-action-params]')
      .map((_, el) => {
        return {
          productName: dom(el).find('a[id*="itemName"]').attr('title'),
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
      .toArray() as Array<ListPrice>;

    return products;
  }
}
