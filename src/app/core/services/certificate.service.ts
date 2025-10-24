import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse, PageableResponse } from '../models/ApiResponseService';

@Injectable({
  providedIn: 'root',
})
export class CertificateService {
  private apiUrl = `${environment.apiUrl}/certificates`;

  constructor(private http: HttpClient) {}


  getCertificates(): Observable<any[]> {
    return this.http.get<ApiResponse<PageableResponse<any[]>>>(this.apiUrl).pipe(
      map((response) => response.data.content as any[])
    );
  }


  getCertificateById(id: string): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/${id}`).pipe(
      map((response) => response.data)
    );
  }


  getStudentCertificates(studentId: string): Observable<any[]> {
    return this.http.get<ApiResponse<PageableResponse<any[]>>>(`${this.apiUrl}/student/${studentId}`).pipe(
      map((response) => response.data.content as any[])
    );
  }


  getCertificatesByCourse(courseId: string): Observable<any[]> {
    return this.http.get<ApiResponse<PageableResponse<any[]>>>(`${this.apiUrl}/course/${courseId}`).pipe(
      map((response) => response.data.content as any[])
    );
  }


  getCertificatesByLevel(levelId: string): Observable<any[]> {
    return this.http.get<ApiResponse<PageableResponse<any[]>>>(`${this.apiUrl}/level/${levelId}`).pipe(
      map((response) => response.data.content as any[])
    );
  }


  issueCertificate(studentId: string): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/issue/${studentId}`, {}).pipe(
      map((response) => response.data)
    );
  }


  verifyCertificate(certificateId: string): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/verify/${certificateId}`).pipe(
      map((response) => response.data)
    );
  }


  revokeCertificate(certificateId: string): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/revoke/${certificateId}`, {}).pipe(
      map((response) => response.data)
    );
  }

  
  downloadCertificate(certificateId: string): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/download/${certificateId}`).pipe(
      map((response) => response.data)
    );
  }
}
