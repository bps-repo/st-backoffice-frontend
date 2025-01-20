import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class BaseService<T> {
    constructor(protected httpClient: HttpClient, private baseUrl: string) {}

    getAll(): Observable<T[]> {
        return this.httpClient
            .get<{ data: T[] }>(this.baseUrl)
            .pipe(map((response) => response.data));
    }

    getById(id: number): Observable<T> {
        return this.httpClient.get<T>(`${this.baseUrl}/${id}`);
    }

    create(item: T): Observable<T> {
        return this.httpClient.post<T>(this.baseUrl, item);
    }

    update(id: number, item: T): Observable<T> {
        return this.httpClient.put<T>(`${this.baseUrl}/${id}`, item);
    }

    delete(id: number): Observable<void> {
        return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
    }
}
