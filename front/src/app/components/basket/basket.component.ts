import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductServiceService } from '../../service/product-service.service'; // Обновите импорт
import { Product } from '../../models/product.model';
import { Basket, BasketItem } from '../../service/product-service.service';

@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {
  basket: Basket | null = null;
  totalPrice: number = 0;

  constructor(private productService: ProductServiceService) {}

  ngOnInit() {
    this.loadBasket();
  }

  getProductId(id: any): string {
    if (typeof id === 'string' && id.startsWith('ObjectId(')) {
      return id.replace(/ObjectId\(['"]?/, '').replace(/['"]?\)/, '');
    }
    return id.toString();
  }

  async loadBasket() {
    try {
      const token = localStorage.getItem('token') || '';
      if (token) {
        const basket = await this.productService.getBasket(token).toPromise();
        this.basket = basket || null;
        this.calculateTotalPrice();
      } else {
        alert('Войдите в аккаунт, чтобы просмотреть корзину');
      }
    } catch (error) {
      console.error('Ошибка загрузки корзины:', error);
      alert('Ошибка загрузки корзины');
      this.basket = null;
    }
  }

  calculateTotalPrice() {
    if (this.basket && this.basket.products.length > 0) {
      this.totalPrice = this.basket.products.reduce((total: number, item: BasketItem) => {
        const price = item.productId.type === 'discount' ? item.productId.price - 500 : item.productId.price;
        return total + price * item.quantity;
      }, 0);
    } else {
      this.totalPrice = 0;
    }
  }
  
  async updateQuantity(productId: string, quantity: number) {
    try {
      const token = localStorage.getItem('token') || '';
      if (token && quantity > 0) {
        await this.productService.updateBasket(this.getProductId(productId), quantity, token).toPromise();
        await this.loadBasket();
      } else if (quantity <= 0) {
        await this.removeFromBasket(productId);
      }
    } catch (error) {
      console.error('Ошибка обновления количества:', error);
      alert('Ошибка при обновлении количества');
    }
  }

  async removeFromBasket(productId: string) {
    try {
      const token = localStorage.getItem('token') || '';
      if (token) {
        await this.productService.removeFromBasket(this.getProductId(productId), token).toPromise();
        await this.loadBasket();
      }
    } catch (error) {
      console.error('Ошибка удаления из корзины:', error);
      alert('Ошибка при удалении товара');
    }
  }

  async clearBasket() {
    if (this.basket && this.basket.products.length > 0) {
      if (confirm('Вы уверены, что хотите очистить корзину?')) {
        for (const item of this.basket.products) {
          await this.removeFromBasket(this.getProductId(item.productId._id));
        }
      }
    }
  }
}