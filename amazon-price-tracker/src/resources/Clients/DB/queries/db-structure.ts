export function createTablesSQL() {
  return `
    create table lists(
      id text primary key not null,
      email text not null,
      url text not null,
      created_at TIMESTAMP not null default CURRENT_TIMESTAMP,
      updated_at TIMESTAMP not null default CURRENT_TIMESTAMP,
      deleted_at TIMESTAMP
    );
  `;
}
