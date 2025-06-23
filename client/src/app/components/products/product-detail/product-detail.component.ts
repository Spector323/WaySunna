import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../service/product-service.service'; // Обновите импорт
import { Product } from '../../../models/product.model';
import { NgxSonnerToaster, toast } from 'ngx-sonner';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxSonnerToaster],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  error: string | null = null;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadProduct();
  }

  getProductId(id: any): string {
    if (typeof id === 'string' && id.startsWith('ObjectId(')) {
      return id.replace(/ObjectId\(['"]?/, '').replace(/['"]?\)/, '');
    }
    return id.toString();
  }

  async loadProduct() {
    try {
      let productId = this.route.snapshot.paramMap.get('id');

      
      if (productId) {
        productId = this.getProductId(productId);
        const result = await this.productService.getProductById(productId).toPromise();
        this.product = result ?? null; // Используем ?? для обработки undefined
        if (!this.product) {
          this.error = 'Товар не найден';
        }
      } else {
        this.error = 'Неверный идентификатор товара';
      }
    } catch (error) {
      console.error('Ошибка загрузки товара:', error);
      this.error = 'Ошибка загрузки товара';
      this.product = null;
    }
  }

  async addToBasket() {
    if (!this.product) return;

    const token = localStorage.getItem('token') || '';
    if (!token) {
      alert('Войдите в аккаунт, чтобы добавить в корзину');
      return;
    }

    try {
      await this.productService.addToBasket(this.getProductId(this.product._id), 1, token).toPromise();
      toast.success('Товар добавлен в корзину');
    } catch (error) {
      console.error('Ошибка добавления в корзину:', error);
      alert('Ошибка при добавлении в корзину');
    }
  }
}