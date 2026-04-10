import { LoginRequestDTO } from '../login/dto/login-request-dto';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoginResponseDTO } from '../login/dto/login-response-dto';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(){
    console.log('API URL:', environment.apiUrl);
  }

  private readonly apiUrl = `${environment.apiUrl}/auth`;
  httpClient = inject(HttpClient);
  private readonly tokenKey = 'ht_token';
  private readonly userKey = 'ht_user';

  login(request: LoginRequestDTO): Observable<LoginResponseDTO> {
    return this.httpClient
      .post<LoginResponseDTO>(`${this.apiUrl}/${'login'}`, request)
      .pipe(tap((response) => this.storeSession(response)));
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }


  private storeSession(response: LoginResponseDTO): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.userKey, JSON.stringify(response));
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
