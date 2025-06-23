import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../../service/login.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgxSonnerToaster, toast } from 'ngx-sonner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, NgxSonnerToaster],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  name: string = '';
  userPassword: string = '';
  error: string = '';
  isSubmitting: boolean = false;
  showSuccessMessage: boolean = false;

  constructor(
    private loginService: LoginService,
    private router: Router
  ) { }

  login() {
    this.error = '';
    if (!this.name || !this.userPassword) {
      this.error = 'Пожалуйста, заполните все поля';
      return;
    }
    this.isSubmitting = true;
    const credentials = {
      name: this.name,
      password: this.userPassword
    };
    this.loginService.onLogin(credentials).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        this.showSuccessMessage = true;
        toast.success('Вход выполнен успешно!');
        localStorage.setItem('token', res.token);
        setTimeout(() => {
          this.router.navigate(['/profile']); // Изменено: '/' → '/profile'
        }, 1500);
      },
      error: (e: any) => {
        this.isSubmitting = false;
        this.error = e.error?.message || 'Неверный логин или пароль';
        toast.error('Ошибка входа:', e);
      }
    });
  }
}