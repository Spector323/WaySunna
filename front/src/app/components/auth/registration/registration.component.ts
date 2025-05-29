import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegistrationService } from '../../../service/regisegistration.service'; // Исправлено: regisegistration → registration
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  name: string = '';
  userEmail: string = '';
  userPassword: string = '';
  userCheckPassword: string = '';
  errorPassword: string = '';
  errorValid: string = '';
  error: string = '';
  isSubmitting: boolean = false;
  showSuccessMessage: boolean = false;

  constructor(
    private registrationService: RegistrationService,
    private router: Router
  ) {}

  registration() {
    this.errorValid = '';
    this.errorPassword = '';
    this.error = '';
    if (
      !this.name ||
      !this.userEmail ||
      !this.userPassword ||
      !this.userCheckPassword
    ) {
      this.errorValid = 'Пожалуйста, заполните все поля корректно';
      return;
    }

    if (this.userPassword !== this.userCheckPassword) {
      this.errorPassword = 'Пароли должны совпадать';
      return;
    }

    if (this.userPassword.length < 6) {
      this.errorPassword = 'Пароль должен быть не менее 6 символов';
      return;
    }

    this.isSubmitting = true;
    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('email', this.userEmail);
    formData.append('password', this.userPassword);

    this.registrationService.registerUser(formData).subscribe({
      next: (res: any) => {
        this.showSuccessMessage = true;
        this.isSubmitting = false;
        if (res.token) {
          localStorage.setItem('token', res.token);
          setTimeout(() => {
            this.router.navigate(['/profile']); // Изменено: редирект на профиль
          }, 1500);
        }
      },
      error: (e) => {
        this.error = e.error?.message || 'Ошибка регистрации';
        this.isSubmitting = false;
        console.error('HTTP error:', e);
      }
    });
  }
}