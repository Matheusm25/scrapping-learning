import cuid from 'cuid';

export function createListSQL(email: string, url: string) {
  return `
    insert into lists(id, email, url)
    values('${cuid()}', '${email}', '${url}');
  `;
}

export function getListById(id: string) {
  return `
    select * from lists where id = '${id}' and deleted_at is null;
  `;
}
