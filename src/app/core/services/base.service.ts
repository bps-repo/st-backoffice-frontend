import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class BaseService<U, T extends { id?: U }> {
    constructor(protected httpClient: HttpClient, private baseUrl: string) {}

    protected getAll(): Observable<T[]> {
        return this.httpClient
            .get<{ data: T[] }>(this.baseUrl)
            .pipe(map((response) => response.data));
    }

    protected getById(id: U): Observable<T> {
        return this.httpClient
            .get<{ data: T[] }>(`${this.baseUrl}`)
            .pipe(
                map(
                    (response) =>
                        response.data.find((item) => item.id === id) as T
                )
            );
    }

    protected create(item: T): Observable<T> {
        return this.httpClient.post<T>(this.baseUrl, item);
    }

    protected update(id: U, item: T): Observable<T> {
        return this.httpClient.put<T>(`${this.baseUrl}/${id}`, item);
    }

    protected delete(id: U): Observable<void> {
        return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
    }
}
