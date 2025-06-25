import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse, PageableResponse } from './interfaces/ApiResponseService';

@Injectable({
  providedIn: 'root',
})
export class CertificateService {
  private apiUrl = `${environment.apiUrl}/certificates`;

  constructor(private http: HttpClient) {}

  /**
   * Gets all certificates.
   * @returns An observable containing an array of Certificate objects.
   */
  getCertificates(): Observable<any[]> {
    return this.http.get<ApiResponse<PageableResponse<any[]>>>(this.apiUrl).pipe(
      map((response) => response.data.content as any[])
    );
  }

  /**
   * Gets a certificate by ID.
   * @param id The ID of the certificate.
   * @returns An observable containing the Certificate object.
   */
  getCertificateById(id: string): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/${id}`).pipe(
      map((response) => response.data)
    );
  }

  /**
   * Gets certificates for a student.
   * @param studentId The ID of the student.
   * @returns An observable containing an array of Certificate objects.
   */
  getStudentCertificates(studentId: string): Observable<any[]> {
    return this.http.get<ApiResponse<PageableResponse<any[]>>>(`${this.apiUrl}/student/${studentId}`).pipe(
      map((response) => response.data.content as any[])
    );
  }

  /**
   * Gets certificates by course.
   * @param courseId The ID of the course.
   * @returns An observable containing an array of Certificate objects.
   */
  getCertificatesByCourse(courseId: string): Observable<any[]> {
    return this.http.get<ApiResponse<PageableResponse<any[]>>>(`${this.apiUrl}/course/${courseId}`).pipe(
      map((response) => response.data.content as any[])
    );
  }

  /**
   * Gets certificates by level.
   * @param levelId The ID of the level.
   * @returns An observable containing an array of Certificate objects.
   */
  getCertificatesByLevel(levelId: string): Observable<any[]> {
    return this.http.get<ApiResponse<PageableResponse<any[]>>>(`${this.apiUrl}/level/${levelId}`).pipe(
      map((response) => response.data.content as any[])
    );
  }

  /**
   * Issues a certificate for a student.
   * @param studentId The ID of the student.
   * @returns An observable containing the issued certificate data.
   */
  issueCertificate(studentId: string): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/issue/${studentId}`, {}).pipe(
      map((response) => response.data)
    );
  }

  /**
   * Verifies a certificate.
   * @param certificateId The ID of the certificate.
   * @returns An observable containing the verification result.
   */
  verifyCertificate(certificateId: string): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/verify/${certificateId}`).pipe(
      map((response) => response.data)
    );
  }

  /**
   * Revokes a certificate.
   * @param certificateId The ID of the certificate.
   * @returns An observable containing the revocation result.
   */
  revokeCertificate(certificateId: string): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/revoke/${certificateId}`, {}).pipe(
      map((response) => response.data)
    );
  }

  /**
   * Downloads a certificate.
   * @param certificateId The ID of the certificate.
   * @returns An observable containing the certificate file data.
   */
  downloadCertificate(certificateId: string): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/download/${certificateId}`).pipe(
      map((response) => response.data)
    );
  }
}
