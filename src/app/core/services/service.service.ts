import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {ApiResponse, PageableResponse} from '../models/ApiResponseService';
import {Product} from '../models/corporate/product';
import {ProductLevel} from '../models/course/product-level';
import {Service, ServicePayload} from '../models/course/service';

@Injectable({
    providedIn: 'root',
})
export class ServiceService {
    private http = inject(HttpClient);

    private apiUrl = `${environment.apiUrl}/products`;


    getServices(
        page: number = 0,
        size: number = 15,
        sort: string = 'createdAt,desc',
    ): Observable<ApiResponse<PageableResponse<Service>>> {
        const params = new HttpParams()
            .set('page', String(page))
            .set('size', String(size))
            .set('sort', sort);

        return this.http.get<ApiResponse<PageableResponse<Service>>>(this.apiUrl, { params });
    }

    getServiceById(id: string): Observable<Service> {
        return this.http.get<ApiResponse<Service>>(`${this.apiUrl}/${id}`).pipe(
            map((response) => response.data)
        );
    }

    getServiceLevels(productId: string): Observable<ProductLevel[]> {
        return this.http.get<ApiResponse<ProductLevel[]>>(`${this.apiUrl}/${productId}/levels`).pipe(
            map((response) => response.data ?? []),
        );
    }

    createService(serviceData: ServicePayload): Observable<Service> {
        return this.http.post<ApiResponse<Service>>(this.apiUrl, serviceData).pipe(
            map((response) => response.data)
        );
    }

    updateService(id: string, serviceData: ServicePayload): Observable<Service> {
        return this.http.patch<ApiResponse<Service>>(`${this.apiUrl}/${id}`, serviceData).pipe(
            map((response) => response.data)
        );
    }


    deleteService(id: string): Observable<Service> {
        return this.http.delete<ApiResponse<Service>>(`${this.apiUrl}/${id}`).pipe(
            map((response) => response.data)
        );
    }
}
