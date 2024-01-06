import { ListPrices } from '../services/DB/Crawler/listPrices';
import { TursoClient } from '../services/DB/Turso';
import { List } from '../services/DB/interfaces/entities';

export class AmazonPriceWatcher {
  DB: TursoClient;

  constructor() {
    this.DB = new TursoClient();
  }

  async bootstrap() {
    const lists = await this.DB.listLists();

    for (const list of lists) {
      await this.checkPrices(list);
    }
  }

  async checkPrices(list: string | List) {
    const crawler = new ListPrices();

    if (typeof list === 'string') {
      list = (await this.DB.getList(list)) as List;
    }

    if (list) {
      const oldProductsData = await this.DB.getProductsFromList(list.id);
      const currentProductsData = await crawler.getListPrices(list.url);

      const productsWithLowerPrice: typeof currentProductsData = [];

      for (const product of currentProductsData) {
        const oldProduct = oldProductsData.find(
          oldProduct => oldProduct.asin === product.asin,
        );

        if (oldProduct) {
          if (oldProduct.price !== product.price && product.price) {
            await this.DB.updateProductPrice({
              price: product.price,
              product_id: oldProduct.id,
            });

            if (oldProduct.price > product.price) {
              productsWithLowerPrice.push(product);
            }
          }
        } else {
          await this.DB.createProduct({
            asin: product.asin,
            list_id: list.id,
            name: product.name,
            price: product.price,
            url: product.url,
          });
        }
      }

      console.log(productsWithLowerPrice);
    }
  }
}
