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
    const products = await crawler.getListPrices(list.url);
    return success(products, 200);
  } else {
    return error('NotFound', 'List not found', { functionName: 'checkPrices' });
  }
}
