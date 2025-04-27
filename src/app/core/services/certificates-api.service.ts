import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CertificatesApiService {
  // Mock data - in a real app, this would come from an API
  private certificates = [
    {
      id: '1',
      name: 'Certificate of Completion',
      student: 'John Doe',
      course: 'English Level 1',
      issueDate: '2023-01-15',
      status: 'Issued',
      description: 'This certificate is awarded for successfully completing the English Level 1 course.',
      validUntil: '2025-01-15',
      issuedBy: 'Language School'
    },
    {
      id: '2',
      name: 'Certificate of Achievement',
      student: 'Jane Smith',
      course: 'Mathematics Advanced',
      issueDate: '2023-02-20',
      status: 'Pending',
      description: 'This certificate is awarded for outstanding achievement in the Mathematics Advanced course.',
      validUntil: '2025-02-20',
      issuedBy: 'Math Academy'
    },
    {
      id: '3',
      name: 'Certificate of Excellence',
      student: 'Bob Johnson',
      course: 'Science Fundamentals',
      issueDate: '2023-03-10',
      status: 'Issued',
      description: 'This certificate is awarded for excellence in the Science Fundamentals course.',
      validUntil: '2025-03-10',
      issuedBy: 'Science Institute'
    }
  ];

  constructor(private http: HttpClient) {}

  // In a real app, these methods would make HTTP requests to an API
  getCertificates(): Observable<any[]> {
    // Simulate API delay
    return of(this.certificates).pipe(delay(500));
  }

  getCertificate(id: string): Observable<any> {
    const certificate = this.certificates.find(c => c.id === id);
    return of(certificate).pipe(delay(500));
  }

  createCertificate(certificate: any): Observable<any> {
    const newCertificate = {
      ...certificate,
      id: (this.certificates.length + 1).toString()
    };
    this.certificates.push(newCertificate);
    return of(newCertificate).pipe(delay(500));
  }

  updateCertificate(id: string, changes: any): Observable<any> {
    const index = this.certificates.findIndex(c => c.id === id);
    if (index !== -1) {
      const updatedCertificate = {
        ...this.certificates[index],
        ...changes
      };
      this.certificates[index] = updatedCertificate;
      return of(updatedCertificate).pipe(delay(500));
    }
    return of(null).pipe(delay(500));
  }

  deleteCertificate(id: string): Observable<string> {
    const index = this.certificates.findIndex(c => c.id === id);
    if (index !== -1) {
      this.certificates.splice(index, 1);
    }
    return of(id).pipe(delay(500));
  }
}
