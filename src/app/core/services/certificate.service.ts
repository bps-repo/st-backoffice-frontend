import {HttpClient} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {ApiResponse} from '../models/ApiResponseService';
import {StudentCertificate} from '../models/academic/students/student-certificate';

@Injectable({
    providedIn: 'root',
})
export class CertificateService {
    private http = inject(HttpClient);

    private apiUrl = `${environment.apiUrl}/certificates`;

    // ── Student certificates ──────────────────────────────────────────────────

    /**
     * GET /certificates/student/{studentId}
     * Returns all certificates issued to a student.
     */
    getStudentCertificates(studentId: string): Observable<StudentCertificate[]> {
        return this.http
            .get<ApiResponse<StudentCertificate[]>>(`${this.apiUrl}/student/${studentId}`)
            .pipe(map((res) => res.data ?? []));
    }

    /**
     * GET /certificates/student/{studentId}/level/{levelId}
     * Returns the certificate for a specific contracted level.
     */
    getCertificateByLevel(studentId: string, levelId: string): Observable<StudentCertificate> {
        return this.http
            .get<ApiResponse<StudentCertificate>>(
                `${this.apiUrl}/student/${studentId}/level/${levelId}`,
            )
            .pipe(map((res) => res.data));
    }

    /**
     * POST /certificates/issue/{studentId}
     * Issues a certificate for the student's current level.
     */
    issueCertificate(studentId: string): Observable<StudentCertificate> {
        return this.http
            .post<ApiResponse<StudentCertificate>>(`${this.apiUrl}/issue/${studentId}`, {})
            .pipe(map((res) => res.data));
    }

    /**
     * PUT /certificates/{certificateId}/publish
     * Publishes the certificate to the student (makes it visible to the student).
     */
    publishCertificate(certificateId: string): Observable<StudentCertificate> {
        return this.http
            .put<ApiResponse<StudentCertificate>>(`${this.apiUrl}/${certificateId}/publish`, {})
            .pipe(map((res) => res.data));
    }

    /**
     * GET /certificates/download/{certificateId}
     * Downloads the PDF binary for a given certificate.
     */
    downloadCertificate(certificateId: string): Observable<Blob> {
        return this.http.get(
            `${this.apiUrl}/download/${certificateId}`,
            {responseType: 'blob'},
        );
    }
}
