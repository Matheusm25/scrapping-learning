import cuid from 'cuid';
import { ProductPrice } from '../interfaces/entities';

export function createPrice(
  price: Pick<ProductPrice, 'price' | 'product_id'>,
): [string, string] {
  const id = cuid();
  return [
    `insert into product_prices (id, price, product_id) values ('${id}', '${price.price}', '${price.product_id}');`,
    id,
  ];
}
