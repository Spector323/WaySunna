import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../service/product-service.service';
import { SliderComponent } from '../../products/slider/slider.component';
import { PromotionsComponent } from '../../products/promotions/promotions.component';
import { CatalogComponent } from '../../products/catalog/catalog.component';
import { DiscountsComponent } from '../../products/discounts/discounts.component';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, SliderComponent, PromotionsComponent, CatalogComponent, DiscountsComponent, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
  constructor(private productService: ProductService) {}

  ngAfterViewInit() {}

  search(event: any) {
    const value = event.target.value.toLowerCase();
    // Здесь можно добавить логику передачи поискового запроса в компоненты,
    // если требуется глобальный поиск
    console.log('Поиск:', value);
  }
}