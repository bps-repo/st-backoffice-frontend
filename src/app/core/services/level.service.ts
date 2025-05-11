import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Level } from '../models/course/level';

@Injectable({
    providedIn: 'root',
})
export class LevelService {
    private baseUrl = '/api/levels'; // Ajuste conforme necessário

    constructor(private http: HttpClient) {}

    getLevels(): Observable<Level[]> {
        return this.http.get<Level[]>(this.baseUrl);
    }

    getLevelById(id: string): Observable<Level> {
        return this.http.get<Level>(`${this.baseUrl}/${id}`);
    }
}