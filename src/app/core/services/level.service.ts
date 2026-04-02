import {HttpClient} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {ApiResponse, PageableResponse} from '../models/ApiResponseService';

@Injectable({
    providedIn: 'root',
})
export class LevelService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/levels`;

    getLevels(): Observable<any[]> {
        return this.http.get<ApiResponse<PageableResponse<any[]>>>(this.apiUrl).pipe(
            map((response) => response.data.content as any[])
        );
    }

    createLevel(levelData: any): Observable<any> {
        return this.http.post<ApiResponse<any>>(this.apiUrl, levelData).pipe(
            map((response) => response.data)
        );
    }

    getLevelById(id: string): Observable<any> {
        return this.http.get<ApiResponse<any>>(`${this.apiUrl}/${id}`).pipe(
            map((response) => response.data)
        );
    }

    updateLevel(id: string, levelData: any): Observable<any> {
        return this.http.patch<ApiResponse<any>>(`${this.apiUrl}/${id}`, levelData).pipe(
            map((response) => response.data)
        );
    }


    deleteLevel(id: string): Observable<any> {
        return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`).pipe(
            map((response) => response.data)
        );
    }
}
