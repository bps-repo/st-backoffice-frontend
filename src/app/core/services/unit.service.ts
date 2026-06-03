import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Unit, UpdateUnitPayload} from '../models/course/unit';
import {environment} from 'src/environments/environment';
import {ApiResponse, PageableResponse} from '../models/ApiResponseService';

@Injectable({
    providedIn: 'root',
})
export class UnitService {
    private http = inject(HttpClient);


    private apiUrl = `${environment.apiUrl}/units`;

    createUnit(unit: Partial<Unit>): Observable<ApiResponse<Unit>> {
        return this.http.post<ApiResponse<Unit>>(this.apiUrl, unit);
    }

    updateUnit(id: string, unit: UpdateUnitPayload): Observable<ApiResponse<Unit>> {
        return this.http.patch<ApiResponse<Unit>>(`${this.apiUrl}/${id}`, unit).pipe(
            map((response) => ({...response, data: this.mapUnit(response.data)})),
        );
    }

    loadUnitById(id: string): Observable<ApiResponse<Unit>> {
        return this.http.get<ApiResponse<Unit>>(`${this.apiUrl}/${id}`).pipe(
            map((response) => ({...response, data: this.mapUnit(response.data)})),
        );
    }

    loadUnits(): Observable<Unit[]> {
        return this.http.get<ApiResponse<any>>(`${this.apiUrl}/search`).pipe(
            map(response => {
                const data = response.data;
                const units = (Array.isArray(data) ? data : (data?.content ?? [])) as Unit[];
                return units.map((unit) => this.mapUnit(unit));
            })
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

    private mapUnit(raw: Unit & {unitOrder?: number}): Unit {
        return {
            ...raw,
            orderUnit: raw.orderUnit ?? raw.unitOrder ?? 0,
        };
    }
}
