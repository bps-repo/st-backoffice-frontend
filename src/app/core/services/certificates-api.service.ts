import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {delay} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CertificatesApiService {
    private http = inject(HttpClient);
    private certificates: any[] = [];

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
