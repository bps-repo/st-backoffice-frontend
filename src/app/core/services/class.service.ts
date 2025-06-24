import {Class} from "../models/academic/class";
import {Observable, of} from "rxjs";
import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ApiResponse, PageableResponse} from "./interfaces/ApiResponseService";
import {map} from "rxjs/operators";

@Injectable(
    {providedIn: 'root'}
)
export class ClassService {
    private readonly apiUrl = `${environment.apiUrl}/classes`;

    constructor(private readonly http: HttpClient) {}

    /**
     * Fetches a general of classes from the API.
     * @returns An observable containing an array of Class objects.
     */
    getClasses(): Observable<Class[]> {
        return this.http.get<ApiResponse<PageableResponse<Class[]>>>(this.apiUrl)
            .pipe(
                map(response => response.data.content as Class[])
            );
    }


    createClass(classData: any): Observable<Class> {
        return of()
    }

    getClassById(id: any): Observable<Class> {
        return of()
    }
}
