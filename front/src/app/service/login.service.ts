import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  apiUrl = 'http://localhost:5000/auth';

  constructor(private http: HttpClient) {}

  onLogin(obj: any) {
    return this.http.post(`${this.apiUrl}/login`, obj);
  }

  getProfile(token: string): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get(`${this.apiUrl}/profile`, { headers }).pipe(
      map((user) => user || null),
      catchError(error => {
        console.error('Ошибка в getProfile:', error);
        return of(null);
      })
    );
  }

  updateProfile(data: FormData, token: string): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.post(`${this.apiUrl}/updateProfile`, data, { headers }).pipe(
      map((user) => user || null),
      catchError(error => {
        console.error('Ошибка в updateProfile:', error);
        return of(null);
      })
    );
  }

  deleteProfile(token: string): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.delete(`${this.apiUrl}/deleteProfile`, { headers }).pipe(
      map((response) => response || null),
      catchError(error => {
        console.error('Ошибка в deleteProfile:', error);
        return of(null);
      })
    );
  }
}