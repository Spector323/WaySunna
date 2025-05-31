import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs'; // Добавляем catchError и of
import { Product } from '../models/product.model';

export interface BasketItem {
  productId: Product;
  quantity: number;
}

export interface Basket {
  userId: string;
  products: BasketItem[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductServiceService { // TODO: Переименовать в ProductServiceService
  apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  // Метод для обработки ID
  getProductId(id: any): string {
    if (typeof id === 'string' && id.startsWith('ObjectId(')) {
      return id.replace(/ObjectId\(['"]?/, '').replace(/['"]?\)/, '');
    }
    return id.toString();
  }

  // Методы для карточек товаров
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/product/getProducts`);
  }

  getProductById(id: string): Observable<Product | null> {
    const cleanId = this.getProductId(id); // Обрабатываем ID
    return this.http.get<Product>(`${this.apiUrl}/product/getProduct/${cleanId}`).pipe( // Исправляем маршрут
      map((product: Product) => product || null),
      catchError(error => {
        console.error('Ошибка в getProductById:', error);
        return of(null);
      })
    );
  }

  addProduct(product: any, token: string, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('price', product.price.toString());
    formData.append('description', product.description);
    formData.append('discount', product.discount.toString());
    formData.append('type', product.type);
    if (image) {
      formData.append('image', image);
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/product/addProduct`, formData, { headers });
  }

  editProduct(product: any, token: string, image?: File): Observable<any> {
  const formData = new FormData();
  formData.append('name', product.name);
  formData.append('price', product.price.toString());
  formData.append('discount', product.discount ? product.discount.toString() : '0'); // Добавляем скидку, если она есть
  formData.append('description', product.description);
  formData.append('type', product.type);

  // Если цена изменилась, сохраняем предыдущее значение в oldPrice
  if (product.previousPrice !== undefined && product.previousPrice !== product.price) {
    formData.append('oldPrice', product.previousPrice.toString());
  }

  if (image) {
    formData.append('image', image);
  }

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  const cleanId = this.getProductId(product._id);

  return this.http.patch(`${this.apiUrl}/product/changeProduct/${cleanId}`, formData, { headers });
}

  deleteProduct(id: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete(`${this.apiUrl}/product/deleteProduct/${this.getProductId(id)}`, { headers }); // Обновляем ID
  }

  // Методы для слайдов
  getSlides(): Observable<any> {
    return this.http.get(`${this.apiUrl}/slide/getSlides`);
  }

  addSlide(slide: any, token: string, file: File, typeOfSlide: string): Observable<any> {
    const formData = new FormData();
    formData.append('title', slide.title);
    formData.append('description', slide.description);
    formData.append('buttonText', slide.buttonText);
    formData.append('isVideo', slide.isVideo.toString());
    formData.append(slide.isVideo ? 'video' : 'image', file);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/slide/addSlide/${typeOfSlide ? 'video' : 'image'}`, formData, { headers });
  }

  editSlide(slide: any, token: string, file?: File): Observable<any> {
    const formData = new FormData();
    formData.append('title', slide.title);
    formData.append('description', slide.description);
    formData.append('buttonText', slide.buttonText);
    formData.append('isVideo', slide.isVideo.toString());
    if (file) {
      formData.append(slide.isVideo ? 'video' : 'image', file);
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.patch(`${this.apiUrl}/slide/changeSlide/${this.getProductId(slide._id)}`, formData, { headers }); // Обновляем ID
  }

  deleteSlide(id: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete(`${this.apiUrl}/slide/deleteSlide/${this.getProductId(id)}`, { headers }); // Обновляем ID
  }

  // Методы для избранного
  addToFavorites(productId: string, token: string): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const cleanId = this.getProductId(productId); // Обновляем ID
    return this.http.post(`${this.apiUrl}/favorite/add`, { productId: cleanId }, { headers });
  }

  removeFromFavorites(productId: string, token: string): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const cleanId = this.getProductId(productId); // Обновляем ID
    return this.http.post(`${this.apiUrl}/favorite/remove`, { productId: cleanId }, { headers });
  }

  getFavorites(token: string): Observable<Product[]> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<Product[]>(`${this.apiUrl}/favorite/get`, { headers });
  }

  // Методы для корзины
  getBasket(token: string): Observable<Basket> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<Basket>(`${this.apiUrl}/basket/get`, { headers }).pipe(
      map((response: Basket | null) => response || { userId: '', products: [] })
    );
  }

  addToBasket(productId: string, quantity: number, token: string): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const cleanId = this.getProductId(productId); // Обрабатываем ID
    return this.http.post(`${this.apiUrl}/basket/add`, { productId: cleanId, quantity }, { headers });
  }

  updateBasket(productId: string, quantity: number, token: string): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const cleanId = this.getProductId(productId); // Обрабатываем ID
    return this.http.post(`${this.apiUrl}/basket/update`, { productId: cleanId, quantity }, { headers });
  }

  removeFromBasket(productId: string, token: string): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const cleanId = this.getProductId(productId); // Обрабатываем ID
    return this.http.post(`${this.apiUrl}/basket/remove`, { productId: cleanId }, { headers });
  }

  saveToLocalBasket(product: Product, quantity: number) {
    let localBasket: BasketItem[] = JSON.parse(localStorage.getItem('localBasket') || '[]');
    const existingItem = localBasket.find(item => item.productId._id === product._id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      localBasket.push({ productId: product, quantity });
    }
    localStorage.setItem('localBasket', JSON.stringify(localBasket));
  }

  getLocalBasket(): BasketItem[] {
    return JSON.parse(localStorage.getItem('localBasket') || '[]');
  }

  syncLocalBasketWithServer(token: string) {
    const localBasket = this.getLocalBasket();
    if (localBasket.length > 0) {
      localBasket.forEach(async (item) => {
        await this.addToBasket(this.getProductId(item.productId._id), item.quantity, token).toPromise(); // Обновляем ID
      });
      localStorage.removeItem('localBasket'); // Очищаем localStorage после синхронизации
    }
  }
}