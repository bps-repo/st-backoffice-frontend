import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Center} from 'src/app/core/models/corporate/center';
import {environment} from '../../../environments/environment';
import {ApiResponse, PageableResponse} from "./interfaces/ApiResponseService";
import {map} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class CenterService {

    private apiUrl = `${environment.apiUrl}/centers`;

    constructor(private http: HttpClient) {
    }

    createCenter(center: Partial<Center>): Observable<Center> {
        return this.http.post<ApiResponse<Center>>(this.apiUrl, center).pipe(
            map(response => response.data as Center)
        );
    }

    getCenterById(id: string): Observable<Center> {
        return this.http.get<ApiResponse<Center>>(`${this.apiUrl}/${id}`).pipe(
            map(response => response.data as Center)
        );
    }

    getAllCenters(): Observable<Center[]> {
        return this.http.get<ApiResponse<PageableResponse<Center[]>>>(`${this.apiUrl}`).pipe(
            map(response => response.data.content)
        );
    }


    deleteCenter(id: string): Observable<void> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }

    updateCenter(id: string, center: Partial<Center>): Observable<Center> {
        return this.http.put<ApiResponse<Center>>(`${this.apiUrl}/${id}`, center).pipe(
            map(response => response.data as Center)
        );
    }
}
