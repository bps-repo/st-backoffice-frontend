import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Level } from '../models/course/level';
import { environment } from 'src/environments/environment';
import { ApiResponse } from './interfaces/ApiResponseService';

@Injectable({
    providedIn: 'root',
})
export class LevelService {

    private apiUrl = `${environment.apiUrl}/levels`;

        constructor(private http: HttpClient) {}

        createLevel(level: Partial<Level>): Observable<ApiResponse<Level>> {
            return this.http.post<ApiResponse<Level>>(this.apiUrl, level);
        }

        updateLevel(id: string, level: Partial<Level>): Observable<ApiResponse<Level>> {
            return this.http.patch<ApiResponse<Level>>(`${this.apiUrl}/${id}`, level);
        }

        getLevelById(id: string): Observable<ApiResponse<Level>> {
            return this.http.get<ApiResponse<Level>>(`${this.apiUrl}/${id}`);
        }

        getPagedLevels(size: number): Observable<ApiResponse<{ content: Level[] }>> {
            return this.http.get<ApiResponse<{ content: Level[] }>>(`${this.apiUrl}/paged`, {
                params: { size: size.toString() }
            });
        }

        deleteLevel(id: string): Observable<ApiResponse<null>> {
            return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
          }

}
