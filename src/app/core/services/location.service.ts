import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models/ApiResponseService';
import { Province, Municipality } from '../models/location/location';

@Injectable({
    providedIn: 'root',
})
export class LocationService {
    private apiUrl = `${environment.apiUrl}/locations`;

    constructor(private http: HttpClient) {}

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
     * Gets a province by ID with its municipalities.
     * @param provinceId The ID of the province.
     * @returns An observable containing the Province object with municipalities.
     */
    getProvinceById(provinceId: string): Observable<Province> {
        return this.http.get<ApiResponse<Province>>(`${this.apiUrl}/provinces/${provinceId}`).pipe(
            map((response) => response.data as Province)
        );
    }
}

