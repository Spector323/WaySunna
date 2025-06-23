import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PromotionsComponent } from './components/products/promotions/promotions.component';
import { CatalogComponent } from './components/products/catalog/catalog.component';
import { DiscountsComponent } from './components/products/discounts/discounts.component';
import { FavoritesComponent } from './components/products/favorites/favorites.component';
import { BasketComponent } from './components/products/basket/basket.component';
import { HomeComponent } from './components/pages/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegistrationComponent } from './components/auth/registration/registration.component';
import { SliderComponent } from './components/products/slider/slider.component';
import { ProductDetailComponent } from './components/products/product-detail/product-detail.component';
import { ProfileComponent } from './components/auth/profile/profile.component';

export const routes: Routes = [
  { path: 'promotions', component: PromotionsComponent },
  { path: 'catalog', component: CatalogComponent },
  { path: 'discounts', component: DiscountsComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'basket', component: BasketComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'slider', component: SliderComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }