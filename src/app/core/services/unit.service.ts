import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Unit} from '../models/course/unit';
import {environment} from 'src/environments/environment';
import {ApiResponse} from './interfaces/ApiResponseService';
import {Class} from '../models/academic/class';

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

    loadPagedUnits(size: number): Observable<ApiResponse<{ content: Unit[] }>> {
        return this.http.get<ApiResponse<{ content: Unit[] }>>(`${this.apiUrl}/paged`, {
            params: {size: size.toString()}
        });
    }

    deleteUnit(id: string): Observable<ApiResponse<null>> {
        return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
    }

    /**
     * loads materials for a specific unit.
     * @param unitId The ID of the unit.
     * @returns An observable containing the materials data.
     */
    loadUnitMaterials(unitId: string): Observable<ApiResponse<any[]>> {
        return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/${unitId}/materials`);
    }

    /**
     * Removes a material from a unit.
     * @param unitId The ID of the unit.
     * @param materialId The ID of the material to remove.
     * @returns An observable containing the updated unit data.
     */
    removeMaterialFromUnit(unitId: string, materialId: string): Observable<ApiResponse<Unit>> {
        return this.http.put<ApiResponse<Unit>>(`${this.apiUrl}/${unitId}/remove-material/${materialId}`, {});
    }

    /**
     * Updates the order of a unit.
     * @param unitId The ID of the unit.
     * @param order The new order value.
     * @returns An observable containing the updated unit data.
     */
    updateUnitOrder(unitId: string, order: number): Observable<ApiResponse<Unit>> {
        return this.http.put<ApiResponse<Unit>>(`${this.apiUrl}/${unitId}/order/${order}`, {});
    }

    /**
     * loads classes for a specific unit.
     * @param unitId The ID of the unit.
     * @returns An observable containing the classes data.
     */
    loadUnitClasses(unitId: string): Observable<ApiResponse<Class[]>> {
        return this.http.get<ApiResponse<Class[]>>(`${this.apiUrl}/${unitId}/classes`);
    }

    /**
     * loads unit progresses for a specific unit.
     * @param unitId The ID of the unit.
     * @returns An observable containing the unit progresses data.
     */
    loadUnitProgresses(unitId: string): Observable<ApiResponse<any[]>> {
        return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/${unitId}/unit-progresses`);
    }
}
