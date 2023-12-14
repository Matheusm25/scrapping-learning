export interface List {
  id: string;
  email: string;
  url: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

export interface Product {
  id: string;
  asin: string;
  list_id: string;
  name: string;
  current_price_id: string;
  url: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

export interface ProductPrice {
  id: string;
  product_id: string;
  price: number;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}
