import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Center } from 'src/app/core/models/corporate/center';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CenterService {

     private apiUrl = `${environment.apiUrl}/centers`;

    constructor(private http: HttpClient) {}

    createCenter(center: Partial<Center>): Observable<any> {
        return this.http.post<any>(this.apiUrl, center);
    }

    getCenterById(id: string): Observable<Center> {
        return this.http.get<Center>(`${this.apiUrl}/${id}`);
    }

    getAllCenters(): Observable<Center[]> {
        return this.http.get<Center[]>(`${this.apiUrl}`);
    }

    getPagedCenters(size: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/paged`, {
            params: { size: size.toString() } // Adiciona o parâmetro size na URL
        });
    }

    deleteCenter(id: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }

    updateCenter(id: string, center: Partial<Center>): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, center);
    }

}
