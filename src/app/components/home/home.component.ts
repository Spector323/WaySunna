import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  isAdmin = true; // Здесь будет проверка на администратора
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

  // Поиск
  search(event: any) {
    const value = event.target.value.toLowerCase();
    this.filterProducts = this.products.filter(p =>
      p.name.toLowerCase().includes(value)
    );
  }

  // Добавление товара в корзину
  addProductBasket(product: any) {
    this.addCart[product._id] = true;
  }

  // Переход к странице товара
  goToProduct(id: string) {
    console.log('Переход к товару с ID:', id);
  }

  // Удаление товара
  deleteProduct(id: string) {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
      this.products = this.products.filter(p => p._id !== id);
      this.filterProducts = [...this.products];
    }
  }

  // Открытие модального окна для добавления
  openAddModal() {
    this.selectedProduct = {
      _id: '',
      name: '',
      description: '',
      price: 0,
      image: ''
    };
    this.modalVisible = true;
  }

  // Открытие модального окна для редактирования
  editProduct(product: any) {
    this.selectedProduct = { ...product };
    this.modalVisible = true;
  }

  // Закрытие модального окна
  closeModal() {
    this.modalVisible = false;
  }

  // Сохранение нового или отредактированного товара
  saveProduct(product: any) {
    if (product._id) {
      const index = this.products.findIndex(p => p._id === product._id);
      if (index !== -1) {
        this.products[index] = { ...product };
      }
    } else {
      const newProduct = { ...product, _id: Date.now().toString() };
      this.products.push(newProduct);
    }

    this.filterProducts = [...this.products];
    this.closeModal();
  }
}
