import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ProductCardComponent } from './components/products/product-card/product-card.component';
import { AdminComponent } from './components/admin/admin.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'products', component: ProductCardComponent },
  { path: 'admin', component: AdminComponent },
];
