import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { PromotionsComponent } from './components/products/product/promotions/promotions.component';
import { CatalogComponent } from './components/products/product/catalog/catalog.component';
import { DiscountsComponent } from './components/products/product/discounts/discounts.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { BasketComponent } from './components/basket/basket.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegistrationComponent } from './components/auth/registration/registration.component';
import { SliderComponent } from './components/products/product/slider/slider.component';
import { ProductServiceService } from './service/product-service.service';

import { routes } from './app.routes';
import { AppRoutingModule } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    PromotionsComponent,
    CatalogComponent,
    DiscountsComponent,
    FavoritesComponent,
    BasketComponent,
    HomeComponent,
    LoginComponent,
    RegistrationComponent,
    SliderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
    AppRoutingModule
  ],
  providers: [ProductServiceService],
  bootstrap: [AppComponent]
})
export class AppModule {}