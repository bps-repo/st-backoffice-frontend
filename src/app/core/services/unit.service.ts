import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Unit } from 'src/app/core/models/course/unit';

@Injectable({
    providedIn: 'root',
})
export class UnitService {
    private apiUrl = '/api/units'; // URL base da API

    constructor(private http: HttpClient) {}

    // Busca todas as unidades
    getAllUnits(): Observable<Unit[]> {
        return this.http.get<Unit[]>(this.apiUrl);
    }

    // Busca uma unidade pelo ID
    getUnitById(id: string): Observable<Unit> {
        return this.http.get<Unit>(`${this.apiUrl}/${id}`);
    }
}
