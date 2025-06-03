import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../../service/product-service.service';
import { Product } from '../../../models/product.model';
import { NgxSonnerToaster, toast } from 'ngx-sonner';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, MatIconModule,NgxSonnerToaster],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  favorites: Product[] = [];
  addBasket: { [key: string]: boolean } = {}; // Переименовал addCart
  favoriteStatus: { [key: string]: boolean } = {};

  constructor(private productService: ProductService) {}

  async ngOnInit() {
    await this.loadFavorites();
  }

  async loadFavorites() {
    try {
      const token = localStorage.getItem('token') || '';
      if (token) {
        const favorites = await this.productService.getFavorites(token).toPromise();
        if (Array.isArray(favorites)) {
          this.favorites = favorites;
          this.favorites.forEach((product: Product) => {
            this.favoriteStatus[product._id] = true;
          });
        } else {
          this.favorites = [];
        }
      } else {
        toast.info('Войдите в аккаунт, чтобы просмотреть избранное');
      }
    } catch (e) {
      console.error('Ошибка загрузки избранного:', e);
      alert('Ошибка загрузки избранного');
    }
  }

  toggleFavorite(product: Product) {
    const token = localStorage.getItem('token') || '';
    if (!token) {
      toast.error('Войдите в аккаунт, чтобы удалить из избранного');
      return;
    }

    this.productService.removeFromFavorites(product._id, token).subscribe({
      next: () => {
        this.favorites = this.favorites.filter(p => p._id !== product._id);
        this.favoriteStatus[product._id] = false;
        toast.error('Товар удален из избранного');
      },
      error: (error) => {
        console.error('Ошибка удаления из избранного:', error);
        toast.error('Ошибка: ' + (error.error?.message || 'Не удалось удалить из избранного'));
      }
    });
  }

  async addProductBasket(product: Product) {
    const token = localStorage.getItem('token') || '';
    if (!token) {
      alert('Войдите в аккаунт, чтобы добавить в корзину');
      return;
    }

    try {
      await this.productService.addToBasket(product._id, 1, token).toPromise();
      this.addBasket[product._id] = true;
      alert('Товар добавлен в корзину');
    } catch (error) {
      console.error('Ошибка добавления в корзину:', error);
      // alert('Ошибка: ' + (error.error?.message || 'Не удалось добавить в корзину'));
    }
  }
}