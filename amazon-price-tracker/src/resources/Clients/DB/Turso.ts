import { createClient, Client, ResultSet } from '@libsql/client';
import { createTablesSQL } from './queries/db-structure';
import { createListSQL, getListById } from './queries/lists';

interface List {
  id: string;
  email: string;
  url: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

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
    await this.client.execute(createTablesSQL());
    console.log('DB structure ran');
  }

  async registerList(
    registerData: Pick<List, 'email' | 'url'>,
  ): Promise<boolean> {
    await this.client.execute(
      createListSQL(registerData.email, registerData.url),
    );

    return true;
  }

  async getList(id: string): Promise<List | undefined> {
    const result = await this.client.execute(getListById(id));
    return this.parseResult<List>(result)[0];
  }
}
