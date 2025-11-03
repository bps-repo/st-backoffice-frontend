import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {Student} from 'src/app/core/models/academic/student';
import {ApiResponse, PageableResponse} from "../models/ApiResponseService";
import {map} from "rxjs/operators";

// Request payload for creating a student according to backend contract
export interface CreateStudentRequest {
    identificationNumber: string
    firstname: string;
    lastname: string;
    gender: string; // 'MALE' or 'FEMALE'
    birthdate: string; // YYYY-MM-DD
    email: string;
    password: string;
    photo?: string;
    phone: string;
    centerId: string;
    emergencyContactNumber?: string;
    emergencyContactName?: string;
    emergencyContactRelationship?: string;
    academicBackground: string; // e.g., 'SECONDARY_SCHOOL'
    province: string;
    municipality: string;
    notes?: string;
    // VIP fields are set during creation but not required in initial request
    vip?: boolean;
    vipTeacherId?: string;
    directChatEnabled?: boolean;
    fixedDateClasses?: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class StudentService {
    private apiUrl = `${environment.apiUrl}/students`;

    constructor(private http: HttpClient) {
    }

    // Normalize API student object into front-end Student model
    private normalizeStudent(apiStudent: any): Student {
        return {
            id: apiStudent.id,
            code: apiStudent.code,
            user: apiStudent.user,
            status: apiStudent.status,
            levelProgressPercentage: apiStudent.levelProgressPercentage ?? 0,
            center: apiStudent.center || (apiStudent.centerId ? { id: apiStudent.centerId } : null),
            level: apiStudent.level || (apiStudent.levelId ? { id: apiStudent.levelId } : null),
            currentUnit: apiStudent.currentUnit,
            enrollmentDate: apiStudent.enrollmentDate,
            certificates: apiStudent.certificates ?? apiStudent.certificatesIds,
            attendances: apiStudent.attendances ?? apiStudent.attendancesIds,
            unitProgresses: apiStudent.unitProgresses ?? apiStudent.unitProgressesIds,
            createdAt: apiStudent.createdAt,
            updatedAt: apiStudent.updatedAt,
            vip: apiStudent.vip,
            vipTeacherId: apiStudent.vipTeacherId,
            directChatEnabled: apiStudent.directChatEnabled,
            fixedDateClasses: apiStudent.fixedDateClasses,
        } as Student;
    }

    getStudents(): Observable<Student[]> {
        return this.http.get<ApiResponse<any>>(this.apiUrl).pipe(
            map((response) => {
                const data = response.data;
                // Handle both pageable and non-pageable responses
                const list = Array.isArray(data) ? data : (data?.content ?? []);
                return (list as any[]).map((s) => this.normalizeStudent(s));
            })
        );
    }

    getStudent(id: string): Observable<Student> {
        return this.http.get<ApiResponse<any>>(`${this.apiUrl}/${id}`).pipe(
            map((response) => this.normalizeStudent(response.data))
        );
    }

    // Existing method kept for backward compatibility (posts current Student model as-is)
    createStudent(student: Student): Observable<Student> {
        return this.http.post<ApiResponse<any>>(this.apiUrl, student).pipe(
            map((response) => this.normalizeStudent(response.data))
        );
    }

    // New method that posts the required payload shape to /students
    createStudentWithRequest(payload: CreateStudentRequest): Observable<Student> {
        return this.http.post<ApiResponse<any>>(this.apiUrl, payload).pipe(
            map((response) => this.normalizeStudent(response.data))
        );
    }

    updateStudent(student: Student): Observable<Student> {
        return this.http.put<ApiResponse<any>>(`${this.apiUrl}/${student.id}`, student).pipe(
            map((response) => this.normalizeStudent(response.data))
        );
    }

    deleteStudent(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    createStudentPhoto(photoData: FormData): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/photo/create`, photoData);
    }

    addStudentToClass(studentId: string, classId: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/add-to-class/${classId}`, {studentId});
    }

    removeStudentFromClass(studentId: string, classId: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/remove-from-class/${classId}`, {studentId});
    }

    addStudentToCenter(studentId: string, centerId: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/add-to-center/${centerId}`, {studentId});
    }

    removeStudentFromCenter(studentId: string, centerId: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/remove-from-center/${centerId}`, {studentId});
    }

    /**
     * Search and filter students with comprehensive filtering options.
     * @param filters Search filters (status, centerId, levelId, unitId, code, email, username, province, municipality)
     * @returns Observable of Student array
     */
    searchStudents(filters: {
        status?: string;
        centerId?: string;
        levelId?: string;
        unitId?: string;
        code?: number;
        email?: string;
        username?: string;
        province?: string;
        municipality?: string;
    }): Observable<Student[]> {
        let params = new HttpParams();

        Object.entries(filters || {}).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params = params.set(key, String(value));
            }
        });

        return this.http.get<ApiResponse<any>>(`${this.apiUrl}/search`, { params }).pipe(
            map((response) => {
                const data = response.data;
                // Handle both pageable and non-pageable responses
                const list = Array.isArray(data) ? data : (data?.content ?? []);
                return (list as any[]).map((s) => this.normalizeStudent(s));
            })
        );
    }
}
