import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../../service/login.service';
import { NgxSonnerToaster, toast } from 'ngx-sonner';

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  registrationDate: string;
  avatar?: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgxSonnerToaster],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  error: string | null = null;
  name: string = '';
  email: string = '';
  phone: string = '';
  avatarFile: File | null = null;
  avatarUrl: string = '';
  isSubmitting: boolean = false;
  isEditing: boolean = false;

  constructor(
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    const token = localStorage.getItem('token') || '';
    if (!token) {
      this.error = 'Войдите в аккаунт';
      this.router.navigate(['/login']);
      return;
    }
  
    this.loginService.getProfile(token).subscribe({
      next: (user) => {
        this.user = user;
        if (!user) {
          this.error = 'Профиль не найден';
        } else {
          this.name = user.name;
          this.email = user.email;
          this.phone = user.phone || '';
          console.log(`Время регистрации: ${user.registrationDate}`);
        }
      },
      error: (error) => {
        console.error('Ошибка загрузки профиля:', error);
        this.error = 'Ошибка загрузки профиля';
        this.user = null;
      }
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    this.error = '';
    if (!this.isEditing) {
      this.name = this.user?.name || '';
      this.email = this.user?.email || '';
      this.phone = this.user?.phone || '';
      this.avatarFile = null;
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.avatarFile = input.files[0];
      this.avatarUrl = URL.createObjectURL(this.avatarFile);
      input.value = ''; // Сбросить значение input после выбора файла
    }
  }

  updateProfile() {
    this.error = '';
    this.isSubmitting = true;
    const token = localStorage.getItem('token') || '';
    if (!token) {
      this.error = 'Войдите в аккаунт';
      this.isSubmitting = false;
      this.router.navigate(['/login']);
      return;
    }

    if (!this.name || !this.email) {
      this.error = 'Имя и email обязательны';
      this.isSubmitting = false;
      return;
    }

    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('email', this.email);
    if (this.phone) formData.append('phone', this.phone);
    if (this.avatarFile) formData.append('avatar', this.avatarFile);


    this.loginService.updateProfile(formData, token).subscribe({
      next: (user) => {
        this.isSubmitting = false;
        this.isEditing = false;
        this.user = user;
        if (!user) {
          this.error = 'Ошибка обновления профиля';
        } else {
          toast.success('Профиль обновлён');
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        this.error = error.error?.error || 'Ошибка обновления профиля';
        console.error('Ошибка обновления:', error);
      }
    });
  }

  deleteProfile() {
    if (!confirm('Вы уверены, что хотите удалить профиль? Это действие нельзя отменить.')) {
      return;
    }

    const token = localStorage.getItem('token') || '';
    if (!token) {
      this.error = 'Войдите в аккаунт';
      this.router.navigate(['/login']);
      return;
    }

    this.loginService.deleteProfile(token).subscribe({
      next: (response) => {
        if (response) {
          localStorage.removeItem('token');
          toast('Профиль удалён');
          this.router.navigate(['/login']);
        } else {
          this.error = 'Ошибка удаления профиля';
        }
      },
      error: (error) => {
        this.error = error.error?.error || 'Ошибка удаления профиля';
        console.error('Ошибка удаления:', error);
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
    toast.warning('Вы вышли из аккаунта');
  }

  isVideo(avatar: string | undefined): boolean {
    return avatar ? avatar.endsWith('.mp4') : false;
  }
}