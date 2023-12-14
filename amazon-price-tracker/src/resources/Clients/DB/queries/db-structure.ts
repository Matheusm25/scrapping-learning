export function createTablesSQL() {
  return [
    `create table if not exists lists (
      id text primary key not null,
      email text not null,
      url text not null,
      created_at TIMESTAMP not null default CURRENT_TIMESTAMP,
      updated_at TIMESTAMP not null default CURRENT_TIMESTAMP,
      deleted_at TIMESTAMP
    );`,
    `create table if not exists products (
      id text primary key not null,
      asin text not null,
      list_id text not null,
      name text not null,
      current_price_id text,
      url text not null,
      created_at TIMESTAMP not null default CURRENT_TIMESTAMP,
      updated_at TIMESTAMP not null default CURRENT_TIMESTAMP,
      deleted_at TIMESTAMP
    );`,
    `create table if not exists product_prices (
      id text primary key not null,
      product_id text not null,
      price number not null,
      created_at TIMESTAMP not null default CURRENT_TIMESTAMP,
      updated_at TIMESTAMP not null default CURRENT_TIMESTAMP,
      deleted_at TIMESTAMP
    );
  `,
  ];
}
