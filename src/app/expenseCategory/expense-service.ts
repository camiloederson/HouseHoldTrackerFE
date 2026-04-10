import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExpenseCategoryGetDTO } from './dto/expense-category-get-dto';
import { ExpenseCategoryPostDTO } from './dto/expense-category-postt-dto';
import { ExpenseCategoryPutDTO } from './dto/expense-category-put-dto';
import { environment } from '../../environment';


@Injectable({
  providedIn: 'root'
})
export class ExpenseCategoryService {
  private readonly httpClient = inject(HttpClient);
private readonly apiUrl = `${environment.apiUrl}/expense-categories`;

  findAll(): Observable<ExpenseCategoryGetDTO[]> {
    return this.httpClient.get<ExpenseCategoryGetDTO[]>(this.apiUrl);
  }

  findById(id: number): Observable<ExpenseCategoryGetDTO> {
    return this.httpClient.get<ExpenseCategoryGetDTO>(`${this.apiUrl}/${id}`);
  }

  save(request: ExpenseCategoryPostDTO): Observable<ExpenseCategoryGetDTO> {
    return this.httpClient.post<ExpenseCategoryGetDTO>(this.apiUrl, request);
  }

  update(id: number, request: ExpenseCategoryPutDTO): Observable<ExpenseCategoryGetDTO> {
    return this.httpClient.put<ExpenseCategoryGetDTO>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}