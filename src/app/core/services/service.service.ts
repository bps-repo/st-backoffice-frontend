import {HttpClient} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {ApiResponse, PageableResponse} from '../models/ApiResponseService';
import {Product} from '../models/corporate/product';
import {Service} from '../models/course/service';

@Injectable({
    providedIn: 'root',
})
export class ServiceService {
    private http = inject(HttpClient);

    private apiUrl = `${environment.apiUrl}/services`;


    getServices(): Observable<Service[]> {
        return this.http.get<ApiResponse<PageableResponse<Service>>>(this.apiUrl).pipe(
            map((response) => response.data.content as Service[])
        );
    }

    getServiceById(id: string): Observable<Service> {
        return this.http.get<ApiResponse<Service>>(`${this.apiUrl}/${id}`).pipe(
            map((response) => response.data)
        );
    }

    createService(serviceData: any): Observable<Service> {
        return this.http.post<ApiResponse<Service>>(this.apiUrl, serviceData).pipe(
            map((response) => response.data)
        );
    }


    updateService(id: string, serviceData: Service): Observable<Service> {
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
