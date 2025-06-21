import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Service } from '../models/course/service';
import { environment } from 'src/environments/environment';
import { ApiResponse } from './interfaces/ApiResponseService';

@Injectable({
    providedIn: 'root',
})
export class ServiceService {

    private apiUrl = `${environment.apiUrl}/services`;

    constructor(private http: HttpClient) {}

    createService(service: Partial<Service>): Observable<ApiResponse<Service>> {
        return this.http.post<ApiResponse<Service>>(this.apiUrl, service);
    }

    updateService(id: string, service: Partial<Service>): Observable<ApiResponse<Service>> {
        return this.http.put<ApiResponse<Service>>(`${this.apiUrl}/${id}`, service);
    }

    getServiceById(id: string): Observable<ApiResponse<Service>> {
        return this.http.get<ApiResponse<Service>>(`${this.apiUrl}/${id}`);
    }

    getPagedServices(size: number): Observable<ApiResponse<{ content: Service[] }>> {
        return this.http.get<ApiResponse<{ content: Service[] }>>(`${this.apiUrl}/paged`, {
            params: { size: size.toString() }
        });
    }

    deleteService(id: string): Observable<ApiResponse<null>> {
        return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
      }
}
