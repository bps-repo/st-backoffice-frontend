import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Unit } from '../models/course/unit';
import { environment } from 'src/environments/environment';
import { ApiResponse } from './interfaces/ApiResponseService';

@Injectable({
  providedIn: 'root',
})
export class UnitService {

  private apiUrl = `${environment.apiUrl}/units`;

  constructor(private http: HttpClient) {}

  createUnit(unit: Partial<Unit>): Observable<ApiResponse<Unit>> {
    return this.http.post<ApiResponse<Unit>>(this.apiUrl, unit);
  }

  updateUnit(id: string, unit: Partial<Unit>): Observable<ApiResponse<Unit>> {
    return this.http.patch<ApiResponse<Unit>>(`${this.apiUrl}/${id}`, unit);
  }

  getUnitById(id: string): Observable<ApiResponse<Unit>> {
    return this.http.get<ApiResponse<Unit>>(`${this.apiUrl}/${id}`);
  }

  getPagedUnits(size: number): Observable<ApiResponse<{ content: Unit[] }>> {
    return this.http.get<ApiResponse<{ content: Unit[] }>>(`${this.apiUrl}/paged`, {
      params: { size: size.toString() }
    });
  }

  deleteUnit(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }

}
