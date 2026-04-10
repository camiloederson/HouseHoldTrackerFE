import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MonthlyBudgetGetDTO } from './dto/monthly-budget-get-dto';
import { MonthlyBudgetPostDTO } from './dto/monthly-budget-post-dto';
import { MonthlyBudgetPutDTO } from './dto/monthly-budget-put-dto';
import { MonthlyBudgetDetailDTO } from './dto/monthly-budget-detail-dto';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class MonthlyBudgetService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/monthly-budgets`;

  findAll(): Observable<MonthlyBudgetGetDTO[]> {
    return this.httpClient.get<MonthlyBudgetGetDTO[]>(this.apiUrl);
  }

  findById(id: number): Observable<MonthlyBudgetGetDTO> {
    return this.httpClient.get<MonthlyBudgetGetDTO>(`${this.apiUrl}/${id}`);
  }

  save(request: MonthlyBudgetPostDTO): Observable<MonthlyBudgetGetDTO> {
    return this.httpClient.post<MonthlyBudgetGetDTO>(this.apiUrl, request);
  }

  update(id: number, request: MonthlyBudgetPutDTO): Observable<MonthlyBudgetGetDTO> {
    return this.httpClient.put<MonthlyBudgetGetDTO>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }

    findDetailById(id: number): Observable<MonthlyBudgetDetailDTO> {
    return this.httpClient.get<MonthlyBudgetDetailDTO>(`${this.apiUrl}/${id}/detail`);
  }
}