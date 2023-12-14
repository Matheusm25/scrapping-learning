import { TursoClient } from '../../resources/Clients/DB/Turso';
import { success } from '../../resources/utils/http/response';

export async function register(event) {
  const DB = new TursoClient();
  await DB.registerList(JSON.parse(event.body));
  return success({ status: 'ok' }, 200);
}
