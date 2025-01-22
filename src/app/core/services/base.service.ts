import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export class BaseService<U, T extends { id?: U }> {
    constructor(protected httpClient: HttpClient, private baseUrl: string) {}

    getAll(): Observable<T[]> {
        return this.httpClient
            .get<{ data: T[] }>(this.baseUrl)
            .pipe(map((response) => response.data));
    }

    getById(id: U): Observable<T> {
        return this.httpClient
            .get<T>(`${this.baseUrl}`)
            .pipe(filter((item) => item.id === id));
    }

    create(item: T): Observable<T> {
        return this.httpClient.post<T>(this.baseUrl, item);
    }

    update(id: U, item: T): Observable<T> {
        return this.httpClient.put<T>(`${this.baseUrl}/${id}`, item);
    }

    delete(id: U): Observable<void> {
        return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
    }
}
