import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';

export interface HouseholdGetDTO {
  id: number;
  name: string;
}

export interface HouseholdPostDTO {
  name: string;
}

export interface HouseholdPutDTO {
  name: string;
}

@Injectable({ providedIn: 'root' })
export class HouseholdService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/households`;

  findAll(): Observable<HouseholdGetDTO[]> {
    return this.http.get<HouseholdGetDTO[]>(this.apiUrl);
  }

  findById(id: number): Observable<HouseholdGetDTO> {
    return this.http.get<HouseholdGetDTO>(`${this.apiUrl}/${id}`);
  }

  save(request: HouseholdPostDTO): Observable<HouseholdGetDTO> {
    return this.http.post<HouseholdGetDTO>(this.apiUrl, request);
  }

  update(id: number, request: HouseholdPutDTO): Observable<HouseholdGetDTO> {
    return this.http.put<HouseholdGetDTO>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}