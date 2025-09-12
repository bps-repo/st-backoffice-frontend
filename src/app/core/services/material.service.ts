import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Material } from '../models/academic/material';
import { ApiResponse, PageableResponse } from '../models/ApiResponseService';

@Injectable({
  providedIn: 'root',
})
export class MaterialService {
  private apiUrl = `${environment.apiUrl}/materials`;

  constructor(private http: HttpClient) {}

  /**
   * Gets all materials.
   * @returns An observable containing an array of Material objects.
   */
  getMaterials(): Observable<Material[]> {
    return this.http.get<ApiResponse<PageableResponse<Material[]>>>(this.apiUrl).pipe(
      map((response) => response.data.content as Material[])
    );
  }

  /**
   * Creates a new material.
   * @param material The material data to create.
   * @returns An observable containing the created Material object.
   */
  createMaterial(material: Partial<Material>): Observable<Material> {
    return this.http.post<ApiResponse<Material>>(this.apiUrl, material).pipe(
      map((response) => response.data as Material)
    );
  }

  /**
   * Gets materials by active status.
   * @param active The active status to filter by.
   * @returns An observable containing an array of Material objects.
   */
  getMaterialsByActive(active: boolean): Observable<Material[]> {
    return this.http.get<ApiResponse<PageableResponse<Material[]>>>(`${this.apiUrl}/by-active/${active}`).pipe(
      map((response) => response.data.content as Material[])
    );
  }

  /**
   * Gets materials by type.
   * @param type The type to filter by.
   * @returns An observable containing an array of Material objects.
   */
  getMaterialsByType(type: string): Observable<Material[]> {
    return this.http.get<ApiResponse<PageableResponse<Material[]>>>(`${this.apiUrl}/by-type/${type}`).pipe(
      map((response) => response.data.content as Material[])
    );
  }

  /**
   * Gets materials by uploader ID.
   * @param uploaderId The uploader ID to filter by.
   * @returns An observable containing an array of Material objects.
   */
  getMaterialsByUploader(uploaderId: string): Observable<Material[]> {
    return this.http.get<ApiResponse<PageableResponse<Material[]>>>(`${this.apiUrl}/by-uploader/${uploaderId}`).pipe(
      map((response) => response.data.content as Material[])
    );
  }
}
