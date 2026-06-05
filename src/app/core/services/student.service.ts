import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {Student} from 'src/app/core/models/academic/students/student';
import {StudentUnitProgress} from 'src/app/core/models/academic/students/student-unit-progress';
import {ApiResponse, PageableResponse} from "../models/ApiResponseService";
import {map} from "rxjs/operators";
import {CreateStudentRequest} from "../models/academic/students/create-student-request";
import {UpdateStudentRequest} from "../models/academic/students/update-student-request";
import {LegalGuardian} from "../models/academic/students/legal-guardian";


@Injectable({
    providedIn: 'root',
})
export class StudentService {
    private http = inject(HttpClient);

    private apiUrl = `${environment.apiUrl}/students`;

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

    updateStudentWithRequest(id: string, request: UpdateStudentRequest): Observable<Student> {
        return this.http.put<ApiResponse<any>>(`${this.apiUrl}/${id}`, request).pipe(
            map((response) => this.normalizeStudent(response.data))
        );
    }

    deleteStudent(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    createStudentPhoto(photoData: FormData): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/photo/create`, photoData);
    }

    /**
     * Replace student profile photo (multipart field `photo`).
     */
    updateStudentPhoto(studentId: string, photoFile: File): Observable<Student> {
        const formData = new FormData();
        formData.append('photo', photoFile);
        return this.http.put<ApiResponse<any>>(`${this.apiUrl}/${studentId}/photo`, formData).pipe(
            map((response) => this.normalizeStudent(response.data)),
        );
    }

    addStudentToClass(studentId: string, classId: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/add-to-class/${classId}`, {studentId});
    }

    removeStudentFromClass(studentId: string, classId: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/remove-from-class/${classId}`, {studentId});
    }

    manageStudentCenter(
        studentId: string,
        centerId: string,
        action: 'assign' | 'remove',
    ): Observable<Student> {
        const params = new HttpParams()
            .set('centerId', centerId)
            .set('action', action);

        return this.http.put<ApiResponse<any>>(`${this.apiUrl}/${studentId}/centers`, null, {params}).pipe(
            map((response) => this.normalizeStudent(response.data)),
        );
    }

    addStudentToCenter(studentId: string, centerId: string): Observable<Student> {
        return this.manageStudentCenter(studentId, centerId, 'assign');
    }

    removeStudentFromCenter(studentId: string, centerId: string): Observable<Student> {
        return this.manageStudentCenter(studentId, centerId, 'remove');
    }

    updateLegalGuardians(studentId: string, guardians: LegalGuardian[]): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${studentId}/legal-guardians`, guardians);
    }

    updateCredentials(studentId: string, payload: {password?: string; phone?: string; username?: string}): Observable<void> {
        return this.http.patch<void>(`${this.apiUrl}/${studentId}/credentials`, payload);
    }

    syncStudentLevel(studentId: string): Observable<Student> {
        return this.http.post<ApiResponse<any>>(`${this.apiUrl}/${studentId}/sync-level`, {}).pipe(
            map((response) => this.normalizeStudent(response.data)),
        );
    }

    /**
     * Search and filter students with comprehensive filtering options.
     */
    searchStudents(filters: {
        status?: string;
        academicBackground?: string;
        ageRange?: string;
        gender?: string;
        centerId?: string;
        levelId?: string;
        unitId?: string;
        code?: number;
        email?: string;
        username?: string;
        fullName?: string;
        province?: string;
        municipality?: string;
    }): Observable<Student[]> {
        let params = new HttpParams();

        Object.entries(filters || {}).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params = params.set(key, String(value));
            }
        });

        return this.http.get<ApiResponse<any>>(`${this.apiUrl}/search`, {params}).pipe(
            map((response) => {
                const data = response.data;
                const list = Array.isArray(data) ? data : (data?.content ?? []);
                return (list as any[]).map((s) => this.normalizeStudent(s));
            })
        );
    }

    /**
     * Paginated search — used by the student list with server-side pagination and sorting.
     */
    searchStudentsPaginated(
        filters: {
            status?: string;
            academicBackground?: string;
            ageRange?: string;
            gender?: string;
            centerId?: string;
            levelId?: string;
            unitId?: string;
            code?: number;
            email?: string;
            username?: string;
            fullName?: string;
            province?: string;
            municipality?: string;
        },
        page: number,
        size: number,
        sort?: string
    ): Observable<PageableResponse<Student>> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        if (sort) params = params.set('sort', sort);

        Object.entries(filters || {}).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params = params.set(key, String(value));
            }
        });

        return this.http.get<ApiResponse<PageableResponse<any>>>(`${this.apiUrl}/search`, {params}).pipe(
            map((response) => {
                const data = response.data as PageableResponse<any>;
                return {
                    ...data,
                    content: (data.content ?? []).map((s: any) => this.normalizeStudent(s)),
                } as PageableResponse<Student>;
            })
        );
    }


    getStudentUnitProgresses(studentId: string): Observable<StudentUnitProgress[]> {
        return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/${studentId}/unit-progresses`).pipe(
            map(res => {
                const items: any[] = res.data ?? [];
                return items
                    .map(item => {
                        // lessonProgress / assessmentProgress / status live inside the
                        // embedded student.unitProgresses array; find the matching entry by id.
                        const embedded: any[] = item.student?.unitProgresses ?? [];
                        const extra = embedded.find((up: any) => up.id === item.id) ?? {};
                        return {
                            id: item.id,
                            unit: item.unit,
                            completed: item.completed ?? false,
                            assessmentsPassed: item.assessmentsPassed ?? 0,
                            assessmentsFailed: item.assessmentsFailed ?? 0,
                            lessonProgress: extra.lessonProgress ?? 0,
                            assessmentProgress: extra.assessmentProgress ?? 0,
                            status: extra.status ?? (item.completed ? 'COMPLETED' : 'PENDING'),
                        } as StudentUnitProgress;
                    })
                    .sort((a, b) => Number(a.unit.orderUnit) - Number(b.unit.orderUnit));
            })
        );
    }

    /**
     * Turn relative photo paths into absolute URLs against the configured API base.
     * Leaves http(s), data: and blob: URIs unchanged.
     */
    private resolveStudentPhotoUrl(photo: string | null | undefined): string | null | undefined {
        if (photo == null || String(photo).trim() === '') {
            return photo;
        }
        const p = photo.trim();
        if (/^(https?:\/\/|data:|blob:)/i.test(p)) {
            return p;
        }
        const base = environment.apiUrl.replace(/\/$/, '');
        return p.startsWith('/') ? `${base}${p}` : `${base}/${p}`;
    }

    // Normalize API student object into front-end Student model
    private normalizeStudent(apiStudent: any): Student {
        const user = apiStudent.user;
        return {
            id: apiStudent.id,
            code: apiStudent.code,
            user: user
                ? {...user, photo: this.resolveStudentPhotoUrl(user.photo)}
                : user,
            status: apiStudent.status,
            levelProgressPercentage: apiStudent.levelProgressPercentage ?? 0,
            center: apiStudent.center || (apiStudent.centerId ? {id: apiStudent.centerId} : null),
            level: apiStudent.level || (apiStudent.levelId ? {id: apiStudent.levelId} : null),
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
            emergencyContactNumber: apiStudent.emergencyContactNumber ?? apiStudent.user?.emergencyContactNumber ?? null,
            emergencyContactName: apiStudent.emergencyContactName ?? apiStudent.user?.emergencyContactName ?? null,
            emergencyContactRelationship: apiStudent.emergencyContactRelationship ?? apiStudent.user?.emergencyContactRelationship ?? null,
            academicBackground: apiStudent.academicBackground ?? apiStudent.user?.academicBackground ?? null,
            province: apiStudent.province ?? apiStudent.user?.province ?? apiStudent.user?.address?.province ?? null,
            municipality: apiStudent.municipality ?? apiStudent.user?.municipality ?? apiStudent.user?.address?.municipality ?? null,
            notes: apiStudent.notes ?? null,
            legalGuardians: apiStudent.legalGuardians ?? [],
        } as Student;
    }
}
