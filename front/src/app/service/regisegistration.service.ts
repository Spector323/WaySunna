import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  apiUrl = 'http://localhost:5000/auth';

  constructor(private http: HttpClient) {}

  registerUser(formData: FormData) {
    return this.http.post(`${this.apiUrl}/registration`, formData);
  }
}