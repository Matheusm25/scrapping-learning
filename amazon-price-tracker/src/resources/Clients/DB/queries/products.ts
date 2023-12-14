import cuid from 'cuid';
import { Product } from '../interfaces/entities';

export function getProductsFromList(id: string) {
  return `select p.id, p.asin, pp.price from products p join product_prices pp on pp.id = p.current_price_id where p.list_id = '${id}' and p.deleted_at is null;`;
}

export function createProduct(
  product: Pick<Product, 'asin' | 'list_id' | 'name' | 'url'>,
): [string, string] {
  const id = cuid();
  return [
    `insert into products (id, asin, list_id, name, url) values ('${id}', '${product.asin}', '${product.list_id}', '${product.name}', '${product.url}');`,
    id,
  ];
}

export function updateProductCurrentPrice(
  product: Pick<Product, 'id' | 'current_price_id'>,
) {
  return `update products set current_price_id = '${product.current_price_id}' where id = '${product.id}';`;
}
