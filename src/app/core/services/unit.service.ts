import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Unit } from '../models/course/unit';
import { environment } from 'src/environments/environment';
import { ApiResponse, PageableResponse } from '../models/ApiResponseService';

@Injectable({
    providedIn: 'root',
})
export class UnitService {

    private apiUrl = `${environment.apiUrl}/units`;

    constructor(private http: HttpClient) {
    }

    createUnit(unit: Partial<Unit>): Observable<ApiResponse<Unit>> {
        return this.http.post<ApiResponse<Unit>>(this.apiUrl, unit);
    }

    updateUnit(id: string, unit: Partial<Unit>): Observable<ApiResponse<Unit>> {
        return this.http.patch<ApiResponse<Unit>>(`${this.apiUrl}/${id}`, unit);
    }

    loadUnitById(id: string): Observable<ApiResponse<Unit>> {
        return this.http.get<ApiResponse<Unit>>(`${this.apiUrl}/${id}`);
    }

    loadUnits(): Observable<Unit[]> {
        return this.http.get<ApiResponse<PageableResponse<Unit[]>>>(`${this.apiUrl}`).pipe(
            map(response => response.data.content)
        );
    }

    deleteUnit(id: string): Observable<ApiResponse<null>> {
        return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
    }


    loadUnitMaterials(unitId: string): Observable<ApiResponse<any[]>> {
        return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/${unitId}/materials`);
    }

    removeMaterialFromUnit(unitId: string, materialId: string): Observable<ApiResponse<Unit>> {
        return this.http.put<ApiResponse<Unit>>(`${this.apiUrl}/${unitId}/remove-material/${materialId}`, {});
    }


    updateUnitOrder(unitId: string, order: number): Observable<ApiResponse<Unit>> {
        return this.http.put<ApiResponse<Unit>>(`${this.apiUrl}/${unitId}/order/${order}`, {});
    }


    loadUnitProgresses(unitId: string): Observable<ApiResponse<any[]>> {
        return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/${unitId}/unit-progresses`);
    }
}
