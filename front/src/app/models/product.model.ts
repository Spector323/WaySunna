export interface Product {
  _id: string;
  name: string;
  description: string;
  oldPrice?: number;
  discount?: number;
  price: number;
  image?: string | File;
  type: 'catalog' | 'discount' | 'promotion';
}