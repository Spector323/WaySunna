import { Component } from '@angular/core';
import { NgFor} from '@angular/common';
@Component({
  selector: 'app-home',
  imports: [NgFor],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  isAdmin = true; // тут должна быть настоящая проверка
  modalVisible = false;
  selectedProduct: any = null;
  addCart: { [key: string]: boolean } = {};
  products = [
    {
      _id: '1',
      name: 'Мужские духи',
      description: 'Свежий аромат для мужчин',
      price: 3999,
      image: 'uploads/product1.jpg'
    },
    {
      _id: '2',
      name: 'Женские духи',
      description: 'Цветочный женственный аромат',
      price: 4500,
      image: 'uploads/product2.jpg'
    }
  ];
  filterProducts = [...this.products];

  search(event: any) {
    const value = event.target.value.toLowerCase();
    this.filterProducts = this.products.filter(p =>
      p.name.toLowerCase().includes(value)
    );
  }

  addProductBasket(product: any) {
    this.addCart[product._id] = true;
  }

  goToProduct(id: string) {
    // переход на детальную страницу товара
  }

  deleteProduct(id: string) {
    this.products = this.products.filter(p => p._id !== id);
    this.filterProducts = [...this.products];
  }

  openAddModal() {
    this.selectedProduct = null;
    this.modalVisible = true;
  }

  editProduct(product: any) {
    this.selectedProduct = { ...product };
    this.modalVisible = true;
  }

  closeModal() {
    this.modalVisible = false;
  }

  saveProduct(product: any) {
    if (this.selectedProduct) {
      const index = this.products.findIndex(p => p._id === this.selectedProduct._id);
      this.products[index] = { ...product, _id: this.selectedProduct._id };
    } else {
      const newProduct = { ...product, _id: Date.now().toString() };
      this.products.push(newProduct);
    }
    this.filterProducts = [...this.products];
    this.closeModal();
  }
}
