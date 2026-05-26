import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Material, MaterialCreateRequest, MaterialUploadRequest } from '../models/academic/material';
import { ApiResponse, PageableResponse } from '../models/ApiResponseService';

@Injectable({
    providedIn: 'root',
})
export class MaterialService {
    private http = inject(HttpClient);

    private apiUrl = `${environment.apiUrl}/materials`;

    /**
     * Ensures fileUrl is always an absolute URL.
     * When the backend returns a relative path (e.g. "/uploads/file.pdf") the
     * API base URL is prepended.  Absolute URLs (http/https) are left untouched.
     */
    private normalizeFileUrl(material: Material): Material {
        if (material?.fileUrl && !material.fileUrl.startsWith('http')) {
            return { ...material, fileUrl: `${environment.apiUrl}${material.fileUrl}` };
        }
        return material;
    }

    private normalizeList(materials: Material[]): Material[] {
        return (materials ?? []).map((m) => this.normalizeFileUrl(m));
    }


    getMaterials(): Observable<Material[]> {
        return this.http.get<ApiResponse<PageableResponse<Material>>>(this.apiUrl).pipe(
            map((response) => this.normalizeList(response.data.content as Material[]))
        );
    }


    createMaterial(material: Partial<Material>): Observable<Material> {
        return this.http.post<ApiResponse<Material>>(this.apiUrl, material).pipe(
            map((response) => this.normalizeFileUrl(response.data as Material))
        );
    }


    getMaterialsByActive(active: boolean): Observable<Material[]> {
        return this.http.get<ApiResponse<PageableResponse<Material>>>(`${this.apiUrl}/by-active/${active}`).pipe(
            map((response) => this.normalizeList(response.data.content as Material[]))
        );
    }


    getMaterialsByUploader(uploaderId: string): Observable<Material[]> {
        return this.http.get<ApiResponse<PageableResponse<Material>>>(`${this.apiUrl}/by-uploader/${uploaderId}`).pipe(
            map((response) => this.normalizeList(response.data.content as Material[]))
        );
    }

    createMaterialWithRelations(material: MaterialCreateRequest): Observable<Material> {
        return this.http.post<ApiResponse<Material>>(`${this.apiUrl}/create-with-relations`, material).pipe(
            map((response) => this.normalizeFileUrl(response.data as Material))
        );
    }

    /**
     * Uploads a file together with the material metadata as multipart/form-data.
     * POST /materials/upload-with-relations
     *   - part "file"    → binary payload
     *   - part "request" → JSON blob (application/json)
     */
    uploadMaterialWithRelations(file: File, request: MaterialUploadRequest): Observable<Material> {
        const formData = new FormData();
        formData.append('file', file, file.name);
        formData.append(
            'request',
            new Blob([JSON.stringify(request)], { type: 'application/json' })
        );
        return this.http
            .post<ApiResponse<Material>>(`${this.apiUrl}/upload-with-relations`, formData)
            .pipe(map((response) => this.normalizeFileUrl(response.data as Material)));
    }

    getMaterialsByEntity(entityType: string, entityId: string): Observable<Material[]> {
        return this.http.get<ApiResponse<Material[]>>(`${this.apiUrl}/entity/${entityType}/${entityId}`).pipe(
            map((response) => this.normalizeList(response.data as Material[]))
        );
    }
}
