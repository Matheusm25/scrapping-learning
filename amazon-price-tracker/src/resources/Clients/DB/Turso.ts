import { createClient, Client, ResultSet } from '@libsql/client';
import { createTablesSQL } from './queries/db-structure';
import { createListSQL, getListById } from './queries/lists';
import {
  createProduct,
  getProductsFromList,
  updateProductCurrentPrice,
} from './queries/products';
import { List, Product, ProductPrice } from './interfaces/entities';
import { createPrice } from './queries/product_prices';

export class TursoClient {
  private client: Client;

  constructor() {
    this.client = createClient({
      url: String(process.env.DATABASE_URL),
      authToken: String(process.env.DATABASE_AUTH_TOKEN),
    });
  }

  private parseResult<T>(result: ResultSet): Array<T> {
    const columns = result.columns;
    const rows: Array<T> = [];
    for (const row of result.rows) {
      const parsedRow: any = {};
      for (let i = 0; i < columns.length; i++) {
        parsedRow[`${columns[i]}`] = row[i];
      }
      rows.push(parsedRow);
    }

    return rows;
  }

  async runDBStructure() {
    console.log('Running DB structure');
    console.log(createTablesSQL());
    for (const query of createTablesSQL()) {
      await this.client.execute(query);
    }
    console.log('DB structure ran');
  }

  async registerList(
    registerData: Pick<List, 'email' | 'url'>,
  ): Promise<boolean> {
    console.log('creating list');
    const [query] = createListSQL(registerData.email, registerData.url);
    await this.client.execute(query);
    console.log('list created');

    return true;
  }

  async getList(id: string): Promise<List | undefined> {
    const result = await this.client.execute(getListById(id));
    return this.parseResult<List>(result)[0];
  }

  async getProductsFromList(
    id: string,
  ): Promise<Array<{ id: string; asin: string; price: number }>> {
    const result = await this.client.execute(getProductsFromList(id));
    return this.parseResult<{ id: string; asin: string; price: number }>(
      result,
    );
  }

  async createProduct(
    product: Pick<Product, 'asin' | 'list_id' | 'name'> & { price: number },
  ) {
    console.log('creating product');
    const [createProductQuery, productId] = createProduct(product);
    const [createPriceQuery, priceId] = createPrice({
      price: product.price,
      product_id: productId,
    });

    await Promise.all([
      await this.client.execute(createProductQuery),
      await this.client.execute(createPriceQuery),
      await this.client.execute(
        updateProductCurrentPrice({ id: productId, current_price_id: priceId }),
      ),
    ]);
    console.log('product created');
  }

  async updateProductPrice(
    product: Pick<ProductPrice, 'price' | 'product_id'>,
  ) {
    console.log('updating product price');
    const [createPriceQuery, priceId] = createPrice({
      price: product.price,
      product_id: product.product_id,
    });

    await Promise.all([
      await this.client.execute(createPriceQuery),
      await this.client.execute(
        updateProductCurrentPrice({
          id: product.product_id,
          current_price_id: priceId,
        }),
      ),
    ]);

    console.log('product price updated');
  }
}
