import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {ApiResponse, PageableResponse} from './interfaces/ApiResponseService';
import {Level} from "../models/course/level";

@Injectable({
    providedIn: 'root',
})
export class LevelService {
    private apiUrl = `${environment.apiUrl}/levels`;

    constructor(private http: HttpClient) {
    }

    /**
     * Gets all levels.
     * @returns An observable containing an array of Level objects.
     */
    getLevels(): Observable<Level[]> {
        return this.http.get<ApiResponse<PageableResponse<Level[]>>>(this.apiUrl).pipe(
            map((response) => response.data.content as Level[])
        );
    }

    /**
     * Creates a new level.
     * @param levelData The level data to create.
     * @returns An observable containing the created Level object.
     */
    createLevel(levelData: Partial<Level>): Observable<Level> {
        return this.http.post<ApiResponse<Level>>(this.apiUrl, levelData).pipe(
            map((response) => response.data as Level)
        );
    }

    /**
     * Gets levels enrolled by a student.
     * @param studentId The ID of the student.
     * @returns An observable containing an array of Level objects.
     */
    getEnrolledLevels(studentId: string): Observable<Level[]> {
        return this.http.get<ApiResponse<PageableResponse<Level[]>>>(`${this.apiUrl}/enrolled/${studentId}`).pipe(
            map((response) => response.data.content as Level[])
        );
    }

    /**
     * Gets levels completed by a student.
     * @param studentId The ID of the student.
     * @returns An observable containing an array of Level objects.
     */
    getCompletedLevels(studentId: string): Observable<Level[]> {
        return this.http.get<ApiResponse<PageableResponse<Level[]>>>(`${this.apiUrl}/completed/${studentId}`).pipe(
            map((response) => response.data.content as Level[])
        );
    }

    /**
     * Gets levels by name.
     * @param name The name to filter by.
     * @returns An observable containing an array of Level objects.
     */
    getLevelsByName(name: string): Observable<Level[]> {
        return this.http.get<ApiResponse<Level[]>>(`${this.apiUrl}/by-name/${name}`).pipe(
            map((response) => response.data as Level[])
        );
    }

    /**
     * Gets levels by course.
     * @param courseId The ID of the course.
     * @returns An observable containing an array of Level objects.
     */
    getLevelsByCourse(courseId: string): Observable<Level[]> {
        return this.http.get<ApiResponse<Level[]>>(`${this.apiUrl}/by-course/${courseId}`).pipe(
            map((response) => response.data as Level[])
        );
    }

    /**
     * Gets levels by difficulty.
     * @param difficulty The difficulty level to filter by.
     * @returns An observable containing an array of Level objects.
     */
    getLevelsByDifficulty(difficulty: string): Observable<Level[]> {
        return this.http.get<ApiResponse<Level[]>>(`${this.apiUrl}/by-difficulty/${difficulty}`).pipe(
            map((response) => response.data as Level[])
        );
    }

    /**
     * Gets a level by ID.
     * @param id The ID of the level.
     * @returns An observable containing the Level object.
     */
    getLevelById(id: string): Observable<Level> {
        return this.http.get<ApiResponse<Level>>(`${this.apiUrl}/${id}`).pipe(
            map((response) => response.data)
        );
    }

    /**
     * Updates a level.
     * @param id The ID of the level.
     * @param levelData The updated level data.
     * @returns An observable containing the updated Level object.
     */
    updateLevel(id: string, levelData: Partial<Level>): Observable<Level> {
        return this.http.patch<ApiResponse<Level>>(`${this.apiUrl}/${id}`, levelData).pipe(
            map((response) => response.data)
        );
    }

    /**
     * Updates a level's status.
     * @param id The ID of the level.
     * @param status The new status.
     * @returns An observable containing the updated Level object.
     */
    updateLevelStatus(id: string, status: any): Observable<Level> {
        return this.http.patch<ApiResponse<Level>>(`${this.apiUrl}/${id}/status`, status).pipe(
            map((response) => response.data)
        );
    }

    /**
     * Deletes a level.
     * @param id The ID of the level to delete.
     * @returns An observable containing the response.
     */
    deleteLevel(id: string): Observable<any> {
        return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`).pipe(
            map((response) => response)
        );
    }
}
