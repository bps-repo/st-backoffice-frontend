import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password });
  }

  /*
  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }
    */

  logout() {
    return this.http.post(`${this.apiUrl}/logout`, {});
  }
}
