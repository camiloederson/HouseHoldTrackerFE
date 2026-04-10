import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ExpenseGetDTO } from './dto/expense-get-dto';
import { ExpensePostDTO } from './dto/expense-post-dto';
import { ExpensePutDTO } from './dto/expense-put-dto';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private readonly httpClient = inject(HttpClient);
private readonly apiUrl = `${environment.apiUrl}/expenses`;

  findAll(): Observable<ExpenseGetDTO[]> {
    return this.httpClient.get<ExpenseGetDTO[]>(this.apiUrl);
  }

  findById(id: number): Observable<ExpenseGetDTO> {
    return this.httpClient.get<ExpenseGetDTO>(`${this.apiUrl}/${id}`);
  }

  save(request: ExpensePostDTO): Observable<ExpenseGetDTO> {
    return this.httpClient.post<ExpenseGetDTO>(this.apiUrl, request);
  }

  update(id: number, request: ExpensePutDTO): Observable<ExpenseGetDTO> {
    return this.httpClient.put<ExpenseGetDTO>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}