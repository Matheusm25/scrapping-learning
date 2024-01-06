import cuid from 'cuid';

export function createListSQL(email: string, url: string): [string, string] {
  const id = cuid();
  return [
    `insert into lists(id, email, url) values('${id}', '${email}', '${url}');`,
    id,
  ];
}

export function getListById(id: string) {
  return `
    select * from lists where id = '${id}' and deleted_at is null;
  `;
}

export function listLists() {
  return `
    select * from lists where deleted_at is null;
  `;
}
