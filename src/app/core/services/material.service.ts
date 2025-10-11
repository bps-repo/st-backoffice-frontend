import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Material, MaterialCreateRequest } from '../models/academic/material';
import { ApiResponse, PageableResponse } from '../models/ApiResponseService';

@Injectable({
    providedIn: 'root',
})
export class MaterialService {
    private apiUrl = `${environment.apiUrl}/materials`;

    constructor(private http: HttpClient) { }


    getMaterials(): Observable<Material[]> {
        return this.http.get<ApiResponse<PageableResponse<Material[]>>>(this.apiUrl).pipe(
            map((response) => response.data.content as Material[])
        );
    }


    createMaterial(material: Partial<Material>): Observable<Material> {
        return this.http.post<ApiResponse<Material>>(this.apiUrl, material).pipe(
            map((response) => response.data as Material)
        );
    }


    getMaterialsByActive(active: boolean): Observable<Material[]> {
        return this.http.get<ApiResponse<PageableResponse<Material[]>>>(`${this.apiUrl}/by-active/${active}`).pipe(
            map((response) => response.data.content as Material[])
        );
    }

    getMaterialsByType(type: string): Observable<Material[]> {
        return this.http.get<ApiResponse<PageableResponse<Material[]>>>(`${this.apiUrl}/by-type/${type}`).pipe(
            map((response) => response.data.content as Material[])
        );
    }


    getMaterialsByUploader(uploaderId: string): Observable<Material[]> {
        return this.http.get<ApiResponse<PageableResponse<Material[]>>>(`${this.apiUrl}/by-uploader/${uploaderId}`).pipe(
            map((response) => response.data.content as Material[])
        );
    }

    createMaterialWithRelations(material: MaterialCreateRequest): Observable<Material> {
        return this.http.post<ApiResponse<Material>>(`${this.apiUrl}/create-with-relations`, material).pipe(
            map((response) => response.data as Material)
        );
    }

    getMaterialsByEntity(entityType: string, entityId: string): Observable<Material[]> {
        return this.http.get<ApiResponse<Material[]>>(`${environment.apiUrl}/material-relations/entity/${entityType}/${entityId}`).pipe(
            map((response) => response.data as Material[])
        );
    }
}
