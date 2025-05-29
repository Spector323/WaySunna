import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductServiceService } from '../../service/product-service.service';
import { SliderComponent } from '../products/product/slider/slider.component';
import { PromotionsComponent } from '../products/product/promotions/promotions.component';
import { CatalogComponent } from '../products/product/catalog/catalog.component';
import { DiscountsComponent } from '../products/product/discounts/discounts.component';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, SliderComponent, PromotionsComponent, CatalogComponent, DiscountsComponent,RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
  constructor(private productService: ProductServiceService) {}

  ngAfterViewInit() {}

  search(event: any) {
    const value = event.target.value.toLowerCase();
    // Здесь можно добавить логику передачи поискового запроса в компоненты,
    // если требуется глобальный поиск
    console.log('Поиск:', value);
  }
}