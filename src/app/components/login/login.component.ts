import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LoginService } from "../../service/login.service";
import { NgIf } from "@angular/common";
import { CommonModule } from "@angular/common";
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: "app-login",
  standalone: true,
  imports: [FormsModule, NgIf, CommonModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  name: string = "";
  userPassword: string = "";
  error: string = "";
  isSubmitting: boolean = false;
  showSuccessMessage: boolean = false;

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}

  login() {
    this.error = "";
    
    if (!this.name || !this.userPassword) {
      this.error = "Пожалуйста, заполните все поля";
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
    
        if (res.token) {
          localStorage.setItem('token', res.token);
        }
    
        setTimeout(() => {
          this.router.navigate(['/profile']);
        }, 1500);
      },
      error: (e: HttpErrorResponse) => {
        this.isSubmitting = false;
        this.error = e.error?.message || "Неверный логин или пароль";
        console.error("Ошибка входа:", e);
      },
    });
  }
}