import { Product } from '../../DB/interfaces/entities';

export function productsPriceChangeTemplate(
  products: Array<Pick<Product, 'url' | 'name'> & { price: number }>,
) {
  return `
    <h2>Products that have dropped in price since the last check</h2>
    <ul>
      ${products
        .map(
          product =>
            `<li><a href="${product.url}">${
              product.name
            }</a> - ${new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(product.price)}</li>`,
        )
        .join('')}
    </ul>
  `;
}
