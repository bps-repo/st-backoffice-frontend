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


    /**
     * Creates a new class.
     * @param classData The data for the new class.
     * @returns An observable containing the created Class object.
     */
    createClass(classData: any): Observable<Class> {
        return this.http.post<ApiResponse<Class>>(this.apiUrl, classData)
            .pipe(
                map(response => response.data as Class)
            );
    }

    /**
     * Fetches a class by its ID.
     * @param id The ID of the class to fetch.
     * @returns An observable containing the Class object.
     */
    getClassById(id: string): Observable<Class> {
        return this.http.get<ApiResponse<Class>>(`${this.apiUrl}/${id}`)
            .pipe(
                map(response => response.data as Class)
            );
    }
}
