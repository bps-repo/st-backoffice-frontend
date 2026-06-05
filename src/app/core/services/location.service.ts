import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models/ApiResponseService';
import { Province } from '../models/location/location';

@Injectable({
    providedIn: 'root',
})
export class LocationService {
    private http = inject(HttpClient);

    private apiUrl = `${environment.apiUrl}/locations`;

    /**
     * Gets all provinces.
     * @returns An observable containing an array of Province objects.
     */
    getProvinces(): Observable<Province[]> {
        return this.http.get<ApiResponse<Province[]>>(`${this.apiUrl}/provinces`).pipe(
            map((response) => response.data as Province[])
        );
    }

    /**
     * Gets a province by name with its municipalities.
     * @param provinceName The name of the province.
     * @returns An observable containing the Province object with municipalities.
     */
    getProvinceById(provinceName: string): Observable<Province> {
        return this.http.get<ApiResponse<Province>>(`${this.apiUrl}/provinces/${encodeURIComponent(provinceName)}`).pipe(
            map((response) => response.data as Province)
        );
    }
}

