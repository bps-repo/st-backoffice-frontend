import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as CertificatesActions from 'src/app/core/store/schoolar/actions/certificates.actions';
import { selectSelectedCertificate, selectCertificatesLoading } from 'src/app/core/store/schoolar/selectors/certificates.selectors';
import { SkeletonModule } from "primeng/skeleton";
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';

interface Certificate {
    id: string;
    name: string;
    student: string;
    course: string;
    issueDate: string;
    status: string;
    description?: string;
    validUntil?: string;
    issuedBy?: string;
}

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    standalone: true,
    imports: [CommonModule, SkeletonModule, InputTextModule, InputTextareaModule, ButtonModule]
})
export class DetailComponent implements OnInit {
    certificateId: string = '';
    certificate$: Observable<any>;
    certificate: any = null;
    loading$: Observable<boolean>;
    loading: boolean = true;

    constructor(private route: ActivatedRoute, private store: Store) {
        this.certificate$ = this.store.select(selectSelectedCertificate);
        this.loading$ = this.store.select(selectCertificatesLoading);
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.certificateId = params['id'];
            this.loadCertificate();
        });

        // Subscribe to certificate and loading observables
        this.certificate$.subscribe(certificate => {
            this.certificate = certificate;
        });

        this.loading$.subscribe(loading => {
            this.loading = loading;
        });
    }

    loadCertificate(): void {
        // Dispatch loadCertificate action to load the selected certificate
        this.store.dispatch(CertificatesActions.loadCertificate({ id: this.certificateId }));
    }

    downloadCertificate(): void {
        // In a real app, this would trigger a download of the certificate
        console.log('Downloading certificate:', this.certificate);
        alert('Certificate download started');
    }

    sendCertificate(): void {
        // In a real app, this would send the certificate to the student
        console.log('Sending certificate to:', this.certificate?.student);
        alert('Certificate sent to ' + this.certificate?.student);
    }
}
