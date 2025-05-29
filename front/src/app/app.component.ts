import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from './service/login.service';

interface User {
  avatar?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  user: User | null = null;

  constructor(
    private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    const token = localStorage.getItem('token');
    if (token) {
      this.loginService.getProfile(token).subscribe({
        next: (user) => {
          this.user = user || null;
        },
        error: (error) => {
          console.error('Ошибка загрузки профиля:', error);
          this.user = null;
        }
      });
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.user = null;
    this.router.navigate(['/login']);
    alert('Вы вышли из аккаунта');
  }

  isVideo(avatar?: string): boolean {
    return avatar ? avatar.endsWith('.mp4') : false;
  }
}