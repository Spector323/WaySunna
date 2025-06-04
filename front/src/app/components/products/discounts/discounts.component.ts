import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../service/product-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from '../../../models/product.model';
import { Router } from '@angular/router';
import { NgxSonnerToaster, toast } from 'ngx-sonner';

@Component({
  selector: 'app-discounts',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, RouterModule, NgxSonnerToaster],
  templateUrl: './discounts.component.html',
  styleUrls: ['./discounts.component.css']
})
export class DiscountsComponent implements AfterViewInit {
  isAdmin = false;
  modalVisible = false;
  selectedProduct: any = null;
  addBasket: { [key: string]: boolean } = {};
  favorites: { [key: string]: boolean } = {};
  products: Product[] = [];

  constructor(private productService: ProductService, private http: HttpClient, private router: Router) { }

  async ngAfterViewInit() {
    try {
      const token = localStorage.getItem('token') || '';
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      const user = await this.http.get(`${this.productService.apiUrl}/profile/getProfile`, { headers }).toPromise();
      this.isAdmin = (user as any).roles.includes('Admin');
    } catch (e) {
      this.isAdmin = false;
    }
    await this.loadProducts();
    await this.loadFavorites();
  }

  async loadProducts() {
    try {
      const data = await this.productService.getProducts().toPromise();
      this.products = (data as Product[]).filter(p => p.type === 'discount');
      console.log('Загруженные продукты:', this.products);

    } catch (e) {
      console.error('Ошибка загрузки продуктов:', e);
    }
  }

  async loadFavorites() {

    try {
      const token = localStorage.getItem('token');
      if (token) {
        const favorites = await this.productService.getFavorites(token).toPromise();
        if (Array.isArray(favorites)) {
          favorites.forEach((product: Product) => {
            this.favorites[product._id] = true;
          });
        }
      }
    } catch (e) {
      console.error('Ошибка загрузки избранного:', e);
    }
  }

  async addProductBasket(product: Product) {
    const token = localStorage.getItem('token') || '';
    if (!token) {
      toast.info('Войдите в аккаунт, чтобы добавить в корзину');
      return;
    }
    try {
      await this.productService.addToBasket(product._id, 1, token).toPromise();
      this.addBasket[product._id] = true;
      toast.success('Товар добавлен в корзину');
    } catch (error) {
      console.error('Ошибка добавления в корзину:', error);
      toast.error('Ошибка при добавлении в корзину');
    }
  }

  goToProduct(id: string) {
    this.router.navigate(['/product', id]);
  }

  toggleFavorite(product: Product) {
    const token = localStorage.getItem('token') || '';
    if (!token) {
      toast.info('Войдите в аккаунт, чтобы добавить в избранное');
      return;
    }

    if (this.favorites[product._id]) {
      this.productService.removeFromFavorites(product._id, token).subscribe({
        next: () => {
          this.favorites[product._id] = false;
          toast.error('Товар удален из избранного');
        },
        error: (error) => {
          console.error('Ошибка удаления из избранного:', error);
          alert('Ошибка: ' + (error.error?.message || 'Не удалось удалить из избранного'));
        }
      });
    } else {
      this.productService.addToFavorites(product._id, token).subscribe({
        next: () => {
          this.favorites[product._id] = true;
          toast.success('Товар добавлен в избранное');
        },
        error: (error) => {
          console.error('Ошибка добавления в избранное:', error);
          alert('Ошибка: ' + (error.error?.message || 'Не удалось добавить в избранное'));
        }
      });
    }
  }

  deleteProduct(id: string) {
    if (!this.isAdmin) {
      return;
    }
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
      this.products = this.products.filter(p => p._id !== id);
      this.productService.deleteProduct(id, localStorage.getItem('token') || '').subscribe({
        next: () => {
          toast.warning('Товар успешно удален');
          this.loadProducts();
        },
        error: (error) => {
          console.error('Ошибка при удалении товара:', error);
        }
      });
    }
  }

  addProduct() {
    if (!this.isAdmin) {
      return;
    }
    this.selectedProduct = {
      _id: '',
      name: '',
      description: '',
      price: '',
      discount: '',
      image: null,
      type: 'discount'
    };
    this.modalVisible = true;
  }

  editProduct(product: Product) {
    if (!this.isAdmin) {
      toast.error('Доступ запрещен: требуется роль Admin');
      return;
    }
    this.selectedProduct = { ...product, image: null };
    this.modalVisible = true;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedProduct.image = file;
    }
  }

  saveProduct() {
    if (!this.isAdmin) {
      toast.error('Доступ запрещен');
      return;
    }
    const token = localStorage.getItem('token') || '';
    if (this.selectedProduct._id) {
      this.productService.editProduct(this.selectedProduct, token, this.selectedProduct.image).subscribe({
        next: () => {
          toast.success('Товар успешно обновлён');
          this.loadProducts();
          this.closeModal();
        },
        error: (error) => {
          console.error('Ошибка при обновлении товара:', error);
          alert('Ошибка: ' + (error.error?.message || 'Ошибка обновления'));
        }
      });
    }
  }

  closeModal() {
    this.modalVisible = false;
    this.selectedProduct = null;
  }
}