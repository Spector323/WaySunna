import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductServiceService } from '../../../../service/product-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements AfterViewInit {
  @ViewChild('slidesContainer') slidesContainer!: ElementRef;
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  isAdmin = false;
  modalVisible = false;
  selectedSlide: any = null;
  currentSlide = 0;
  slides: any[] = [];

  constructor(private productService: ProductServiceService, private http: HttpClient) {}

  async ngAfterViewInit() {
    try {
      const token = localStorage.getItem('token') || '';
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      const user = await this.http.get('http://localhost:5000/profile/getProfile', { headers }).toPromise();
      this.isAdmin = (user as any).roles.includes('Admin');
      console.log('isAdmin:', this.isAdmin);
    } catch (e) {
      console.error('Ошибка проверки роли:', e);
      this.isAdmin = false;
    }
    await this.loadSlides();
    this.updateSlide();
    this.handleVideoSlide();
  }

  updateSlide() {
    const slides = this.slidesContainer.nativeElement;
    slides.style.transform = `translateX(-${this.currentSlide * (100 / this.slides.length)}%)`;
  }

  goToSlide(index: number) {
    if (index !== this.currentSlide && index >= 0 && index < this.slides.length) {
      this.currentSlide = index;
      this.updateSlide();
      this.handleVideoSlide();
    }
  }

  prevSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
      this.updateSlide();
      this.handleVideoSlide();
    }
  }

  nextSlide() {
    if (this.currentSlide < this.slides.length - 1) {
      this.currentSlide++;
      this.updateSlide();
      this.handleVideoSlide();
    }
  }

  handleVideoSlide() {
    const video = this.videoPlayer?.nativeElement;
    if (this.slides[this.currentSlide]?.isVideo && video) {
      video.currentTime = 0;
      video.play();
      video.onended = () => this.nextSlide();
    } else if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }

  async loadSlides() {
    try {
      const data = await this.productService.getSlides().toPromise();
      this.slides = data as any[];
      console.log('Slides loaded:', this.slides);
    } catch (e) {
      console.error('Ошибка загрузки слайдов:', e);
    }
  }

  addSlide() {
    if (!this.isAdmin) {
      alert('Доступ запрещен: требуется роль Admin');
      return;
    }
    this.selectedSlide = {
      title: '',
      description: '',
      buttonText: '',
      isVideo: false,
      image: null,
      video: null
    };
    this.modalVisible = true;
  }

  editSlide(slide: any) {
    if (!this.isAdmin) {
      alert('Доступ запрещен: требуется роль Admin');
      return;
    }
    this.selectedSlide = { ...slide, image: null, video: null };
    this.modalVisible = true;
  }

  deleteSlide(id: string) {
    if (!this.isAdmin) {
      alert('Доступ запрещен: требуется роль Admin');
      return;
    }
    if (confirm('Вы уверены, что хотите удалить этот слайд?')) {
      this.slides = this.slides.filter(s => s._id !== id);
      this.productService.deleteSlide(id, localStorage.getItem('token') || '').subscribe({
        next: () => {
          console.log('Слайд успешно удален');
          this.loadSlides();
          if (this.currentSlide >= this.slides.length) {
            this.currentSlide = this.slides.length - 1;
            this.updateSlide();
          }
        },
        error: (error) => {
          console.error('Ошибка при удалении слайда:', error);
          alert('Ошибка: ' + (error.error?.message || 'Не удалось удалить слайд'));
        }
      });
    }
  }

  onFileChange(event: any, type: string) {
    const file = event.target.files[0];
    if (file) {
      this.selectedSlide[type] = file;
    }
  }

  saveSlide() {
    if (!this.isAdmin) {
      alert('Доступ запрещен: требуется роль Admin');
      return;
    }
    const slide = { ...this.selectedSlide };
    const token = localStorage.getItem('token') || '';
    const file = slide.isVideo ? slide.video : slide.image;

    if (slide._id) {
      this.productService.editSlide(slide, token, file).subscribe({
        next: () => {
          console.log('Слайд успешно обновлен');
          this.loadSlides();
          this.closeModal();
        },
        error: (error) => {
          console.error('Ошибка при обновлении слайда:', error);
          alert('Ошибка: ' + (error.error?.message || 'Не удалось обновить слайд'));
        }
      });
    } else {
      this.productService.addSlide(slide, token, file, slide.isVideo).subscribe({
        next: () => {
          console.log('Слайд успешно добавлен');
          this.loadSlides();
          this.closeModal();
        },
        error: (error) => {
          console.error('Ошибка при добавлении слайда:', error);
          alert('Ошибка: ' + (error.error?.message || 'Не удалось добавить слайд'));
        }
      });
    }
  }

  closeModal() {
    this.modalVisible = false;
    this.selectedSlide = null;
  }
}