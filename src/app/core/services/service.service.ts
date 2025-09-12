import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse, PageableResponse } from '../models/ApiResponseService';
import { Product } from '../models/corporate/product';
import { Service } from '../models/course/service';

@Injectable({
    providedIn: 'root',
})
export class ServiceService {
    private apiUrl = `${environment.apiUrl}/services`;

    constructor(private http: HttpClient) { }

    /**
     * Gets all services.
     * @returns An observable containing an array of Service objects.
     */
    getServices(): Observable<Service[]> {
        return this.http.get<ApiResponse<PageableResponse<Service[]>>>(this.apiUrl).pipe(
            map((response) => response.data.content as Service[])
        );
    }

    /**
     * Gets a service by ID.
     * @param id The ID of the service.
     * @returns An observable containing the Service object.
     */
    getServiceById(id: string): Observable<Service> {
        return this.http.get<ApiResponse<Service>>(`${this.apiUrl}/${id}`).pipe(
            map((response) => response.data)
        );
    }

    /**
     * Creates a new service.
     * @param serviceData The service data to create.
     * @returns An observable containing the created Service object.
     */
    createService(serviceData: any): Observable<Service> {
        return this.http.post<ApiResponse<Service>>(this.apiUrl, serviceData).pipe(
            map((response) => response.data)
        );
    }

    /**
     * Gets services by type.
     * @param type The type to filter by.
     * @returns An observable containing an array of Service objects.
     */
    getServicesByType(type: string): Observable<Service[]> {
        return this.http.get<ApiResponse<PageableResponse<Service[]>>>(`${this.apiUrl}/by-type/${type}`).pipe(
            map((response) => response.data.content as Service[])
        );
    }

    /**
     * Gets services by name.
     * @param name The name to filter by.
     * @returns An observable containing an array of Service objects.
     */
    getServicesByName(name: string): Observable<Product[]> {
        return this.http.get<ApiResponse<PageableResponse<Product[]>>>(`${this.apiUrl}/by-name/${name}`).pipe(
            map((response) => response.data.content as Product[])
        );
    }

    /**
     * Gets services by active status.
     * @param active The active status to filter by.
     * @returns An observable containing an array of Service objects.
     */
    getServicesByActive(active: boolean): Observable<Product[]> {
        return this.http.get<ApiResponse<PageableResponse<Product[]>>>(`${this.apiUrl}/by-active/${active}`).pipe(
            map((response) => response.data.content as Product[])
        );
    }

    /**
     * Gets services by center.
     * @param centerId The ID of the center.
     * @returns An observable containing an array of Service objects.
     */
    getServicesByCenter(centerId: string): Observable<Product[]> {
        return this.http.get<ApiResponse<PageableResponse<Product[]>>>(`${this.apiUrl}/by-center/${centerId}`).pipe(
            map((response) => response.data.content as Product[])
        );
    }

    /**
     * Gets services by price range.
     * @param minPrice The minimum price.
     * @param maxPrice The maximum price.
     * @returns An observable containing an array of Service objects.
     */
    getServicesByPriceRange(minPrice: number, maxPrice: number): Observable<Product[]> {
        return this.http.get<ApiResponse<PageableResponse<Product[]>>>(`${this.apiUrl}/by-price-range/${minPrice}/${maxPrice}`).pipe(
            map((response) => response.data.content as Product[])
        );
    }

    /**
     * Updates a service.
     * @param id The ID of the service.
     * @param serviceData The updated service data.
     * @returns An observable containing the updated Service object.
     */
    updateService(id: string, serviceData: Service): Observable<Service> {
        return this.http.patch<ApiResponse<Service>>(`${this.apiUrl}/${id}`, serviceData).pipe(
            map((response) => response.data)
        );
    }

    /**
     * Updates a service's status.
     * @param id The ID of the service.
     * @param status The new status.
     * @returns An observable containing the updated Service object.
     */
    updateServiceStatus(id: string, status: Service): Observable<Service> {
        return this.http.patch<ApiResponse<Service>>(`${this.apiUrl}/${id}/status`, status).pipe(
            map((response) => response.data)
        );
    }

    /**
     * Deletes a service.
     * @param id The ID of the service to delete.
     * @returns An observable containing the response.
     */
    deleteService(id: string): Observable<Service> {
        return this.http.delete<ApiResponse<Service>>(`${this.apiUrl}/${id}`).pipe(
            map((response) => response.data)
        );
    }
}
