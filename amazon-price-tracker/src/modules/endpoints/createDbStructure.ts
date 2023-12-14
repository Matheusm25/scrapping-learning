import { TursoClient } from '../../resources/Clients/DB/Turso';
import { success } from '../../resources/utils/http/response';

export async function handler() {
  const DB = new TursoClient();
  await DB.runDBStructure();
  return success({ status: 'ok' }, 200);
}
