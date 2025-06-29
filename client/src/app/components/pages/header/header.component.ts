import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../service/login.service';
import { NgxSonnerToaster, toast } from 'ngx-sonner';


interface User {
  avatar?: string;
}
@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule, NgxSonnerToaster],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {
 user: User | null = null;

  constructor(
    private router: Router,
    private loginService: LoginService
  ) { }

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
          toast.error('Ошибка загрузки профиля:', error);
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
    toast.warning('Вы вышли из аккаунта');
  }

  isVideo(avatar?: string): boolean {
    return avatar ? avatar.endsWith('.mp4') : false;
  }
}
