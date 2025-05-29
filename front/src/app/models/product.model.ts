export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  type: 'catalog' | 'discount' | 'promotion';
}