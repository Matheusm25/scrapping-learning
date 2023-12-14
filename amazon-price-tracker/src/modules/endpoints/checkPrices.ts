import { ListPrices } from '../../resources/Clients/Crawler/listPrices';
import { TursoClient } from '../../resources/Clients/DB/Turso';
import { success, error } from '../../resources/utils/http/response';

export async function handler(event) {
  const id = event.body && JSON.parse(event.body).id;
  if (!id) {
    return error('Request', 'id is required', { functionName: 'checkPrices' });
  }
  const DB = new TursoClient();
  const crawler = new ListPrices();
  const list = await DB.getList(id);
  if (list) {
    const oldProductsData = await DB.getProductsFromList(list.id);
    const currentProductsData = await crawler.getListPrices(list.url);

    for (const product of currentProductsData.filter(p => p.price)) {
      const oldProduct = oldProductsData.find(
        oldProduct => oldProduct.asin === product.asin,
      );
      if (oldProduct) {
        if (oldProduct.price !== product.price) {
          await DB.updateProductPrice({
            price: product.price,
            product_id: oldProduct.id,
          });
        }
      } else {
        await DB.createProduct({
          asin: product.asin,
          list_id: id,
          name: product.productName,
          price: product.price,
        });
      }
    }

    return success(currentProductsData, 200);
  } else {
    return error('NotFound', 'List not found', { functionName: 'checkPrices' });
  }
}
