import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, NgClass, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('slides') slidesContainer!: ElementRef;
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  isAdmin = true;
  modalVisible = false;
  selectedProduct: any = null;
  addCart: { [key: string]: boolean } = {};
  currentSlide = 0;

  products = [
    {
      _id: '1',
      name: 'Мужские духи',
      description: 'Свежий аромат для мужчин',
      price: 3999,
      image: 'uploads/product1.jpg',
    },
    {
      _id: '2',
      name: 'Женские духи',
      description: 'Цветочный женственный аромат',
      price: 4500,
      image: 'uploads/product2.jpg',
    },
    {
      _id: '3',
      name: 'Женские духи',
      description: 'Цветочный женственный аромат',
      price: 4500,
      image: 'uploads/product2.jpg',
    },
    {
      _id: '4',
      name: 'Женские духи',
      description: 'Цветочный женственный аромат',
      price: 4500,
      image: 'uploads/product2.jpg',
    },
    {
      _id: '5',
      name: 'Женские духи',
      description: 'Цветочный женственный аромат',
      price: 4500,
      image: 'uploads/product2.jpg',
    },
  ];

  filterProducts = [...this.products];

  ngAfterViewInit() {
    this.updateSlide();
    this.handleVideoSlide();
  }

  // Обновление текущего слайда
  updateSlide() {
    const slides = this.slidesContainer.nativeElement;
    slides.style.transform = `translateX(-${this.currentSlide * 25}%)`;
  }

  // Перейти к конкретному слайду
  goToSlide(index: number) {
    if (index !== this.currentSlide) {
      this.currentSlide = index;
      this.updateSlide();
      this.handleVideoSlide();
    }
  }

  // Предыдущий слайд
  prevSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
      this.updateSlide();
      this.handleVideoSlide();
    }
  }

  // Следующий слайд
  nextSlide() {
    if (this.currentSlide < 3) {
      this.currentSlide++;
      this.updateSlide();
      this.handleVideoSlide();
    }
  }

  // Управление видео
  handleVideoSlide() {
    const video = this.videoPlayer?.nativeElement;
    if (this.currentSlide === 1 && video) {
      video.currentTime = 0;
      video.play();
      video.onended = () => {
        this.nextSlide(); // Переход после завершения видео
      };
    } else if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }

  // Поиск
  search(event: any) {
    const value = event.target.value.toLowerCase();
    this.filterProducts = this.products.filter(p =>
      p.name.toLowerCase().includes(value)
    );
  }

  // Добавление в корзину
  addProductBasket(product: any) {
    this.addCart[product._id] = true;
  }

  // Переход к товару
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
      image: '',
    };
    this.modalVisible = true;
  }

  // Редактирование товара
  editProduct(product: any) {
    this.selectedProduct = { ...product };
    this.modalVisible = true;
  }

  // Закрытие модального окна
  closeModal() {
    this.modalVisible = false;
  }

  // Сохранение товара
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