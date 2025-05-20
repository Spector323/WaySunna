import { Component, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { RegistrationService } from "../../service/regisegistration.service";
import { NgIf } from "@angular/common";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-registration",
  standalone: true,
  imports: [FormsModule, NgIf, CommonModule],
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.css"],
})
export class RegistrationComponent {
  name: string = "";

  userEmail: string = "";
  userPassword: string = "";
  userCheckPassword: string = "";
  userAvatar: any =
    "https://avatars.mds.yandex.net/i?id=93932abfd430c7aab32a3d45806ea6e6d4d0523a-4944707-images-thumbs&n=13";
  error: string = "";
  errorValid: string = "";
  errorPassword: string = "";
  isSubmitting: boolean = false;
  showSuccessMessage: boolean = false;

  constructor(private registrationService: RegistrationService) {}

  http = inject(HttpClient);

  


  registration() {
    this.errorValid = "";
    this.errorPassword = "";
    this.error = "";

    if (
      !this.name ||
      !this.userEmail ||
      // !this.userAge ||
      !this.userPassword ||
      !this.userCheckPassword
    ) {
      this.errorValid = "Пожалуйста, заполните все поля корректно";
      return;
    }
    // if (this.userAge <= 0) {
    //   this.errorValid = "Возраст должен быть положительным числом";
    //   return;
    // }
    if (this.userPassword !== this.userCheckPassword) {
      this.errorPassword = "Пароли должны совпадать";
      return;
    }
    if (this.userPassword.length < 6) {
      this.errorPassword = "Пароль должен быть не менее 6 символов";
      return;
    }

    this.isSubmitting = true;

    const formData = new FormData();
    formData.append("name", this.name);

    // formData.append("age", this.userAge.toString());
    formData.append("email", this.userEmail);
    formData.append("password", this.userPassword);

    if (this.userAvatar instanceof File) {
      formData.append("avatar", this.userAvatar);
    } else {
      formData.append("avatar", this.userAvatar || "");
    }
    this.registrationService.registerUser(formData).subscribe({
        next: (res: any) => {
          if (res === "Регистрация прошла успешно") {
            this.showSuccessMessage = true;
          } else {
            this.error = "Не удалось зарегистрировать пользователя";
          }
          this.isSubmitting = false;
        },
        error: (e) => {
          this.error = e.error?.message || "Ошибка регистрации";
          console.error("HTTP error:", e);
          this.isSubmitting = false;
        },
      });
  }

  // onfileSelected(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files[0]) {
  //     const file = input.files[0];

  //     const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  //     if (!allowedTypes.includes(file.type)) {
  //       this.error = "Допустимы только изоображения JPEG , JPG или PNG";
  //       return;
  //     }

  //     if (file.size > 2 * 1024 * 1024) {
  //       this.error = "Размер файла не должен привышать 2МБ";
  //       return;
  //     }

  //     this.userAvatar = file;
  //     this.error = " ";
  //   }
  // }
}
